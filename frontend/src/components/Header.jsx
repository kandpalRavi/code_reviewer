import { motion } from 'framer-motion'
import { FaCode, FaHome, FaSignInAlt, FaUserCircle, FaUserPlus, FaSignOutAlt } from 'react-icons/fa'
import { useAuth } from '../context/AuthContext'

export default function Header({ onHomeClick, onLoginClick, onSignupClick }) {
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
            <button
              onClick={onHomeClick}
              className="hidden md:inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <FaHome />
              <span>Home</span>
            </button>

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
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                  <FaUserCircle className="text-white/50" />
                  <span className="text-sm text-white/60">Guest</span>
                </div>
                <button
                  onClick={onLoginClick}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-white bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <FaSignInAlt />
                  <span>Sign In</span>
                </button>
                <button
                  onClick={onSignupClick}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-blue-700 bg-white hover:bg-blue-50 transition-colors"
                >
                  <FaUserPlus />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}
