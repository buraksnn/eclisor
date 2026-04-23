'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { Search, Trash2, Eye, Mail, MailOpen, Send, Pencil } from 'lucide-react'
import toast from 'react-hot-toast'
import type { ContactMessage } from '@/lib/db'

const subjects = ['All', 'General Inquiry', 'Partnership', 'Press', 'Other']
const readStatuses = ['All', 'Unread', 'Read']

export default function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('All')
  const [readFilter, setReadFilter] = useState('All')
  const [selectedIds, setSelectedIds] = useState<number[]>([])
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<number | number[] | null>(null)
  const [page, setPage] = useState(1)
  const perPage = 10

  // Mail compose state
  const [composeOpen, setComposeOpen] = useState(false)
  const [composeTo, setComposeTo] = useState('')
  const [composeSubject, setComposeSubject] = useState('')
  const [composeMessage, setComposeMessage] = useState('')
  const [isSending, setIsSending] = useState(false)

  const fetchMessages = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (subjectFilter !== 'All') params.set('subject', subjectFilter)
      if (readFilter !== 'All') params.set('read', readFilter === 'Read' ? 'true' : 'false')
      const res = await fetch(`/api/admin/messages?${params}`)
      const data = await res.json()
      setMessages(data)
    } catch {
      toast.error('Failed to load messages')
    } finally {
      setIsLoading(false)
    }
  }, [search, subjectFilter, readFilter])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  const handleToggleRead = async (id: number, isRead: boolean) => {
    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_read: isRead }),
      })
      toast.success(isRead ? 'Marked as read' : 'Marked as unread')
      fetchMessages()
      if (selectedMsg?.id === id) {
        setSelectedMsg({ ...selectedMsg, is_read: isRead })
      }
    } catch {
      toast.error('Failed to update')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const ids = Array.isArray(deleteTarget) ? deleteTarget : [deleteTarget]
      await fetch('/api/admin/messages/bulk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      })
      toast.success(`Deleted ${ids.length} message(s)`)
      setSelectedIds([])
      setDeleteDialogOpen(false)
      setDeleteTarget(null)
      setSelectedMsg(null)
      fetchMessages()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleBulkMarkRead = async () => {
    try {
      await fetch('/api/admin/messages/bulk', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds, is_read: true }),
      })
      toast.success(`Marked ${selectedIds.length} message(s) as read`)
      setSelectedIds([])
      fetchMessages()
    } catch {
      toast.error('Failed to update')
    }
  }

  const handleSendEmail = async () => {
    if (!composeTo || !composeSubject || !composeMessage) {
      toast.error('Please fill in all fields')
      return
    }
    setIsSending(true)
    try {
      const res = await fetch('/api/admin/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: composeTo,
          subject: composeSubject,
          message: composeMessage,
        }),
      })
      if (!res.ok) throw new Error()
      toast.success('Email sent successfully!')
      setComposeOpen(false)
      setComposeTo('')
      setComposeSubject('')
      setComposeMessage('')
    } catch {
      toast.error('Failed to send email')
    } finally {
      setIsSending(false)
    }
  }

  const openReply = (msg: ContactMessage) => {
    setComposeTo(msg.email)
    setComposeSubject(`Re: ${msg.subject}`)
    setComposeMessage('')
    setComposeOpen(true)
  }

  const openCompose = () => {
    setComposeTo('')
    setComposeSubject('')
    setComposeMessage('')
    setComposeOpen(true)
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedMsgs.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(paginatedMsgs.map((m) => m.id))
    }
  }

  const paginatedMsgs = messages.slice((page - 1) * perPage, page * perPage)
  const totalPages = Math.ceil(messages.length / perPage)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-light">Messages</h1>
          <p className="text-muted-foreground font-light mt-1">{messages.length} total messages</p>
        </div>
        <Button onClick={openCompose} className="bg-primary hover:bg-primary/90">
          <Pencil size={16} className="mr-2" />
          New Email
        </Button>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-input/50"
            />
          </div>
          <Select value={subjectFilter} onValueChange={setSubjectFilter}>
            <SelectTrigger className="w-[180px] bg-input/50">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={readFilter} onValueChange={setReadFilter}>
            <SelectTrigger className="w-[150px] bg-input/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {readStatuses.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedIds.length > 0 && (
          <div className="mt-4 flex items-center gap-4 pt-4 border-t border-border/50">
            <span className="text-sm text-muted-foreground">{selectedIds.length} selected</span>
            <Button variant="outline" size="sm" onClick={handleBulkMarkRead}>
              <MailOpen size={14} className="mr-2" />
              Mark as Read
            </Button>
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
                    checked={selectedIds.length === paginatedMsgs.length && paginatedMsgs.length > 0}
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="text-left p-4 font-light text-muted-foreground text-sm">Name</th>
                <th className="text-left p-4 font-light text-muted-foreground text-sm hidden md:table-cell">Email</th>
                <th className="text-left p-4 font-light text-muted-foreground text-sm hidden lg:table-cell">Subject</th>
                <th className="text-left p-4 font-light text-muted-foreground text-sm hidden lg:table-cell">Date</th>
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
                    <td className="p-4"><Skeleton className="h-6 w-16" /></td>
                    <td className="p-4"><Skeleton className="h-8 w-24" /></td>
                  </tr>
                ))
              ) : paginatedMsgs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    No messages found
                  </td>
                </tr>
              ) : (
                paginatedMsgs.map((msg) => (
                  <tr key={msg.id} className={`border-b border-border/30 hover:bg-muted/20 transition-colors ${!msg.is_read ? 'bg-primary/5' : ''}`}>
                    <td className="p-4">
                      <Checkbox
                        checked={selectedIds.includes(msg.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedIds([...selectedIds, msg.id])
                          } else {
                            setSelectedIds(selectedIds.filter((id) => id !== msg.id))
                          }
                        }}
                      />
                    </td>
                    <td className="p-4">
                      <p className={`${!msg.is_read ? 'font-medium' : 'font-light'}`}>{msg.full_name}</p>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground hidden md:table-cell">{msg.email}</td>
                    <td className="p-4 text-sm text-muted-foreground hidden lg:table-cell">{msg.subject}</td>
                    <td className="p-4 text-sm text-muted-foreground hidden lg:table-cell">
                      {new Date(msg.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <Badge className={msg.is_read ? 'bg-muted text-muted-foreground' : 'bg-primary/20 text-primary'}>
                        {msg.is_read ? 'Read' : 'Unread'}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedMsg(msg)
                            if (!msg.is_read) handleToggleRead(msg.id, true)
                          }}
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleRead(msg.id, !msg.is_read)}
                        >
                          {msg.is_read ? <Mail size={16} /> : <MailOpen size={16} />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openReply(msg)}
                        >
                          <Send size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeleteTarget(msg.id)
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

        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Sheet */}
      <Sheet open={!!selectedMsg} onOpenChange={(open) => !open && setSelectedMsg(null)}>
        <SheetContent className="glass border-l-border/50 w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="font-light">Message Details</SheetTitle>
          </SheetHeader>
          {selectedMsg && (
            <div className="mt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Full Name</p>
                  <p className="font-light">{selectedMsg.full_name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="font-light">{selectedMsg.email}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Subject</p>
                  <p className="font-light">{selectedMsg.subject}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Date</p>
                  <p className="font-light">{new Date(selectedMsg.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Message</p>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="font-light text-sm whitespace-pre-wrap">{selectedMsg.message}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleToggleRead(selectedMsg.id, !selectedMsg.is_read)}
                >
                  {selectedMsg.is_read ? <Mail size={16} className="mr-2" /> : <MailOpen size={16} className="mr-2" />}
                  {selectedMsg.is_read ? 'Mark Unread' : 'Mark Read'}
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90"
                  onClick={() => {
                    openReply(selectedMsg)
                    setSelectedMsg(null)
                  }}
                >
                  <Send size={16} className="mr-2" />
                  Reply
                </Button>
              </div>

              <Button
                variant="destructive"
                className="w-full"
                onClick={() => {
                  setDeleteTarget(selectedMsg.id)
                  setDeleteDialogOpen(true)
                }}
              >
                <Trash2 size={16} className="mr-2" />
                Delete Message
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Compose / Reply Dialog */}
      <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
        <DialogContent className="glass sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-light">
              {composeTo ? 'Reply' : 'New Email'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1">To</p>
              <Input
                placeholder="email@example.com"
                value={composeTo}
                onChange={(e) => setComposeTo(e.target.value)}
                className="bg-input/50"
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Subject</p>
              <Input
                placeholder="Subject"
                value={composeSubject}
                onChange={(e) => setComposeSubject(e.target.value)}
                className="bg-input/50"
              />
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Message</p>
              <Textarea
                placeholder="Write your message..."
                value={composeMessage}
                onChange={(e) => setComposeMessage(e.target.value)}
                className="bg-input/50 min-h-[160px] resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setComposeOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={handleSendEmail}
              disabled={isSending}
            >
              <Send size={16} className="mr-2" />
              {isSending ? 'Sending...' : 'Send'}
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
              Are you sure you want to delete {Array.isArray(deleteTarget) ? deleteTarget.length : 1} message(s)? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
