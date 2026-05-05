'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Spinner } from '@/components/ui/spinner'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        toast.error('Invalid credentials')
        return
      }

      router.push('/dashboard')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 relative">
      {/* Background */}
      <div className="absolute inset-0 aurora-bg opacity-20" />
      <div className="absolute inset-0 grain pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-light tracking-wider">
            ECLISOR
          </Link>
        </div>

        <div className="glass rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-light">Welcome back</h1>
          </div>

          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="bg-input/50 border-border/50"
                  autoComplete="email"
                />
              </Field>

              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className="bg-input/50 border-border/50"
                  autoComplete="current-password"
                />
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              disabled={isLoading || !formData.email || !formData.password}
              className="w-full mt-8 bg-primary hover:bg-primary/90"
            >
              {isLoading ? <Spinner className="mr-2" /> : null}
              {isLoading ? 'Signing in...' : 'Login'}
            </Button>
          </form>
        </div>

        <div className="text-center text-sm text-muted-foreground mt-6 space-y-2">
          <p>
            New to Eclisor?{' '}
            <Link href="/register" className="text-foreground underline underline-offset-4">
              Create an account
            </Link>
          </p>
          <Link href="/" className="hover:text-foreground transition-colors">
            &larr; Back to home
          </Link>
        </div>
      </motion.div>
    </main>
  )
}
