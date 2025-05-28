import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, User, Mail } from "lucide-react";

const userData = {
  name: "John Doe",
  initials: "JD",
  email: "john.doe@example.com",
  joinDate: "January 2024",
  location: "San Francisco, CA",
  handicap: "12.5",
  totalRounds: 45,
  status: "Active Member",
};

export function SettingsSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[500px] sm:w-[600px]">
        <SheetHeader>
          <SheetTitle>User Settings</SheetTitle>
          <SheetDescription>
            Manage your account settings and preferences.
          </SheetDescription>
        </SheetHeader>
        <div className="py-8 px-2">
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Profile Information</h3>
              <div className="space-y-4 bg-muted/50 rounded-lg p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium">Display Name</p>
                    <p className="text-sm text-muted-foreground">
                      {userData.name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium">Email Address</p>
                    <p className="text-sm text-muted-foreground">
                      {userData.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Golf Preferences</h3>
              <div className="space-y-4 bg-muted/50 rounded-lg p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Current Handicap</p>
                    <p className="text-lg font-semibold text-primary">
                      {userData.handicap}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Total Rounds</p>
                    <p className="text-lg font-semibold text-primary">
                      {userData.totalRounds}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Home Course</p>
                  <p className="text-sm text-muted-foreground">
                    Pebble Beach Golf Links
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Account Actions</h3>
              <div className="grid grid-cols-1 gap-4">
                <Button
                  variant="outline"
                  className="justify-start h-12 text-left"
                >
                  <User className="h-4 w-4 mr-3" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Edit Profile</span>
                    <span className="text-xs text-muted-foreground">
                      Update your personal information
                    </span>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-12 text-left"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Change Password</span>
                    <span className="text-xs text-muted-foreground">
                      Update your account security
                    </span>
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="justify-start h-12 text-left"
                >
                  <Mail className="h-4 w-4 mr-3" />
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Notification Settings</span>
                    <span className="text-xs text-muted-foreground">
                      Manage your preferences
                    </span>
                  </div>
                </Button>
                <Button
                  variant="destructive"
                  className="justify-start h-12 text-left mt-4"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Sign Out</span>
                    <span className="text-xs opacity-80">
                      End your current session
                    </span>
                  </div>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
