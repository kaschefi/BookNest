# BookNest - Academic Study & Resource Sharing Platform

## Executive Overview

BookNest is an enterprise-ready, full-stack academic resource management and study platform designed for university students, educators, and course administrators. Built on Next.js 16 (App Router and API endpoints), React 19, TypeScript, Tailwind CSS v4, MongoDB (Mongoose ODM), and Cloudinary, BookNest facilitates real-time academic collaboration through document sharing, upvoting/downvoting mechanisms, text search, course material categorization, and administrative moderation.

The frontend incorporates a customized "paper-notebook" aesthetic powered by dynamic canvas rendering (RoughJS), custom micro-animations, and hand-drawn layout components, balancing visual appeal with strict separation of concerns.

---

## Technical Stack & Architecture

### Core Stack
- **Frontend Framework**: Next.js 16 (App Router for page layouts and Pages API Routes for RESTful endpoints)
- **UI & Component Layer**: React 19, TypeScript 5, Tailwind CSS v4
- **Visual & Design System**: RoughJS dynamic canvas elements, Lucide React iconography, custom paper notebook CSS theme
- **Database & Object Data Modeling**: MongoDB with Mongoose 9 ODM
- **Authentication & Security**: Dual-layer authentication via custom JWT (`jsonwebtoken`, `bcryptjs`) and NextAuth v4 (Google and GitHub OAuth 2.0)
- **Media & Document Pipeline**: Cloudinary SDK for cloud asset storage and document distribution
- **Testing Infrastructure**: Jest 30, React Testing Library 16, `@testing-library/jest-dom`

### Architectural Pattern: Decoupled Layered Architecture

BookNest enforces a strict separation of concerns across four distinct tiers:

1. **Presentation Layer (`app/`, `components/`)**: React components focused exclusively on layout, rendering, accessibility, and visual presentation. Components do not contain direct side-effects, database access, or fetch logic.
2. **Custom Hook / Controller Layer (`hooks/`)**: State management, asynchronous API orchestration, side-effect handling, and form states encapsulated in reusable custom hooks (e.g., `useSubjectLessons`, `useUploadForm`, `useAdminResources`, `useAdminFields`, `useAdminLessons`).
3. **Service Layer (`services/`)**: Centralized HTTP client abstraction and API service integration (`ResourceService`, `UserService`, `AdminService`, `FieldService`, `LessonService`, `VoteService`, `UploadService`).
4. **Data & Security Layer (`models/`, `lib/`)**: Mongoose schemas (`User`, `Resource`, `Field`, `Lesson`, `Vote`), database connection management (`lib/mongoose.ts`), and unified authentication wrappers (`lib/apiAuth.ts`).

---

## Key Features & Capabilities

### Public & Student Portal
- **Academic Hierarchy**: Navigation organized by Academic Fields (e.g., Computer Science, Mathematics, Physics), Course Outlines, and Subject Lessons.
- **Resource Repository**: Searchable index of academic materials classified into Midterms, Final Exams, and Study Pamphlets.
- **Interactive Voting System**: Upvote and downvote mechanics with denormalized score caching for fast retrieval.
- **Document Preview & Downloads**: Cloud-backed PDF and media delivery with automated download and view analytics tracking.
- **User Authentication & Profiles**: Registration, JWT local authentication, OAuth single sign-on (Google and GitHub), and user profile management.

### Administrative Moderation & Control Panel (`/admin`)
- **Executive Analytics Dashboard**: Overview metrics including total resources, pending review queues, total user base, and system activity logs.
- **Resource Moderation Queue**: Workflow tools to review, approve, reject, or permanently purge user-submitted documents.
- **User Management**: Role management (`user`, `admin`), profile moderation, and active/blocked account toggling.
- **Curriculum Management**: Dynamic CRUD management for Fields of Study and Lesson definitions.

---

## Project Directory Structure

```
my-app/
├── app/                        # Next.js App Router (Pages, Layouts & Contexts)
│   ├── admin/                  # Administrative Dashboard & Sub-pages
│   ├── login/                  # Authentication Login Route
│   ├── notes/                  # Notes Directory Page
│   ├── profile/                # User Profile Page
│   ├── resources/              # Academic Resource Hub
│   ├── signup/                 # User Registration Route
│   ├── subjects/               # Course & Subject Catalog
│   ├── globals.css             # Global Tailwind CSS Styles
│   └── layout.tsx              # Root Application Layout
├── components/                 # Presentation-only React Components
│   ├── admin/                  # Admin UI Tables, Modals & Metric Cards
│   ├── home/                   # Landing Page Hero & Feature Sections
│   ├── layout/                 # Header, Footer, and Navigation Components
│   ├── AuthBackgroundDoodles.tsx
│   ├── AuthPageContent.tsx
│   └── RoughCardBackground.tsx # RoughJS Dynamic Canvas Renderer
├── hooks/                      # Custom React Hooks (Business Logic & State)
├── lib/                        # Infrastructure & Utility Modules
│   ├── apiAuth.ts              # Unified Session & JWT Authentication Helper
│   ├── cloudinary.ts           # Cloudinary SDK Configuration
│   ├── mongoose.ts             # MongoDB Client Connection Manager
│   └── seed.ts                 # Database Seeding Script
├── models/                     # Mongoose Data Schemas & Models
│   ├── Field.ts                # Academic Field Schema
│   ├── Lesson.ts               # Course/Lesson Schema
│   ├── Resource.ts             # Resource & Moderation Schema
│   ├── User.ts                 # User Account & Role Schema
│   └── Vote.ts                 # User Vote Interaction Schema
├── pages/api/                  # RESTful API Service Endpoints
│   ├── admin/                  # Administrative Operations API
│   ├── auth/                   # Local & OAuth Authentication API
│   └── files/                  # Document Upload, Vote, & Download API
├── services/                   # Frontend API Client Abstraction Layer
├── __tests__/                  # Unit & Integration Test Suites
├── package.json                # Dependencies, Scripts, and Metadata
├── tsconfig.json               # TypeScript Configuration
└── next.config.ts              # Next.js Configuration
```

