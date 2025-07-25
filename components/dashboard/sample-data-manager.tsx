"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion } from "framer-motion";
import { Database, Trash2, Plus, AlertTriangle } from "lucide-react";

export function SampleDataManager() {
  const [isCreating, setIsCreating] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const createSampleData = async () => {
    setIsCreating(true);
    setMessage(null);

    try {
      const response = await fetch("/api/seed", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: "success",
          text: `Sample data created! ${data.data.categories} categories, ${data.data.accounts} accounts, ${data.data.budgets} budgets, and ${data.data.transactions} transactions. Refreshing...`,
        });
        // Refresh the page to show new data
        setTimeout(() => window.location.reload(), 3000);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to create sample data",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while creating sample data",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const clearAllData = async () => {
    setIsClearing(true);
    setMessage(null);

    try {
      const response = await fetch("/api/seed", {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "All data deleted successfully" });
        // Refresh the page to show empty state
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to delete data",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "An error occurred while deleting data",
      });
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Sample Data Manager</span>
          </CardTitle>
          <CardDescription>
            Get started quickly with sample data or manage your existing data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <Alert
              variant={message.type === "error" ? "destructive" : "default"}
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{message.text}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Create Sample Data</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Generate sample categories, accounts, budgets, and transactions
                to explore the app features.
              </p>
              <Button
                onClick={createSampleData}
                disabled={isCreating || isClearing}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                {isCreating ? "Creating..." : "Create Sample Data"}
              </Button>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-red-600">Clear All Data</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Delete all your transactions, accounts, categories, and budgets.
                This action cannot be undone.
              </p>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    disabled={isCreating || isClearing}
                    variant="destructive"
                    className="w-full"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {isClearing ? "Deleting..." : "Clear All Data"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      all of your data, including transactions, accounts, and
                      budgets.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={clearAllData}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Yes, delete all data
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Sample Data Includes:
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• 16 expense and income categories with icons</li>
              <li>
                • 4 different account types (checking, savings, credit card,
                investment)
              </li>
              <li>• 3 monthly budgets for common expense categories</li>
              <li>• 30+ realistic transactions from the past month</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
