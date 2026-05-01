import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, Users, CalendarDays, ShoppingBag, Tag, LogOut, Ticket, Menu, X } from 'lucide-react'
import { useState } from 'react'

const NAV = [
  { to: '/admin',                end: true, icon: LayoutDashboard, label: 'Tableau de bord' },
  { to: '/admin/organisateurs',            icon: Users,            label: 'Organisateurs' },
  { to: '/admin/evenements',               icon: CalendarDays,     label: 'Événements' },
  { to: '/admin/commandes',                icon: ShoppingBag,      label: 'Commandes' },
  { to: '/admin/categories',               icon: Tag,              label: 'Catégories' },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-sahara-400 to-sahara-600 rounded-xl flex items-center justify-center">
            <Ticket className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-lg font-black text-white">MAURI-TICKET</div>
            <div className="text-xs text-sahara-400 font-bold tracking-wider">ADMIN</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV.map(({ to, end, icon: Icon, label }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive ? 'bg-sahara-500/20 text-sahara-400 border border-sahara-500/30' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }>
            <Icon className="w-4 h-4" />{label}
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-8 h-8 bg-sahara-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <LogOut className="w-4 h-4" />Déconnexion
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-[#080808] text-white overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 bg-white/3 border-r border-white/10 flex-col">
        <Sidebar />
      </aside>

      {/* Mobile sidebar */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 bg-[#0f0f0f] border-r border-white/10 flex flex-col">
            <Sidebar />
          </div>
          <div className="flex-1 bg-black/50" onClick={() => setOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/3">
          <button onClick={() => setOpen(true)}><Menu className="w-6 h-6" /></button>
          <span className="font-bold">Admin</span>
          <div className="w-6" />
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
