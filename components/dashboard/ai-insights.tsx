"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { Brain, TrendingUp, AlertCircle, Lightbulb, RefreshCw } from "lucide-react"

interface AIInsights {
  spendingPatterns: string
  budgetInsights: string
  recommendations: string[]
  savingsOpportunities: string[]
  financialHealthScore: number
  summary: string
}

export function AIInsights() {
  const [insights, setInsights] = useState<AIInsights | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateInsights = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to generate insights")
      }

      const data = await response.json()
      setInsights(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const getHealthScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600"
    if (score >= 6) return "text-yellow-600"
    return "text-red-600"
  }

  const getHealthScoreLabel = (score: number) => {
    if (score >= 8) return "Excellent"
    if (score >= 6) return "Good"
    if (score >= 4) return "Fair"
    return "Needs Improvement"
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <CardTitle>AI Financial Insights</CardTitle>
            </div>
            <Button onClick={generateInsights} disabled={loading} variant="outline" size="sm">
              {loading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Brain className="h-4 w-4 mr-2" />}
              {loading ? "Analyzing..." : "Generate Insights"}
            </Button>
          </div>
          <CardDescription>
            Get AI-powered analysis of your spending patterns and personalized recommendations
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="flex items-center space-x-2 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg mb-4">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {!insights && !loading && !error && (
            <div className="text-center py-8">
              <Brain className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                Click "Generate Insights" to get AI-powered financial analysis
              </p>
              <p className="text-xs text-slate-400">Powered by Google Gemini AI</p>
            </div>
          )}

          {insights && (
            <div className="space-y-6">
              {/* Financial Health Score */}
              <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Financial Health Score</h3>
                <div className="flex items-center justify-center space-x-2">
                  <span className={`text-3xl font-bold ${getHealthScoreColor(insights.financialHealthScore)}`}>
                    {insights.financialHealthScore}/10
                  </span>
                  <Badge variant="secondary">{getHealthScoreLabel(insights.financialHealthScore)}</Badge>
                </div>
              </div>

              {/* Summary */}
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Summary
                </h4>
                <p className="text-slate-600 dark:text-slate-300">{insights.summary}</p>
              </div>

              {/* Spending Patterns */}
              <div>
                <h4 className="font-semibold mb-2">Spending Patterns</h4>
                <p className="text-slate-600 dark:text-slate-300">{insights.spendingPatterns}</p>
              </div>

              {/* Budget Insights */}
              <div>
                <h4 className="font-semibold mb-2">Budget Performance</h4>
                <p className="text-slate-600 dark:text-slate-300">{insights.budgetInsights}</p>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-semibold mb-2 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {insights.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span className="text-slate-600 dark:text-slate-300">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Savings Opportunities */}
              <div>
                <h4 className="font-semibold mb-2">Savings Opportunities</h4>
                <ul className="space-y-2">
                  {insights.savingsOpportunities.map((opp, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-green-600 mt-1">💡</span>
                      <span className="text-slate-600 dark:text-slate-300">{opp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
