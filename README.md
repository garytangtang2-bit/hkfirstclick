# HKfirstclick AI SaaS (Next.js Application)

Welcome to the HKfirstclick AI travel planning SaaS repository. This project has been successfully migrated from a monolithic React prototype into a secure, production-ready **Next.js (App Router)** framework.

## Key Architecture & Features
- **Next.js App Router**: Optimized, server-side rendered application.
- **Source Code Obfuscation**: The transition to Next.js ensures that none of the core logic, API keys, or proprietary workflows are exposed to the user's browser.
- **Supabase Authentication**: Integrated with `@supabase/ssr` for secure session cookies and database operations via hidden Service Role keys.
- **Stripe Subscriptions**: Fully functioning Checkout and Webhook implementation tracking `tier` and `credits` directly on the server.
- **OpenAI & Live Travel Data Engine**: The backend route (`/api/generate-trip`) is structured to orchestrate live data fetching (flights/hotels) alongside LLM planning, returning strict, budget-verified JSON.

## Local Setup

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Environment Variables**
   Duplicate `.env.example` to `.env.local` and populate the necessary keys securely:
   - Supabase keys (URL, ANON, and SERVICE_ROLE for the webhook)
   - Stripe keys (Secret, Publishable, and Webhook Secret)
   - OpenAI API Key

3. **Start Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

## Deployment & CI/CD
This project includes a `.github/workflows/deploy.yml` workflow to validate your code via GitHub Actions on every push. 
As a Next.js App Router application utilizing API endpoints, it requires a Node.js runtime. 

The easiest and recommended way to go live is to link this GitHub Repository to **Vercel**:
1. Sign up on [Vercel](https://vercel.com/)
2. Click **Add New Project** and import this repository
3. Inject your configured `.env.local` variables into Vercel's Environment Variables panel
4. Click Deploy. Vercel will automatically host it securely and provide you with a live HTTPS URL.
