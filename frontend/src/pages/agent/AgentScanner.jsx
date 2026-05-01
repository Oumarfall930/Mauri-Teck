import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, QrCode, CheckCircle, XCircle, Camera, RotateCcw } from 'lucide-react'
import jsQR from 'jsqr'
import api from '../../utils/api'

export default function AgentScanner() {
  const { eventId } = useParams()
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const streamRef = useRef(null)

  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState(null) // { success, message, ticket }
  const [stats, setStats] = useState(null)
  const [eventInfo, setEventInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [cameraError, setCameraError] = useState('')

  useEffect(() => {
    fetchStats()
    fetchEventInfo()
    return () => stopCamera()
  }, [eventId])

  const fetchStats = () => {
    api.get(`/tickets/scan-stats/${eventId}`).then(r => setStats(r.data.stats))
  }

  const fetchEventInfo = () => {
    api.get(`/events/${eventId}`).then(r => setEventInfo(r.data.event)).finally(() => setLoading(false))
  }

  const startCamera = async () => {
    setCameraError('')
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      })
      streamRef.current = stream
      videoRef.current.srcObject = stream
      videoRef.current.play()
      setScanning(true)
      scanLoop()
    } catch (err) {
      setCameraError('Impossible d\'accéder à la caméra. Vérifiez les permissions.')
    }
  }

  const stopCamera = () => {
    if (animRef.current) cancelAnimationFrame(animRef.current)
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop())
    setScanning(false)
  }

  const scanLoop = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const tick = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height)
        if (code) {
          handleScan(code.data)
          return
        }
      }
      animRef.current = requestAnimationFrame(tick)
    }
    animRef.current = requestAnimationFrame(tick)
  }

  const handleScan = async (qrData) => {
    stopCamera()
    try {
      const { data } = await api.post('/tickets/scan', { qrData, eventId })
      setResult({ success: true, message: data.message, ticket: data.ticket })
      fetchStats()
    } catch (err) {
      setResult({ success: false, message: err.response?.data?.message || 'Erreur de scan' })
    }
  }

  const reset = () => {
    setResult(null)
    startCamera()
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-sahara-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link to="/agent" onClick={stopCamera} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-white">{eventInfo?.title}</h1>
          <p className="text-sm text-gray-400">{eventInfo?.location} · {new Date(eventInfo?.date).toLocaleDateString('fr-FR')}</p>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Entrés', value: stats.used, color: 'text-green-400' },
            { label: 'En attente', value: stats.active, color: 'text-blue-400' },
            { label: 'Total', value: stats.total, color: 'text-white' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <div className={`text-2xl font-black ${color}`}>{value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Scanner */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {/* Result display */}
        {result ? (
          <div className={`p-8 text-center ${result.success ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
            {result.success ? (
              <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
            ) : (
              <XCircle className="w-20 h-20 text-red-400 mx-auto mb-4" />
            )}
            <h2 className={`text-xl font-black mb-2 ${result.success ? 'text-green-300' : 'text-red-300'}`}>
              {result.success ? '✅ ACCÈS AUTORISÉ' : '❌ ACCÈS REFUSÉ'}
            </h2>
            <p className="text-gray-300 text-sm mb-2">{result.message}</p>
            {result.ticket && (
              <div className="mt-4 bg-white/5 rounded-xl p-4 text-left text-sm">
                <div className="font-mono text-xs text-sahara-400 mb-2">{result.ticket.ticketNumber}</div>
                <div className="text-gray-300">Type : <span className="text-white font-bold">{result.ticket.orderItem?.ticketType?.name}</span></div>
              </div>
            )}
            <button onClick={reset} className="mt-6 flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3 rounded-xl transition-colors mx-auto">
              <RotateCcw className="w-4 h-4" />Scanner suivant
            </button>
          </div>
        ) : (
          <div className="p-6">
            {/* Camera view */}
            <div className="relative aspect-square bg-black rounded-xl overflow-hidden mb-4">
              <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
              <canvas ref={canvasRef} className="hidden" />

              {/* Scan overlay */}
              {scanning && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    <div className="absolute inset-0 border-2 border-sahara-400/50 rounded-2xl" />
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-sahara-400 rounded-tl-xl" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-sahara-400 rounded-tr-xl" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-sahara-400 rounded-bl-xl" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-sahara-400 rounded-br-xl" />
                    {/* Scan line */}
                    <div className="absolute left-2 right-2 h-0.5 bg-sahara-400 opacity-80 animate-scan" style={{animation:'scan 2s linear infinite'}} />
                  </div>
                </div>
              )}

              {!scanning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                  <QrCode className="w-16 h-16 text-gray-500 mb-4" />
                  <p className="text-gray-400 text-sm text-center px-4">
                    {cameraError || 'Appuyez sur "Démarrer" pour activer le scanner'}
                  </p>
                </div>
              )}
            </div>

            {cameraError && <p className="text-red-400 text-xs text-center mb-4">{cameraError}</p>}

            <button onClick={scanning ? stopCamera : startCamera}
              className={`w-full font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                scanning ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400' : 'bg-sahara-500 hover:bg-sahara-400 text-white'
              }`}>
              <Camera className="w-5 h-5" />
              {scanning ? 'Arrêter le scanner' : 'Démarrer le scanner'}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scan {
          0% { top: 8px; }
          50% { top: calc(100% - 8px); }
          100% { top: 8px; }
        }
      `}</style>
    </div>
  )
}
