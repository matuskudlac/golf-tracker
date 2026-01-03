'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthLayout from '@/components/auth/AuthLayout'
import { LoginForm } from '@/components/auth/LoginForm'
import { SuccessMessage } from '@/components/ui/success-message'

export default function LoginPage() {
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
      <LoginForm onSuccess={handleSuccess} showSuccess={showSuccess} />
    </AuthLayout>
  )
}
