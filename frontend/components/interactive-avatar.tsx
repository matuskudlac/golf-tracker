"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import * as HoverCard from "@radix-ui/react-hover-card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, User, Mail, Calendar, MapPin, Sheet } from "lucide-react";
import { SettingsSheet } from "./sheet-settings";

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
              <div className="space-y-0 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">{userData.name}</h4>
                  <Badge className="text-xs bg-green-100 text-green-800 border-green-200">
                    {userData.status}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  Handicap: {userData.handicap}
                </span>
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

            <SettingsSheet />
          </div>
        </HoverCard.Content>
      </HoverCard.Portal>
    </HoverCard.Root>
  );
}
