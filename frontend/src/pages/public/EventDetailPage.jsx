import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Calendar, MapPin, Users, Minus, Plus, ShoppingCart, ArrowLeft, Clock, Tag } from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import toast from 'react-hot-toast'
import Navbar from '../../components/common/Navbar'
import { useCart } from '../../context/CartContext'
import api from '../../utils/api'

export default function EventDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantities, setQuantities] = useState({})

  useEffect(() => {
    api.get(`/events/${id}`)
      .then(r => {
        setEvent(r.data.event)
        const q = {}
        r.data.event.ticketTypes.forEach(t => { q[t.id] = 0 })
        setQuantities(q)
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [id])

  const setQty = (id, v) => setQuantities(prev => ({ ...prev, [id]: Math.max(0, v) }))

  const handleAddToCart = (ticketType) => {
    const qty = quantities[ticketType.id]
    if (qty === 0) { toast.error('Sélectionnez au moins 1 ticket'); return }
    addToCart(event, ticketType, qty)
    toast.success(`${qty} ticket(s) ajouté(s) au panier 🎫`)
    setQty(ticketType.id, 0)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-2 border-sahara-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!event) return null

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        {/* Hero image */}
        <div className="relative h-80 md:h-[420px] bg-night-800">
          {event.image ? (
            <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-night-700 to-night-900 flex items-center justify-center">
              <div className="text-9xl">🎫</div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-night-900 via-night-900/50 to-transparent" />
          <div className="absolute top-6 left-6">
            <button onClick={() => navigate(-1)} className="glass rounded-full p-2 text-desert-300 hover:text-sahara-400 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute bottom-6 left-6 right-6">
            <span className="badge mb-3" style={{ background: `${event.category?.color}33`, color: event.category?.color }}>
              {event.category?.icon} {event.category?.name}
            </span>
            <h1 className="font-display font-black text-4xl md:text-5xl text-white leading-tight">{event.title}</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left - Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: <Calendar className="w-5 h-5" />, label: 'Date', val: format(new Date(event.date), "d MMMM yyyy", { locale: fr }) },
                  { icon: <Clock className="w-5 h-5" />, label: 'Heure', val: format(new Date(event.date), "HH:mm", { locale: fr }) },
                  { icon: <MapPin className="w-5 h-5" />, label: 'Lieu', val: `${event.location}, ${event.city}` }
                ].map((m, i) => (
                  <div key={i} className="card p-4 flex items-start gap-3">
                    <div className="text-sahara-400 mt-0.5">{m.icon}</div>
                    <div>
                      <div className="text-desert-500 text-xs uppercase tracking-wide">{m.label}</div>
                      <div className="text-desert-100 font-medium text-sm mt-0.5">{m.val}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="card p-6">
                <h2 className="font-display font-bold text-xl text-desert-50 mb-4">À propos de l'événement</h2>
                <p className="text-desert-300 leading-relaxed whitespace-pre-wrap">{event.description}</p>
              </div>

              {/* Organizer */}
              <div className="card p-6 flex items-center gap-4">
                {event.organizer?.logo ? (
                  <img src={event.organizer.logo} alt="" className="w-14 h-14 rounded-xl object-cover border-2 border-sahara-400/30" />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-night-700 flex items-center justify-center text-2xl">🏢</div>
                )}
                <div>
                  <div className="text-desert-500 text-xs uppercase tracking-wide">Organisé par</div>
                  <div className="font-display font-bold text-desert-50 text-lg">{event.organizer?.companyName}</div>
                  {event.organizer?.description && <p className="text-desert-400 text-sm mt-1">{event.organizer.description}</p>}
                </div>
              </div>
            </div>

            {/* Right - Tickets */}
            <div className="space-y-4">
              <h2 className="font-display font-bold text-2xl text-desert-50">Choisir vos tickets</h2>

              {event.ticketTypes?.length === 0 ? (
                <div className="card p-8 text-center text-desert-400">Aucun ticket disponible pour le moment</div>
              ) : (
                event.ticketTypes?.map(tt => (
                  <div key={tt.id} className="card p-5 border-l-4 hover:border-sahara-400/50 transition-all" style={{ borderLeftColor: tt.color || '#D4A853' }}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-desert-50">{tt.name}</h3>
                        {tt.description && <p className="text-desert-400 text-sm mt-1">{tt.description}</p>}
                      </div>
                      <div className="text-right">
                        <div className="font-display font-bold text-sahara-400 text-lg">{tt.price.toLocaleString()}</div>
                        <div className="text-desert-500 text-xs">MRU</div>
                      </div>
                    </div>

                    {tt.benefits?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {tt.benefits.map((b, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-night-700 text-desert-400">✓ {b}</span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-1 text-desert-500 text-xs mb-4">
                      <Users className="w-3 h-3" /> {tt.availableSeats} places restantes
                    </div>

                    {tt.availableSeats > 0 ? (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-night-700 rounded-lg">
                          <button onClick={() => setQty(tt.id, quantities[tt.id] - 1)} className="p-2 text-desert-300 hover:text-sahara-400 transition-colors">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-mono font-bold text-desert-100">{quantities[tt.id]}</span>
                          <button onClick={() => setQty(tt.id, quantities[tt.id] + 1)} disabled={quantities[tt.id] >= tt.availableSeats} className="p-2 text-desert-300 hover:text-sahara-400 transition-colors disabled:opacity-30">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button onClick={() => handleAddToCart(tt)} className="flex-1 btn-gold py-2 text-sm flex items-center justify-center gap-2">
                          <ShoppingCart className="w-4 h-4" />
                          Ajouter
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-2 bg-night-700 rounded-lg text-desert-500 text-sm">Complet</div>
                    )}
                  </div>
                ))
              )}

              <Link to="/panier" className="block w-full btn-outline text-center py-3 rounded-xl mt-4">
                <ShoppingCart className="w-4 h-4 inline mr-2" />
                Voir mon panier
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
