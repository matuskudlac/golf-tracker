"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"

const performanceItems: { title: string; href: string; description: string }[] = [
  {
    title: "Overview",
    href: "/performance",
    description: "Analyze and look at your overall performance in all parts of the game",
  },
  {
    title: "Scoring Average",
    href: "/performance/scoring",
    description: "Track your average score over time and identify trends in your game",
  },
  {
    title: "Fairways Hit",
    href: "/performance/fairways",
    description: "Monitor your driving accuracy and consistency off the tee",
  },
  {
    title: "Greens in Regulation",
    href: "/performance/gir",
    description: "Analyze your approach shots and green-hitting percentage",
  },
  {
    title: "Putting Stats",
    href: "/performance/putting",
    description: "Review your putting performance and average putts per round",
  },
  {
    title: "Up & Downs",
    href: "/performance/short-game",
    description: "Track your short game efficiency around the greens",
  },
]

const insightsItems: { title: string; href: string; description: string }[] = [
  {
    title: "Trend Analysis",
    href: "/insights/trends",
    description: "Discover patterns and trends in your golf performance over time.",
  },
  {
    title: "Strengths & Weaknesses",
    href: "/insights/analysis",
    description: "Identify areas of your game that need improvement.",
  },
  {
    title: "Course Comparison",
    href: "/insights/courses",
    description: "Compare your performance across different golf courses.",
  },
  {
    title: "Goal Setting",
    href: "/insights/goals",
    description: "Set and track progress towards your golf improvement goals.",
  },
]

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"

export function SiteHeaderNavigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex-nowrap">
        <NavigationMenuItem>
          <Link
            href="/"
            className="font-semibold text-lg sm:text-xl pr-2 sm:pr-4 py-2 block no-underline transition-colors hover:text-primary focus:outline-none focus:text-primary whitespace-nowrap"
          >
            Track App
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm sm:text-base whitespace-nowrap">Performance</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-3 p-4 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px] z-50">
              {performanceItems.map((item) => (
                <ListItem key={item.title} title={item.title} href={item.href}>
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="text-sm sm:text-base whitespace-nowrap">Insights</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[300px] gap-3 p-4 sm:w-[400px] md:w-[500px] md:grid-cols-2 lg:w-[600px] z-50">
              {insightsItems.map((item) => (
                <ListItem key={item.title} title={item.title} href={item.href}>
                  {item.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link
            href="/courses"
            className="font-medium text-sm sm:text-base whitespace-nowrap px-4 py-2 transition-colors hover:text-primary focus:outline-none focus:text-primary"
          >
            Courses
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}
