import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import api from '../../utils/api'

const ICONS = ['🎵','🎭','⚽','🏋️','🍽️','🎨','🎬','💼','🏥','📚','🎪','🌍']
const COLORS = ['#f59e0b','#3b82f6','#10b981','#ec4899','#8b5cf6','#f97316','#06b6d4','#14b8a6']

export default function AdminCategories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', icon: '🎵', color: '#f59e0b' })

  useEffect(() => { fetchCategories() }, [])

  const fetchCategories = async () => {
    setLoading(true)
    try { const { data } = await api.get('/categories'); setCategories(data.categories) }
    finally { setLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) await api.put(`/categories/${editing.id}`, form)
      else await api.post('/categories', form)
      setShowForm(false); setEditing(null)
      setForm({ name: '', description: '', icon: '🎵', color: '#f59e0b' })
      fetchCategories()
    } catch (err) { alert(err.response?.data?.message || 'Erreur') }
  }

  const handleEdit = (cat) => {
    setEditing(cat); setForm({ name: cat.name, description: cat.description || '', icon: cat.icon || '🎵', color: cat.color || '#f59e0b' })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette catégorie ?')) return
    try { await api.delete(`/categories/${id}`); fetchCategories() }
    catch (err) { alert(err.response?.data?.message || 'Erreur') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-white">Catégories</h1>
          <p className="text-gray-400 text-sm mt-1">{categories.length} catégorie(s)</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ name: '', description: '', icon: '🎵', color: '#f59e0b' }); setShowForm(true) }}
          className="flex items-center gap-2 bg-sahara-500 hover:bg-sahara-400 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm">
          <Plus className="w-4 h-4" />Nouvelle catégorie
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading ? (
          <div className="col-span-full flex justify-center py-12"><div className="w-6 h-6 border-2 border-sahara-400 border-t-transparent rounded-full animate-spin" /></div>
        ) : categories.map(cat => (
          <div key={cat.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: cat.color + '20' }}>
                {cat.icon}
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(cat)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(cat.id)} className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <h3 className="font-bold text-white">{cat.name}</h3>
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
            <div className="mt-3 text-xs text-gray-500">{cat._count?.events || 0} événement(s)</div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#111] border border-white/10 rounded-3xl p-6 w-full max-w-md">
            <h2 className="text-xl font-black text-white mb-6">{editing ? 'Modifier' : 'Créer'} une catégorie</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 font-medium block mb-1.5">Nom</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sahara-400 transition-all" />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-medium block mb-1.5">Description</label>
                <textarea rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-sahara-400 transition-all resize-none" />
              </div>
              <div>
                <label className="text-xs text-gray-400 font-medium block mb-2">Icône</label>
                <div className="flex flex-wrap gap-2">
                  {ICONS.map(icon => (
                    <button key={icon} type="button" onClick={() => setForm({...form, icon})}
                      className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all ${form.icon === icon ? 'bg-sahara-500/30 ring-2 ring-sahara-400' : 'bg-white/5 hover:bg-white/10'}`}>
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 font-medium block mb-2">Couleur</label>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(color => (
                    <button key={color} type="button" onClick={() => setForm({...form, color})}
                      className={`w-8 h-8 rounded-full transition-all ${form.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-[#111]' : ''}`}
                      style={{ backgroundColor: color }} />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-2.5 rounded-xl transition-colors text-sm">Annuler</button>
                <button type="submit" className="flex-1 bg-sahara-500 hover:bg-sahara-400 text-white font-bold py-2.5 rounded-xl transition-colors text-sm">
                  {editing ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
