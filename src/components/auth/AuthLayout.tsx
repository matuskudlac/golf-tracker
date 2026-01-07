import Image from 'next/image'
import Link from 'next/link'
import { ReactNode } from 'react'
import { FlipWords } from '@/components/ui/flip-words'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left Side - Image */}
      <div className="relative hidden w-1/2 lg:block">
        <Image
          src="/login-bg.png"
          alt="Golf course at sunset"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/50" />
        
        {/* Logo */}
        <div className="absolute left-8 top-8">
          <h1 className="text-2xl font-bold text-white">Golf Tracker</h1>
        </div>

        {/* Tagline */}
        <div className="absolute bottom-12 left-8 right-8">
          <h2 className="text-4xl font-bold leading-tight text-white">
            Track Every<FlipWords words={["Shot", "Round"]} duration={1500} className="text-white" />
          </h2>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex w-full items-center justify-center bg-white px-8 lg:w-1/2">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="text-center lg:hidden">
            <h1 className="text-2xl font-bold text-slate-900">Golf Tracker</h1>
          </div>

          {/* Form Content (passed as children) */}
          {children}
        </div>
      </div>
    </div>
  )
}
