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
    return { error: 'Lütfen tüm meta veri alanlarını doldurun.' }
  }
  if (!audioFile || audioFile.size === 0) {
    return { error: 'Lütfen bir ses dosyası yükleyin.' }
  }
  if (!coverFile || coverFile.size === 0) {
    return { error: 'Lütfen bir kapak görseli yükleyin.' }
  }
  if (!audioFile.type.startsWith('audio/')) {
    return { error: 'Ses dosyası geçerli bir ses formatı olmalıdır.' }
  }
  if (!coverFile.type.startsWith('image/')) {
    return { error: 'Kapak görseli bir resim dosyası olmalıdır.' }
  }
  const maxAudioSize = 50 * 1024 * 1024
  const maxCoverSize = 10 * 1024 * 1024
  if (audioFile.size > maxAudioSize) {
    return { error: 'Ses dosyası 50MB boyutundan küçük olmalıdır.' }
  }
  if (coverFile.size > maxCoverSize) {
    return { error: 'Kapak görseli 10MB boyutundan küçük olmalıdır.' }
  }

  const uploadRoot = path.join(process.cwd(), 'public', 'uploads')
  const audioDir = path.join(uploadRoot, 'audio')
  const coverDir = path.join(uploadRoot, 'covers')
  await mkdir(audioDir, { recursive: true })
  await mkdir(coverDir, { recursive: true })

  const audioExtMap: Record<string, string> = {
    'audio/mpeg': '.mp3',
    'audio/wav': '.wav',
    'audio/x-wav': '.wav',
    'audio/flac': '.flac',
    'audio/aac': '.aac',
    'audio/mp4': '.m4a',
    'audio/x-m4a': '.m4a',
  }
  const coverExtMap: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
  }
  const audioExt = audioExtMap[audioFile.type]
  const coverExt = coverExtMap[coverFile.type]
  if (!audioExt) {
    return { error: 'Ses dosyası MP3, WAV, FLAC, M4A veya AAC olmalıdır.' }
  }
  if (!coverExt) {
    return { error: 'Kapak görseli JPG, PNG veya WebP olmalıdır.' }
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
