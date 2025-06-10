"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  Flag,
  Target,
  Disc,
  CircleDot,
  SettingsIcon,
  LogOut,
  Plus,
  Map,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartNoAxesCombined } from "lucide-react";

interface SideMenuItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

function SideMenuItem({ icon: Icon, label, href, active }: SideMenuItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors first:rounded-t-lg last:rounded-b-lg last:border-t",
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </Link>
  );
}

export function SideMenu() {
  const pathname = usePathname();

  const menuItems = [
    { icon: Home, label: "Overview", href: "/" },
    { icon: Flag, label: "Tee Shots", href: "/tee-shots" },
    { icon: Target, label: "Approaches", href: "/approaches" },
    { icon: Disc, label: "Chipping", href: "/chipping" },
    { icon: CircleDot, label: "Putting", href: "/putting" },
    { icon: ChartNoAxesCombined, label: "Practice", href: "/practice" },
    { icon: Map, label: "Courses", href: "/courses" },
    { icon: SettingsIcon, label: "Settings", href: "/settings" },
  ];

  return (
    <div className="space-y-3">
      <Card className="w-56 h-fit shadow-sm p-0">
        <div className="flex flex-col">
          <div className="flex flex-col space-y-1">
            {menuItems.map((item) => (
              <SideMenuItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={pathname === item.href}
              />
            ))}
          </div>
        </div>
      </Card>

      <Link href="/add-round">
        <Button
          className="w-56 h-12 bg-primary/15 hover:bg-primary/25 text-primary border border-primary/20 shadow-sm transition-all duration-200 hover:shadow-md"
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Round
        </Button>
      </Link>
    </div>
  );
}
