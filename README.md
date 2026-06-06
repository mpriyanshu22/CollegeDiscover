# College Discovery Platform

A full-stack application built with the MERN/Next.js stack to help students discover and compare colleges.

## Project Structure

This project uses a monorepo-style structure containing both the frontend and backend applications:

- `backend/`: The Express + Prisma REST API
- `college-app/`: The Next.js React frontend

## Tech Stack

### Frontend
- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Data Fetching:** Axios

### Backend
- **Framework:** Express.js
- **Database ORM:** Prisma
- **Database:** PostgreSQL
- **Language:** TypeScript
- **Authentication:** JWT, bcryptjs

## Getting Started

### Prerequisites
- Node.js installed
- PostgreSQL database setup

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Setup `.env` file with your `DATABASE_URL`
4. Run migrations: `npx prisma migrate dev`
5. Seed database (optional): `npm run prisma db seed`
6. Start dev server: `npm run dev`

### Frontend Setup
1. Navigate to the frontend directory: `cd college-app`
2. Install dependencies: `npm install`
3. Setup `.env.local` if needed
4. Start dev server: `npm run dev`

## Features
- College search and filtering
- Detailed college information pages
- Side-by-side college comparison
- Tier-based college predictions
