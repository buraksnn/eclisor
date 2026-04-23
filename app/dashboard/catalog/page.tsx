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

const genres = ['All', 'Pop', 'Hip-Hop', 'Electronic', 'Rock', 'R&B', 'Classical', 'Other']
const artistGenres = ['Pop', 'Hip-Hop', 'Electronic', 'Rock', 'R&B', 'Classical', 'Other']
const statuses = ['All', 'ACTIVE', 'INACTIVE']

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
      toast.error('Failed to load artists')
    } finally {
      setIsLoading(false)
    }
  }, [search, genreFilter, statusFilter])

  useEffect(() => {
    fetchArtists()
  }, [fetchArtists])

  const handleSave = async () => {
    if (!editArtist.artist_name || !editArtist.genre || !editArtist.country) {
      toast.error('Please fill required fields')
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

      toast.success(editArtist.id ? 'Artist updated' : 'Artist added')
      setEditDialogOpen(false)
      setEditArtist(emptyArtist)
      fetchArtists()
    } catch {
      toast.error('Failed to save artist')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await fetch(`/api/admin/catalog/${deleteTarget}`, { method: 'DELETE' })
      toast.success('Artist deleted')
      setDeleteDialogOpen(false)
      setDeleteTarget(null)
      fetchArtists()
    } catch {
      toast.error('Failed to delete artist')
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light">Artist Catalog</h1>
          <p className="text-muted-foreground font-light mt-1">{artists.length} artists in catalog</p>
        </div>
        <Button onClick={() => openEditDialog()} className="gap-2 bg-primary hover:bg-primary/90">
          <Plus size={16} />
          Add Artist
        </Button>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search artists..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-input/50"
            />
          </div>
          <Select value={genreFilter} onValueChange={setGenreFilter}>
            <SelectTrigger className="w-[150px] bg-input/50">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent>
              {genres.map((g) => (
                <SelectItem key={g} value={g}>{g}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] bg-input/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Artist Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-card rounded-xl p-6">
              <Skeleton className="h-40 w-full rounded-lg mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : artists.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" strokeWidth={1} />
          <p className="text-muted-foreground">No artists in catalog</p>
          <Button
            onClick={() => openEditDialog()}
            className="mt-4 gap-2"
            variant="outline"
          >
            <Plus size={16} />
            Add Your First Artist
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {artists.map((artist) => (
            <div key={artist.id} className="glass-card rounded-xl overflow-hidden group">
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
                  <h3 className="text-lg font-light">{artist.artist_name}</h3>
                  <Badge className={artist.status === 'ACTIVE' ? 'bg-green-500/20 text-green-400' : 'bg-muted text-muted-foreground'}>
                    {artist.status}
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
                    Edit
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
        <DialogContent className="glass max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-light">
              {editArtist.id ? 'Edit Artist' : 'Add New Artist'}
            </DialogTitle>
          </DialogHeader>

          <FieldGroup className="mt-4">
            <Field>
              <FieldLabel>Artist Name *</FieldLabel>
              <Input
                value={editArtist.artist_name || ''}
                onChange={(e) => setEditArtist({ ...editArtist, artist_name: e.target.value })}
                placeholder="Artist name"
                className="bg-input/50"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Genre *</FieldLabel>
                <Select
                  value={editArtist.genre || ''}
                  onValueChange={(value) => setEditArtist({ ...editArtist, genre: value })}
                >
                  <SelectTrigger className="bg-input/50">
                    <SelectValue placeholder="Select genre" />
                  </SelectTrigger>
                  <SelectContent>
                    {artistGenres.map((g) => (
                      <SelectItem key={g} value={g}>{g}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Country *</FieldLabel>
                <Input
                  value={editArtist.country || ''}
                  onChange={(e) => setEditArtist({ ...editArtist, country: e.target.value })}
                  placeholder="Country"
                  className="bg-input/50"
                />
              </Field>
            </div>

            <Field>
              <FieldLabel>Bio</FieldLabel>
              <Textarea
                value={editArtist.bio || ''}
                onChange={(e) => setEditArtist({ ...editArtist, bio: e.target.value })}
                placeholder="Short bio..."
                rows={3}
                className="bg-input/50 resize-none"
              />
            </Field>

            <Field>
              <FieldLabel>Spotify Link</FieldLabel>
              <Input
                value={editArtist.spotify_link || ''}
                onChange={(e) => setEditArtist({ ...editArtist, spotify_link: e.target.value })}
                placeholder="https://open.spotify.com/..."
                className="bg-input/50"
              />
            </Field>

            <Field>
              <FieldLabel>Instagram Link</FieldLabel>
              <Input
                value={editArtist.instagram_link || ''}
                onChange={(e) => setEditArtist({ ...editArtist, instagram_link: e.target.value })}
                placeholder="https://instagram.com/..."
                className="bg-input/50"
              />
            </Field>

            <Field>
              <FieldLabel>Profile Image URL</FieldLabel>
              <Input
                value={editArtist.image_url || ''}
                onChange={(e) => setEditArtist({ ...editArtist, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="bg-input/50"
              />
            </Field>

            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel>Active Status</FieldLabel>
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
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving} className="bg-primary hover:bg-primary/90">
              {isSaving ? 'Saving...' : editArtist.id ? 'Update' : 'Add Artist'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle className="font-light">Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this artist? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
