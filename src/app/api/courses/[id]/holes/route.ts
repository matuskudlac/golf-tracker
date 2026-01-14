import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = await createClient()
        const body = await request.json()
        const { holes } = body

        // Insert all holes for this course
        const { data, error } = await supabase
            .from('course_holes')
            .insert(
                holes.map((hole: any) => ({
                    course_id: params.id,
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
