import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaCode, FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaRocket, FaCheck, FaExclamationCircle } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

const API = '/api/auth'

const particles = Array.from({ length: 18 }, (_, i) => i)

// Stagger animation for form fields
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 20 },
  },
}

export default function AuthPage({ initialMode = 'login', onSuccess, onClose }) {
  const { login } = useAuth()
  const [mode, setMode] = useState(initialMode) // 'login' | 'signup'
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    setMode(initialMode)
    setError('')
    setSuccess('')
    setForm({ username: '', email: '', password: '', confirmPassword: '' })
    setShowPassword(false)
  }, [initialMode])

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

  const handleGuest = () => {
    setError('')
    setSuccess('')
    onClose?.()
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
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center mb-8"
        >
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 shadow-2xl shadow-blue-500/30 mb-4 relative"
            animate={{ 
              boxShadow: [
                '0 0 20px 0 rgba(59, 130, 246, 0.3)',
                '0 0 40px 0 rgba(59, 130, 246, 0.5)',
                '0 0 20px 0 rgba(59, 130, 246, 0.3)',
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-400/50 to-indigo-400/50 bg-clip-border opacity-0"
            />
            <FaCode className="text-white text-3xl relative z-10" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-3xl font-black bg-gradient-to-r from-blue-300 via-blue-200 to-indigo-300 bg-clip-text text-transparent tracking-tight">
              Code<span className="text-indigo-300">Reviewer</span>
            </h1>
            <motion.p
              className="text-slate-400 mt-2 text-sm font-medium"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              ✨ AI-Powered Code Quality Analysis
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="relative rounded-2xl overflow-hidden backdrop-blur-xl"
          style={{ background: 'rgba(15,23,42,0.75)' }}
        >
          {/* Animated border glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            style={{
              border: '1px solid transparent',
              backgroundImage: 'linear-gradient(rgba(15,23,42,0.75), rgba(15,23,42,0.75)), linear-gradient(135deg, rgba(59,130,246,0.3), rgba(99,102,241,0.2))',
              backgroundOrigin: 'border-box',
              backgroundClip: 'padding-box, border-box',
            }}
            animate={{
              boxShadow: [
                '0 0 20px rgba(59,130,246,0.1)',
                '0 0 40px rgba(59,130,246,0.2)',
                '0 0 20px rgba(59,130,246,0.1)',
              ]
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          {/* Gradient overlay on top */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          {/* Tabs */}
          <div className="flex border-b border-white/10 bg-gradient-to-r from-white/3 to-transparent">
            {['login', 'signup'].map((m) => (
              <motion.button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-4 text-sm font-bold tracking-wide transition-all relative overflow-hidden ${
                  mode === m
                    ? 'text-blue-300'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
              >
                {mode === m && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">
                  {m === 'login' ? '🔐 Sign In' : '✨ Create Account'}
                </span>
              </motion.button>
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
                <div className="mb-6">
                  <motion.h2
                    key={`title-${mode}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-bold bg-gradient-to-r from-blue-300 via-blue-200 to-indigo-300 bg-clip-text text-transparent"
                  >
                    {mode === 'login' ? 'Welcome Back' : 'Join Us Today'}
                  </motion.h2>
                  <motion.p
                    key={`subtitle-${mode}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="text-slate-400 text-sm mt-1.5"
                  >
                    {mode === 'login'
                      ? 'Access your analysis history and personalized dashboard'
                      : 'Get started with AI-powered code insights'}
                  </motion.p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <motion.div variants={containerVariants} initial="hidden" animate="visible">
                    {/* Username */}
                    <motion.div variants={itemVariants}>
                      <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                        Username
                      </label>
                      <div className="relative group">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg opacity-0 group-hover:opacity-20 blur transition-all"
                          initial={false}
                        />
                        <div className="relative">
                          <FaUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm group-hover:text-slate-400 transition-colors" />
                          <input
                            id="auth-username"
                            name="username"
                            type="text"
                            autoComplete="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="your_username"
                            className="w-full bg-gradient-to-br from-white/8 to-white/5 border border-white/20 hover:border-white/40 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:from-white/12 focus:to-white/8 transition-all duration-200 backdrop-blur-sm"
                          />
                        </div>
                      </div>
                    </motion.div>

                    {/* Email (signup only) */}
                    {mode === 'signup' && (
                      <motion.div
                        variants={itemVariants}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                          Email
                        </label>
                        <div className="relative group">
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg opacity-0 group-hover:opacity-20 blur transition-all"
                            initial={false}
                          />
                          <div className="relative">
                            <FaEnvelope className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm group-hover:text-slate-400 transition-colors" />
                            <input
                              id="auth-email"
                              name="email"
                              type="email"
                              autoComplete="email"
                              value={form.email}
                              onChange={handleChange}
                              placeholder="you@example.com"
                              className="w-full bg-gradient-to-br from-white/8 to-white/5 border border-white/20 hover:border-white/40 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:from-white/12 focus:to-white/8 transition-all duration-200 backdrop-blur-sm"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Password */}
                    <motion.div variants={itemVariants}>
                      <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                        Password
                      </label>
                      <div className="relative group">
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg opacity-0 group-hover:opacity-20 blur transition-all"
                          initial={false}
                        />
                        <div className="relative">
                          <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm group-hover:text-slate-400 transition-colors" />
                          <input
                            id="auth-password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="w-full bg-gradient-to-br from-white/8 to-white/5 border border-white/20 hover:border-white/40 rounded-lg pl-10 pr-11 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:from-white/12 focus:to-white/8 transition-all duration-200 backdrop-blur-sm"
                          />
                          <motion.button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>

                    {/* Confirm Password (signup only) */}
                    {mode === 'signup' && (
                      <motion.div
                        variants={itemVariants}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <label className="block text-xs font-semibold text-slate-300 mb-2 uppercase tracking-wider">
                          Confirm Password
                        </label>
                        <div className="relative group">
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg opacity-0 group-hover:opacity-20 blur transition-all"
                            initial={false}
                          />
                          <div className="relative">
                            <FaLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-sm group-hover:text-slate-400 transition-colors" />
                            <input
                              id="auth-confirm-password"
                              name="confirmPassword"
                              type={showPassword ? 'text' : 'password'}
                              autoComplete="new-password"
                              value={form.confirmPassword}
                              onChange={handleChange}
                              placeholder="••••••••"
                              className="w-full bg-gradient-to-br from-white/8 to-white/5 border border-white/20 hover:border-white/40 rounded-lg pl-10 pr-4 py-3 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 focus:from-white/12 focus:to-white/8 transition-all duration-200 backdrop-blur-sm"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: -10 }}
                          animate={{ opacity: 1, height: 'auto', y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -10 }}
                          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                          className="relative"
                        >
                          <div className="bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30 rounded-lg px-4 py-3 flex items-start gap-3">
                            <motion.div
                              initial={{ scale: 0, rotate: -45 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 200 }}
                            >
                              <FaExclamationCircle className="text-red-400 text-lg mt-0.5 flex-shrink-0" />
                            </motion.div>
                            <p className="text-red-300 text-xs font-medium">{error}</p>
                          </div>
                        </motion.div>
                      )}
                      {success && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, y: -10 }}
                          animate={{ opacity: 1, height: 'auto', y: 0 }}
                          exit={{ opacity: 0, height: 0, y: -10 }}
                          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                          className="relative"
                        >
                          <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30 rounded-lg px-4 py-3 flex items-start gap-3">
                            <motion.div
                              initial={{ scale: 0, rotate: -45 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
                            >
                              <FaCheck className="text-green-400 text-lg mt-0.5 flex-shrink-0" />
                            </motion.div>
                            <p className="text-green-300 text-xs font-medium">{success}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Submit */}
                    <motion.div variants={itemVariants} className="pt-2">
                      <motion.button
                        id="auth-submit-btn"
                        type="submit"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative w-full py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-900/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                      >
                        {/* Animated background shine effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                          animate={{ x: ['100%', '-100%'] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          style={{ pointerEvents: 'none' }}
                        />

                        <div className="relative flex items-center justify-center gap-2">
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <motion.span
                                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                              />
                              <span>{mode === 'login' ? 'Signing in…' : 'Creating account…'}</span>
                            </span>
                          ) : (
                            <>
                              <motion.span
                                animate={{ y: [0, -2, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity }}
                              >
                                <FaRocket className="text-sm" />
                              </motion.span>
                              <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                            </>
                          )}
                        </div>
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </form>

                {/* Guest mode */}
                <motion.div
                  className="mt-6 pt-6 border-t border-white/10"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <p className="text-center text-xs text-slate-500 mb-3">Want to explore first?</p>
                  <motion.button
                    id="guest-mode-btn"
                    onClick={handleGuest}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 rounded-lg font-semibold text-slate-300 bg-gradient-to-r from-slate-700/20 to-slate-800/20 border border-slate-600/30 hover:border-slate-500/50 hover:from-slate-700/30 hover:to-slate-800/30 transition-all flex items-center justify-center gap-2"
                  >
                    <motion.span
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 20, repeat: Infinity }}
                    >
                      🚀
                    </motion.span>
                    Continue as Guest
                  </motion.button>
                  <p className="text-center text-xs text-slate-600 mt-2">(No history saved)</p>
                </motion.div>
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
