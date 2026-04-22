terraform {
  required_version = ">= 1.5.0"
  required_providers {
    google = { source = "hashicorp/google", version = "~> 5.0" }
    google-beta = { source = "hashicorp/google-beta", version = "~> 5.0" }
  }
  backend "gcs" {
    bucket = "careerpathway-terraform-state"
    prefix = "terraform/state"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# ── Enable APIs ────────────────────────────────────────────
resource "google_project_service" "apis" {
  for_each = toset([
    "run.googleapis.com", "sql-component.googleapis.com",
    "sqladmin.googleapis.com", "redis.googleapis.com",
    "secretmanager.googleapis.com", "artifactregistry.googleapis.com",
    "cloudbuild.googleapis.com", "vpcaccess.googleapis.com",
    "servicenetworking.googleapis.com", "storage.googleapis.com",
  ])
  service            = each.value
  disable_on_destroy = false
}

# ── Artifact Registry ──────────────────────────────────────
resource "google_artifact_registry_repository" "careerpathway" {
  location      = var.region
  repository_id = "careerpathway"
  format        = "DOCKER"
  description   = "CareerPathway Docker images"
  depends_on    = [google_project_service.apis]
}

# ── VPC Network ────────────────────────────────────────────
resource "google_compute_network" "vpc" {
  name                    = "careerpathway-vpc"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "subnet" {
  name          = "careerpathway-subnet"
  ip_cidr_range = "10.0.0.0/24"
  region        = var.region
  network       = google_compute_network.vpc.id
}

# ── Cloud SQL (PostgreSQL) ─────────────────────────────────
resource "google_sql_database_instance" "postgres" {
  name             = "careerpathway-postgres-${var.environment}"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier              = var.environment == "prod" ? "db-n1-standard-2" : "db-f1-micro"
    availability_type = var.environment == "prod" ? "REGIONAL" : "ZONAL"
    disk_size         = 20
    disk_autoresize   = true

    backup_configuration {
      enabled                        = true
      point_in_time_recovery_enabled = var.environment == "prod"
      start_time                     = "03:00"
      transaction_log_retention_days = 7
      backup_retention_settings {
        retained_backups = 30
      }
    }

    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.vpc.id
    }

    database_flags {
      name  = "max_connections"
      value = "200"
    }
  }

  deletion_protection = var.environment == "prod"
  depends_on          = [google_project_service.apis, google_service_networking_connection.private_vpc_connection]
}

resource "google_sql_database" "careerpathway" {
  name     = "careerpathway_db"
  instance = google_sql_database_instance.postgres.name
}

resource "google_sql_user" "app_user" {
  name     = "careerpathway"
  instance = google_sql_database_instance.postgres.name
  password = var.db_password
}

# ── Private VPC Connection for Cloud SQL ───────────────────
resource "google_compute_global_address" "private_ip_range" {
  name          = "careerpathway-private-ip"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.vpc.id
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.vpc.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_range.name]
}

# ── Memorystore (Redis) ────────────────────────────────────
resource "google_redis_instance" "cache" {
  name           = "careerpathway-redis"
  tier           = "BASIC"
  memory_size_gb = 1
  region         = var.region
  redis_version  = "REDIS_7_0"

  authorized_network = google_compute_network.vpc.id
  connect_mode       = "PRIVATE_SERVICE_ACCESS"
  depends_on         = [google_project_service.apis, google_service_networking_connection.private_vpc_connection]
}

# ── VPC Connector for Cloud Run ────────────────────────────
resource "google_vpc_access_connector" "connector" {
  name          = "careerpathway-connector"
  region        = var.region
  network       = google_compute_network.vpc.name
  ip_cidr_range = "10.8.0.0/28"
  depends_on    = [google_project_service.apis]
}

# ── Cloud Storage Bucket ───────────────────────────────────
resource "google_storage_bucket" "uploads" {
  name          = "${var.project_id}-careerpathway-uploads"
  location      = var.region
  force_destroy = var.environment != "prod"

  cors {
    origin          = ["https://${var.domain}"]
    method          = ["GET", "POST", "PUT", "DELETE"]
    response_header = ["*"]
    max_age_seconds = 3600
  }

  lifecycle_rule {
    action { type = "Delete" }
    condition { age = 365 }
  }
}

# ── Secret Manager ─────────────────────────────────────────
locals {
  secrets = {
    "careerpathway-db-url"         = "postgresql://careerpathway:${var.db_password}@${google_sql_database_instance.postgres.private_ip_address}:5432/careerpathway_db"
    "careerpathway-redis-url"      = "redis://${google_redis_instance.cache.host}:${google_redis_instance.cache.port}"
    "careerpathway-jwt-secret"     = var.jwt_secret
    "careerpathway-jwt-refresh"    = var.jwt_refresh_secret
    "careerpathway-gemini-key"     = var.gemini_api_key
    "careerpathway-sendgrid-key"   = var.sendgrid_api_key
    "careerpathway-razorpay-secret" = var.razorpay_key_secret
  }
}

resource "google_secret_manager_secret" "secrets" {
  for_each  = local.secrets
  secret_id = each.key
  replication { auto {} }
  depends_on = [google_project_service.apis]
}

resource "google_secret_manager_secret_version" "secret_values" {
  for_each    = local.secrets
  secret      = google_secret_manager_secret.secrets[each.key].id
  secret_data = each.value
}

# ── Cloud Run — Backend ────────────────────────────────────
resource "google_cloud_run_v2_service" "backend" {
  name     = "careerpathway-backend"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    scaling {
      min_instance_count = 1
      max_instance_count = 20
    }
    vpc_access {
      connector = google_vpc_access_connector.connector.id
      egress    = "PRIVATE_RANGES_ONLY"
    }
    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/careerpathway/backend:latest"
      ports { container_port = 4000 }
      resources {
        limits = { cpu = "1", memory = "1Gi" }
      }
      env { name = "NODE_ENV", value = "production" }
      env { name = "FRONTEND_URL", value = "https://${var.domain}" }
      dynamic "env" {
        for_each = local.secrets
        content {
          name = upper(replace(replace(env.key, "careerpathway-", ""), "-", "_"))
          value_source {
            secret_key_ref {
              secret  = env.key
              version = "latest"
            }
          }
        }
      }
    }
  }

  depends_on = [google_project_service.apis, google_vpc_access_connector.connector]
}

# ── Cloud Run — Frontend ───────────────────────────────────
resource "google_cloud_run_v2_service" "frontend" {
  name     = "careerpathway-frontend"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    scaling {
      min_instance_count = 0
      max_instance_count = 10
    }
    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/careerpathway/frontend:latest"
      ports { container_port = 3000 }
      resources { limits = { cpu = "1", memory = "512Mi" } }
      env { name = "NODE_ENV", value = "production" }
      env { name = "NEXT_PUBLIC_API_URL", value = google_cloud_run_v2_service.backend.uri }
    }
  }

  depends_on = [google_project_service.apis, google_cloud_run_v2_service.backend]
}

# ── IAM — Allow unauthenticated access ────────────────────
resource "google_cloud_run_service_iam_member" "backend_public" {
  service  = google_cloud_run_v2_service.backend.name
  location = var.region
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_service_iam_member" "frontend_public" {
  service  = google_cloud_run_v2_service.frontend.name
  location = var.region
  role     = "roles/run.invoker"
  member   = "allUsers"
}
