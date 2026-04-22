output "frontend_url" {
  description = "Frontend Cloud Run URL"
  value       = google_cloud_run_v2_service.frontend.uri
}

output "backend_url" {
  description = "Backend API Cloud Run URL"
  value       = google_cloud_run_v2_service.backend.uri
}

output "artifact_registry" {
  description = "Artifact Registry path"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/careerpathway"
}

output "db_instance_name" {
  description = "Cloud SQL instance name"
  value       = google_sql_database_instance.postgres.name
}

output "redis_host" {
  description = "Redis host"
  value       = google_redis_instance.cache.host
}

output "storage_bucket" {
  description = "Cloud Storage bucket name"
  value       = google_storage_bucket.uploads.name
}
