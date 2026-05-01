import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Ticket, Calendar, MapPin, QrCode, Download, ChevronRight } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import api from '../../utils/api'

const STATUS_MAP = {
  PENDING:          { label: 'En attente',       color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' },
  PAYMENT_UPLOADED: { label: 'Paiement envoyé',  color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  CONFIRMED:        { label: 'Confirmé',          color: 'bg-green-500/20 text-green-300 border-green-500/30' },
  CANCELLED:        { label: 'Annulé',            color: 'bg-red-500/20 text-red-300 border-red-500/30' },
}

export default function MyTicketsPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    api.get('/orders/my')
      .then(r => setOrders(r.data.orders))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-[#080808]">
      <Navbar />
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-sahara-400 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-black">Mes Tickets</h1>
          <p className="text-gray-400 mt-1">Gérez vos commandes et tickets</p>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white/3 rounded-3xl border border-white/5">
            <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400">Aucune commande</h3>
            <p className="text-gray-500 mt-2 mb-6">Vous n'avez pas encore acheté de tickets</p>
            <Link to="/" className="inline-flex items-center gap-2 bg-sahara-500 hover:bg-sahara-400 text-white font-bold px-6 py-3 rounded-xl transition-colors">
              Explorer les événements
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const s = STATUS_MAP[order.status] || STATUS_MAP.PENDING
              return (
                <div key={order.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-sahara-500/30 transition-all">
                  <div className="p-5 flex items-start gap-4">
                    {order.event.image ? (
                      <img src={`http://localhost:5000${order.event.image}`} className="w-20 h-20 rounded-xl object-cover shrink-0" />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-sahara-500/20 to-sahara-600/20 rounded-xl flex items-center justify-center shrink-0">
                        <Ticket className="w-8 h-8 text-sahara-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-white truncate">{order.event.title}</h3>
                          <p className="text-xs text-gray-500 mt-0.5 font-mono">{order.orderNumber}</p>
                        </div>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full border shrink-0 ${s.color}`}>{s.label}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(order.event.date).toLocaleDateString('fr-FR', { day:'numeric', month:'long', year:'numeric' })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {order.event.location}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sahara-400 font-bold">{order.totalAmount.toLocaleString()} MRU</span>
                        <button onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                          className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors">
                          {selectedOrder?.id === order.id ? 'Masquer' : 'Voir tickets'}
                          <ChevronRight className={`w-3.5 h-3.5 transition-transform ${selectedOrder?.id === order.id ? 'rotate-90' : ''}`} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tickets list */}
                  {selectedOrder?.id === order.id && order.status === 'CONFIRMED' && (
                    <div className="border-t border-white/10 p-5">
                      <h4 className="text-sm font-bold text-gray-300 mb-4">Vos tickets QR</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {order.items.flatMap(item => item.tickets).map(ticket => (
                          <div key={ticket.id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col items-center gap-3">
                            <div className="text-xs font-mono text-sahara-400 font-bold">{ticket.ticketNumber}</div>
                            {ticket.qrCode && (
                              <img src={ticket.qrCode} alt="QR Code" className="w-32 h-32 rounded-lg bg-white p-1" />
                            )}
                            <div className={`text-xs font-bold px-3 py-1 rounded-full border ${ticket.status === 'USED' ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-green-500/20 text-green-300 border-green-500/30'}`}>
                              {ticket.status === 'USED' ? '✓ Utilisé' : '✓ Valide'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Payment proof upload for pending orders */}
                  {selectedOrder?.id === order.id && order.status === 'PENDING' && (
                    <div className="border-t border-white/10 p-5">
                      <Link to={`/checkout?order=${order.id}`} className="inline-flex items-center gap-2 bg-sahara-500 hover:bg-sahara-400 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">
                        Uploader le reçu de paiement
                      </Link>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
