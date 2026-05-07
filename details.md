# CareerPathway (Mentroo) — Full Project Analysis & Vercel Deployment Guide

> **Generated:** 2026-05-07 | **Project Type:** Full-Stack Web Application  
> **Frontend:** Next.js 14 (TypeScript) | **Backend:** Express.js + Prisma (TypeScript)  
> **Database:** PostgreSQL 15 | **Cache:** Redis 7 (currently mocked in-memory)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture Diagram](#2-architecture-diagram)
3. [Technology Stack](#3-technology-stack)
4. [Project Structure](#4-project-structure)
5. [Database Schema](#5-database-schema)
6. [API Routes](#6-api-routes)
7. [Frontend Pages & Components](#7-frontend-pages--components)
8. [Environment Variables](#8-environment-variables)
9. [Current CI/CD Setup](#9-current-cicd-setup)
10. [Vercel Deployment Guide](#10-vercel-deployment-guide)
11. [External Services Required](#11-external-services-required)
12. [Known Issues & Recommendations](#12-known-issues--recommendations)

---

## 1. Project Overview

**CareerPathway** (internally named **Mentroo**) is an expert career guidance platform that connects **Career Seekers** with **Consultants** across domains like Education, Business, Sports, Medical, and Engineering.

### Core Features

| Feature | Description |
|---------|-------------|
| **AI Career Guide** | Google Gemini-powered chatbot for career recommendations |
| **Consultant Marketplace** | Browse, filter, and book sessions with verified consultants |
| **Booking System** | Schedule video/audio/chat sessions with availability management |
| **Payment Gateway** | Razorpay (India) + Stripe (International) integration |
| **Real-time Chat** | Socket.IO powered messaging between seekers and consultants |
| **Admin Dashboard** | Consultant approval, platform analytics, payout management |
| **Domain Content** | Curated articles and guides per career domain |
| **RAG/Vector Search** | College and course search with pgvector embeddings |

### User Roles

- **SEEKER** — Students/professionals seeking career guidance
- **CONSULTANT** — Verified experts providing paid consultations
- **ADMIN** — Platform administrators managing approvals and payouts

---

## 2. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTS                              │
│              (Browser / Mobile Browser)                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
  ┌─────▼──────┐             ┌────────▼────────┐
  │  Frontend   │   REST     │    Backend API   │
  │  Next.js    │ ◄────────► │  Express.js      │
  │  Port 3000  │   +WS      │  Port 4000       │
  └─────────────┘             └───────┬──────────┘
                                      │
                    ┌─────────────────┼──────────────────┐
                    │                 │                   │
             ┌──────▼──────┐  ┌──────▼──────┐  ┌────────▼────────┐
             │ PostgreSQL  │  │   Redis     │  │ External APIs   │
             │ (Prisma)    │  │  (Cache)    │  │ Gemini/Razorpay │
             │ Port 5432   │  │  Port 6379  │  │ Stripe/SendGrid │
             └─────────────┘  └─────────────┘  │ Twilio/GCS      │
                                                └─────────────────┘
```

---

## 3. Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 14.2.5 | React framework (App Router, SSR, standalone output) |
| React | 18.3.1 | UI library |
| TypeScript | 5.5.4 | Type safety |
| Tailwind CSS | 3.4.6 | Utility-first styling |
| Framer Motion | 11.3.8 | Animations |
| Radix UI | Various | Accessible UI primitives (Dialog, Dropdown, Tabs, Toast, etc.) |
| Recharts | 2.12.7 | Dashboard charts |
| Axios | 1.7.3 | HTTP client |
| Socket.IO Client | 4.7.5 | Real-time communication |
| React Hook Form + Zod | Latest | Form handling + validation |
| next-themes | 0.4.6 | Dark/light mode |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Express.js | 4.19.2 | HTTP server framework |
| TypeScript | 5.5.4 | Type safety |
| Prisma | 5.19.0 | ORM + migrations |
| Socket.IO | 4.7.5 | WebSocket server |
| jsonwebtoken | 9.0.2 | JWT authentication |
| bcryptjs | 2.4.3 | Password hashing |
| @google/generative-ai | 0.14.1 | Gemini AI integration |
| Razorpay SDK | 2.9.2 | Indian payment gateway |
| Stripe SDK | 16.8.0 | International payment gateway |
| SendGrid | 8.1.3 | Email service |
| Twilio | 5.3.0 | SMS/OTP service |
| Winston | 3.14.2 | Logging |
| Helmet + CORS | Latest | Security middleware |
| express-rate-limit | 7.4.0 | Rate limiting |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| Docker + Docker Compose | Containerization |
| PostgreSQL 15 | Primary database |
| Redis 7 | Caching (currently mocked in-memory) |
| Terraform | GCP infrastructure-as-code |
| GitHub Actions (CI/CD) | Automated testing + GCP Cloud Run deployment |
| Google Cloud Build | Alternative CI/CD |

---

## 4. Project Structure

```
careerpathway/
├── .env                          # Root environment variables
├── .env.example                  # Environment template
├── .github/workflows/
│   ├── ci.yml                    # CI pipeline (lint, test, build)
│   └── cd.yml                    # CD pipeline (deploy to GCP Cloud Run)
├── docker-compose.yml            # Local development orchestration
├── cloudbuild.yaml               # Google Cloud Build config
├── terraform/
│   ├── main.tf                   # GCP infrastructure (Cloud SQL, Redis, Cloud Run)
│   ├── variables.tf              # Terraform variables
│   └── outputs.tf                # Terraform outputs
│
├── backend/                      # Express.js API Server
│   ├── Dockerfile                # Multi-stage (builder → production → development)
│   ├── package.json              # Dependencies
│   ├── tsconfig.json             # TypeScript config (target: ES2020, outDir: dist)
│   ├── prisma/
│   │   └── schema.prisma         # Database schema (15 models, 6 enums)
│   └── src/
│       ├── index.ts              # Entry point (Express + Socket.IO + middleware)
│       ├── config/
│       │   ├── database.ts       # Prisma client singleton
│       │   ├── redis.ts          # Redis config (currently mock in-memory Map)
│       │   └── logger.ts         # Winston logger
│       ├── middleware/
│       │   ├── auth.ts           # JWT authentication middleware
│       │   ├── rbac.ts           # Role-based access control
│       │   ├── errorHandler.ts   # Global error handler
│       │   └── validate.ts       # Request validation (Zod)
│       ├── controllers/
│       │   ├── auth.controller.ts       # Register, login, refresh, password reset
│       │   ├── ai.controller.ts         # Gemini AI chat sessions
│       │   ├── bookings.controller.ts   # Session booking CRUD
│       │   ├── consultants.controller.ts # Consultant profiles & search
│       │   └── payments.controller.ts   # Razorpay/Stripe payment handling
│       ├── routes/
│       │   ├── auth.routes.ts           # /api/auth/*
│       │   ├── ai.routes.ts             # /api/ai/*
│       │   ├── bookings.routes.ts       # /api/bookings/*
│       │   ├── consultants.routes.ts    # /api/consultants/*
│       │   ├── payments.routes.ts       # /api/payments/*
│       │   ├── messages.routes.ts       # /api/messages/*
│       │   ├── users.routes.ts          # /api/users/*
│       │   ├── admin.routes.ts          # /api/admin/*
│       │   ├── domains.routes.ts        # /api/domains/*
│       │   └── support.routes.ts        # /api/support/*
│       ├── services/
│       │   ├── email.service.ts         # SendGrid email templates
│       │   └── socket.service.ts        # Socket.IO event handlers
│       └── utils/
│           └── daily.ts                 # Scheduled tasks
│
└── frontend/                     # Next.js 14 App
    ├── Dockerfile                # Multi-stage (deps → builder → production → development)
    ├── package.json              # Dependencies
    ├── next.config.js            # Standalone output, image domains, security headers
    ├── tailwind.config.js        # Custom theme (Inter/Outfit fonts, purple palette)
    ├── tsconfig.json             # TypeScript config
    └── src/
        ├── lib/
        │   └── axios.ts          # Axios instance with JWT interceptor
        ├── components/
        │   ├── Navbar.tsx        # Main navigation bar
        │   ├── Footer.tsx        # Site footer
        │   ├── ChatbotWidget.tsx  # AI chatbot floating widget
        │   ├── ThemeProvider.tsx  # Dark/light mode provider
        │   ├── ThemeToggle.tsx   # Theme switch button
        │   ├── ui/
        │   │   └── Toaster.tsx   # Toast notifications
        │   └── landing/
        │       ├── HeroSection.tsx
        │       ├── DomainCards.tsx
        │       ├── HowItWorks.tsx
        │       ├── StatsBar.tsx
        │       ├── Testimonials.tsx
        │       └── TopConsultants.tsx
        └── app/
            ├── layout.tsx        # Root layout (Navbar, ChatbotWidget, Toaster)
            ├── globals.css       # Global styles + Tailwind directives
            ├── page.tsx          # Landing page
            ├── login/            # Login page
            ├── signup/           # Registration page
            ├── forgot-password/  # Password recovery
            ├── about/            # About page
            ├── ai-guide/         # AI career guidance page
            ├── consultants/      # Consultant listing
            ├── domains/          # Career domains listing
            ├── book/             # Booking flow
            ├── bookings/         # Booking management
            └── dashboard/
                ├── seeker/       # Seeker dashboard
                └── consultant/   # Consultant dashboard
```

---

## 5. Database Schema

### Models (15 total)

| Model | Table | Key Fields |
|-------|-------|------------|
| **User** | `users` | email, phone, passwordHash, role (SEEKER/CONSULTANT/ADMIN) |
| **SeekerProfile** | `seeker_profiles` | fullName, educationLevel, interestedDomains |
| **ConsultantProfile** | `consultant_profiles` | bio, domains, ratePerSession, status, averageRating |
| **Availability** | `availability_slots` | date, startTime, endTime, isBooked |
| **Booking** | `bookings` | seekerId, consultantId, topic, sessionType, status |
| **Payment** | `payments` | grossAmount, commissionPct (20%), gateway, status |
| **Payout** | `payouts` | consultantId, amount, status |
| **Review** | `reviews` | rating (1-5), comment, isAnonymous |
| **Message** | `messages` | senderId, receiverId, content, isRead |
| **AiSession** | `ai_sessions` | userId, title, messages (JSON), domain |
| **SavedConsultant** | `saved_consultants` | seekerId, consultantId |
| **Notification** | `notifications` | title, body, type, isRead |
| **SupportTicket** | `support_tickets` | subject, category, status |
| **DomainContent** | `domain_contents` | slug, name, description, articles (JSON) |
| **College** | `colleges` | name, location, embedding (vector 768) |
| **Course** | `courses` | collegeId, name, fee, embedding (vector 768) |

### Special Features
- **pgvector extension** enabled for College/Course vector search (RAG)
- **20% platform commission** on all payments
- **Multi-gateway** payment support (Razorpay + Stripe)

---

## 6. API Routes

| Route | Methods | Auth | Description |
|-------|---------|------|-------------|
| `/health` | GET | ❌ | Health check endpoint |
| `/api/auth/*` | POST | ❌ | Register, login, refresh token, password reset |
| `/api/users/*` | GET, PUT | ✅ | User profile management |
| `/api/consultants/*` | GET, POST, PUT | Partial | Consultant listing, profile, availability |
| `/api/bookings/*` | GET, POST, PUT | ✅ | Create/manage booking sessions |
| `/api/payments/*` | POST | ✅ | Payment creation and verification |
| `/api/messages/*` | GET, POST | ✅ | Direct messaging between users |
| `/api/ai/*` | GET, POST | Partial | AI career guidance chat sessions |
| `/api/admin/*` | GET, POST, PUT | ✅ (ADMIN) | Consultant approval, analytics, payouts |
| `/api/domains/*` | GET, POST, PUT | Partial | Career domain content management |
| `/api/support/*` | GET, POST | ✅ | Support ticket management |

**Rate Limits:**
- General API: 200 requests / 15 minutes
- Auth endpoints: 20 requests / 15 minutes

---

## 7. Frontend Pages & Components

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Hero, domain cards, stats, testimonials, top consultants |
| `/login` | Login | User authentication |
| `/signup` | Signup | New user registration |
| `/forgot-password` | Password Recovery | Password reset flow |
| `/about` | About | Platform information |
| `/ai-guide` | AI Guide | Gemini-powered career chatbot |
| `/consultants` | Consultant Listing | Browse and search consultants |
| `/domains` | Career Domains | Browse career domains |
| `/book` | Booking | Session booking flow |
| `/bookings` | My Bookings | View/manage bookings |
| `/dashboard/seeker` | Seeker Dashboard | Seeker analytics and management |
| `/dashboard/consultant` | Consultant Dashboard | Consultant analytics and management |

---

## 8. Environment Variables

### Backend (Required for Production)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `REDIS_URL` | ⚠️ | Redis URL (currently mocked — not critical) |
| `JWT_SECRET` | ✅ | JWT signing secret |
| `JWT_REFRESH_SECRET` | ✅ | JWT refresh token secret |
| `JWT_EXPIRES_IN` | ✅ | Token expiry (e.g., `15m`) |
| `JWT_REFRESH_EXPIRES_IN` | ✅ | Refresh token expiry (e.g., `7d`) |
| `GEMINI_API_KEY` | ✅ | Google Gemini AI API key |
| `RAZORPAY_KEY_ID` | ⚠️ | Razorpay public key |
| `RAZORPAY_KEY_SECRET` | ⚠️ | Razorpay secret key |
| `STRIPE_SECRET_KEY` | ⚠️ | Stripe secret key |
| `SENDGRID_API_KEY` | ⚠️ | SendGrid email API key |
| `TWILIO_ACCOUNT_SID` | ⚠️ | Twilio SMS account SID |
| `PORT` | ❌ | Backend port (default: 4000) |
| `FRONTEND_URL` | ✅ | Frontend URL for CORS |
| `NODE_ENV` | ✅ | `production` |

### Frontend (Required for Production)

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | ✅ | Backend API URL |
| `NEXT_PUBLIC_APP_NAME` | ❌ | App name (default: Mentroo) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | ⚠️ | Razorpay public key |
| `NEXT_PUBLIC_GEMINI_API_KEY` | ⚠️ | Gemini API key (client-side) |

---

## 9. Current CI/CD Setup

The project is currently configured for **Google Cloud Platform (GCP)**:

- **CI:** GitHub Actions → lint, test, build, Docker validation
- **CD:** GitHub Actions → build Docker images → push to Artifact Registry → deploy to Cloud Run
- **IaC:** Terraform for Cloud SQL, Memorystore Redis, Cloud Run, VPC, Secret Manager
- **Alt CI/CD:** Google Cloud Build (`cloudbuild.yaml`)

---

## 10. Vercel Deployment Guide

> [!IMPORTANT]
> Vercel **only supports the frontend (Next.js)**. The backend (Express.js) **cannot be deployed on Vercel** as a traditional server — it requires a separate hosting provider.

### Deployment Strategy

```
┌────────────────────────┐     ┌──────────────────────────┐
│   VERCEL (Frontend)    │     │  SEPARATE HOST (Backend) │
│   Next.js App          │────►│  Express.js API          │
│   *.vercel.app         │     │  Railway / Render / Fly  │
└────────────────────────┘     └───────────┬──────────────┘
                                           │
                               ┌───────────┼───────────┐
                               │           │           │
                          PostgreSQL    Redis     External APIs
                          (Supabase/   (Upstash)
                           Neon)
```

### Step 1: Deploy Backend (Choose One Provider)

Since Vercel can't host Express.js as a long-running server with Socket.IO, deploy the backend separately:

| Provider | Free Tier | Best For | Notes |
|----------|-----------|----------|-------|
| **Railway** | $5/mo credit | Full-stack | PostgreSQL + Redis included |
| **Render** | Free tier | Simple deploy | Free PostgreSQL, auto-sleep |
| **Fly.io** | Free tier | Low latency | Docker-based, global edge |
| **DigitalOcean App Platform** | $5/mo | Production | Managed DB available |
| **Google Cloud Run** | Free tier | Already configured | Existing Terraform + CD pipeline |

#### Railway Example (Recommended for Simplicity)

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login
railway login

# 3. Initialize project from backend directory
cd backend
railway init

# 4. Add PostgreSQL
railway add --plugin postgresql

# 5. Add Redis (optional — currently mocked)
railway add --plugin redis

# 6. Set environment variables
railway variables set JWT_SECRET=<your-secret>
railway variables set JWT_REFRESH_SECRET=<your-refresh-secret>
railway variables set GEMINI_API_KEY=<your-gemini-key>
railway variables set FRONTEND_URL=https://your-app.vercel.app
railway variables set NODE_ENV=production

# 7. Deploy
railway up
```

#### Database Options (Managed PostgreSQL)

| Provider | Free Tier | pgvector Support | Recommendation |
|----------|-----------|------------------|----------------|
| **Supabase** | 500MB, 2 projects | ✅ Yes | Best for this project (pgvector needed) |
| **Neon** | 512MB | ✅ Yes | Serverless PostgreSQL, great free tier |
| **Railway** | Included | ✅ Yes | Bundled with backend deployment |
| **PlanetScale** | 5GB | ❌ No (MySQL) | Not compatible |

> [!WARNING]
> This project uses **pgvector** for College/Course embeddings. Make sure your PostgreSQL provider supports the `vector` extension.

---

### Step 2: Deploy Frontend to Vercel

#### 2A. Prepare the Repository

The project has a **monorepo structure** (`backend/` + `frontend/`). Vercel needs to know the frontend root directory.

**Option 1: Deploy from the monorepo (Recommended)**
- Set **Root Directory** to `frontend` in Vercel dashboard

**Option 2: Separate repository**
- Move `frontend/` to its own Git repo

#### 2B. Required Configuration Changes

##### 1. Update `next.config.js` — Remove `standalone` output for Vercel

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // REMOVE: output: 'standalone',  ← Vercel handles this automatically
  images: {
    domains: [
      'storage.googleapis.com',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
      'ui-avatars.com',
      'images.unsplash.com',
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || 'CareerPathway',
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};
module.exports = nextConfig;
```

> [!CAUTION]
> The `output: 'standalone'` setting is for Docker/self-hosted deployments. **Remove it for Vercel** — Vercel uses its own build optimization.

##### 2. Fix deprecated `viewport` and `themeColor` in `layout.tsx`

In Next.js 14, `viewport` and `themeColor` should be exported separately:

```tsx
// Add this export to layout.tsx
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#a855f7',
};
```

And remove `viewport` and `themeColor` from the `metadata` export.

#### 2C. Deploy to Vercel

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Navigate to project root
cd careerpathway

# 3. Deploy (first time — will prompt for config)
vercel

# During setup:
#   - Set up and deploy? → Yes
#   - Which scope? → Your account
#   - Link to existing project? → No
#   - Project name? → careerpathway
#   - Root directory? → frontend
#   - Override build settings? → No (uses next build automatically)
```

#### 2D. Set Environment Variables in Vercel Dashboard

Go to **Vercel Dashboard → Project → Settings → Environment Variables**:

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://your-backend-url.railway.app` | Production |
| `NEXT_PUBLIC_APP_NAME` | `CareerPathway` | Production |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | `rzp_live_xxxxx` | Production |
| `NEXT_PUBLIC_GEMINI_API_KEY` | `your-gemini-key` | Production |

#### 2E. Configure Custom Domain (Optional)

```
Vercel Dashboard → Project → Settings → Domains → Add Domain
```

#### 2F. Vercel Project Settings Summary

| Setting | Value |
|---------|-------|
| **Framework Preset** | Next.js |
| **Root Directory** | `frontend` |
| **Build Command** | `next build` (auto-detected) |
| **Output Directory** | `.next` (auto-detected) |
| **Install Command** | `npm ci` (auto-detected) |
| **Node.js Version** | 20.x |

---

### Step 3: Update Backend CORS for Vercel Domain

In `backend/src/index.ts`, update the CORS origin to include your Vercel domain:

```typescript
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3000',
    'https://your-app.vercel.app',        // Add Vercel domain
    'https://yourdomain.com',             // Add custom domain
  ],
  credentials: true,
}));
```

Or better, use the `FRONTEND_URL` env var on your backend to dynamically set the allowed origin.

---

### Step 4: Post-Deployment Checklist

- [ ] Backend is deployed and `/health` returns `200 OK`
- [ ] Database migrations are run (`npx prisma migrate deploy`)
- [ ] Prisma client is generated (`npx prisma generate`)
- [ ] `NEXT_PUBLIC_API_URL` points to the live backend URL
- [ ] `FRONTEND_URL` on the backend points to the Vercel URL
- [ ] CORS is configured to allow the Vercel domain
- [ ] All `NEXT_PUBLIC_*` environment variables are set in Vercel
- [ ] JWT secrets are set on the backend
- [ ] Payment gateway keys are set (if using payments)
- [ ] Custom domain DNS is configured (if applicable)
- [ ] SSL/HTTPS is working on both frontend and backend

---

## 11. External Services Required

| Service | Purpose | Required? | Free Tier? |
|---------|---------|-----------|------------|
| **PostgreSQL** (Supabase/Neon) | Database | ✅ | ✅ |
| **Google Gemini AI** | Career AI chatbot | ✅ | ✅ (free tier) |
| **Razorpay** | Indian payments | ⚠️ (if payments needed) | Test mode free |
| **Stripe** | International payments | ⚠️ (if payments needed) | Test mode free |
| **SendGrid** | Email notifications | ⚠️ (if email needed) | 100 emails/day free |
| **Twilio** | SMS/OTP | ⚠️ (if OTP needed) | Trial credit |
| **Redis** (Upstash) | Caching | ❌ (currently mocked) | ✅ |
| **Google Cloud Storage** | File uploads | ⚠️ (if uploads needed) | 5GB free |

---

## 12. Known Issues & Recommendations

### Issues

| # | Issue | Severity | Details |
|---|-------|----------|---------|
| 1 | **Naming inconsistency** | Low | Package names say `mentroo-frontend` / `mentroo-backend` but branding is `CareerPathway`. Server log says "Mentroo API". |
| 2 | **Redis is mocked** | Medium | `redis.ts` uses an in-memory `Map()` instead of actual Redis. Fine for MVP, not for production scale. |
| 3 | **`output: 'standalone'` in next.config.js** | High | Must be **removed** for Vercel deployment. Vercel handles output optimization itself. |
| 4 | **Deprecated viewport config** | Low | `viewport` and `themeColor` in metadata export are deprecated in Next.js 14. Should use separate `viewport` export. |
| 5 | **Socket.IO incompatibility** | High | Socket.IO requires persistent connections. **Vercel Serverless Functions don't support WebSockets**. Real-time chat will NOT work with a Vercel-only deployment. Backend must be hosted separately. |
| 6 | **`.env.local` committed** | High | `frontend/.env.local` contains environment variable template. Should be in `.gitignore`. |
| 7 | **No seed data script** | Medium | `db:seed` script references `prisma/seed.ts` but the file doesn't exist. |

### Recommendations

1. **Remove `output: 'standalone'`** from `next.config.js` before deploying to Vercel
2. **Use Upstash Redis** for a serverless Redis solution compatible with Vercel Edge
3. **Deploy backend to Railway/Render** for Socket.IO WebSocket support
4. **Use Supabase or Neon** for managed PostgreSQL with pgvector support
5. **Add `frontend/.env.local` to `.gitignore`** to prevent credential leaks
6. **Create a `vercel.json`** for custom configuration if needed:

```json
{
  "framework": "nextjs",
  "installCommand": "npm ci",
  "buildCommand": "next build"
}
```

---

## Quick Start — Minimum Viable Vercel Deployment

```bash
# 1. Sign up for free services
#    - Vercel: https://vercel.com (frontend hosting)
#    - Supabase: https://supabase.com (PostgreSQL + pgvector)
#    - Railway: https://railway.app (backend hosting)
#    - Google AI Studio: https://aistudio.google.com (Gemini API key)

# 2. Deploy backend to Railway
cd backend
railway init && railway up

# 3. Run database migrations
railway run npx prisma migrate deploy

# 4. Edit next.config.js — remove 'standalone' output
# 5. Deploy frontend to Vercel
cd ../frontend
vercel --prod

# 6. Set environment variables in Vercel dashboard
#    NEXT_PUBLIC_API_URL = https://your-backend.railway.app

# 7. Set FRONTEND_URL on backend
#    railway variables set FRONTEND_URL=https://your-app.vercel.app

# Done! 🎉
```

---

## 13. Azure VM Deployment Guide (Full-Stack — Single Server)

> [!TIP]
> An Azure VM is ideal for this project because it hosts **everything on one machine** — frontend, backend, PostgreSQL, Redis, Socket.IO (WebSockets) — with no service limitations.

### Why Azure VM over Vercel?

| Aspect | Vercel | Azure VM |
|--------|--------|----------|
| Frontend (Next.js) | ✅ Native support | ✅ Works |
| Backend (Express.js) | ❌ No long-running servers | ✅ Full support |
| Socket.IO (WebSockets) | ❌ Not supported | ✅ Full support |
| PostgreSQL + pgvector | ❌ Needs external service | ✅ Self-hosted |
| Redis | ❌ Needs external service | ✅ Self-hosted |
| Full control | ❌ Limited | ✅ Complete |
| Cost | Free tier + paid services | ~$15-30/mo (B2s VM) |
| Scaling | Auto-scaling | Manual (or VM Scale Sets) |

---

### Step 1: Create Azure VM

#### Via Azure Portal

1. Go to [portal.azure.com](https://portal.azure.com)
2. Click **Create a Resource** → **Virtual Machine**
3. Configure:

| Setting | Recommended Value |
|---------|-------------------|
| **Subscription** | Your subscription |
| **Resource Group** | `careerpathway-rg` (create new) |
| **VM Name** | `careerpathway-vm` |
| **Region** | `Central India` (or closest to users) |
| **Image** | `Ubuntu Server 22.04 LTS - x64 Gen2` |
| **Size** | `Standard_B2s` (2 vCPU, 4GB RAM) — **~$30/mo** |
| **Authentication** | SSH public key (recommended) |
| **Username** | `azureuser` |
| **Inbound Ports** | Allow SSH (22), HTTP (80), HTTPS (443) |

> [!IMPORTANT]
> For production, `Standard_B2s` (2 vCPU, 4GB RAM) is the minimum recommended. For heavier loads, use `Standard_B2ms` (2 vCPU, 8GB RAM, ~$60/mo).

#### Via Azure CLI

```bash
# Login to Azure
az login

# Create resource group
az group create --name careerpathway-rg --location centralindia

# Create VM
az vm create \
  --resource-group careerpathway-rg \
  --name careerpathway-vm \
  --image Ubuntu2204 \
  --size Standard_B2s \
  --admin-username azureuser \
  --generate-ssh-keys \
  --public-ip-sku Standard \
  --os-disk-size-gb 30

# Open required ports
az vm open-port --resource-group careerpathway-rg --name careerpathway-vm --port 80 --priority 1001
az vm open-port --resource-group careerpathway-rg --name careerpathway-vm --port 443 --priority 1002
az vm open-port --resource-group careerpathway-rg --name careerpathway-vm --port 4000 --priority 1003
```

#### Get VM Public IP

```bash
az vm show -d --resource-group careerpathway-rg --name careerpathway-vm --query publicIps -o tsv
```

---

### Step 2: SSH into VM & Install Software

```bash
# SSH into the VM
ssh azureuser@<YOUR_VM_PUBLIC_IP>
```

#### 2A. Update System

```bash
sudo apt update && sudo apt upgrade -y
```

#### 2B. Install Docker & Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose plugin
sudo apt install docker-compose-plugin -y

# Verify
docker --version
docker compose version

# Re-login for group changes
exit
ssh azureuser@<YOUR_VM_PUBLIC_IP>
```

#### 2C. Install Node.js 20 (for build tools)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version
```

#### 2D. Install Nginx (Reverse Proxy)

```bash
sudo apt install nginx -y
sudo systemctl enable nginx
```

#### 2E. Install Certbot (SSL/HTTPS)

```bash
sudo apt install certbot python3-certbot-nginx -y
```

---

### Step 3: Clone & Configure Project

```bash
# Clone repository
cd /home/azureuser
git clone https://github.com/YOUR_USERNAME/careerpathway.git
cd careerpathway
```

#### 3A. Create Production `.env` File

```bash
nano .env
```

Paste and fill in real values:

```env
# ============================================================
# CareerPathway — Production Environment Variables
# ============================================================

# --- App ---
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://yourdomain.com

# --- Database (PostgreSQL) ---
DATABASE_URL=postgresql://careerpathway:YOUR_STRONG_DB_PASSWORD@postgres:5432/careerpathway_db

# --- Redis ---
REDIS_URL=redis://redis:6379

# --- JWT ---
JWT_SECRET=GENERATE_A_RANDOM_64_CHAR_STRING_HERE
JWT_REFRESH_SECRET=GENERATE_ANOTHER_RANDOM_64_CHAR_STRING_HERE
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# --- Google Gemini AI ---
GEMINI_API_KEY=your_real_gemini_api_key

# --- Razorpay ---
RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# --- Stripe ---
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxxx

# --- SendGrid ---
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxx
EMAIL_FROM=noreply@yourdomain.com

# --- Twilio ---
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890

# --- Frontend ---
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXT_PUBLIC_APP_NAME=CareerPathway
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxxx
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

Generate secure JWT secrets:

```bash
openssl rand -hex 32   # Use output for JWT_SECRET
openssl rand -hex 32   # Use output for JWT_REFRESH_SECRET
```

#### 3B. Update `docker-compose.yml` for Production

```bash
nano docker-compose.yml
```

Replace with this production-ready version:

```yaml
version: "3.9"

services:
  # ── PostgreSQL Database ──────────────────────────────
  postgres:
    image: postgres:15-alpine
    container_name: careerpathway_postgres
    restart: always
    environment:
      POSTGRES_USER: careerpathway
      POSTGRES_PASSWORD: ${DB_PASSWORD:-YOUR_STRONG_DB_PASSWORD}
      POSTGRES_DB: careerpathway_db
    ports:
      - "127.0.0.1:5432:5432"   # Only expose to localhost
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U careerpathway -d careerpathway_db"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ── Redis Cache ──────────────────────────────────────
  redis:
    image: redis:7-alpine
    container_name: careerpathway_redis
    restart: always
    ports:
      - "127.0.0.1:6379:6379"   # Only expose to localhost
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  # ── Backend API ──────────────────────────────────────
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: production
    container_name: careerpathway_backend
    restart: always
    env_file:
      - .env
    environment:
      DATABASE_URL: postgresql://careerpathway:${DB_PASSWORD:-YOUR_STRONG_DB_PASSWORD}@postgres:5432/careerpathway_db
      REDIS_URL: redis://redis:6379
      NODE_ENV: production
    ports:
      - "127.0.0.1:4000:4000"   # Only expose to localhost (Nginx will proxy)
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  # ── Frontend ─────────────────────────────────────────
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: production
      args:
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL:-https://yourdomain.com}
        NEXT_PUBLIC_APP_NAME: ${NEXT_PUBLIC_APP_NAME:-CareerPathway}
    container_name: careerpathway_frontend
    restart: always
    environment:
      NODE_ENV: production
    ports:
      - "127.0.0.1:3000:3000"   # Only expose to localhost (Nginx will proxy)
    depends_on:
      - backend

volumes:
  postgres_data:
  redis_data:

networks:
  default:
    name: careerpathway_network
```

> [!IMPORTANT]
> Key changes from development config:
> - All ports bound to `127.0.0.1` (not exposed to internet directly)
> - Using `production` build targets
> - `restart: always` for auto-recovery
> - Nginx will handle external traffic

---

### Step 4: Build & Start Services

```bash
cd /home/azureuser/careerpathway

# Build all images (first time takes ~5-10 minutes)
docker compose build

# Start all services in detached mode
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f backend
docker compose logs -f frontend

# Run database migrations
docker compose exec backend npx prisma migrate deploy
```

Verify services are running:

```bash
# Backend health check
curl http://localhost:4000/health

# Frontend
curl -I http://localhost:3000
```

---

### Step 5: Configure Nginx Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/careerpathway
```

Paste this configuration:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL certificates (Certbot will fill these in)
    # ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Max upload size
    client_max_body_size 10M;

    # ── API Backend (Express.js) ──────────────────────
    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;   # WebSocket timeout (24h)
    }

    # ── Health check ──────────────────────────────────
    location /health {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
    }

    # ── Socket.IO (WebSockets) ────────────────────────
    location /socket.io/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 86400;
    }

    # ── Frontend (Next.js) ────────────────────────────
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

> [!NOTE]
> If you don't have a domain yet, temporarily use the VM's public IP. Replace `yourdomain.com` with your IP and comment out the SSL/HTTPS redirect block. Use only the `listen 80` server block.

#### Enable the site:

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/careerpathway /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

#### Temporary IP-only config (no domain):

If testing without a domain, use this simpler config:

```nginx
server {
    listen 80;
    server_name _;

    client_max_body_size 10M;

    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_read_timeout 86400;
    }

    location /health {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
    }

    location /socket.io/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

---

### Step 6: Setup SSL with Let's Encrypt (Free HTTPS)

> Requires a domain name pointing to your VM's IP address.

```bash
# Point your domain's A record to your VM's public IP first, then:

sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal (Certbot sets this up automatically)
sudo certbot renew --dry-run
```

---

### Step 7: Configure Azure Firewall (NSG)

Ensure your Azure Network Security Group allows:

```bash
# Via Azure CLI
az network nsg rule create --resource-group careerpathway-rg \
  --nsg-name careerpathway-vmNSG --name AllowHTTP \
  --priority 1001 --destination-port-ranges 80 --access Allow \
  --protocol Tcp --direction Inbound

az network nsg rule create --resource-group careerpathway-rg \
  --nsg-name careerpathway-vmNSG --name AllowHTTPS \
  --priority 1002 --destination-port-ranges 443 --access Allow \
  --protocol Tcp --direction Inbound
```

| Port | Protocol | Purpose | Access |
|------|----------|---------|--------|
| 22 | TCP | SSH | Allow (restrict to your IP) |
| 80 | TCP | HTTP → HTTPS redirect | Allow |
| 443 | TCP | HTTPS (main traffic) | Allow |
| 4000 | TCP | Backend API (direct) | ❌ Deny (Nginx proxies) |
| 5432 | TCP | PostgreSQL | ❌ Deny (internal only) |
| 6379 | TCP | Redis | ❌ Deny (internal only) |

> [!CAUTION]
> **Never expose ports 5432 (PostgreSQL) or 6379 (Redis) to the internet.** They are bound to `127.0.0.1` in the Docker Compose config and should stay that way.

---

### Step 8: Setup Auto-Deploy with GitHub Actions

Create `.github/workflows/deploy-azure.yml`:

```yaml
name: Deploy to Azure VM

on:
  push:
    branches: [main]

jobs:
  deploy:
    name: Deploy to Azure VM
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.AZURE_VM_IP }}
          username: ${{ secrets.AZURE_VM_USER }}
          key: ${{ secrets.AZURE_SSH_KEY }}
          script: |
            cd /home/azureuser/careerpathway
            git pull origin main
            docker compose build --no-cache
            docker compose up -d
            docker compose exec -T backend npx prisma migrate deploy
            docker system prune -f
            echo "✅ Deployed at $(date)"
```

#### GitHub Secrets to Add:

| Secret | Value |
|--------|-------|
| `AZURE_VM_IP` | Your VM's public IP |
| `AZURE_VM_USER` | `azureuser` |
| `AZURE_SSH_KEY` | Contents of your private SSH key (`~/.ssh/id_rsa`) |

---

### Step 9: Production Hardening Checklist

```bash
# ── Swap file (important for B2s with 4GB RAM) ──────
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile swap swap defaults 0 0' | sudo tee -a /etc/fstab

# ── Enable automatic security updates ───────────────
sudo apt install unattended-upgrades -y
sudo dpkg-reconfigure -plow unattended-upgrades

# ── Setup UFW firewall ──────────────────────────────
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
sudo ufw enable

# ── Fail2ban (brute-force protection) ───────────────
sudo apt install fail2ban -y
sudo systemctl enable fail2ban

# ── Log rotation for Docker ─────────────────────────
sudo nano /etc/docker/daemon.json
```

Add to `/etc/docker/daemon.json`:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

```bash
sudo systemctl restart docker
```

---

### Step 10: Useful Management Commands

```bash
# ── Service Management ──────────────────────────────
docker compose up -d              # Start all services
docker compose down               # Stop all services
docker compose restart backend    # Restart backend only
docker compose logs -f --tail=50  # Live logs (last 50 lines)
docker compose ps                 # Status of all services

# ── Database ────────────────────────────────────────
docker compose exec backend npx prisma migrate deploy   # Run migrations
docker compose exec backend npx prisma studio           # Open Prisma Studio
docker compose exec postgres psql -U careerpathway -d careerpathway_db  # SQL shell

# ── Database Backup ─────────────────────────────────
docker compose exec postgres pg_dump -U careerpathway careerpathway_db > backup_$(date +%Y%m%d).sql

# ── Database Restore ────────────────────────────────
cat backup_20260507.sql | docker compose exec -T postgres psql -U careerpathway -d careerpathway_db

# ── Monitoring ──────────────────────────────────────
docker stats                      # Resource usage
df -h                             # Disk usage
free -h                           # Memory usage
htop                              # Process monitor

# ── Update & Redeploy ──────────────────────────────
cd /home/azureuser/careerpathway
git pull origin main
docker compose build
docker compose up -d
docker compose exec -T backend npx prisma migrate deploy
```

---

### Azure VM Cost Estimate

| Resource | Size | Monthly Cost (Central India) |
|----------|------|------------------------------|
| **VM** (B2s) | 2 vCPU, 4GB RAM | ~$30 |
| **OS Disk** | 30GB SSD | ~$4 |
| **Public IP** | Static | ~$3 |
| **Bandwidth** | 5GB outbound | Free (first 5GB) |
| **Total** | | **~$37/month** |

> [!TIP]
> Use **Azure Reserved Instances** (1-year commitment) to save **~40%** → bringing cost down to ~$22/month.

---

### Azure VM Architecture Summary

```
Internet
   │
   ▼
┌──────────────────── Azure VM (Ubuntu 22.04) ────────────────────┐
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │  Nginx (Port 80/443)                                      │   │
│  │  ├── /        → localhost:3000 (Next.js Frontend)         │   │
│  │  ├── /api/*   → localhost:4000 (Express.js Backend)       │   │
│  │  └── /socket.io/* → localhost:4000 (WebSocket)            │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────── Docker Compose ───────────────────────────────────┐   │
│  │                                                           │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐    │   │
│  │  │ Frontend │ │ Backend  │ │PostgreSQL│ │  Redis   │    │   │
│  │  │ :3000    │ │ :4000    │ │ :5432    │ │ :6379    │    │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘    │   │
│  │                                                           │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

*This document was generated by analyzing the complete project source code, configuration files, and infrastructure setup.*
