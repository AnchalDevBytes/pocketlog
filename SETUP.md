# PocketLog Setup Guide

## Environment Variables Setup

### 1. Database (✅ Already Configured)

The DATABASE_URL has been provided and configured for your Neon PostgreSQL database.

### 2. NextAuth Secret

Generate a secure secret for NextAuth:
\`\`\`bash
openssl rand -base64 32
\`\`\`
Add this to your `.env.local` as `NEXTAUTH_SECRET`

### 3. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Copy Client ID and Client Secret to your `.env.local`

### 4. Gemini AI (Optional)

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Add it to your `.env.local` as `GEMINI_API_KEY`

## Database Setup

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Generate Prisma client:
   \`\`\`bash
   npm run db:generate
   \`\`\`

3. Push database schema:
   \`\`\`bash
   npm run db:push
   \`\`\`

4. (Optional) Open Prisma Studio to view your database:
   \`\`\`bash
   npm run db:studio
   \`\`\`

## Running the Application

1. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Production Deployment

1. Set `NEXTAUTH_URL` to your production domain
2. Update Google OAuth redirect URIs for production
3. Ensure all environment variables are set in your hosting platform
4. Run database migrations in production:
   \`\`\`bash
   npm run db:push
   \`\`\`

## Troubleshooting

### Common Issues:

1. **Database Connection Error**

   - Verify DATABASE_URL is correct
   - Check if Neon database is accessible
   - Ensure SSL mode is enabled

2. **Google OAuth Error**

   - Verify redirect URIs match exactly
   - Check if Google+ API is enabled
   - Ensure client ID and secret are correct

3. **NextAuth Session Error**
   - Generate a new NEXTAUTH_SECRET
   - Clear browser cookies and try again
   - Check if NEXTAUTH_URL matches your domain

## Features Overview

- 🔐 **Authentication**: Google OAuth integration
- 📊 **Dashboard**: Overview with charts and analytics
- 💰 **Transactions**: Add, edit, filter, and categorize expenses
- 🏦 **Accounts**: Manage multiple bank accounts
- 📈 **Budgets**: Set and track spending goals
- 📤 **Import/Export**: CSV and Excel data management
- 👤 **Profile**: User settings and preferences
- 🎨 **Modern UI**: Responsive design with dark mode support

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL (Neon)
- **Authentication**: NextAuth.js with Google OAuth
- **State Management**: Redux Toolkit
- **Charts**: Recharts
- **Animations**: Framer Motion
- **UI Components**: shadcn/ui
  \`\`\`

Now let me create an API endpoint for the Gemini AI integration that was mentioned in the original requirements:
