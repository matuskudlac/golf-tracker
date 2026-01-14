import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()
        const { id } = await params

        const { data: course, error } = await supabase
            .from('courses')
            .select('*, course_holes(*)')
            .eq('id', id)
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        if (!course) {
            return NextResponse.json({ error: 'Course not found' }, { status: 404 })
        }

        return NextResponse.json(course)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch course' },
            { status: 500 }
        )
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()
        const { id } = await params
        const body = await request.json()

        const { data: course, error } = await supabase
            .from('courses')
            .update(body)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(course)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to update course' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()
        const { id } = await params

        const { error } = await supabase
            .from('courses')
            .delete()
            .eq('id', id)

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete course' },
            { status: 500 }
        )
    }
}
