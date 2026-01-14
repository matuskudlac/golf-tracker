import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
    try {
        const supabase = await createClient()

        const { data: courses, error } = await supabase
            .from('courses')
            .select('*')
            .order('name', { ascending: true })

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        return NextResponse.json(courses)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch courses' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const supabase = await createClient()

        const body = await request.json()

        console.log('Creating course with data:', body)

        const { data: course, error } = await supabase
            .from('courses')
            .insert([body])
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        console.log('Course created successfully:', course)
        return NextResponse.json(course, { status: 201 })
    } catch (error) {
        console.error('Unexpected error:', error)
        return NextResponse.json(
            { error: 'Failed to create course' },
            { status: 500 }
        )
    }
}
