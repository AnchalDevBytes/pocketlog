"use client"

import { motion } from "framer-motion"
import { BarChart3, PieChart, TrendingUp, Shield, Smartphone, Download } from "lucide-react"

const features = [
  {
    icon: BarChart3,
    title: "Smart Analytics",
    description: "Get detailed insights into your spending patterns with interactive charts and graphs.",
  },
  {
    icon: PieChart,
    title: "Budget Management",
    description: "Set and track budgets with visual progress indicators and smart notifications.",
  },
  {
    icon: TrendingUp,
    title: "Financial Goals",
    description: "Set financial goals and track your progress with personalized recommendations.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your financial data is encrypted and secure with industry-standard protection.",
  },
  {
    icon: Smartphone,
    title: "Mobile Friendly",
    description: "Access your finances anywhere with our responsive design and mobile optimization.",
  },
  {
    icon: Download,
    title: "Export Data",
    description: "Export your financial data in multiple formats for external analysis.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-800">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Everything You Need to Manage Your Finances
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
            Our comprehensive suite of tools helps you take control of your financial life with ease and confidence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-50 dark:bg-slate-700 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300"
            >
              <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">{feature.title}</h3>
              <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
