'use client'

import { useEffect, useMemo, useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { createRelease, type UploadState } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? 'Submitting release...' : 'Submit for approval'}
    </Button>
  )
}

export default function UploadPage() {
  const [state, formAction] = useFormState<UploadState>(createRelease, { error: '', success: false })
  const [step, setStep] = useState(1)
  const [metadata, setMetadata] = useState({
    title: '',
    artist: '',
    genre: '',
    isrc: '',
    releaseDate: '',
  })
  const [audioName, setAudioName] = useState('')
  const [coverPreview, setCoverPreview] = useState('')

  const metadataComplete = useMemo(
    () => Object.values(metadata).every((value) => value.trim().length > 0),
    [metadata],
  )

  useEffect(() => {
    return () => {
      if (coverPreview) {
        URL.revokeObjectURL(coverPreview)
      }
    }
  }, [coverPreview])

  const fileComplete = useMemo(() => audioName.length > 0 && coverPreview.length > 0, [audioName, coverPreview])

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Release Upload</p>
        <h1 className="mt-4 text-3xl md:text-5xl font-semibold">Submit your next release</h1>
        <p className="mt-3 text-muted-foreground">
          Complete the steps below and send your track to the admin team for approval.
        </p>
      </div>

      <div className="flex flex-wrap gap-4">
        {['Metadata', 'Files', 'Review'].map((label, index) => {
          const current = index + 1
          return (
            <div
              key={label}
              className={`flex items-center gap-3 px-4 py-2 border rounded-full text-sm font-semibold ${
                step === current ? 'border-foreground text-foreground' : 'border-border/80 text-muted-foreground'
              }`}
            >
              <span className="text-xs">{String(current).padStart(2, '0')}</span>
              {label}
            </div>
          )
        })}
      </div>

      <form action={formAction} className="space-y-8" encType="multipart/form-data">
        <div className={step === 1 ? 'block' : 'hidden'}>
          <div className="glass-card rounded-2xl p-8 border border-border/80">
            <FieldGroup>
              <Field>
                <FieldLabel>Track Title</FieldLabel>
                <Input
                  name="title"
                  value={metadata.title}
                  onChange={(event) => setMetadata({ ...metadata, title: event.target.value })}
                  placeholder="Enter track name"
                  required
                />
              </Field>
              <Field>
                <FieldLabel>Artist Name</FieldLabel>
                <Input
                  name="artist"
                  value={metadata.artist}
                  onChange={(event) => setMetadata({ ...metadata, artist: event.target.value })}
                  placeholder="Primary artist"
                  required
                />
              </Field>
              <div className="grid gap-6 md:grid-cols-2">
                <Field>
                  <FieldLabel>Genre</FieldLabel>
                  <Input
                    name="genre"
                    value={metadata.genre}
                    onChange={(event) => setMetadata({ ...metadata, genre: event.target.value })}
                    placeholder="Pop, Electronic, Hip-Hop"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel>ISRC</FieldLabel>
                  <Input
                    name="isrc"
                    value={metadata.isrc}
                    onChange={(event) => setMetadata({ ...metadata, isrc: event.target.value })}
                    placeholder="TRABC2400001"
                    required
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel>Release Date</FieldLabel>
                <Input
                  name="releaseDate"
                  type="date"
                  value={metadata.releaseDate}
                  onChange={(event) => setMetadata({ ...metadata, releaseDate: event.target.value })}
                  required
                />
              </Field>
            </FieldGroup>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" size="lg" disabled={!metadataComplete} onClick={() => setStep(2)}>
              Continue
            </Button>
          </div>
        </div>

        <div className={step === 2 ? 'block' : 'hidden'}>
          <div className="glass-card rounded-2xl p-8 border border-border/80 space-y-6">
            <FieldGroup>
              <Field>
                <FieldLabel>Audio File</FieldLabel>
                <Input
                  name="audio"
                  type="file"
                  accept="audio/*"
                  required
                  onChange={(event) => setAudioName(event.target.files?.[0]?.name || '')}
                />
                {audioName ? <p className="text-xs text-muted-foreground mt-2">Selected: {audioName}</p> : null}
              </Field>
              <Field>
                <FieldLabel>Cover Art</FieldLabel>
                <Input
                  name="cover"
                  type="file"
                  accept="image/*"
                  required
                  onChange={(event) => {
                    const file = event.target.files?.[0]
                    if (coverPreview) {
                      URL.revokeObjectURL(coverPreview)
                    }
                    setCoverPreview(file ? URL.createObjectURL(file) : '')
                  }}
                />
                {coverPreview ? (
                  <img src={coverPreview} alt="Cover preview" className="mt-4 h-40 w-40 object-cover border" />
                ) : null}
              </Field>
            </FieldGroup>
          </div>
          <div className="mt-6 flex justify-between gap-3">
            <Button type="button" variant="outline" size="lg" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button type="button" size="lg" disabled={!fileComplete} onClick={() => setStep(3)}>
              Review
            </Button>
          </div>
        </div>

        <div className={step === 3 ? 'block' : 'hidden'}>
          <div className="glass-card rounded-2xl p-8 border border-border/80 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Review</p>
              <h2 className="mt-3 text-2xl font-semibold">Confirm release details</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ['Title', metadata.title],
                ['Artist', metadata.artist],
                ['Genre', metadata.genre],
                ['ISRC', metadata.isrc],
                ['Release Date', metadata.releaseDate],
                ['Audio File', audioName || 'Not selected'],
              ].map(([label, value]) => (
                <div key={label} className="border border-border/80 rounded-lg p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
                  <p className="mt-2 font-semibold text-sm">{value}</p>
                </div>
              ))}
              {coverPreview ? (
                <div className="border border-border/80 rounded-lg p-4 flex items-center gap-4">
                  <img src={coverPreview} alt="Cover preview" className="h-20 w-20 object-cover border" />
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Cover Art</p>
                    <p className="mt-2 font-semibold text-sm">Ready</p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
          {state?.error ? <p className="text-sm text-destructive mt-4">{state.error}</p> : null}
          {state?.success ? (
            <p className="text-sm text-foreground mt-4">
              Release submitted. You can track approval in the admin queue.
            </p>
          ) : null}
          <div className="mt-6 flex justify-between gap-3">
            <Button type="button" variant="outline" size="lg" onClick={() => setStep(2)}>
              Back
            </Button>
            <SubmitButton />
          </div>
        </div>
      </form>
    </div>
  )
}
