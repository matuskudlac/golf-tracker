'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getCurrentUser, signOut } from '@/lib/auth'
import { Plus, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { CoursesDataTable } from './data-table'
import { columns } from './columns'
import { AddCourseDialog } from '@/components/courses/AddCourseDialog'

type AddMode = 'quick' | 'upload' | 'manual'

export default function CoursesPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [courses, setCourses] = useState([])
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [addMode, setAddMode] = useState<AddMode>('quick')

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        router.push('/login')
        return
      }
      setUser(currentUser)
      await fetchCourses()
    } catch (error) {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/courses')
      if (response.ok) {
        const data = await response.json()
        setCourses(data)
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent-700 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    )
  }

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
            <h1 className="text-3xl font-bold text-slate-900">Courses</h1>
            <p className="text-slate-600 mt-1">Manage your golf courses</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-brand-700 hover:bg-brand-800 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Course
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[180px]">
              <DropdownMenuItem
                onClick={() => {
                  setAddMode('quick')
                  setDialogOpen(true)
                }}
              >
                Quick Add
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setAddMode('upload')
                  setDialogOpen(true)
                }}
              >
                Upload Scorecard
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setAddMode('manual')
                  setDialogOpen(true)
                }}
              >
                Manual Entry
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CoursesDataTable columns={columns} data={courses} />

        <AddCourseDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          mode={addMode}
          onSuccess={fetchCourses}
        />
      </main>
    </div>
  )
}
