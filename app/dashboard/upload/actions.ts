'use server'

import path from 'path'
import { mkdir, writeFile } from 'fs/promises'
import { sql } from '@/lib/db'
import { requireAuth } from '@/lib/auth'

export type UploadState = {
  error?: string
  success?: boolean
}

export async function createRelease(_: UploadState, formData: FormData): Promise<UploadState> {
  const user = await requireAuth()
  const title = String(formData.get('title') || '').trim()
  const artist = String(formData.get('artist') || '').trim()
  const genre = String(formData.get('genre') || '').trim()
  const isrc = String(formData.get('isrc') || '').trim()
  const releaseDate = String(formData.get('releaseDate') || '').trim()
  const audioFile = formData.get('audio') as File | null
  const coverFile = formData.get('cover') as File | null

  if (!title || !artist || !genre || !isrc || !releaseDate) {
    return { error: 'Please complete all metadata fields.' }
  }
  if (!audioFile || audioFile.size === 0) {
    return { error: 'Please upload an audio file.' }
  }
  if (!coverFile || coverFile.size === 0) {
    return { error: 'Please upload a cover image.' }
  }
  if (!audioFile.type.startsWith('audio/')) {
    return { error: 'Audio file must be a valid audio format.' }
  }
  if (!coverFile.type.startsWith('image/')) {
    return { error: 'Cover art must be an image file.' }
  }
  const maxAudioSize = 50 * 1024 * 1024
  const maxCoverSize = 10 * 1024 * 1024
  if (audioFile.size > maxAudioSize) {
    return { error: 'Audio file must be smaller than 50MB.' }
  }
  if (coverFile.size > maxCoverSize) {
    return { error: 'Cover art must be smaller than 10MB.' }
  }

  const uploadRoot = path.join(process.cwd(), 'public', 'uploads')
  const audioDir = path.join(uploadRoot, 'audio')
  const coverDir = path.join(uploadRoot, 'covers')
  await mkdir(audioDir, { recursive: true })
  await mkdir(coverDir, { recursive: true })

  const allowedAudioExts = ['.mp3', '.wav', '.flac', '.m4a', '.aac']
  const allowedCoverExts = ['.jpg', '.jpeg', '.png', '.webp']
  const audioExt = path.extname(audioFile.name).toLowerCase()
  const coverExt = path.extname(coverFile.name).toLowerCase()
  if (!allowedAudioExts.includes(audioExt)) {
    return { error: 'Audio file must be MP3, WAV, FLAC, M4A, or AAC.' }
  }
  if (!allowedCoverExts.includes(coverExt)) {
    return { error: 'Cover art must be JPG, PNG, or WebP.' }
  }
  const audioName = `${crypto.randomUUID()}${audioExt}`
  const coverName = `${crypto.randomUUID()}${coverExt}`

  const audioPath = path.join(audioDir, audioName)
  const coverPath = path.join(coverDir, coverName)

  await writeFile(audioPath, Buffer.from(await audioFile.arrayBuffer()))
  await writeFile(coverPath, Buffer.from(await coverFile.arrayBuffer()))

  const audioUrl = `/uploads/audio/${audioName}`
  const coverUrl = `/uploads/covers/${coverName}`

  await sql`
    INSERT INTO releases (user_id, title, artist_name, genre, isrc, release_date, audio_url, cover_url, status)
    VALUES (${user.id}, ${title}, ${artist}, ${genre}, ${isrc}, ${releaseDate}, ${audioUrl}, ${coverUrl}, 'pending')
  `

  return { success: true }
}
