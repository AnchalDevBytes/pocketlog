"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, PieChart, TrendingUp } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6">
              Take Control of Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Finances
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8">
              Track expenses, manage budgets, and gain insights into your financial habits with our intelligent expense
              tracking platform.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8 py-4">
                Start Tracking Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Learn More
              </Button>
            </Link>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="bg-slate-50 dark:bg-slate-700 px-6 py-4 border-b border-slate-200 dark:border-slate-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">Total Balance</p>
                        <p className="text-2xl font-bold">$12,450.00</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-200" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">Monthly Income</p>
                        <p className="text-2xl font-bold">$5,200.00</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-green-200" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-100">Monthly Expenses</p>
                        <p className="text-2xl font-bold">$3,750.00</p>
                      </div>
                      <PieChart className="h-8 w-8 text-red-200" />
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Recent Transactions</h3>
                  <div className="space-y-3">
                    {[
                      { name: "Grocery Shopping", amount: "-$85.50", category: "Food" },
                      { name: "Salary Deposit", amount: "+$2,600.00", category: "Income" },
                      { name: "Electric Bill", amount: "-$120.00", category: "Utilities" },
                    ].map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{transaction.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{transaction.category}</p>
                        </div>
                        <p
                          className={`font-semibold ${
                            transaction.amount.startsWith("+") ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {transaction.amount}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
