'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { signOut } from '@/lib/auth'
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

interface CoursesClientProps {
  initialUser: any
  initialCourses: any[]
}

export function CoursesClient({ initialUser, initialCourses }: CoursesClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [addMode, setAddMode] = useState<AddMode>('quick')
  const [editCourse, setEditCourse] = useState<any>(null)

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

  const handleRefresh = () => {
    router.refresh()
  }

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
                  setEditCourse(null)
                  setAddMode('quick')
                  setDialogOpen(true)
                }}
              >
                Quick Add
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setEditCourse(null)
                  setAddMode('upload')
                  setDialogOpen(true)
                }}
              >
                Upload Scorecard
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setEditCourse(null)
                  setAddMode('manual')
                  setDialogOpen(true)
                }}
              >
                Manual Entry
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CoursesDataTable 
          columns={columns} 
          data={initialCourses} 
          onEdit={(course) => {
            setEditCourse(course)
            setAddMode('manual')
            setDialogOpen(true)
          }}
          onDelete={handleRefresh}
        />

        <AddCourseDialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) setEditCourse(null)
          }}
          mode={addMode}
          onSuccess={handleRefresh}
          editMode={!!editCourse}
          courseData={editCourse}
        />
      </main>
    </div>
  )
}
