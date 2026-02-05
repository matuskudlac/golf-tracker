'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { signOut } from '@/lib/auth'
import { User, Palette, Flag, Check, ChevronsUpDown, Moon, Sun, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useTheme } from 'next-themes'
import {
  Navbar,
  NavBody,
  NavItems,
  NavbarLogo,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
} from '@/components/ui/resizable-navbar'
import { UserMenu } from '@/components/navigation/UserMenu'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'

interface SettingsClientProps {
  user: any
  account: any
  category: string
}

const settingsCategories = [
  { id: 'account', name: 'Account', icon: User },
  { id: 'preferences', name: 'Preferences', icon: Palette },
  { id: 'golf', name: 'Golf', icon: Flag },
]

const commonTeeColors = ['Black', 'White', 'Yellow', 'Blue', 'Red']

export function SettingsClient({ user, account, category }: SettingsClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Settings State
  const [units, setUnits] = useState(account?.preferred_units || 'yards')
  const [defaultTeeColor, setDefaultTeeColor] = useState(account?.default_tee_color || 'Yellow')
  const [teeColorOpen, setTeeColorOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const navItems = [
    { name: "Dashboard", link: "/dashboard" },
    { name: "Rounds", link: "/rounds" },
    { name: "Statistics", link: "/statistics" },
    { name: "Courses", link: "/courses" },
  ]

  const saveSettings = async (updates: Record<string, any>) => {
    setSaving(true)
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })
      if (!response.ok) {
        throw new Error('Failed to save settings')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleUnitsChange = (value: string) => {
    if (value) {
      setUnits(value)
      saveSettings({ preferred_units: value })
    }
  }

  const handleThemeChange = (value: string) => {
    if (value) {
      setTheme(value)
      saveSettings({ preferred_theme: value })
    }
  }

  const handleTeeColorChange = (value: string) => {
    setDefaultTeeColor(value)
    setTeeColorOpen(false)
    saveSettings({ default_tee_color: value })
  }

  const renderContent = () => {
    switch (category) {
      case 'account':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-1">Account</h2>
              <p className="text-sm text-slate-500">Manage your account information</p>
            </div>
            
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-slate-600">Email</Label>
                <p className="text-slate-900 font-medium">{user.email}</p>
              </div>
              
              <div className="space-y-2">
                <Label className="text-slate-600">User ID</Label>
                <p className="text-xs text-slate-500 font-mono">{user.id}</p>
              </div>
            </div>
          </div>
        )
      
      case 'preferences':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-1">Preferences</h2>
              <p className="text-sm text-slate-500">Customize your app experience</p>
            </div>
            
            {/* Theme Setting */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-900 font-medium">Theme</Label>
                  <p className="text-sm text-slate-500">Choose your preferred color scheme</p>
                </div>
                <ToggleGroup 
                  type="single" 
                  value={theme} 
                  onValueChange={handleThemeChange}
                  className="gap-1 p-1 bg-slate-100 rounded-lg"
                >
                  <ToggleGroupItem 
                    value="light"
                    className="data-[state=on]:bg-white data-[state=on]:text-brand-700 data-[state=on]:shadow-sm transition-all !rounded-md px-3"
                    aria-label="Light mode"
                  >
                    <Sun className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="dark"
                    className="data-[state=on]:bg-white data-[state=on]:text-brand-700 data-[state=on]:shadow-sm transition-all !rounded-md px-3"
                    aria-label="Dark mode"
                  >
                    <Moon className="h-4 w-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="system"
                    className="data-[state=on]:bg-white data-[state=on]:text-brand-700 data-[state=on]:shadow-sm transition-all !rounded-md px-3"
                    aria-label="System preference"
                  >
                    <Monitor className="h-4 w-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            {/* Units Setting */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-900 font-medium">Distance Units</Label>
                  <p className="text-sm text-slate-500">Choose how distances are displayed</p>
                </div>
                <ToggleGroup 
                  type="single" 
                  value={units} 
                  onValueChange={handleUnitsChange}
                  className="gap-1 p-1 bg-slate-100 rounded-lg"
                >
                  <ToggleGroupItem 
                    value="yards"
                    className="data-[state=on]:bg-white data-[state=on]:text-brand-700 data-[state=on]:shadow-sm transition-all !rounded-md px-4"
                  >
                    Yards
                  </ToggleGroupItem>
                  <ToggleGroupItem 
                    value="meters"
                    className="data-[state=on]:bg-white data-[state=on]:text-brand-700 data-[state=on]:shadow-sm transition-all !rounded-md px-4"
                  >
                    Meters
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>
          </div>
        )
      
      case 'golf':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-1">Golf Settings</h2>
              <p className="text-sm text-slate-500">Configure your default golf preferences</p>
            </div>
            
            {/* Default Tee Color */}
            <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-slate-900 font-medium">Default Tee Color</Label>
                  <p className="text-sm text-slate-500">Pre-selected when adding new rounds or courses</p>
                </div>
                <Popover open={teeColorOpen} onOpenChange={setTeeColorOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={teeColorOpen}
                      className="w-[150px] justify-between font-normal"
                    >
                      {defaultTeeColor || "Select..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput 
                        placeholder="Type or select..." 
                        value={defaultTeeColor}
                        onValueChange={setDefaultTeeColor}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleTeeColorChange(defaultTeeColor)
                          }
                        }}
                      />
                      <CommandList>
                        <CommandEmpty>
                          <div className="py-2 text-center text-sm">
                            Press Enter to use custom color
                          </div>
                        </CommandEmpty>
                        <CommandGroup heading="Common Colors">
                          {commonTeeColors.map((color) => (
                            <CommandItem
                              key={color}
                              value={color}
                              onSelect={handleTeeColorChange}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  defaultTeeColor === color ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {color}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Navbar */}
      <Navbar>
        {/* Desktop Navbar */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} currentPath={pathname} />
          <UserMenu user={user} />
        </NavBody>

        {/* Mobile Navbar */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle 
              isOpen={isMobileMenuOpen} 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            />
          </MobileNavHeader>
          <MobileNavMenu 
            isOpen={isMobileMenuOpen} 
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.link}
                className="block px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                {item.name}
              </Link>
            ))}
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Main Content */}
      <main className="pt-24 pb-12 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-48 shrink-0">
            <nav className="space-y-1">
              {settingsCategories.map((cat) => {
                const Icon = cat.icon
                const isActive = category === cat.id
                return (
                  <Link
                    key={cat.id}
                    href={`/settings/${cat.id}`}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-brand-100 text-brand-700" 
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {cat.name}
                  </Link>
                )
              })}
            </nav>
          </aside>

          {/* Divider */}
          <div className="w-px bg-slate-200 shrink-0" />

          {/* Content */}
          <div className="flex-1 min-w-0">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  )
}
