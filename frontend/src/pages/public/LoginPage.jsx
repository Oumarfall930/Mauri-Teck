import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff, Ticket, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      if (user.role === 'ADMIN') navigate('/admin')
      else if (user.role === 'ORGANIZER') navigate('/organisateur')
      else if (user.role === 'AGENT') navigate('/agent')
      else navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Identifiants invalides')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#1a0a00] to-[#0a0a0a] flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{backgroundImage:'repeating-linear-gradient(45deg,#c8851a 0,#c8851a 1px,transparent 0,transparent 50%)',backgroundSize:'20px 20px'}}/>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-sahara-400 to-sahara-600 rounded-2xl flex items-center justify-center shadow-lg shadow-sahara-500/30">
              <Ticket className="w-7 h-7 text-white" />
            </div>
            <div className="text-left">
              <div className="text-2xl font-black text-white tracking-tight">MAURI</div>
              <div className="text-xs font-bold text-sahara-400 tracking-[0.3em] -mt-1">TICKET</div>
            </div>
          </Link>
          <p className="text-gray-400 mt-4 text-sm">Connectez-vous à votre espace</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-3xl p-8 shadow-2xl">
          {error && (
            <div className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                required
                placeholder="votre@email.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-sahara-400 focus:ring-1 focus:ring-sahara-400/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  required
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-sahara-400 focus:ring-1 focus:ring-sahara-400/50 transition-all"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-sahara-500 to-sahara-600 hover:from-sahara-400 hover:to-sahara-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-sahara-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connexion...
                </span>
              ) : 'Se connecter'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <Link to="/" className="text-sm text-gray-400 hover:text-sahara-400 transition-colors">
              ← Retour à l'accueil
            </Link>
          </div>
        </div>

        {/* Demo accounts */}
        <div className="mt-6 bg-white/3 border border-white/5 rounded-2xl p-4">
          <p className="text-xs text-gray-500 font-medium mb-3 uppercase tracking-wider">Comptes de démonstration</p>
          <div className="space-y-1.5 text-xs text-gray-400">
            <div className="flex justify-between"><span>Admin:</span><span className="text-gray-300 font-mono">admin@mauti.mr / admin123</span></div>
            <div className="flex justify-between"><span>Organisateur:</span><span className="text-gray-300 font-mono">org@mauti.mr / org123</span></div>
            <div className="flex justify-between"><span>Agent:</span><span className="text-gray-300 font-mono">agent@mauti.mr / agent123</span></div>
          </div>
        </div>
      </div>
    </div>
  )
}
