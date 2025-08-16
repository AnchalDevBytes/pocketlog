# PocketLog - A Modern Personal Finance Application

**PocketLog** is a full-stack web application designed to provide a modern, intuitive, and powerful way to manage your personal finances. Built with the latest web technologies, it helps users track expenses, create and manage budgets, and gain clear insights into their spending habits.

## Table of Contents

- [Introduction](#introduction)
- [Core Features](#core-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Installation](#local-installation)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)

## Introduction

PocketLog addresses the common challenge of personal finance management by offering a clean, user-friendly interface without sacrificing powerful features. Users can authenticate securely, manage multiple bank accounts, categorize every transaction, and set intelligent budgets that track spending in real-time. The application is fully responsive and provides a seamless experience on both desktop and mobile devices.

## Core Features

- **Interactive Dashboard:** A central hub to visualize your income vs. expense, latest transactions, account balances, and budget progress.
- **Transaction Management:** Full CRUD (Create, Read, Update, Delete) functionality for all your income and expense transactions.
- **Account Management:** Add and manage multiple types of accounts (Checking, Savings, Credit Card) with real-time balance updates.
- **Intelligent Budgeting:** Create periodic budgets (monthly, weekly) and link them to one or more expense categories. The system automatically tracks spending against your targets.
- **Custom Categories:** Full CRUD for creating personalized categories for both income and expenses, complete with custom icons and colors.
- **User Profile Management:** Users can update their personal information, which is securely stored and managed.
- **Secure Authentication:** Built with NextAuth.js, providing secure authentication using OAuth providers (e.g., Google).
- **Data Import & Export:** Easily import transactions from a CSV file or export all your financial data to CSV or Excel (XLSX) for backup or analysis.
- **Sample Data Seeding:** A built-in tool for new users to generate a full set of sample data to explore the application's features without entering their own.
- **Fully Responsive:** A mobile-first design that works beautifully on all screen sizes, featuring a collapsible sidebar for navigation.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (Compatible with services like Neon, Supabase, or local instances)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **Data Visualization:** [Recharts](https://recharts.org/)
- **Data Handling:** [PapaParse](https://www.paparse.com/) (for CSV), [ExcelJS](https://github.com/exceljs/exceljs) (for XLSX)
- **Deployment:** [Vercel](https://vercel.com/)

## Getting Started

Follow these instructions to set up the project on your local machine for development and testing purposes.

### Prerequisites

- Node.js (v18 or later)

### Local Installation

1.  **Clone the repository:**

    ```bash
    git clone git@github.com:AnchalDevBytes/pocketlog.git
    cd pocketlog
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the root of the project and add the necessary environment variables. You can use the `.env.example` file as a template.

4.  **Run database migrations:**
    This will sync your database schema with the Prisma schema file and create all the necessary tables.

    ```bash
    npx prisma migrate dev
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application should now be running on [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env` file in the project root and add the following variables.

```env
DATABASE_URL="YOUR_DATABASE_URL"

NEXTAUTH_SECRET="YOUR_NEXTAUTH_SECRET"

GOOGLE_CLIENT_ID="YOUR_GOOGLE_CLIENT_ID"
GOOGLE_CLIENT_SECRET="YOUR_GOOGLE_CLIENT_SECRET"

GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

```

## Deployment

Deployed on vercel : [here](https://ai-pocketlog.vercel.app/)
