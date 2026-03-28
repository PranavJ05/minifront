# Alumni Relations Website — Frontend

A production-quality alumni platform frontend built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**, designed to connect with Spring Boot REST APIs and MySQL.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## 📁 Project Structure

```
alumni-website/
│
├── app/                          # Next.js 14 App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page (/)
│   ├── not-found.tsx             # 404 page
│   │
│   ├── auth/
│   │   ├── login/page.tsx        # Login page with role selection
│   │   └── signup/page.tsx       # 2-step signup form
│   │
│   ├── alumni/
│   │   ├── page.tsx              # Alumni directory with filters
│   │   └── [id]/page.tsx        # Individual alumni profile
│   │
│   ├── events/page.tsx           # Events & reunions listing
│   ├── news/page.tsx             # News & announcements
│   │
│   └── dashboard/
│       ├── alumni/page.tsx       # Alumni dashboard
│       ├── student/page.tsx      # Student dashboard
│       └── admin/page.tsx        # Admin dashboard
│
├── components/
│   ├── auth/
│   │   └── AuthInput.tsx         # Reusable auth input with icon
│   │
│   ├── alumni/
│   │   ├── AlumniCard.tsx        # Grid + list view card
│   │   └── AlumniFilters.tsx     # Search + filter panel
│   │
│   ├── layout/
│   │   ├── Navbar.tsx            # Responsive top navbar
│   │   ├── Footer.tsx            # Site footer
│   │   └── DashboardSidebar.tsx  # Role-based sidebar
│   │
│   └── ui/                       # (extend with shadcn, etc.)
│
├── lib/
│   ├── mockData.ts               # All mock data (replace with API calls)
│   └── utils.ts                  # Helper functions
│
├── types/
│   └── index.ts                  # TypeScript types & interfaces
│
├── public/images/                # Static assets
│
├── tailwind.config.ts            # Custom navy + gold theme
├── tsconfig.json
├── next.config.js
└── package.json
```

---

## 🎨 Design System

**Color Palette:**
- Primary: `navy-950` (#0d1f2d) — Deep navy blue
- Accent: `gold-500` (#d4a017) — University gold
- Background: `gray-50`
- Text: `navy-900`

**Typography:**
- Headings: Georgia serif
- Body: System sans-serif

**Reusable CSS Classes:**
```css
.btn-primary   /* Navy filled button */
.btn-gold      /* Gold filled button */
.btn-outline   /* Navy outlined button */
.card          /* White card with shadow */
.input-field   /* Styled form input */
.section-title /* Section headings */
.badge         /* Small label tag */
```

---

## 🔐 Authentication

### Role-Based Access

| Role    | Dashboard Path       | Access Level          |
|---------|---------------------|-----------------------|
| Admin   | /dashboard/admin    | Full platform control |
| Alumni  | /dashboard/alumni   | Network + jobs        |
| Student | /dashboard/student  | Browse + mentors      |

### Login Flow
1. User selects role (Alumni / Student / Admin)
2. Enters email + password
3. Redirected to role-specific dashboard
4. Mock auth stores user in localStorage

### To integrate Spring Boot JWT:
```typescript
// lib/api.ts (create this file)
const API_BASE = 'http://localhost:8080/api';

export async function login(email: string, password: string, role: string) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role }),
  });
  const data = await res.json();
  // Store JWT: localStorage.setItem('token', data.token)
  return data;
}
```

---

## 📄 Pages Overview

### Landing Page (`/`)
- Hero section with stats
- Core pillars (Directory, Jobs, Mentorship)
- Featured alumni cards
- Upcoming events
- News & announcements
- Testimonial
- CTA section

### Alumni Directory (`/alumni`)
- Search bar (name, company, major)
- Filters: batch, department, company, location
- Grid / list view toggle
- Alumni cards with connect/message actions

### Alumni Profile (`/alumni/[id]`)
- Profile header with photo
- Work experience timeline
- Education history
- Skills badges
- Contact & social links

### Events (`/events`)
- Featured event hero
- Monthly grouped listing
- Register functionality

### Dashboards
- **Alumni**: Feed, events, job suggestions, activity
- **Student**: Mentor search, job board, events
- **Admin**: Stats, pending approvals, user management

---

## 🔌 Spring Boot API Integration

Replace mock data in `lib/mockData.ts` with API calls:

```typescript
// Example: Replace mockAlumni
const [alumni, setAlumni] = useState([]);

useEffect(() => {
  fetch('http://localhost:8080/api/alumni', {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(r => r.json())
    .then(setAlumni);
}, []);
```

**Expected Spring Boot Endpoints:**
```
POST /api/auth/login
POST /api/auth/register
GET  /api/alumni
GET  /api/alumni/{id}
GET  /api/events
GET  /api/news
GET  /api/jobs
GET  /api/dashboard/stats
```

---

## 🛠 Tech Stack

- **Next.js 14** (App Router)
- **TypeScript** — Full type safety
- **Tailwind CSS** — Utility-first styling
- **Lucide React** — Icons
- **Next/Image** — Optimized images

---

## 📱 Responsive Design

- Mobile: Single column, bottom navigation pattern in dashboards
- Tablet: 2-column grids
- Desktop: 3-4 column grids, full sidebar navigation

---

## 🧪 Demo Credentials

Visit `/auth/login` and:
1. Enter any email/password
2. Select a role
3. Click Sign In → redirected to that role's dashboard
