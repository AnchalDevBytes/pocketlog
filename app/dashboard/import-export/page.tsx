"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Download, Upload, FileText, FileSpreadsheet, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ImportExportPage() {
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)

  const handleExport = async (format: "csv" | "xlsx") => {
    setIsExporting(true)
    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real app, you would call your API here
      const response = await fetch(`/api/export?format=${format}`)
      const blob = await response.blob()

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `expense-data.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleImport = async (file: File) => {
    setIsImporting(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      // In a real app, you would call your API here
      const response = await fetch("/api/import", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        // Handle success
        console.log("Import successful")
      }
    } catch (error) {
      console.error("Import failed:", error)
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Import & Export</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2">
          Backup your data or import transactions from other sources
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Tabs defaultValue="export" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="export">Export Data</TabsTrigger>
            <TabsTrigger value="import">Import Data</TabsTrigger>
          </TabsList>

          <TabsContent value="export" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Export as CSV</span>
                  </CardTitle>
                  <CardDescription>
                    Download your transaction data in CSV format for use in spreadsheet applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => handleExport("csv")} disabled={isExporting} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    {isExporting ? "Exporting..." : "Download CSV"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileSpreadsheet className="h-5 w-5" />
                    <span>Export as Excel</span>
                  </CardTitle>
                  <CardDescription>
                    Download your transaction data in Excel format with formatted sheets
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => handleExport("xlsx")} disabled={isExporting} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    {isExporting ? "Exporting..." : "Download Excel"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your exported data will include all transactions, categories, accounts, and budgets. Personal
                information is not included in the export.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="import" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Upload className="h-5 w-5" />
                  <span>Import Transactions</span>
                </CardTitle>
                <CardDescription>Upload a CSV file to import your transaction data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="file">Select CSV File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleImport(file)
                      }
                    }}
                  />
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Make sure your CSV file has the following columns: Date, Description, Amount, Type, Category,
                    Account
                  </AlertDescription>
                </Alert>

                {isImporting && (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Importing transactions...</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>CSV Format Example</CardTitle>
                <CardDescription>Your CSV file should follow this format</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <div className="whitespace-nowrap">
                    Date,Description,Amount,Type,Category,Account
                    <br />
                    2024-01-15,"Grocery Shopping",85.50,EXPENSE,"Food & Dining","Main Checking"
                    <br />
                    2024-01-16,"Salary Deposit",2600.00,INCOME,"Salary","Main Checking"
                    <br />
                    2024-01-17,"Electric Bill",120.00,EXPENSE,"Utilities","Main Checking"
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
