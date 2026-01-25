"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useRouter } from "next/navigation"

export type Round = {
    id: string
    date_played: string
    course_name: string
    course_id: string
    total_score: number
    total_par: number
    to_par: number
    holes_played: number
}

const RoundActions = ({ round }: { round: Round }) => {
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this round?')) {
            return
        }

        try {
            const response = await fetch(`/api/rounds/${round.id}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                router.refresh()
            } else {
                alert('Failed to delete round')
            }
        } catch (error) {
            console.error('Error deleting round:', error)
            alert('Failed to delete round')
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
                    <DropdownMenuItem
                        onClick={handleDelete}
                        className="text-red-600 focus:text-red-600"
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export const columns: ColumnDef<Round>[] = [
    {
        accessorKey: "date_played",
        header: "Date",
        size: 120,
        cell: ({ row }) => {
            // Format date as dd/mm/yyyy
            const date = new Date(row.getValue("date_played"))
            const day = String(date.getDate()).padStart(2, '0')
            const month = String(date.getMonth() + 1).padStart(2, '0')
            const year = date.getFullYear()
            return <div>{`${day}/${month}/${year}`}</div>
        },
    },
    {
        accessorKey: "course_name",
        header: "Course",
        size: 250,
        cell: ({ row }) => {
            const courseId = row.original.course_id
            const courseName = row.getValue("course_name") as string
            return (
                <Link 
                    href={`/courses/${courseId}`}
                    className="text-brand-700 hover:text-brand-800 hover:underline truncate block"
                    title={courseName}
                >
                    {courseName}
                </Link>
            )
        },
    },
    {
        accessorKey: "total_score",
        header: () => <div className="text-center">Score</div>,
        size: 100,
        cell: ({ row }) => {
            return <div className="text-center">{row.getValue("total_score")}</div>
        },
    },
    {
        accessorKey: "to_par",
        header: () => <div className="text-center">To Par</div>,
        size: 100,
        cell: ({ row }) => {
            const toPar = row.getValue("to_par") as number
            const formatted = toPar > 0 ? `+${toPar}` : toPar === 0 ? "E" : `${toPar}`
            const color = toPar > 0 ? "text-red-600" : toPar === 0 ? "text-gray-600" : "text-green-600"
            return <div className={`text-center font-semibold ${color}`}>{formatted}</div>
        },
    },
    {
        accessorKey: "holes_played",
        header: () => <div className="text-center">Holes</div>,
        size: 80,
        cell: ({ row }) => {
            return <div className="text-center">{row.getValue("holes_played")}</div>
        },
    },
    {
        id: "actions",
        size: 60,
        cell: ({ row }) => {
            return <RoundActions round={row.original} />
        },
    },
]