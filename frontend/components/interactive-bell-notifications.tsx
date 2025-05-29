"use client";

import { useState } from "react";
import {
  Bell,
  Check,
  Settings,
  Eye,
  Clock,
  User,
  Trophy,
  Calendar,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// Mock notifications data
const notifications = [
  {
    id: 1,
    type: "achievement",
    title: "New Personal Best!",
    message: "You achieved your best score of 78 at Pebble Beach",
    time: "2 hours ago",
    read: false,
    icon: Trophy,
  },
  {
    id: 2,
    type: "reminder",
    title: "Tee Time Reminder",
    message: "Your tee time at Augusta National is tomorrow at 9:00 AM",
    time: "5 hours ago",
    read: false,
    icon: Calendar,
  },
  {
    id: 3,
    type: "social",
    title: "Friend Request",
    message: "Mike Johnson wants to connect with you",
    time: "1 day ago",
    read: true,
    icon: User,
  },
  {
    id: 4,
    type: "update",
    title: "Handicap Updated",
    message: "Your handicap has been updated to 12.3",
    time: "2 days ago",
    read: true,
    icon: Settings,
  },
];

export function InteractiveBellNotifications() {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationList, setNotificationList] = useState(notifications);

  const unreadCount = notificationList.filter((n) => !n.read).length;

  const markAsRead = (id: number) => {
    setNotificationList((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotificationList((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-md transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus:bg-accent focus:text-accent-foreground">
          <Bell className="h-5 w-5" />
          {/* Notification badge for unread count */}
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 text-white border-0 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end" sideOffset={8}>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h4 className="text-base font-semibold">Notifications</h4>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                <Check className="h-3 w-3 mr-1" />
                Mark all as read
              </Button>
            )}
          </div>

          <Separator />

          {/* Notifications List */}
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {notificationList.length > 0 ? (
              notificationList.map((notification) => {
                const IconComponent = notification.icon;
                return (
                  <div
                    key={notification.id}
                    className={cn(
                      "flex items-start space-x-3 p-3 rounded-md transition-colors cursor-pointer",
                      !notification.read
                        ? "bg-primary/5 hover:bg-primary/10"
                        : "hover:bg-muted/50"
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div
                      className={cn(
                        "p-2 rounded-full",
                        notification.type === "achievement" &&
                          "bg-yellow-100 text-yellow-600",
                        notification.type === "reminder" &&
                          "bg-blue-100 text-blue-600",
                        notification.type === "social" &&
                          "bg-green-100 text-green-600",
                        notification.type === "update" &&
                          "bg-purple-100 text-purple-600"
                      )}
                    >
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="h-2 w-2 bg-primary rounded-full" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {notification.message}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {notification.time}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No notifications yet</p>
              </div>
            )}
          </div>

          <Separator />

          {/* Footer Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Eye className="h-4 w-4 mr-2" />
              View All
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
