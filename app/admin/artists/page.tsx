'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Switch } from '@/components/ui/switch'
import { Search, Plus, Pencil, Trash2, Music } from 'lucide-react'
import toast from 'react-hot-toast'
import type { ArtistCatalog } from '@/lib/db'

const genres = [
  { value: 'All', label: 'Tümü' },
  { value: 'Pop', label: 'Pop' },
  { value: 'Hip-Hop', label: 'Hip-Hop' },
  { value: 'Electronic', label: 'Elektronik' },
  { value: 'Rock', label: 'Rock' },
  { value: 'R&B', label: 'R&B' },
  { value: 'Classical', label: 'Klasik' },
  { value: 'Other', label: 'Diğer' },
]
const artistGenres = [
  { value: 'Pop', label: 'Pop' },
  { value: 'Hip-Hop', label: 'Hip-Hop' },
  { value: 'Electronic', label: 'Elektronik' },
  { value: 'Rock', label: 'Rock' },
  { value: 'R&B', label: 'R&B' },
  { value: 'Classical', label: 'Klasik' },
  { value: 'Other', label: 'Diğer' },
]
const statuses = [
  { value: 'All', label: 'Tümü' },
  { value: 'ACTIVE', label: 'Aktif' },
  { value: 'INACTIVE', label: 'Pasif' },
]

const statusLabels: Record<string, string> = {
  ACTIVE: 'Aktif',
  INACTIVE: 'Pasif',
}

const emptyArtist = {
  artist_name: '',
  genre: '',
  country: '',
  bio: '',
  spotify_link: '',
  instagram_link: '',
  image_url: '',
  status: 'ACTIVE' as const,
}

