#  EduNext - Next-Generation Learning Management System

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)


EduNext is a highly scalable, full-stack Learning Management System (LMS) built with Next.js 16 (App Router) and TypeScript. Designed with a modern SaaS aesthetic, it provides a seamless educational experience from course discovery to automated certification. 

 Live Demo: [EduNext on Vercel](https://edu-next-nu.vercel.app/)

##  Key Features

-  Custom AI Assistant: An intelligent, context-aware chatbot trained on the platform's specific course data to guide users, answer curriculum queries, and recommend courses in real-time.
-  Smart Course Player & Progress Tracking: Advanced video modules that track user progress accurately, ensuring prerequisites are met before advancing.
-  Automated Assessment & Certification: A built-in exam engine that unlocks upon course completion. Successful evaluations automatically generate and issue digital certificates.
-  Advanced Next.js Rendering: Strategic utilization of SSR, SSG, and ISR for lightning-fast page loads and maximum SEO performance.
-  Enterprise-Grade Security & Auth: Robust authentication flow using NextAuth, with strictly protected routes for Users and Administrators.

##  Tech Stack & Architecture

- Core & Architecture: Next.js 16.1 (App Router), TypeScript
- UI & Styling: Tailwind CSS v4, Shadcn UI, Framer Motion
- State Management & Data Fetching: TanStack React Query v5, Axios
- Forms & Validation: Formik, Zod, Yup

##  Application Flow & Routing

- / - SEO-optimized Landing Page
- /courses & /courses/[id] - Course catalog with dynamic metadata
- /teachers & /teachers/[id] - Instructor profiles
- /login & /register - Secure authentication flows
- /user-panel - Personal dashboard and progress metrics
- /admin-panel - Platform management and analytics
- /payment - Secure transaction handling
- /certificate - Dynamic certificate generation logic

##  Getting Started Locally

To run this project on your local machine:

1. Clone the repository:
   
   ```bash
   git clone https://github.com/AbolfazlMnf/EduNext.git
   cd EduNext
   ```
   
2. Install dependencies:

   ```bash
   npm install
   ```
   
3. Create a `.env.local` file in the root directory and add:

   ```env
   NEXT_PUBLIC_API_BASE_URL=https://edunext-api-docker.onrender.com/api
   ```
   
4. Run the development server:

   ```bash
   npm run dev
   ```
   
5. Open your browser and visit:

   ```text
   http://localhost:3000
   ```
   
