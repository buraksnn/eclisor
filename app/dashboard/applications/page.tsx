'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Search, Download, Trash2, Eye, ExternalLink } from 'lucide-react'
import toast from 'react-hot-toast'
import type { ApplicationRequest } from '@/lib/db'

const genres = ['All', 'Pop', 'Hip-Hop', 'Electronic', 'Rock', 'R&B', 'Classical', 'Other']
const statuses = ['All', 'PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED']
const types = ['All', 'ARTIST', 'LABEL']

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-400',
  REVIEWED: 'bg-blue-500/20 text-blue-400',
  ACCEPTED: 'bg-green-500/20 text-green-400',
  REJECTED: 'bg-red-500/20 text-red-400',
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<ApplicationRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [genreFilter, setGenreFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [selectedApp, setSelectedApp] = useState<ApplicationRequest | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<number | number[] | null>(null)
  const [page, setPage] = useState(1)
  const perPage = 10

  const fetchApplications = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (statusFilter !== 'All') params.set('status', statusFilter)
      if (genreFilter !== 'All') params.set('genre', genreFilter)
      if (typeFilter !== 'All') params.set('type', typeFilter)

      const res = await fetch(`/api/admin/applications?${params}`)
      const data = await res.json()
      setApplications(data)
    } catch {
      toast.error('Failed to load applications')
    } finally {
      setIsLoading(false)
    }
  }, [search, statusFilter, genreFilter, typeFilter])

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      toast.success('Status updated')
      fetchApplications()
      if (selectedApp?.id === id) {
        setSelectedApp({ ...selectedApp, status: status as ApplicationRequest['status'] })
      }
    } catch {
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const ids = Array.isArray(deleteTarget) ? deleteTarget : [deleteTarget]
      await fetch('/api/admin/applications/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      })
      toast.success(`Deleted ${ids.length} application(s)`)
      setSelectedIds([])
      setDeleteDialogOpen(false)
      setDeleteTarget(null)
      setSelectedApp(null)
      fetchApplications()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleBulkStatusChange = async (status: string) => {
    try {
      await fetch('/api/admin/applications/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, status }),
      })
      toast.success(`Updated ${selectedIds.length} application(s)`)
      setSelectedIds([])
      fetchApplications()
    } catch {
      toast.error('Failed to update')
    }
  }

  const handleExportCSV = () => {
    const headers = ['Artist Name', 'Real Name', 'Email', 'Country', 'Genre', 'Type', 'Status', 'Date']
    const rows = applications.map((a) => [
      a.artist_name,
      a.real_name,
      a.email,
      a.country,
      a.genre,
      a.type,
      a.status,
      new Date(a.created_at).toLocaleDateString(),
    ])
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'applications.csv'
    a.click()
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedApps.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(paginatedApps.map((a) => a.id))
    }
  }

  const paginatedApps = applications.slice((page - 1) * perPage, page * perPage)
  const totalPages = Math.ceil(applications.length / perPage)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light">Applications</h1>
          <p className="text-muted-foreground font-light mt-1">{applications.length} total applications</p>
        </div>
        <Button onClick={handleExportCSV} variant="outline" className="gap-2">
          <Download size={16} />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-input/50"
            />
          </div>
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
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[150px] bg-input/50">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {types.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {selectedIds.length > 0 && (
          <div className="mt-4 flex items-center gap-4 pt-4 border-t border-border/50">
            <span className="text-sm text-muted-foreground">{selectedIds.length} selected</span>
            <Select onValueChange={handleBulkStatusChange}>
              <SelectTrigger className="w-[150px] bg-input/50">
                <SelectValue placeholder="Set status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.slice(1).map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setDeleteTarget(selectedIds)
                setDeleteDialogOpen(true)
              }}
            >
              <Trash2 size={14} className="mr-2" />
              Delete Selected
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left p-4 font-light">
                  <Checkbox
                    checked={selectedIds.length === paginatedApps.length && paginatedApps.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="text-left p-4 font-light text-muted-foreground text-sm">Artist</th>
                <th className="text-left p-4 font-light text-muted-foreground text-sm hidden md:table-cell">Email</th>
                <th className="text-left p-4 font-light text-muted-foreground text-sm hidden lg:table-cell">Country</th>
                <th className="text-left p-4 font-light text-muted-foreground text-sm hidden lg:table-cell">Genre</th>
                <th className="text-left p-4 font-light text-muted-foreground text-sm">Status</th>
                <th className="text-left p-4 font-light text-muted-foreground text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/30">
                    <td className="p-4"><Skeleton className="h-4 w-4" /></td>
                    <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="p-4 hidden md:table-cell"><Skeleton className="h-4 w-40" /></td>
                    <td className="p-4 hidden lg:table-cell"><Skeleton className="h-4 w-24" /></td>
                    <td className="p-4 hidden lg:table-cell"><Skeleton className="h-4 w-20" /></td>
                    <td className="p-4"><Skeleton className="h-6 w-20" /></td>
                    <td className="p-4"><Skeleton className="h-8 w-24" /></td>
                  </tr>
                ))
              ) : paginatedApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No applications found
                  </td>
                </tr>
              ) : (
                paginatedApps.map((app) => (
                  <tr key={app.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="p-4">
                      <Checkbox
                        checked={selectedIds.includes(app.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedIds([...selectedIds, app.id])
                          } else {
                            setSelectedIds(selectedIds.filter((id) => id !== app.id))
                          }
                        }}
                      />
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-light">{app.artist_name}</p>
                        <p className="text-xs text-muted-foreground">{app.real_name}</p>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">{app.email}</td>
                    <td className="p-4 text-sm text-muted-foreground hidden lg:table-cell">{app.country}</td>
                    <td className="p-4 text-sm text-muted-foreground hidden lg:table-cell">{app.genre}</td>
                    <td className="p-4">
                      <Select
                        value={app.status}
                        onValueChange={(value) => handleStatusChange(app.id, value)}
                      >
                        <SelectTrigger className={`w-[120px] h-8 text-xs ${statusColors[app.status]}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.slice(1).map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedApp(app)}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeleteTarget(app.id)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 size={16} className="text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Sheet */}
      <Sheet open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
        <SheetContent className="glass border-l-border/50 w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-light">Application Details</SheetTitle>
          </SheetHeader>
          {selectedApp && (
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Artist Name</p>
                  <p className="font-light">{selectedApp.artist_name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Real Name</p>
                  <p className="font-light">{selectedApp.real_name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="font-light">{selectedApp.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Country</p>
                  <p className="font-light">{selectedApp.country}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Genre</p>
                  <p className="font-light">{selectedApp.genre}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Type</p>
                  <p className="font-light">{selectedApp.type}</p>
                </div>
              </div>

              {selectedApp.music_link && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Music Link</p>
                  <a
                    href={selectedApp.music_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {selectedApp.music_link}
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}

              {selectedApp.social_link && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Social Link</p>
                  <a
                    href={selectedApp.social_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline flex items-center gap-1"
                  >
                    {selectedApp.social_link}
                    <ExternalLink size={12} />
                  </a>
                </div>
              )}

              {selectedApp.message && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Message</p>
                  <p className="font-light text-sm whitespace-pre-wrap">{selectedApp.message}</p>
                </div>
              )}

              <div>
                <p className="text-xs text-muted-foreground mb-2">Status</p>
                <Select
                  value={selectedApp.status}
                  onValueChange={(value) => handleStatusChange(selectedApp.id, value)}
                >
                  <SelectTrigger className={`w-full ${statusColors[selectedApp.status]}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.slice(1).map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="destructive"
                className="w-full"
                onClick={() => {
                  setDeleteTarget(selectedApp.id)
                  setDeleteDialogOpen(true)
                }}
              >
                <Trash2 size={16} className="mr-2" />
                Delete Application
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="glass">
          <DialogHeader>
            <DialogTitle className="font-light">Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {Array.isArray(deleteTarget) ? deleteTarget.length : 1} application(s)? This action cannot be undone.
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
