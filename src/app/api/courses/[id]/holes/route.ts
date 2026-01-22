import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('course_holes')
            .select('*')
            .eq('course_id', id)
            .order('hole_number', { ascending: true })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch course holes' },
            { status: 500 }
        )
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await createClient()
        const body = await request.json()
        const { holes } = body

        // Insert all holes for this course
        const { data, error } = await supabase
            .from('course_holes')
            .insert(
                holes.map((hole: any) => ({
                    course_id: id,
                    hole_number: hole.hole_number,
                    par: hole.par,
                    distance: hole.distance,
                    handicap: hole.handicap,
                }))
            )
            .select()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data, { status: 201 })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to create course holes' },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const supabase = await createClient()
        const body = await request.json()
        const { holes } = body

        // Delete existing holes
        await supabase
            .from('course_holes')
            .delete()
            .eq('course_id', id)

        // Insert updated holes
        const { data, error } = await supabase
            .from('course_holes')
            .insert(
                holes.map((hole: any) => ({
                    course_id: id,
                    hole_number: hole.hole_number,
                    par: hole.par,
                    distance: hole.distance,
                    handicap: hole.handicap,
                }))
            )
            .select()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update course holes' },
            { status: 500 }
        )
    }
}
