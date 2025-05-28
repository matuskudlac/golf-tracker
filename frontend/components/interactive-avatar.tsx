"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as HoverCard from "@radix-ui/react-hover-card";
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
import { Settings, User, Mail, Calendar, MapPin } from "lucide-react";

export function InteractiveAvatar() {
  const [isHovered, setIsHovered] = useState(false);

  // Mock user data - replace with actual user data
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

  return (
    <HoverCard.Root openDelay={200} closeDelay={200}>
      <HoverCard.Trigger asChild>
        <Avatar
          className="h-10 w-10 cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-primary hover:ring-offset-2"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>{userData.initials}</AvatarFallback>
        </Avatar>
      </HoverCard.Trigger>
      <HoverCard.Portal>
        <HoverCard.Content
          className="w-80 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          sideOffset={8}
          align="end"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>{userData.initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">{userData.name}</h4>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="text-xs">
                    {userData.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Handicap: {userData.handicap}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{userData.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Joined {userData.joinDate}
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {userData.location}
                </span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total Rounds:</span>
              <span className="font-medium">{userData.totalRounds}</span>
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
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
                      <h3 className="text-lg font-semibold">
                        Profile Information
                      </h3>
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
                      <h3 className="text-lg font-semibold">
                        Golf Preferences
                      </h3>
                      <div className="space-y-4 bg-muted/50 rounded-lg p-6">
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-1">
                            <p className="text-sm font-medium">
                              Current Handicap
                            </p>
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
                            <span className="font-medium">
                              Notification Settings
                            </span>
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
          </div>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