---

## Environment Configuration

Create a `.env.local` file in the `my-app` directory using `.env.example` as a reference:

```ini
# Database Connection
MONGODB_URI=mongodb://localhost:27017/booknest

# Authentication & Security Secrets
JWT_SECRET=your_jwt_secret_key
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=http://localhost:3000

# Cloudinary Cloud Storage Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# OAuth Provider Credentials (Optional)
GOOGLE_ID=your_google_client_id
GOOGLE_SECRET=your_google_client_secret
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
```

---

## Database Seeding & Data Model

Upon initial connection to MongoDB, the application automatically invokes `lib/seed.ts`. If no fields exist in the database, the system seeds standard academic disciplines (such as Computer Science, Mathematics, and Physics) alongside default lesson modules to ensure out-of-the-box usability.

### Core Data Models

- **User**: Stores credentials, hashed passwords, roles (`user`, `admin`), OAuth provider references, and active status flags.
- **Field**: Defines academic disciplines (e.g., Computer Science).
- **Lesson**: Maps course subjects to specific Fields.
- **Resource**: Captures uploaded document metadata, Cloudinary `publicId`, MIME type, review state (`pending`, `approved`, `rejected`), semester/year tag, view count, download count, and cached `voteScore`.
- **Vote**: Tracks individual user votes (+1 / -1) on resources to prevent duplicate voting.

---

## Installation & Local Development

### 1. Prerequisites
- Node.js version 18.x or 20.x
- npm version 9.x or higher
- Running MongoDB database instance (Local or MongoDB Atlas)

### 2. Dependency Installation
```bash
npm install
```

### 3. Execution Commands

#### Development Server
Start the development server on `http://localhost:3000`:
```bash
npm run dev
```

#### Static Type Checking & Linting
Validate TypeScript types and code linting standard compliance:
```bash
npx tsc --noEmit
npm run lint
```

#### Automated Testing
Execute unit tests using Jest:
```bash
npm run test
```

#### Production Build & Start
Compile optimized production assets and initiate the production web server:
```bash
npm run build
npm run start
```

---

## API Architecture & Endpoints

| Endpoint Category | Route Pattern | HTTP Methods | Access Level | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication** | `/api/auth/signup` | POST | Public | Registers a new local user account |
| **Authentication** | `/api/auth/login` | POST | Public | Authenticates credentials and returns JWT token |
| **Authentication** | `/api/auth/[...nextauth]` | GET, POST | Public | NextAuth handler for OAuth authentication |
| **Resources** | `/api/files` | GET, POST | Public / Auth | Lists approved resources or uploads a new document |
| **Resources** | `/api/files/[id]` | GET | Public | Fetches resource details and increments view count |
| **Resources** | `/api/files/[id]/download` | GET | Public | Increments file download metric |
| **Resources** | `/api/files/[id]/vote` | POST | Authenticated | Upvotes or downvotes a resource |
| **Admin Operations** | `/api/admin/stats` | GET | Admin | Retrieves system metrics and overview stats |
| **Admin Operations** | `/api/admin/resources` | GET | Admin | Lists all resources including pending and rejected items |
| **Admin Operations** | `/api/admin/resources/[id]` | PATCH, DELETE | Admin | Updates resource moderation status or deletes resource |
| **Admin Operations** | `/api/admin/users` | GET, POST | Admin | Lists users or provisions new accounts |
| **Admin Operations** | `/api/admin/users/[id]` | PATCH, DELETE | Admin | Updates user roles, bans/unblocks, or removes accounts |
| **Admin Operations** | `/api/admin/fields` | GET, POST | Admin | Manages academic fields of study |
| **Admin Operations** | `/api/admin/lessons` | GET, POST | Admin | Manages lesson definitions |

---

## Security & Authentication Standards

BookNest employs a dual-authentication strategy implemented via `lib/apiAuth.ts`:

1. **Local Bearer Tokens**: Standard JWTs passed in the `Authorization: Bearer <token>` HTTP header, verified using `JWT_SECRET`.
2. **Session Security**: Server-side NextAuth session evaluation via `getServerSession`, enabling seamless OAuth integration.
3. **RBAC Guarding**: The `requireAdmin` helper validates administrative privilege, returning HTTP 401 Unauthorized for unauthenticated requests and HTTP 403 Forbidden for non-administrative roles.

---

## Quality Assurance & Testing

Automated test suites are located in `my-app/__tests__`:
- **Service Integration Unit Tests**: `__tests__/services/UserService.test.ts`
- **Hook State Unit Tests**: `__tests__/hooks/`

Run Jest with coverage evaluation:
```bash
npm run test -- --coverage
```

---

## Deployment Guidance

1. **Environment Setup**: Populate environment variables on host platforms (such as Vercel, AWS Amplify, or Railway).
2. **Cloud Storage**: Verify Cloudinary API credentials to ensure uninterrupted document upload processing.
3. **Database Connection**: Ensure the target MongoDB cluster permits incoming network connections from the hosting environment IP range.
4. **Vercel Deployment**:
```bash
npx vercel --prod
```
