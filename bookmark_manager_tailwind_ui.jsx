import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Edit2, Search, PlusCircle, X } from 'lucide-react'
import api from './api'

export default function App() {
  const [bookmarks, setBookmarks] = useState([])
  const [q, setQ] = useState('')
  const [form, setForm] = useState({ title: '', url: '', category: 'General' })
  const [editing, setEditing] = useState(null)

  const fetchAll = async () => {
    const data = await api.getAll()
    setBookmarks(data)
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const search = async (e) => {
    e.preventDefault()
    if (!q) return fetchAll()
    const res = await api.search(q)
    setBookmarks(res)
  }

  const addBookmark = async (e) => {
    e.preventDefault()
    if (!form.title || !form.url) return alert('Title and URL required')
    if (editing) {
      await api.update(editing.id, form)
      setEditing(null)
      setForm({ title: '', url: '', category: 'General' })
      fetchAll()
      return
    }
    await api.add(form)
    setForm({ title: '', url: '', category: 'General' })
    fetchAll()
  }

  const remove = async (id) => {
    if (!confirm('Delete this bookmark?')) return
    await api.delete(id)
    fetchAll()
  }

  const startEdit = (bm) => {
    setEditing(bm)
    setForm({ title: bm.title, url: bm.url, category: bm.category })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800">
      <header className="border-b bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
          <h1 className="text-2xl font-bold tracking-tight">📚 Bookmark Manager</h1>
          <form onSubmit={search} className="flex items-center gap-2 w-full sm:w-auto">
            <Input placeholder="Search bookmarks..." value={q} onChange={(e) => setQ(e.target.value)} />
            <Button type="submit" variant="default" className="flex items-center gap-1"><Search size={16}/>Search</Button>
            <Button type="button" variant="outline" onClick={() => { setQ(''); fetchAll() }}>Clear</Button>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 space-y-8">
        <section>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>{editing ? 'Edit Bookmark' : 'Add New Bookmark'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={addBookmark} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <Input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                <Input placeholder="URL (https://...)" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} />
                <Select value={form.category} onValueChange={(val) => setForm({ ...form, category: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="General">General</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Stocks">Stocks</SelectItem>
                    <SelectItem value="Learning">Learning</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button type="submit" className="w-full flex items-center gap-1">
                    {editing ? <Edit2 size={16}/> : <PlusCircle size={16}/>}
                    {editing ? 'Update' : 'Add'}
                  </Button>
                  {editing && <Button type="button" variant="destructive" onClick={() => { setEditing(null); setForm({ title: '', url: '', category: 'General' }) }}><X size={16}/>Cancel</Button>}
                </div>
              </form>
            </CardContent>
          </Card>
        </section>

        <section>
          {bookmarks.length === 0 ? (
            <p className="text-center text-slate-500">No bookmarks yet.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bookmarks.map((b) => (
                <Card key={b.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold truncate">
                      <a href={b.url} target="_blank" rel="noreferrer" className="hover:underline">{b.title}</a>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-500 truncate mb-2">{b.url}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-700">{b.category}</span>
                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost" onClick={() => startEdit(b)}><Edit2 size={16}/></Button>
                        <Button size="icon" variant="ghost" onClick={() => remove(b.id)}><Trash2 size={16}/></Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
