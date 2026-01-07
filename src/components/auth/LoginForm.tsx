'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { AnimatedInput } from '@/components/ui/animated-input'
import { Label } from '@/components/ui/label'
import { signIn } from '@/lib/auth'
import GoogleAuthButton from '@/components/auth/GoogleAuthButton'
import { CheckCircle2 } from 'lucide-react'

interface LoginFormProps {
  onSuccess?: () => void
  showSuccess?: boolean
}

export function LoginForm({ onSuccess, showSuccess }: LoginFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showError, setShowError] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setShowError(false)

    const startTime = Date.now()

    try {
      await signIn(email, password)
      
      // Ensure minimum 1 second delay for smooth UX
      const elapsed = Date.now() - startTime
      const remainingDelay = Math.max(0, 1000 - elapsed)
      
      await new Promise(resolve => setTimeout(resolve, remainingDelay))
      
      onSuccess?.()
    } catch (err: any) {
      // Ensure minimum 1 second delay even for errors
      const elapsed = Date.now() - startTime
      const remainingDelay = Math.max(0, 1000 - elapsed)
      
      await new Promise(resolve => setTimeout(resolve, remainingDelay))
      
      setError(err.message || 'Failed to sign in')
      setShowError(true)
      setLoading(false)
      
      // Fade error state back to normal after 2 seconds
      setTimeout(() => {
        setShowError(false)
      }, 2000)
    }
  }

  return (
    <>
      {/* Header */}
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Welcome back
        </h2>
        <p className="text-sm text-slate-600">
          Don't have an account?{' '}
          <Link
            href="/signup"
            className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Form */}
      <form className="space-y-6" onSubmit={handleSubmit}>
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-slate-700">
            Email address
          </Label>
          <AnimatedInput
            id="email"
            type="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-slate-700">
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <AnimatedInput
            id="password"
            type="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Remember me */}
        <div className="flex items-center justify-end gap-1.5">
          <input
            id="remember-me"
            type="checkbox"
            className="h-3.5 w-3.5 rounded border-slate-300 accent-emerald-600 focus:ring-emerald-500"
          />
          <label
            htmlFor="remember-me"
            className="block text-xs text-slate-500"
          >
            Remember me
          </label>
        </div>

        {/* Sign In Button */}
        <div className="relative group">
          <Button
            type="submit"
            disabled={loading || showSuccess}
            className="relative h-11 w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            {/* Loading/Success overlay - darker green */}
            <div 
              className={`absolute inset-0 bg-gradient-to-r from-emerald-700 to-emerald-600 transition-opacity duration-500 ${
                (loading || showSuccess) && !showError ? 'opacity-100' : 'opacity-0'
              }`} 
            />
            
            {/* Error overlay - red */}
            <div 
              className={`absolute inset-0 bg-gradient-to-r from-red-600 to-red-500 transition-opacity duration-500 ${
                showError ? 'opacity-100' : 'opacity-0'
              }`} 
            />
            
            {/* Hover overlay - only show in default state */}
            {!showError && !showSuccess && !loading && (
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-700 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
            )}
            
            {/* Button content */}
            <span className="relative z-10">
              {showError ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Login unsuccessful
                </span>
              ) : showSuccess ? (
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Login successful!
                </span>
              ) : loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </span>
            <BottomGradient />
          </Button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-slate-500">Or continue with</span>
          </div>
        </div>

        {/* Google Sign In */}
        <GoogleAuthButton mode="login" />
      </form>
    </>
  )
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-0 blur-sm transition duration-500 group-hover:opacity-100" />
    </>
  )
}
