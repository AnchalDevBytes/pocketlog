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
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";
import { Settings, Database, Shield, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { toast } = useToast();

  const [preferences, setPreferences] = useState({
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
    theme: "system",
    language: "en",
    timezone: "UTC",
  });

  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    analytics: true,
    marketing: false,
    twoFactor: false,
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    budgetAlerts: true,
    weeklyReports: true,
    transactionAlerts: true,
  });

  const handleSavePreferences = () => {
    // In a real app, you would call your API here
    console.log("Saving preferences:", preferences);
    toast({
      title: "Success",
      description: "Preferences saved successfully",
    });
  };

  const handleSavePrivacy = () => {
    console.log("Saving privacy settings:", privacy);
    toast({
      title: "Success",
      description: "Privacy settings updated",
    });
  };

  const handleSaveNotifications = () => {
    console.log("Saving notification settings:", notifications);
    toast({
      title: "Success",
      description: "Notification preferences updated",
    });
  };

  const handleExportData = () => {
    toast({
      title: "Export Started",
      description: "Your data export will be ready shortly",
    });
  };

  const handleDeleteAllData = () => {
    if (
      confirm(
        "Are you sure you want to delete all your data? This action cannot be undone."
      )
    ) {
      toast({
        title: "Data Deletion",
        description: "All data has been scheduled for deletion",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2">
          Manage your application preferences and settings
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>General Preferences</span>
                </CardTitle>
                <CardDescription>
                  Configure your basic application settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currency">Default Currency</Label>
                    <Select
                      value={preferences.currency}
                      onValueChange={(value) =>
                        setPreferences({ ...preferences, currency: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="JPY">JPY (¥)</SelectItem>
                        <SelectItem value="INR">INR (₹)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateFormat">Date Format</Label>
                    <Select
                      value={preferences.dateFormat}
                      onValueChange={(value) =>
                        setPreferences({ ...preferences, dateFormat: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select
                      value={preferences.theme}
                      onValueChange={(value) =>
                        setPreferences({ ...preferences, theme: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={preferences.timezone}
                      onValueChange={(value) =>
                        setPreferences({ ...preferences, timezone: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">
                          Eastern Time
                        </SelectItem>
                        <SelectItem value="America/Chicago">
                          Central Time
                        </SelectItem>
                        <SelectItem value="America/Denver">
                          Mountain Time
                        </SelectItem>
                        <SelectItem value="America/Los_Angeles">
                          Pacific Time
                        </SelectItem>
                        <SelectItem value="Europe/London">London</SelectItem>
                        <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={handleSavePreferences}>
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notification Settings</span>
                </CardTitle>
                <CardDescription>
                  Choose what notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Receive email updates about your account
                      </p>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, email: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Push Notifications</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Receive push notifications in your browser
                      </p>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) =>
                        setNotifications({ ...notifications, push: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Budget Alerts</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Get notified when you're close to your budget limits
                      </p>
                    </div>
                    <Switch
                      checked={notifications.budgetAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          budgetAlerts: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Weekly Reports</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Receive weekly spending summaries
                      </p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReports}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          weeklyReports: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Transaction Alerts</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Get notified for large transactions
                      </p>
                    </div>
                    <Switch
                      checked={notifications.transactionAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          transactionAlerts: checked,
                        })
                      }
                    />
                  </div>
                </div>

                <Button onClick={handleSaveNotifications}>
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Privacy & Security</span>
                </CardTitle>
                <CardDescription>
                  Manage your privacy and security preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Data Sharing</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Allow sharing anonymized data for product improvement
                      </p>
                    </div>
                    <Switch
                      checked={privacy.dataSharing}
                      onCheckedChange={(checked) =>
                        setPrivacy({ ...privacy, dataSharing: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Analytics</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Help us improve by sharing usage analytics
                      </p>
                    </div>
                    <Switch
                      checked={privacy.analytics}
                      onCheckedChange={(checked) =>
                        setPrivacy({ ...privacy, analytics: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Marketing Communications</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Receive marketing emails and product updates
                      </p>
                    </div>
                    <Switch
                      checked={privacy.marketing}
                      onCheckedChange={(checked) =>
                        setPrivacy({ ...privacy, marketing: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      checked={privacy.twoFactor}
                      onCheckedChange={(checked) =>
                        setPrivacy({ ...privacy, twoFactor: checked })
                      }
                    />
                  </div>
                </div>

                <Button onClick={handleSavePrivacy}>
                  Save Privacy Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Data Management</span>
                </CardTitle>
                <CardDescription>Manage your data and account</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Export Your Data</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Download all your financial data in CSV format
                    </p>
                    <Button onClick={handleExportData} variant="outline">
                      Export Data
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Account Storage</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Your account is using approximately 2.4 MB of storage
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: "24%" }}
                      ></div>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      2.4 MB of 10 MB used
                    </p>
                  </div>

                  <div className="p-4 border rounded-lg border-red-200 dark:border-red-800">
                    <h4 className="font-medium mb-2 text-red-600 dark:text-red-400">
                      Danger Zone
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Permanently delete all your data. This action cannot be
                      undone.
                    </p>
                    <Button onClick={handleDeleteAllData} variant="destructive">
                      Delete All Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}
