import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SettingsClient } from '../settings-client'

export const dynamic = 'force-dynamic'

interface SettingsPageProps {
  params: Promise<{ category: string }>
}

export default async function SettingsCategoryPage({ params }: SettingsPageProps) {
  const { category } = await params
  const supabase = await createClient()

  // 1. Get User
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) {
    redirect('/login')
  }

  // 2. Get Account Settings
  const { data: account, error: accountError } = await supabase
    .from('accounts')
    .select('*')
    .eq('id', user.id)
    .single()

  if (accountError) {
    console.error('Error fetching account:', accountError)
  }

  return (
    <SettingsClient 
      user={user} 
      account={account} 
      category={category} 
    />
  )
}
