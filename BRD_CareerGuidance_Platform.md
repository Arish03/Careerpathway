# Business Requirements Document (BRD)

## CareerPathway — Career Development & Consultation Platform

| Field             | Detail                                      |
|-------------------|---------------------------------------------|
| **Document Version** | 1.0                                      |
| **Date**             | 8 April 2026                             |
| **Prepared By**      | Product Team                             |
| **Status**           | Draft                                    |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Business Objectives](#2-business-objectives)
3. [Scope](#3-scope)
4. [User Roles](#4-user-roles)
5. [Revenue Model](#5-revenue-model)
6. [Functional Requirements — Page-by-Page Specification](#6-functional-requirements--page-by-page-specification)
7. [AI Chatbot Specification](#7-ai-chatbot-specification)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [Tech Stack Recommendation](#9-tech-stack-recommendation)
10. [Appendix — Navigation Sitemap](#10-appendix--navigation-sitemap)

---

## 1. Executive Summary

CareerPathway is a web-based platform that provides career development guidance and paid consultation services across multiple domains — **Education, Business, Sports, Medical, and more**. The platform connects aspiring students and professionals with experienced consultants (current college students, alumni, and industry professionals) for personalized guidance. An AI-powered chatbot assists users with suggestions, career path mapping, college recommendations, and entrance exam guidance. The platform earns revenue through commission on every consultation booked.

---

## 2. Business Objectives

| # | Objective |
|---|-----------|
| O1 | Provide a one-stop platform for career guidance across Education, Business, Sports, Medical, and other domains |
| O2 | Enable students to discover colleges (Indian & foreign), entrance exams, and application processes |
| O3 | Allow current students and alumni to register as paid consultants |
| O4 | Facilitate 1-on-1 consultation booking (video/audio/chat) |
| O5 | Deploy an AI chatbot for instant career suggestions and guided navigation |
| O6 | Generate revenue through commission on each consultation transaction |
| O7 | Build a trust-based community with ratings, reviews, and verified profiles |

---

## 3. Scope

### 3.1 In Scope

| Area | Details |
|------|---------|
| **Career Domains** | Education, Business, Sports, Medical, Engineering, Arts, Law, Government Services, Research |
| **Geographies** | Indian colleges & universities, Foreign universities (US, UK, Canada, Australia, Europe, etc.) |
| **Guidance Services** | College selection, entrance exam preparation tips, application process guidance, scholarship info, campus life insights |
| **Consultation Services** | Paid 1-on-1 sessions (video call, audio call, chat) between seekers and consultants |
| **AI Chatbot** | Career path suggestions, domain recommendations, college shortlisting, FAQ handling |
| **Monetization** | Platform commission (percentage-based) on each consultation session |

### 3.2 Out of Scope (v1)

- Direct admission processing or form filing on behalf of students
- Loan/financing services
- Full LMS or course delivery
- Offline consultation management

---

## 4. User Roles

| Role | Description |
|------|-------------|
| **Seeker** | A student or professional looking for career guidance, college suggestions, or consultation |
| **Consultant** | A current college student, alumnus, or professional who registers to offer paid consultation sessions |
| **Admin** | Platform administrator managing users, commissions, disputes, and content |
| **AI Chatbot** | System actor providing automated guidance and suggestions |

---

## 5. Revenue Model

| Source | Mechanism |
|--------|-----------|
| Consultation Commission | Platform retains a configurable percentage (e.g., 15–25%) from each paid consultation |
| Featured Consultant Listing | Consultants can pay to be featured/highlighted in search results |
| Premium Seeker Subscription (future) | Unlimited AI chatbot usage, priority booking, exclusive webinars |

---

## 6. Functional Requirements — Page-by-Page Specification

---

### PAGE 1 — Landing Page (`/`)

**Purpose:** First impression; communicate value proposition and drive sign-ups.

| Section | Elements | Details |
|---------|----------|---------|
| **Hero Banner** | Headline, subtext, CTA buttons | "Your Career Starts Here — Get Expert Guidance in Education, Business, Sports, Medical & More" |
| | Primary CTA | `Get Started` → Seeker registration |
| | Secondary CTA | `Become a Consultant` → Consultant registration |
| **How It Works** | 3-step visual | 1. Choose your domain → 2. Talk to AI or book a consultant → 3. Get personalized guidance |
| **Domain Cards** | Clickable category cards | Education, Business, Sports, Medical, Engineering, Arts, Law, Government, Research |
| **Top Consultants** | Carousel | Profile photo, name, domain, rating, "Book Now" button |
| **Testimonials** | Slider | Seeker & consultant success stories |
| **Stats Bar** | Counters | "10,000+ Students Guided", "2,000+ Consultants", "50+ Countries" |
| **AI Chatbot Widget** | Floating button (bottom-right) | Opens chatbot panel |
| **Footer** | Links | About Us, Contact, Careers, T&C, Privacy Policy, Social Media links |

**Navigation Bar (Global — all pages):**

| Position | Element | Action |
|----------|---------|--------|
| Left | Logo | Navigate to `/` |
| Center | Home · Explore Domains · Find Consultants · AI Guide · About Us | Navigate to respective pages |
| Right (Guest) | `Login` · `Sign Up` | Open auth modals |
| Right (Logged In) | Notifications bell · Profile avatar dropdown | Dropdown: Dashboard, My Bookings, Settings, Logout |

---

### PAGE 2 — Sign Up / Registration (`/signup`)

**Purpose:** Onboard new users as Seeker or Consultant.

| Section | Elements | Details |
|---------|----------|---------|
| **Role Selection** | Toggle / Tab | `I'm a Seeker` · `I'm a Consultant` |

#### 2A — Seeker Registration

| Field | Type | Validation |
|-------|------|------------|
| Full Name | Text | Required, 2–100 chars |
| Email | Email | Required, unique, email format |
| Phone Number | Phone with country code | Required, OTP verification |
| Password | Password | Required, min 8 chars, 1 uppercase, 1 number, 1 special char |
| Confirm Password | Password | Must match |
| Current Education Level | Dropdown | 10th, 12th, Undergraduate, Postgraduate, Working Professional |
| Interested Domain(s) | Multi-select checkboxes | Education, Business, Sports, Medical, Engineering, Arts, Law, Government, Research |
| Preferred Country | Multi-select | India, US, UK, Canada, Australia, Germany, Other |
| Terms & Conditions | Checkbox | Required |
| **CTA** | Button | `Create Account` |
| **Social Sign-Up** | Buttons | `Sign up with Google` · `Sign up with LinkedIn` |

#### 2B — Consultant Registration

| Field | Type | Validation |
|-------|------|------------|
| Full Name | Text | Required |
| Email | Email | Required, unique |
| Phone Number | Phone | Required, OTP verification |
| Password | Password | Same rules as Seeker |
| Profile Photo | Image upload | Required, max 5 MB, JPG/PNG |
| Consultant Type | Dropdown | Current Student, Alumni/Passed Out, Industry Professional |
| Institution/Organization | Text + auto-suggest | Required |
| Degree / Qualification | Text | Required |
| Year of Passing / Current Year | Dropdown | Required |
| Domain of Expertise | Multi-select | Education, Business, Sports, Medical, Engineering, Arts, Law, Government, Research |
| Sub-specialization | Tags input | E.g., "IIT JEE Prep", "MBA Admissions", "Cricket Coaching", "USMLE" |
| Country of Institution | Dropdown | Required |
| Bio / About Me | Textarea | Required, 50–500 chars |
| Consultation Rate (per session) | Number (₹ / $) | Required, min ₹100 / $5 |
| Session Duration Options | Multi-select | 15 min, 30 min, 45 min, 60 min |
| Available Days & Times | Calendar/slot picker | Required |
| LinkedIn Profile URL | URL | Optional |
| ID Verification Document | File upload | Required (for verification) — College ID / Degree certificate |
| Terms & Commission Agreement | Checkbox | Required — "I agree to the platform commission of X%" |
| **CTA** | Button | `Apply as Consultant` |

**Post-Registration Flow:**
- Seeker → Email verification → Login → Dashboard
- Consultant → Email verification → Admin review (24–48 hrs) → Approval notification → Login → Dashboard

---

### PAGE 3 — Login (`/login`)

| Element | Details |
|---------|---------|
| Email / Phone | Input field |
| Password | Input field with show/hide toggle |
| Remember Me | Checkbox |
| Forgot Password? | Link → `/forgot-password` |
| Login Button | Primary CTA |
| Social Login | `Login with Google` · `Login with LinkedIn` |
| Don't have an account? | Link → `/signup` |

---

### PAGE 4 — Forgot Password (`/forgot-password`)

| Step | Elements |
|------|----------|
| Step 1 | Enter registered email → `Send OTP` button |
| Step 2 | Enter OTP (6-digit) → `Verify` button |
| Step 3 | New password + Confirm password → `Reset Password` button |
| Success | "Password reset successful" → Redirect to `/login` |

---

### PAGE 5 — Seeker Dashboard (`/dashboard/seeker`)

**Purpose:** Central hub for seekers to manage their journey.

| Section | Elements | Details |
|---------|----------|---------|
| **Welcome Banner** | Personalized greeting | "Welcome back, {Name}! Continue your career journey." |
| **Quick Actions** | Icon buttons | `Chat with AI` · `Find Consultants` · `Explore Domains` · `My Bookings` |
| **AI Recommendations** | Card list | "Based on your profile, we suggest exploring…" — domain/college cards |
| **Upcoming Consultations** | List/Table | Date, time, consultant name, domain, session type, `Join` / `Reschedule` / `Cancel` buttons |
| **Past Consultations** | Collapsible list | Consultant name, date, rating given, `Rebook` · `View Notes` |
| **Saved Consultants** | Horizontal scroll | Bookmarked consultant cards with `Book Now` |
| **Progress Tracker** | Visual stepper | Profile setup → Domain selected → AI consultation → Expert consultation → Application started |
| **Notifications** | Panel / badge | New messages, booking confirmations, consultant availability alerts |

**Sidebar Navigation (Seeker):**

| Menu Item | Route |
|-----------|-------|
| Dashboard | `/dashboard/seeker` |
| Explore Domains | `/domains` |
| Find Consultants | `/consultants` |
| My Bookings | `/bookings` |
| AI Career Guide | `/ai-guide` |
| Messages | `/messages` |
| Saved / Wishlist | `/saved` |
| Profile Settings | `/settings/profile` |
| Payment History | `/payments` |
| Help & Support | `/support` |

---

### PAGE 6 — Consultant Dashboard (`/dashboard/consultant`)

**Purpose:** Central hub for consultants to manage sessions, earnings, and profile.

| Section | Elements | Details |
|---------|----------|---------|
| **Welcome Banner** | Greeting + Stats | "Hello, {Name}! You have {X} upcoming sessions this week." |
| **Earnings Summary** | Card | Total earned, pending payout, commission deducted, `Request Payout` button |
| **Today's Schedule** | Timeline view | Upcoming sessions with seeker name, time, domain, `Start Session` button |
| **Upcoming Sessions** | Table | Date, time, seeker name, domain, session type, status |
| **Past Sessions** | Table | With rating received, feedback, `View Details` |
| **Availability Manager** | Calendar widget | Set/edit available days, time slots, block dates |
| **Profile Completeness** | Progress bar | "Complete your profile to appear higher in search results" |
| **Reviews & Ratings** | Summary | Average rating, total reviews, latest 3 reviews |
| **Notifications** | Panel | New booking requests, cancellations, payout updates |

**Sidebar Navigation (Consultant):**

| Menu Item | Route |
|-----------|-------|
| Dashboard | `/dashboard/consultant` |
| My Schedule | `/schedule` |
| Session History | `/sessions` |
| Earnings & Payouts | `/earnings` |
| My Profile | `/consultant/profile` |
| Reviews | `/reviews` |
| Messages | `/messages` |
| Availability Settings | `/availability` |
| Help & Support | `/support` |

---

### PAGE 7 — Explore Domains (`/domains`)

**Purpose:** Browse all career domains and sub-categories.

| Section | Elements | Details |
|---------|----------|---------|
| **Domain Grid** | Cards with icons | Education, Business, Sports, Medical, Engineering, Arts & Design, Law, Government Services, Research & Academia |
| **Each Card Shows** | | Icon, title, short description, number of consultants available, `Explore →` button |

#### Domain Detail Page (`/domains/{domain-slug}`)

| Section | Elements | Details |
|---------|----------|---------|
| **Domain Header** | Banner | Domain name, description, illustration |
| **Sub-Categories** | Tabs or accordion | E.g., under Education: "Indian Colleges", "Foreign Universities", "Entrance Exams", "Scholarships", "Study Abroad" |
| **Info Articles** | Card list | Curated articles/guides for that domain (e.g., "How to apply for IIT", "Top MBA colleges in USA") |
| **Top Consultants in Domain** | Carousel | Filtered consultants with rating, book button |
| **AI Guide Entry** | CTA card | "Not sure where to start? Chat with our AI Career Guide" → opens chatbot with domain context |
| **College/Institution Directory** | Searchable list | Name, location, ranking, courses offered, `View Details` — (for Education domain) |
| **Entrance Exams Section** | Table | Exam name, domain, eligibility, dates, prep resources link |

---

### PAGE 8 — Find Consultants (`/consultants`)

**Purpose:** Search, filter, and discover consultants.

| Section | Elements | Details |
|---------|----------|---------|
| **Search Bar** | Text input | Search by name, institution, specialization |
| **Filters Panel** (Left sidebar or top bar) | | See filter table below |
| **Results Grid** | Consultant cards | Photo, name, institution, domain, rating, rate/session, `View Profile` · `Book Now` |
| **Sort By** | Dropdown | Relevance, Rating (high–low), Price (low–high), Price (high–low), Most Booked |
| **Pagination** | Numbered + Next/Prev | 12 results per page |

**Filter Options:**

| Filter | Type | Values |
|--------|------|--------|
| Domain | Multi-select checkboxes | Education, Business, Sports, Medical, etc. |
| Consultant Type | Checkboxes | Current Student, Alumni, Industry Professional |
| Country | Dropdown / search | India, US, UK, Canada, Australia, etc. |
| Institution | Auto-suggest text | Type and select |
| Rating | Star slider | 1–5 stars |
| Price Range | Dual slider | ₹100–₹10,000 or $5–$500 |
| Session Duration | Checkboxes | 15 min, 30 min, 45 min, 60 min |
| Availability | Date picker | Select a date to see who's available |
| Language | Multi-select | English, Hindi, Tamil, Telugu, etc. |

---

### PAGE 9 — Consultant Profile (`/consultants/{consultant-id}`)

**Purpose:** Detailed view of a consultant's profile for seekers.

| Section | Elements | Details |
|---------|----------|---------|
| **Profile Header** | | Photo, name, verified badge, domain tags, institution, consultant type, country |
| **Stats Bar** | | ⭐ Rating (avg), Total sessions, Response time |
| **About** | Text block | Consultant's bio/introduction |
| **Expertise & Specializations** | Tag chips | E.g., "IIT Admissions", "SAT Prep", "MBA Essays" |
| **Education** | List | Degree, institution, year |
| **Session Options** | Cards | Duration options with pricing — e.g., "30 min — ₹500" · "60 min — ₹900" |
| **Availability Calendar** | Interactive calendar | Green = available, Red = booked — click a slot to proceed to booking |
| **Reviews & Ratings** | List | Reviewer name (anonymized), date, star rating, comment |
| **Rating Breakdown** | Bar chart | 5-star: 70%, 4-star: 20%, etc. |
| **Similar Consultants** | Carousel | Related consultants in same domain |
| **Action Buttons** | Sticky bottom bar / sidebar | `Book Consultation` (primary) · `Save to Wishlist` · `Send Message` |

---

### PAGE 10 — Booking Flow (`/book/{consultant-id}`)

**Purpose:** Multi-step booking process.

| Step | Screen | Elements |
|------|--------|----------|
| **Step 1 — Select Session** | Session type selection | Choose: 15 min / 30 min / 45 min / 60 min — shows price for each |
| **Step 2 — Select Date & Time** | Calendar + time slots | Available slots highlighted; select one |
| **Step 3 — Session Details** | Form | Topic/agenda (textarea, required) · Preferred language · Attach documents (optional) |
| **Step 4 — Review & Pay** | Summary card | Consultant name, session type, date/time, topic, price breakdown (session fee + platform fee) |
| | Payment options | UPI, Credit/Debit Card, Net Banking, Wallet (Razorpay/Stripe integration) |
| | Promo code | Input field + `Apply` button |
| | Total payable | Calculated amount |
| | `Confirm & Pay` | Primary CTA |
| **Step 5 — Confirmation** | Success screen | Booking ID, date/time, consultant name, `Add to Calendar` button, `Join Session` link (shown when time arrives) |

---

### PAGE 11 — Consultation Session Room (`/session/{session-id}`)

**Purpose:** Live consultation interface.

| Section | Elements | Details |
|---------|----------|---------|
| **Video/Audio Panel** | Main area | Video feed (both participants) — toggle camera on/off |
| **Controls Bar** | Bottom bar | 🎤 Mute/Unmute · 📷 Camera On/Off · 🖥 Screen Share · 📎 Share File · ⏱ Session Timer · 🔴 End Session |
| **Chat Panel** | Right sidebar (collapsible) | In-session text chat, share links, notes |
| **Session Info** | Top bar | Consultant/Seeker name, domain, topic, time remaining |
| **Post-Session Modal** | Popup on session end | Rate the session (1–5 stars) · Write a review (optional) · `Submit` → Redirect to dashboard |

---

### PAGE 12 — My Bookings (`/bookings`)

**Purpose:** View and manage all consultations.

| Tab | Content |
|-----|---------|
| **Upcoming** | List of future bookings — consultant name, date, time, domain, status, `Join` · `Reschedule` · `Cancel` |
| **Past** | Previous sessions — consultant, date, rating given, `Rebook` · `View Notes` · `Download Invoice` |
| **Cancelled** | Cancelled sessions — with refund status |

**Cancellation Policy Display:**
| Timeframe | Refund |
|-----------|--------|
| 24+ hours before session | Full refund |
| 12–24 hours before | 50% refund |
| < 12 hours | No refund |

---

### PAGE 13 — AI Career Guide (`/ai-guide`)

**Purpose:** Full-screen AI chatbot experience for career guidance.

| Section | Elements | Details |
|---------|----------|---------|
| **Chat Interface** | Full-page chat | Conversation thread with message bubbles |
| **Suggested Prompts** | Quick-action chips (top or after welcome) | "Which college is best for me?", "How to prepare for IIT JEE?", "Career options after 12th Science", "Study abroad in USA", "Sports career guidance", "Medical entrance exams" |
| **Input Bar** | Text input + send button | Type questions, press Enter or click Send |
| **Attachment** | Paperclip icon | Upload marksheet / resume for personalized advice |
| **Chat History** | Left sidebar | Previous conversations, `New Chat` button |
| **Recommendation Cards** | Inline in chat | AI returns structured cards: college suggestions, exam dates, consultant recommendations |
| **Book Consultant CTA** | Inline button in AI response | "Want expert advice? Book a session with {Consultant Name}" → navigates to booking |
| **Domain Selector** | Dropdown at top | Focus AI on: Education · Business · Sports · Medical · All |

---

### PAGE 14 — Messages (`/messages`)

**Purpose:** Asynchronous messaging between seekers and consultants.

| Section | Elements | Details |
|---------|----------|---------|
| **Conversation List** | Left panel | Contact name, last message preview, timestamp, unread count |
| **Chat Window** | Right panel | Message thread — text, images, file attachments |
| **Input Bar** | Bottom | Text input, emoji, file attach, send button |
| **Search** | Top of list | Search contacts |
| **Message Rules** | System | Seekers can message consultants only after booking or if consultant enables open messaging |

---

### PAGE 15 — Profile Settings (`/settings/profile`)

**Purpose:** Manage personal information and preferences.

#### Seeker Profile Settings

| Section | Fields |
|---------|--------|
| **Personal Info** | Full name, email (read-only), phone, profile photo |
| **Education Details** | Current education level, institution, year |
| **Career Interests** | Domain preferences (multi-select), preferred countries |
| **Password** | Change password (old + new + confirm) |
| **Notifications** | Email notifications (toggle), SMS notifications (toggle), push notifications (toggle) |
| **Language Preference** | Dropdown — English, Hindi, etc. |
| **Delete Account** | Link → Confirmation flow |

#### Consultant Profile Settings

| Section | Fields |
|---------|--------|
| **All Seeker fields** | + additional below |
| **Professional Info** | Institution, degree, year of passing, domain, sub-specializations |
| **Consultation Settings** | Session rates, duration options, session description template |
| **Availability** | Weekly schedule builder, block specific dates |
| **Payout Settings** | Bank account / UPI details for commission payouts |
| **Verification Status** | View verification status, re-upload documents if rejected |

---

### PAGE 16 — Payment History (`/payments`)

**Purpose:** Financial transaction records.

#### Seeker View

| Column | Details |
|--------|---------|
| Date | Transaction date |
| Booking ID | Linked to booking details |
| Consultant | Name |
| Amount | Amount paid |
| Payment Method | UPI / Card / Net Banking |
| Status | Completed / Refunded / Pending |
| Invoice | `Download PDF` |

#### Consultant View — Earnings (`/earnings`)

| Section | Details |
|---------|---------|
| **Earnings Dashboard** | Total earned (all time), this month, pending payout |
| **Commission Breakdown** | Gross amount, platform commission (%), net amount |
| **Transaction Table** | Date, seeker name, session type, gross, commission, net, payout status |
| **Payout History** | Payout date, amount, bank/UPI reference, status |
| **Request Payout** | Button → Payout processed within 3–5 business days |

---

### PAGE 17 — Admin Panel (`/admin`)

**Purpose:** Platform management for administrators.

| Section | Features |
|---------|----------|
| **Dashboard** | Total users (seekers + consultants), active sessions, revenue, sign-up trends (charts) |
| **User Management** | List all users, search/filter, view profiles, activate/deactivate/ban |
| **Consultant Verification** | Queue of pending applications, view documents, `Approve` / `Reject` with reason |
| **Booking Management** | All bookings, filter by status, handle disputes |
| **Revenue & Commission** | Total revenue, commission earned, payout history, adjust commission rates |
| **Content Management** | Manage domain pages, articles, guides, FAQs |
| **AI Chatbot Management** | Review chatbot logs, update knowledge base, add FAQs |
| **Reports & Analytics** | User growth, session trends, revenue charts, top domains, top consultants |
| **Support Tickets** | View and respond to user-raised tickets |
| **Settings** | Platform commission %, cancellation policy, email templates, notification settings |

---

### PAGE 18 — About Us (`/about`)

| Section | Content |
|---------|---------|
| **Mission** | Company mission statement |
| **Story** | How and why CareerPathway was founded |
| **Team** | Founder/team photos, names, designations |
| **Stats** | Key numbers (students helped, consultants, countries) |
| **Contact** | Email, phone, address, contact form |

---

### PAGE 19 — Help & Support (`/support`)

| Section | Elements |
|---------|----------|
| **FAQ** | Accordion — categorized (General, Booking, Payments, Consultant, Technical) |
| **Search** | Search within FAQs |
| **Raise a Ticket** | Form: subject, category, description, attachments, `Submit` |
| **My Tickets** | List of submitted tickets with status (Open, In Progress, Resolved) |
| **Live Chat** | Opens AI chatbot for instant help |
| **Contact Info** | Email, phone number |

---

### PAGE 20 — Static Pages

| Page | Route | Content |
|------|-------|---------|
| Terms & Conditions | `/terms` | Platform usage terms, liability, user obligations |
| Privacy Policy | `/privacy` | Data collection, storage, usage, third-party sharing, GDPR compliance |
| Refund & Cancellation Policy | `/refund-policy` | Cancellation timelines, refund process, exceptions |
| Consultant Commission Agreement | `/commission-terms` | Commission structure, payout timelines, dispute resolution |

---

## 7. AI Chatbot Specification

### 7.1 Chatbot Capabilities

| Capability | Description |
|------------|-------------|
| **Career Path Suggestion** | Based on user's education, interests, and goals, suggest career paths |
| **College Recommendation** | Recommend colleges (Indian & foreign) based on marks, budget, preferences |
| **Entrance Exam Guidance** | Provide exam-specific info: eligibility, syllabus overview, important dates, prep tips |
| **Application Process** | Step-by-step guidance on how to apply for specific colleges/programs |
| **Scholarship Info** | List relevant scholarships based on profile |
| **Domain Exploration** | Explain career options in business, sports, medical, arts, law, etc. |
| **Consultant Matching** | Recommend relevant consultants based on conversation context |
| **FAQ Handling** | Answer common platform-related questions |
| **Document Analysis** | Analyze uploaded marksheets/resumes to give personalized advice |

### 7.2 Chatbot Presence

| Location | Behavior |
|----------|----------|
| **Floating widget** (all pages) | Compact chat bubble, opens side panel |
| **Dedicated page** (`/ai-guide`) | Full-screen immersive experience |
| **Domain pages** | Context-aware — pre-loaded with domain context |
| **Post-search** | If no suitable consultant found, prompt AI chat |

### 7.3 Chatbot Conversation Flow Example

```
Bot: Welcome! I'm your AI Career Guide. What would you like help with?
     [Education] [Business] [Sports] [Medical] [Other]

User: Education

Bot: Great! Are you looking for:
     [Indian Colleges] [Foreign Universities] [Entrance Exams] [Scholarships]

User: Foreign Universities

Bot: Which country interests you?
     [USA] [UK] [Canada] [Australia] [Germany] [Other]

User: USA

Bot: What level of study?
     [Undergraduate] [Postgraduate/Masters] [PhD]

User: Undergraduate

Bot: What's your current education?
User: I'm in 12th Science with 85% marks.

Bot: Based on your profile, here are top recommendations:
     📋 Suggested Universities (cards with ranking, fees, deadline)
     📝 Required Exams: SAT, TOEFL/IELTS
     💡 Tip: Applications for Fall 2027 open in August 2026.

     Want more detailed guidance?
     [Chat with an Expert Consultant →] [Continue with AI]
```

---

## 8. Non-Functional Requirements

| Category | Requirement |
|----------|-------------|
| **Performance** | Page load < 3 seconds; API response < 500 ms |
| **Scalability** | Support 50,000+ concurrent users; horizontal scaling |
| **Availability** | 99.9% uptime SLA |
| **Security** | HTTPS everywhere, JWT/OAuth2 authentication, data encryption at rest & in transit, OWASP Top 10 compliance, RBAC |
| **Data Privacy** | GDPR & India DPDP Act compliant; user consent management; right to deletion |
| **Accessibility** | WCAG 2.1 AA compliance |
| **Responsiveness** | Fully responsive — Desktop, Tablet, Mobile |
| **Localization** | Multi-language support (English, Hindi — more later) |
| **SEO** | Server-side rendering for public pages; meta tags; structured data |
| **Video/Audio** | WebRTC-based; fallback to third-party (Twilio/Agora) |
| **Payments** | PCI-DSS compliant payment gateway integration (Razorpay for India, Stripe for international) |
| **Backup** | Daily automated backups, 30-day retention |

---

## 9. Tech Stack Recommendation

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js (React) / Nuxt.js (Vue) |
| **Styling** | Tailwind CSS + Component library (Shadcn/Ant Design) |
| **Backend API** | Node.js (Express/Fastify) or Python (Django/FastAPI) |
| **Database** | PostgreSQL (primary) + Redis (caching, sessions) |
| **AI Chatbot** | OpenAI GPT / Google Gemini API with custom fine-tuning, LangChain for orchestration |
| **Real-time Chat** | Socket.IO / WebSocket |
| **Video Calling** | WebRTC + Twilio / Agora / Daily.co |
| **File Storage** | AWS S3 / Cloudflare R2 |
| **Payment Gateway** | Razorpay (India) + Stripe (International) |
| **Authentication** | NextAuth / Firebase Auth / custom JWT + OAuth2 |
| **Hosting** | AWS / GCP / Vercel (frontend) |
| **CI/CD** | GitHub Actions |
| **Monitoring** | Sentry (errors), Grafana + Prometheus (metrics) |
| **Email/SMS** | SendGrid (email), Twilio (SMS/OTP) |
| **Search** | Elasticsearch / Algolia (consultant search) |

---

## 10. Appendix — Navigation Sitemap

```
/
├── /signup                         → Registration (Seeker / Consultant)
├── /login                          → Login
├── /forgot-password                → Password Reset
│
├── /domains                        → Explore All Domains
│   └── /domains/{domain-slug}      → Domain Detail (sub-categories, articles, consultants)
│
├── /consultants                    → Find Consultants (search + filter)
│   └── /consultants/{id}           → Consultant Profile
│
├── /book/{consultant-id}           → Booking Flow (5 steps)
│
├── /session/{session-id}           → Live Session Room (video/chat)
│
├── /ai-guide                       → AI Career Guide (full-page chatbot)
│
├── /dashboard
│   ├── /dashboard/seeker           → Seeker Dashboard
│   └── /dashboard/consultant       → Consultant Dashboard
│
├── /bookings                       → My Bookings (Upcoming / Past / Cancelled)
├── /messages                       → Messages
├── /payments                       → Payment History (Seeker)
├── /earnings                       → Earnings & Payouts (Consultant)
├── /schedule                       → My Schedule (Consultant)
├── /sessions                       → Session History (Consultant)
├── /reviews                        → My Reviews (Consultant)
├── /availability                   → Availability Settings (Consultant)
├── /saved                          → Saved Consultants (Seeker)
│
├── /settings
│   └── /settings/profile           → Profile Settings
│
├── /support                        → Help & Support + FAQ + Tickets
├── /about                          → About Us
├── /terms                          → Terms & Conditions
├── /privacy                        → Privacy Policy
├── /refund-policy                  → Refund & Cancellation Policy
├── /commission-terms               → Consultant Commission Agreement
│
└── /admin                          → Admin Panel
    ├── /admin/users                → User Management
    ├── /admin/verification         → Consultant Verification Queue
    ├── /admin/bookings             → Booking Management
    ├── /admin/revenue              → Revenue & Commission
    ├── /admin/content              → Content Management
    ├── /admin/chatbot              → AI Chatbot Management
    ├── /admin/reports              → Reports & Analytics
    ├── /admin/tickets              → Support Tickets
    └── /admin/settings             → Platform Settings
```

---

**End of Document**

*Version 1.0 — 8 April 2026*
