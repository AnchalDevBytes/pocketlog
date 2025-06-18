"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { User, Bell, Shield, Camera } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession();

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [originalProfileData, setOriginalProfileData] = useState({});

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    timezone: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/profile");
        if (!response.ok) {
          throw new Error("Failed to fetch profile data");
        }
        const data = await response.json();
        setProfileData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          timezone: data.timezone || "",
        });
        //saving the initial state for "cancel" button
        setOriginalProfileData;
      } catch (error) {
        console.error(error);
        toast({
          title: "Error",
          description: "Could not load your profile.",
          variant: "destructive",
        });
      }
    };
    fetchProfile();
  }, []);

  const handleEditClick = () => {
    setOriginalProfileData(profileData);
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setProfileData(originalProfileData as any);
    setIsEditing(false);
  };

  // const [notifications, setNotifications] = useState({
  //   emailNotifications: true,
  //   budgetAlerts: true,
  //   weeklyReports: false,
  //   transactionAlerts: true,
  // });

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
          timezone: profileData.timezone,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile.");
      }
      if (session?.user?.name !== profileData.name) {
        await updateSession({ name: profileData.name });
      }

      toast({
        title: "Success",
        description: "Your profile has been updated.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Could not save your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSaveNotifications = () => {
  //   // In a real app, you would call your API here
  //   console.log("Saving notifications:", notifications);
  // };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Profile Settings
        </h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2">
          Manage your account settings and preferences
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            {/* <TabsTrigger value="notifications">Notifications</TabsTrigger> */}
            {/* <TabsTrigger value="security">Security</TabsTrigger> */}
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Personal Information</span>
                </CardTitle>
                <CardDescription>
                  Update your personal details. Email is managed by your sign-in
                  provider.{" "}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={session?.user?.image || ""} />
                      <AvatarFallback className="text-2xl">
                        {session?.user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                      disabled
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">
                      {session?.user?.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      disabled={!isEditing || isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                      disabled={!isEditing || isLoading}
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Input
                      id="timezone"
                      value={profileData.timezone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          timezone: e.target.value,
                        })
                      }
                      disabled={!isEditing || isLoading}
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSaveProfile} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Profile"}
                      </Button>
                      <Button variant="outline" onClick={handleCancelClick}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleEditClick}>Edit Profile</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notification Preferences</span>
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
                      checked={notifications.emailNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          emailNotifications: checked,
                        })
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
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent> */}

          {/* <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security Settings</span>
                </CardTitle>
                <CardDescription>
                  Manage your account security and privacy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Connected Accounts</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                          G
                        </div>
                        <div>
                          <p className="font-medium">Google</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Connected via OAuth
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Disconnect
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Data Export</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Download all your data in a portable format
                    </p>
                    <Button variant="outline" size="sm">
                      Request Data Export
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg border-red-200 dark:border-red-800">
                    <h4 className="font-medium mb-2 text-red-600 dark:text-red-400">
                      Danger Zone
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Permanently delete your account and all associated data
                    </p>
                    <Button variant="destructive" size="sm">
                      Delete Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}
        </Tabs>
      </motion.div>
    </div>
  );
}
