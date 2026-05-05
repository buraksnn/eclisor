'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { registerUser, type RegisterState } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? 'Creating account...' : 'Create account'}
    </Button>
  )
}

export function RegisterForm() {
  const [state, formAction] = useFormState<RegisterState>(registerUser, { error: '' })

  return (
    <form action={formAction} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel>Artist or Label Name</FieldLabel>
          <Input name="name" placeholder="Your project name" required />
        </Field>
        <Field>
          <FieldLabel>Email</FieldLabel>
          <Input name="email" type="email" placeholder="you@label.com" required />
        </Field>
        <Field>
          <FieldLabel>Password</FieldLabel>
          <Input name="password" type="password" placeholder="Create a secure password" required />
        </Field>
      </FieldGroup>
      {state?.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}
      <SubmitButton />
    </form>
  )
}
