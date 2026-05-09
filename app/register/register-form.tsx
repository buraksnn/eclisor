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
      {pending ? 'Hesap oluşturuluyor...' : 'Hesap oluştur'}
    </Button>
  )
}

export function RegisterForm() {
  const [state, formAction] = useFormState<RegisterState>(registerUser, { error: '' })

  return (
    <form action={formAction} className="space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel>Sanatçı veya Label Adı</FieldLabel>
          <Input name="name" placeholder="Proje adınız" required />
        </Field>
        <Field>
          <FieldLabel>E-posta</FieldLabel>
          <Input name="email" type="email" placeholder="ornek@label.com" required />
        </Field>
        <Field>
          <FieldLabel>Şifre</FieldLabel>
          <Input name="password" type="password" placeholder="Güçlü bir şifre oluştur" required />
        </Field>
      </FieldGroup>
      {state?.error ? (
        <p className="text-sm text-destructive">{state.error}</p>
      ) : null}
      <SubmitButton />
    </form>
  )
}
