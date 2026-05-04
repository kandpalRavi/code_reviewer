import { motion } from 'framer-motion'
import { FaCode, FaSignOutAlt, FaUserCircle } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <motion.header
      className="bg-gradient-to-r from-primary-600 to-primary-800 text-white shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <FaCode className="text-3xl" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold">Code Reviewer</h1>
              <p className="text-sm text-primary-100">AI-Powered Code Analysis</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                  <FaUserCircle className="text-white/80" />
                  <span className="text-sm font-medium text-white">{user.username}</span>
                </div>
                <button
                  id="logout-btn"
                  onClick={logout}
                  title="Sign out"
                  className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors"
                >
                  <FaSignOutAlt />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                <FaUserCircle className="text-white/50" />
                <span className="text-sm text-white/60">Guest</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}
