import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { CalendarDays, QrCode, LogOut, Ticket } from 'lucide-react'

export default function AgentLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Top bar */}
      <header className="bg-white/3 border-b border-white/10 px-4 py-3 flex items-center justify-between sticky top-0 z-40 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-sahara-400 to-sahara-600 rounded-lg flex items-center justify-center">
            <Ticket className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-black text-white text-sm">MAURI-TICKET</span>
            <span className="text-xs text-sahara-400 ml-2 font-bold">AGENT</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400 hidden sm:block">{user?.name}</span>
          <button onClick={() => { logout(); navigate('/') }} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-all">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
