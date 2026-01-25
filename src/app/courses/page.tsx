import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { CoursesClient } from './courses-client'

export const dynamic = 'force-dynamic'

export default async function CoursesPage() {
  const supabase = await createClient()

  // 1. Get User
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect('/login')
  }

  // 2. Get Courses
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('*')
    .eq('user_id', user.id)
    .order('name')

  if (coursesError) {
    console.error('Error fetching courses:', coursesError)
    // Handle error gracefully or throw
  }

  return (
    <CoursesClient 
      initialUser={user} 
      initialCourses={courses || []} 
    />
  )
}
