'use client'

import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/auth'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Settings, LogOut } from 'lucide-react'

interface UserMenuProps {
  user: {
    email?: string
    user_metadata?: {
      first_name?: string
      last_name?: string
      avatar_url?: string
    }
  }
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const handleSettings = () => {
    router.push('/settings')
  }

  // Get user's initials for avatar fallback
  const getInitials = () => {
    const firstName = user?.user_metadata?.first_name || ''
    const lastName = user?.user_metadata?.last_name || ''
    
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase()
    }
    
    // Fallback to email
    if (user?.email) {
      return user.email[0].toUpperCase()
    }
    
    return 'U'
  }

  const getFullName = () => {
    const firstName = user?.user_metadata?.first_name || ''
    const lastName = user?.user_metadata?.last_name || ''
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`
    }
    
    return user?.email?.split('@')[0] || 'User'
  }

  // Placeholder values - these will come from your database later
  const handicap = '--'
  const avgScore = '--'

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <Popover>
        <HoverCardTrigger asChild>
          <PopoverTrigger asChild>
            <button className="relative cursor-pointer">
              <Avatar className="h-9 w-9 transition-all duration-200">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt={getFullName()} />
                <AvatarFallback className="bg-brand-700 text-white font-medium text-sm hover:bg-brand-900 transition-colors duration-200">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
            </button>
          </PopoverTrigger>
        </HoverCardTrigger>

        {/* Hover Card - Quick Info */}
        <HoverCardContent className="w-auto p-3" align="end" sideOffset={8}>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-900">
              {getFullName()}
            </p>
            <p className="text-xs text-slate-500">
              {user?.email}
            </p>
          </div>
        </HoverCardContent>

        {/* Popover - Full Menu */}
        <PopoverContent className="w-64 p-0" align="end" sideOffset={8}>
          {/* Profile Section */}
          <div className="p-4 text-center border-b">
            {/* Avatar */}
            <Avatar className="mx-auto mb-3 h-16 w-16">
              <AvatarImage src={user?.user_metadata?.avatar_url} alt={getFullName()} />
              <AvatarFallback className="bg-brand-700 text-white font-semibold text-xl">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            
            {/* Name */}
            <h3 className="font-semibold text-slate-900 mb-1">
              {getFullName()}
            </h3>
            
            {/* Email */}
            <p className="text-sm text-slate-500 mb-3">
              {user?.email}
            </p>
            
            {/* Stats Row */}
            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-700 font-medium">HCP:</span>
                <span className="text-brand-700 font-semibold">{handicap}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-700 font-medium">Scoring Avg:</span>
                <span className="text-brand-700 font-semibold">{avgScore}</span>
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="p-2 flex gap-2">
            <button
              onClick={handleSettings}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-md transition-colors duration-200"
            >
              <Settings className="h-4 w-4" />
              Settings
            </button>
            <button
              onClick={handleSignOut}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-red-50 hover:text-red-600 rounded-md transition-colors duration-200"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </PopoverContent>
      </Popover>
    </HoverCard>
  )
}
