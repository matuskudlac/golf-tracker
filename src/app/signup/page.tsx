'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthLayout from '@/components/auth/AuthLayout'
import { SignUpForm } from '@/components/auth/SignUpForm'

export default function SignUpPage() {
  const router = useRouter()
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSuccess = () => {
    setShowSuccess(true)
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
  }

  return (
    <AuthLayout>
      <SignUpForm onSuccess={handleSuccess} showSuccess={showSuccess} />
    </AuthLayout>
  )
}