export default function CatalogPage() {
  const [artists, setArtists] = useState<ArtistCatalog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [genreFilter, setGenreFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editArtist, setEditArtist] = useState<Partial<ArtistCatalog>>(emptyArtist)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const fetchArtists = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (genreFilter !== 'All') params.set('genre', genreFilter)
      if (statusFilter !== 'All') params.set('status', statusFilter)

      const res = await fetch(`/api/admin/catalog?${params}`)
      const data = await res.json()
      setArtists(data)
    } catch {
      toast.error('Sanatçılar yüklenemedi')
    } finally {
      setIsLoading(false)
    }
  }, [search, genreFilter, statusFilter])

  useEffect(() => {
    fetchArtists()
  }, [fetchArtists])

  const handleSave = async () => {
    if (!editArtist.artist_name || !editArtist.genre || !editArtist.country) {
      toast.error('Lütfen gerekli alanları doldurun')
      return
    }

    setIsSaving(true)
    try {
      const method = editArtist.id ? 'PUT' : 'POST'
      const url = editArtist.id ? `/api/admin/catalog/${editArtist.id}` : '/api/admin/catalog'

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editArtist),
      })

      toast.success(editArtist.id ? 'Sanatçı güncellendi' : 'Sanatçı eklendi')
      setEditDialogOpen(false)
      setEditArtist(emptyArtist)
      fetchArtists()
    } catch {
      toast.error('Sanatçı kaydedilemedi')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await fetch(`/api/admin/catalog/${deleteTarget}`, { method: 'DELETE' })
      toast.success('Sanatçı silindi')
      setDeleteDialogOpen(false)
      setDeleteTarget(null)
      fetchArtists()
    } catch {
      toast.error('Sanatçı silinemedi')
    }
  }

  const openEditDialog = (artist?: ArtistCatalog) => {
    if (artist) {
      setEditArtist({
        id: artist.id,
        artist_name: artist.artist_name,
        genre: artist.genre,
        country: artist.country,
        bio: artist.bio || '',
        spotify_link: artist.spotify_link || '',
        instagram_link: artist.instagram_link || '',
        image_url: artist.image_url || '',
        status: artist.status,
      })
    } else {
      setEditArtist(emptyArtist)
    }
    setEditDialogOpen(true)
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">Yönetim</p>
          <h1 className="mt-3 text-3xl md:text-5xl font-semibold">Sanatçı Listesi</h1>
          <p className="text-muted-foreground mt-2">{artists.length} sanatçı kayıtlı</p>
        </div>
        <Button onClick={() => openEditDialog()} className="gap-2">
          <Plus size={16} />
          Sanatçı Ekle
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border/80 rounded-2xl p-6">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Sanatçı ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={genreFilter} onValueChange={setGenreFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Tür" />
            </SelectTrigger>
            <SelectContent>
              {genres.map((genreOption) => (
                <SelectItem key={genreOption.value} value={genreOption.value}>{genreOption.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Durum" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((status) => (
                <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Artist Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border border-border/80 rounded-2xl p-6">
              <Skeleton className="h-40 w-full rounded-lg mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : artists.length === 0 ? (
        <div className="bg-card border border-border/80 rounded-2xl p-12 text-center">
          <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" strokeWidth={1} />
          <p className="text-muted-foreground">Katalogda sanatçı yok</p>
          <Button
            onClick={() => openEditDialog()}
            className="mt-4 gap-2"
            variant="outline"
          >
            <Plus size={16} />
            İlk Sanatçıyı Ekle
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {artists.map((artist) => (
            <div key={artist.id} className="bg-card border border-border/80 rounded-2xl overflow-hidden group">
              {artist.image_url ? (
                <div
                  className="h-40 bg-cover bg-center"
                  style={{ backgroundImage: `url(${artist.image_url})` }}
                />
              ) : (
                <div className="h-40 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Music className="h-12 w-12 text-primary/40" strokeWidth={1} />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold">{artist.artist_name}</h3>
                  <Badge className={artist.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'}>
                    {statusLabels[artist.status] || artist.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{artist.genre}</p>
                <p className="text-sm text-muted-foreground mb-4">{artist.country}</p>
                {artist.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{artist.bio}</p>
                )}
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openEditDialog(artist)}
                    >
                      <Pencil size={14} className="mr-2" />
                      Düzenle
                    </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDeleteTarget(artist.id)
                      setDeleteDialogOpen(true)
                    }}
                  >
                    <Trash2 size={14} className="text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit/Add Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-semibold">
              {editArtist.id ? 'Sanatçı Düzenle' : 'Yeni Sanatçı'}
            </DialogTitle>
          </DialogHeader>

          <FieldGroup className="mt-4">
            <Field>
              <FieldLabel>Sanatçı Adı *</FieldLabel>
              <Input
                value={editArtist.artist_name || ''}
                onChange={(e) => setEditArtist({ ...editArtist, artist_name: e.target.value })}
                placeholder="Sanatçı adı"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Tür *</FieldLabel>
                <Select
                  value={editArtist.genre || ''}
                  onValueChange={(value) => setEditArtist({ ...editArtist, genre: value })}
                >
                    <SelectTrigger>
                      <SelectValue placeholder="Tür seçin" />
                    </SelectTrigger>
                  <SelectContent>
                    {artistGenres.map((genreOption) => (
                      <SelectItem key={genreOption.value} value={genreOption.value}>{genreOption.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Ülke *</FieldLabel>
                <Input
                  value={editArtist.country || ''}
                  onChange={(e) => setEditArtist({ ...editArtist, country: e.target.value })}
                  placeholder="Ülke"
                />
              </Field>
            </div>

            <Field>
              <FieldLabel>Bio</FieldLabel>
              <Textarea
                value={editArtist.bio || ''}
                onChange={(e) => setEditArtist({ ...editArtist, bio: e.target.value })}
                placeholder="Kısa bio..."
                rows={3}
                className="resize-none"
              />
            </Field>

            <Field>
              <FieldLabel>Spotify Linki</FieldLabel>
              <Input
                value={editArtist.spotify_link || ''}
                onChange={(e) => setEditArtist({ ...editArtist, spotify_link: e.target.value })}
                placeholder="https://open.spotify.com/..."
              />
            </Field>

            <Field>
              <FieldLabel>Instagram Linki</FieldLabel>
              <Input
                value={editArtist.instagram_link || ''}
                onChange={(e) => setEditArtist({ ...editArtist, instagram_link: e.target.value })}
                placeholder="https://instagram.com/..."
              />
            </Field>

            <Field>
              <FieldLabel>Profil Görseli URL</FieldLabel>
              <Input
                value={editArtist.image_url || ''}
                onChange={(e) => setEditArtist({ ...editArtist, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </Field>

            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel>Aktif Durum</FieldLabel>
                <Switch
                  checked={editArtist.status === 'ACTIVE'}
                  onCheckedChange={(checked) =>
                    setEditArtist({ ...editArtist, status: checked ? 'ACTIVE' : 'INACTIVE' })
                  }
                />
              </div>
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Vazgeç
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? 'Kaydediliyor...' : editArtist.id ? 'Güncelle' : 'Ekle'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-semibold">Silme Onayı</DialogTitle>
            <DialogDescription>
              Bu sanatçıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Vazgeç
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
