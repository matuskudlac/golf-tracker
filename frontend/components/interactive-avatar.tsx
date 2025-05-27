"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function InteractiveAvatar() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Avatar
      className={`h-10 w-10 transition-transform cursor-pointer ${
        isHovered ? "scale-120" : "scale-100"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => alert("Avatar clicked!")}
    >
      <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
