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
  tee_color: string | null
  created_at: string
}

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: 'name',
    header: 'Course Name',
    size: 250,
    cell: ({ row }) => {
      const name = row.getValue('name') as string
      return <div className="font-medium truncate" title={name}>{name}</div>
    },
  },
  {
    accessorKey: 'city',
    header: () => <div className="text-center">Location</div>,
    size: 180,
    cell: ({ row }) => {
      const city = row.original.city
      const state = row.original.state_region
      const country = row.original.country
      
      const location = [city, state, country].filter(Boolean).join(', ')
      return <div className="text-slate-600 text-center truncate" title={location}>{location || '—'}</div>
    },
  },
  {
    accessorKey: 'tee_color',
    header: () => <div className="text-center">Tee Color</div>,
    size: 100,
    cell: ({ row }) => {
      const teeColor = row.getValue('tee_color') as string | null
      return <div className="text-slate-600 text-center">{teeColor || '—'}</div>
    },
  },
  {
    id: 'last_played',
    header: () => <div className="text-center">Last Played</div>,
    size: 120,
    cell: () => {
      // Will show actual date when rounds are implemented
      return <div className="text-slate-400 text-center">—</div>
    },
  },
  {
    accessorKey: 'total_holes',
    header: () => <div className="text-center">Holes</div>,
    size: 80,
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue('total_holes')}</div>
    },
  },
  {
    id: 'actions',
    size: 60,
    cell: ({ row, table }) => {
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

      const handleEdit = () => {
        const meta = table.options.meta as any
        if (meta?.onEdit) {
          meta.onEdit(course)
        }
      }


      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 focus-visible:ring-0 focus-visible:ring-offset-0">
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
            <DropdownMenuItem onClick={handleEdit}>
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
        </div>
      )
    },
  },
]
