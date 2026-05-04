import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCode, FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaRocket } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const API = 'http://localhost:8000/api/auth'

const particles = Array.from({ length: 18 }, (_, i) => i)

export default function AuthPage({ onSuccess }) {
  const { login } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (mode === 'signup') {
      if (!form.username.trim() || !form.email.trim() || !form.password) {
        setError('All fields are required.')
        return
      }
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match.')
        return
      }
      if (form.password.length < 6) {
        setError('Password must be at least 6 characters.')
        return
      }
    } else {
      if (!form.username.trim() || !form.password) {
        setError('Username and password are required.')
        return
      }
    }

    setLoading(true)
    try {
      const endpoint = mode === 'login' ? `${API}/login` : `${API}/register`
      const body =
        mode === 'login'
          ? { username: form.username, password: form.password }
          : { username: form.username, email: form.email, password: form.password }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.detail || 'Something went wrong. Please try again.')
        return
      }

      if (mode === 'signup') {
        setSuccess('Account created! Logging you in…')
        login(data.user)
        setTimeout(() => onSuccess?.(), 800)
      } else {
        login(data.user)
        onSuccess?.()
      }
    } catch {
      setError('Unable to reach the server. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (m) => {
    setMode(m)
    setError('')
    setSuccess('')
    setForm({ username: '', email: '', password: '', confirmPassword: '' })
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0e1a]">
      {/* Animated background particles */}
      {particles.map((p) => (
        <motion.div
          key={p}
          className="absolute rounded-full opacity-20"
          style={{
            width: Math.random() * 80 + 20,
            height: Math.random() * 80 + 20,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: `hsl(${210 + p * 15}, 80%, 60%)`,
            filter: 'blur(40px)',
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 4 + p * 0.3,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p * 0.2,
          }}
        />
      ))}

      {/* Gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0d1b3e] via-[#0a0e1a] to-[#0d2340] opacity-90" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(99,179,237,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,179,237,1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl mb-4">
            <FaCode className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Code<span className="text-blue-400">Reviewer</span>
          </h1>
          <p className="text-slate-400 mt-1 text-sm">AI-powered code quality analysis</p>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
          style={{ background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(20px)' }}
        >
          {/* Tabs */}
          <div className="flex border-b border-white/10">
            {['login', 'signup'].map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-4 text-sm font-semibold tracking-wide transition-all ${
                  mode === m
                    ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/5'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {m === 'login' ? '🔑 Sign In' : '✨ Create Account'}
              </button>
            ))}
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
                transition={{ duration: 0.25 }}
              >
                <h2 className="text-xl font-bold text-white mb-1">
                  {mode === 'login' ? 'Welcome back' : 'Create your account'}
                </h2>
                <p className="text-slate-400 text-sm mb-6">
                  {mode === 'login'
                    ? 'Sign in to access your analysis history and dashboard.'
                    : 'Join to start analyzing code with AI-powered insights.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Username */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Username
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                      <input
                        id="auth-username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="your_username"
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Email (signup only) */}
                  {mode === 'signup' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Email
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                        <input
                          id="auth-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">
                      Password
                    </label>
                    <div className="relative">
                      <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                      <input
                        id="auth-password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                        value={form.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-11 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password (signup only) */}
                  {mode === 'signup' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm" />
                        <input
                          id="auth-confirm-password"
                          name="confirmPassword"
                          type={showPassword ? 'text' : 'password'}
                          autoComplete="new-password"
                          value={form.confirmPassword}
                          onChange={handleChange}
                          placeholder="••••••••"
                          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2"
                      >
                        ⚠️ {error}
                      </motion.p>
                    )}
                    {success && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-green-400 text-xs bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2"
                      >
                        ✅ {success}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  {/* Submit */}
                  <motion.button
                    id="auth-submit-btn"
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-900/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                        />
                        {mode === 'login' ? 'Signing in…' : 'Creating account…'}
                      </span>
                    ) : (
                      <>
                        <FaRocket className="text-sm" />
                        {mode === 'login' ? 'Sign In' : 'Create Account'}
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Guest mode */}
                <div className="mt-5 text-center">
                  <button
                    id="guest-mode-btn"
                    onClick={() => onSuccess?.()}
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-2"
                  >
                    Continue as guest (no history saved)
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <p className="text-center text-slate-600 text-xs mt-6">
          © 2024 CodeReviewer · Built with React & FastAPI
        </p>
      </div>
    </div>
  )
}
