'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { signOut } from '@/lib/auth'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { DataTable } from './data-table'
import { columns } from './columns'
import { AddRoundDialog } from '../../components/rounds/AddRoundDialog'

interface RoundsClientProps {
  initialUser: any
  initialRounds: any[]
}

export function RoundsClient({ initialUser, initialRounds }: RoundsClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const handleRefresh = () => {
    router.refresh()
  }

  const navItems = [
    { name: "Dashboard", link: "/dashboard" },
    { name: "Rounds", link: "/rounds" },
    { name: "Statistics", link: "/statistics" },
    { name: "Courses", link: "/courses" },
  ]

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Navbar */}
      <Navbar>
        {/* Desktop Navbar */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} currentPath={pathname} />
          <UserMenu user={initialUser} />
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
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                className="text-neutral-600 dark:text-neutral-300"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full border-slate-300"
            >
              Sign out
            </Button>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Rounds</h1>
            <p className="text-slate-600 mt-1">Track and manage your golf rounds</p>
          </div>
          <Button 
            className="bg-brand-700 hover:bg-brand-800 text-white"
            onClick={() => setDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Round
          </Button>
        </div>

        <DataTable columns={columns} data={initialRounds} />
        
        <AddRoundDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSuccess={handleRefresh}
        />
      </main>
    </div>
  )
}
