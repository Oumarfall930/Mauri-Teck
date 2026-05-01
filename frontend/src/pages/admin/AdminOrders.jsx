import { useState, useEffect } from 'react'
import api from '../../utils/api'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/admin/all').then(r => setOrders(r.data.orders || [])).finally(() => setLoading(false))
  }, [])

  const STATUS = {
    PENDING:          { label: 'En attente',       color: 'bg-yellow-500/20 text-yellow-300' },
    PAYMENT_UPLOADED: { label: 'Paiement reçu',    color: 'bg-blue-500/20 text-blue-300' },
    CONFIRMED:        { label: 'Confirmé',          color: 'bg-green-500/20 text-green-300' },
    CANCELLED:        { label: 'Annulé',            color: 'bg-red-500/20 text-red-300' },
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white">Toutes les commandes</h1>
        <p className="text-gray-400 text-sm mt-1">{orders.length} commande(s)</p>
      </div>
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-sahara-400 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="text-left px-5 py-3">N° Commande</th>
                  <th className="text-left px-5 py-3">Événement</th>
                  <th className="text-left px-5 py-3">Client</th>
                  <th className="text-left px-5 py-3">Montant</th>
                  <th className="text-left px-5 py-3">Statut</th>
                  <th className="text-left px-5 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map(order => {
                  const s = STATUS[order.status]
                  return (
                    <tr key={order.id} className="hover:bg-white/3 transition-colors">
                      <td className="px-5 py-4 text-xs font-mono text-sahara-400">{order.orderNumber}</td>
                      <td className="px-5 py-4 text-sm text-white">{order.event?.title}</td>
                      <td className="px-5 py-4 text-sm text-gray-400">{order.guestName || order.user?.name || '—'}</td>
                      <td className="px-5 py-4 text-sm font-bold text-white">{order.totalAmount?.toLocaleString()} MRU</td>
                      <td className="px-5 py-4"><span className={`text-xs font-bold px-3 py-1 rounded-full ${s?.color}`}>{s?.label}</span></td>
                      <td className="px-5 py-4 text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
