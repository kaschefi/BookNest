# 📚 BookNest - Academic Study & Resource Platform

**BookNest** is a full-stack, paper-styled academic resource sharing platform built with Next.js, React 19, TypeScript, Tailwind CSS, MongoDB, and Cloudinary. It allows students to browse subject topics, share lecture notes and study sheets, vote on resources, search textbooks, and manage academic fields via an administrative control panel.

---

## 🎨 Design Philosophy & Architecture

### Paper-Style Aesthetic
BookNest features a tactile, paper-notebook design language:
- Hand-drawn doodle elements and notebook margins
- Rough sketch card backgrounds rendered dynamically
- Custom typography (`font-hand` & sans-serif hierarchy)
- Smooth micro-interactions and interactive notebook binder spirals

### Separation of Concerns
All UI components (`.tsx`) are strictly presentation-focused. Business logic, side-effects, state management, and external API calls reside inside decoupled custom hooks (`hooks/` directory):
- `useAuthForm`, `useAuthStatus`, `useAnimatedPen`
- `useSubjectLessons`, `useNotesPage`, `useBooksPage`
- `useAdminResources`, `useAdminUsers`, `useAdminFields`, `useAdminLessons`

---

## 🚀 Features

- **Public Catalog**: Explore subjects (Mathematics, Computer Science, etc.), lessons, and study notes.
- **Resource Hub**: Upload, view, upvote/downvote, and download PDFs, slides, and study pamphlets.
- **Books Catalog (`/books`)**: Filter and search textbooks and recommended reference manuals.
- **Authentication**: JWT local auth and NextAuth OAuth (Google, GitHub) support with role management (`user`, `admin`).
- **Admin Moderation Panel (`/admin`)**:
  - Dashboard analytics overview
  - Resource review (approve, reject, delete uploaded study notes)
  - User management (ban, unblock, promote/demote users)
  - Program & lesson configuration (fields of study and course outlines)

---

## 🛠 Setup & Installation

### 1. Prerequisites
- Node.js (v18.x or higher)
- npm (v9.x or higher)
- MongoDB instance (local or MongoDB Atlas)

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/booknest

# Authentication Secrets
JWT_SECRET=your_super_secret_jwt_key_here
NEXTAUTH_SECRET=your_nextauth_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# Cloudinary Storage (For notes/file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# OAuth Credentials (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
```

---

## 🗄 Database Seeding

BookNest contains automatic seeding logic (`lib/seed.ts`). When connecting to MongoDB for the first time, if default fields or admin accounts do not exist, BookNest seeds standard academic programs (Mathematics, Computer Science) and default lessons automatically.

---

## 💻 Running the Application

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Type-Checking & Linting
```bash
npx tsc --noEmit
npm run lint
```

### Running Automated Tests
```bash
npm run test
```

### Production Build
```bash
npm run build
npm run start
```

---

## 🧪 Testing

Automated tests are written with **Jest** and **React Testing Library**:
- `__tests__/services/UserService.test.ts`: Service-layer logic tests
- `__tests__/hooks/useBooksPage.test.ts`: Custom hook state & filtering tests

Run tests continuously during development:
```bash
npm run test -- --watch
```

---

## 🌐 Deployment Guide

1. Ensure all environment variables are added to your hosting provider (Vercel, Railway, or AWS).
2. Configure Cloudinary credentials for persistent media/document storage.
3. Deploy directly with Vercel:
```bash
npx vercel
```
