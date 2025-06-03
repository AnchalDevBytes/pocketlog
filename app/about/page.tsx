"use client"

import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { ParticleBackground } from "@/components/ui/particle-background"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, Shield, Users, Zap } from "lucide-react"

export default function AboutPage() {
  const features = [
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description:
        "Advanced charts and insights to help you understand your spending patterns and make better financial decisions.",
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Your financial data is protected with industry-standard encryption and security measures.",
    },
    {
      icon: Users,
      title: "User-Centric Design",
      description: "Built with user experience in mind, making financial management accessible and enjoyable.",
    },
    {
      icon: Zap,
      title: "Real-Time Updates",
      description: "Instant synchronization across all your devices with real-time transaction updates.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
      <ParticleBackground />
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-6">
              About ExpenseTracker Pro
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              We're on a mission to make personal finance management simple, intuitive, and accessible to everyone.
            </p>
          </div>

          <div className="space-y-16">
            <section>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">Our Story</h2>
              <div className="prose prose-lg max-w-none text-slate-600 dark:text-slate-300">
                <p className="text-lg leading-relaxed mb-6">
                  ExpenseTracker Pro was born from a simple frustration: existing financial tools were either too
                  complex for everyday users or too basic to provide meaningful insights. We believed there had to be a
                  better way to help people take control of their finances.
                </p>
                <p className="text-lg leading-relaxed mb-6">
                  Our team of developers, designers, and financial experts came together to create a platform that
                  combines powerful analytics with an intuitive interface. We've spent countless hours researching user
                  behavior, testing features, and refining the experience to create something truly special.
                </p>
                <p className="text-lg leading-relaxed">
                  Today, ExpenseTracker Pro helps thousands of users worldwide make smarter financial decisions, reach
                  their savings goals, and build better money habits. We're just getting started.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
                What Makes Us Different
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {features.map((feature, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardContent className="p-8">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
                          <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">Our Mission</h2>
              <div className="text-center">
                <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl mx-auto">
                  To democratize financial literacy and empower individuals to make informed decisions about their
                  money. We believe that everyone deserves access to powerful financial tools, regardless of their
                  background or experience level.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">Privacy & Security</h2>
              <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-8">
                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed text-center">
                  Your financial data is precious, and we treat it that way. We use bank-level encryption, never sell
                  your data to third parties, and give you complete control over your information. Your trust is our
                  most valuable asset.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
