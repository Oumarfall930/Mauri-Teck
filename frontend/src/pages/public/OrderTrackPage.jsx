import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Search, CheckCircle, Clock, XCircle, QrCode } from 'lucide-react'
import Navbar from '../../components/common/Navbar'
import api from '../../utils/api'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

const statusConfig = {
  PENDING:          { label: 'En attente',      color: 'text-yellow-400',  bg: 'bg-yellow-400/10', icon: <Clock className="w-4 h-4" /> },
  PAYMENT_UPLOADED: { label: 'Reçu envoyé',     color: 'text-blue-400',   bg: 'bg-blue-400/10',   icon: <Clock className="w-4 h-4" /> },
  CONFIRMED:        { label: 'Confirmé ✓',       color: 'text-green-400',  bg: 'bg-green-400/10',  icon: <CheckCircle className="w-4 h-4" /> },
  CANCELLED:        { label: 'Annulé',           color: 'text-red-400',    bg: 'bg-red-400/10',    icon: <XCircle className="w-4 h-4" /> },
}

function OrderDetail({ order }) {
  const st = statusConfig[order.status] || statusConfig.PENDING
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Status */}
      <div className={`card p-5 ${st.bg} border-0`}>
        <div className="flex items-center gap-3">
          <span className={st.color}>{st.icon}</span>
          <div>
            <p className="text-desert-400 text-sm">Statut de votre commande</p>
            <p className={`font-bold text-lg ${st.color}`}>{st.label}</p>
          </div>
        </div>
      </div>

      {/* Event */}
      <div className="card p-5">
        <h3 className="font-display font-bold text-xl text-desert-50 mb-1">{order.event?.title}</h3>
        <p className="text-desert-400 text-sm">{order.event?.location} · {format(new Date(order.event?.date), "d MMMM yyyy 'à' HH:mm", { locale: fr })}</p>
      </div>

      {/* Tickets - Show QR only if confirmed */}
      {order.status === 'CONFIRMED' && order.items?.map(item =>
        item.tickets?.map(ticket => (
          <div key={ticket.id} className="card p-6 text-center border border-sahara-400/30">
            <div className="ticket-card bg-night-700 rounded-xl p-6 mx-auto max-w-xs">
              <p className="text-desert-400 text-sm mb-1">{item.ticketType?.name}</p>
              <p className="font-mono text-xs text-desert-500 mb-4">{ticket.ticketNumber}</p>
              {ticket.qrCode && <img src={ticket.qrCode} alt="QR Code" className="w-48 h-48 mx-auto rounded-xl border-4 border-white" />}
              <div className={`mt-4 badge mx-auto ${ticket.status === 'USED' ? 'bg-red-400/20 text-red-400' : 'bg-green-400/20 text-green-400'}`}>
                {ticket.status === 'USED' ? '✗ Utilisé' : '✓ Valide'}
              </div>
            </div>
          </div>
        ))
      )}

      {order.status === 'PAYMENT_UPLOADED' && (
        <div className="card p-5 text-center">
          <QrCode className="w-12 h-12 text-night-600 mx-auto mb-3" />
          <p className="text-desert-300 font-semibold">En attente de validation</p>
          <p className="text-desert-500 text-sm mt-1">L'organisateur va valider votre paiement et vous enverrez votre QR code</p>
        </div>
      )}

      {/* Summary */}
      <div className="card p-5">
        <h4 className="font-semibold text-desert-200 mb-3">Détail commande</h4>
        {order.items?.map(item => (
          <div key={item.id} className="flex justify-between text-sm py-1.5">
            <span className="text-desert-400">{item.ticketType?.name} ×{item.quantity}</span>
            <span className="text-desert-200">{(item.unitPrice * item.quantity).toLocaleString()} MRU</span>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-3 pt-3 border-t border-night-700">
          <span className="text-desert-200">Total payé</span>
          <span className="text-sahara-400 font-display text-lg">{order.totalAmount?.toLocaleString()} MRU</span>
        </div>
      </div>
    </div>
  )
}

export default function OrderTrackPage() {
  const { orderNumber: paramNumber } = useParams()
  const [searchNumber, setSearchNumber] = useState(paramNumber || '')
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { if (paramNumber) handleSearch(paramNumber) }, [paramNumber])

  const handleSearch = async (num) => {
    const n = num || searchNumber
    if (!n) return
    setLoading(true); setError('')
    try {
      const { data } = await api.get(`/orders/track/${n}`)
      setOrder(data.order)
    } catch { setError('Commande introuvable. Vérifiez le numéro.'); setOrder(null) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 max-w-xl mx-auto px-4 pb-16">
        <h1 className="font-display font-bold text-3xl text-desert-50 mb-2">Suivre ma commande</h1>
        <p className="text-desert-400 mb-8">Entrez votre numéro de commande pour voir vos tickets</p>

        <div className="flex gap-2 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 w-4 h-4 text-desert-500" />
            <input className="input pl-10" placeholder="MT-XXXXX-XXXXX" value={searchNumber} onChange={e => setSearchNumber(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
          </div>
          <button onClick={() => handleSearch()} disabled={loading} className="btn-gold px-5 rounded-xl">
            {loading ? <div className="w-4 h-4 border-2 border-night-900 border-t-transparent rounded-full animate-spin" /> : 'Chercher'}
          </button>
        </div>

        {error && <div className="card p-4 text-red-400 text-center mb-6">{error}</div>}
        {order && <OrderDetail order={order} />}
      </div>
    </div>
  )
}
