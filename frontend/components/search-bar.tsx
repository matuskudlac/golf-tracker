"use client";

import type React from "react";

import { useState } from "react";
import { Search, X } from "lucide-react"; // Import X icon for custom clear button
import { cn } from "@/lib/utils";

export function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Handle escape key to clear search and exit focus
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      if (searchQuery) {
        // If there's content, clear it first
        setSearchQuery("");
      } else {
        // If no content, blur the input to exit search
        e.currentTarget.blur();
      }
    }
  };

  return (
    <div
      className={cn(
        "relative flex items-center transition-all duration-300 ease-in-out",
        isFocused ? "w-64" : "w-48 hover:w-56"
      )}
    >
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search
          className={cn(
            "h-4 w-4 transition-colors duration-200",
            isFocused ? "text-primary" : "text-muted-foreground"
          )}
        />
      </div>
      <input
        type="text" // Changed from "search" to "text" to completely remove native clear button
        placeholder="Search..."
        // Apply our styling without the native search input behavior
        className={cn(
          "w-full py-2 pl-10 pr-10 text-sm bg-background border border-input rounded-md outline-none transition-all duration-300",
          "placeholder:text-muted-foreground/70",
          "focus:ring-2 focus:ring-primary/20",
          "hover:border-muted-foreground/50"
        )}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown} // Add keyboard event handler for Escape key
      />
      {/* Custom clear button that matches the focus ring color */}
      {searchQuery && (
        <button
          onClick={() => setSearchQuery("")}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-primary/50 hover:text-primary transition-colors z-10"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
