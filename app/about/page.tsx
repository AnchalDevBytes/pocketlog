"use client";

import { Header } from "@/components/landing/header";
import { Footer } from "@/components/landing/footer";
import { ParticleBackground } from "@/components/ui/particle-background";
import {
  BarChart3,
  Shield,
  Zap,
  LayoutGrid,
  TrendingUp,
  Receipt,
} from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: Receipt,
      title: "Track Transactions",
      description:
        "Effortlessly log all your income and expenses. Categorize every transaction to see where your money goes.",
    },
    {
      icon: TrendingUp,
      title: "Create Budgets",
      description:
        "Set monthly or weekly spending targets for different categories to stay on top of your financial goals.",
    },
    {
      icon: BarChart3,
      title: "Visualize Your Finances",
      description:
        "Interactive charts and a dashboard overview provide a clear picture of your financial health at a glance.",
    },
    {
      icon: LayoutGrid,
      title: "Organize with Categories",
      description:
        "Create custom categories for both income and expenses to organize your financial life your way.",
    },
    {
      icon: Zap,
      title: "Fast & Intuitive",
      description:
        "A clean, modern interface designed to make financial management quick, easy, and even enjoyable.",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description:
        "Your data is yours. We use strong security measures and respect your privacy.",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      <ParticleBackground />
      <Header />

      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Your Personal Finance Hub
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              PocketLog is a modern, intuitive tool designed to help you
              effortlessly track your spending, manage budgets, and achieve your
              financial goals.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800/50 rounded-2xl p-8 md:p-12 shadow-xl border border-slate-200 dark:border-slate-700">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
              Core Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center"
                >
                  <div className="bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full mb-4">
                    <feature.icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Our Commitment
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              We believe in simplicity, security, and giving you complete
              control over your financial data. PocketLog is built to empower
              you, not to get in your way.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
