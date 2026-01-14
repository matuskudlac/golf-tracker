'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Pencil, Trash2, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export type Course = {
  id: string
  name: string
  address: string | null
  city: string | null
  state_region: string | null
  country: string | null
  total_holes: number
  created_at: string
}

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: 'name',
    header: 'Course Name',
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('name')}</div>
    },
  },
  {
    accessorKey: 'city',
    header: 'Location',
    cell: ({ row }) => {
      const city = row.original.city
      const state = row.original.state_region
      const country = row.original.country
      
      const location = [city, state, country].filter(Boolean).join(', ')
      return <div className="text-slate-600">{location || '—'}</div>
    },
  },
  {
    accessorKey: 'total_holes',
    header: 'Holes',
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue('total_holes')}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const course = row.original

      const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${course.name}"?`)) {
          return
        }

        try {
          const response = await fetch(`/api/courses/${course.id}`, {
            method: 'DELETE',
          })

          if (response.ok) {
            window.location.reload()
          } else {
            alert('Failed to delete course')
          }
        } catch (error) {
          console.error('Error deleting course:', error)
          alert('Failed to delete course')
        }
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(course.id)}>
              <Copy className="h-4 w-4 mr-2" />
              Copy course ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Pencil className="h-4 w-4 mr-2" />
              Edit course
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-red-600 focus:text-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete course
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
