import { motion, AnimatePresence } from 'framer-motion'

const toneStyles = {
  success: 'bg-emerald-600',
  error: 'bg-red-600',
  info: 'bg-slate-800',
}

export default function ToastContainer({ toasts = [] }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 w-[320px] max-w-[90vw]">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            className={`${toneStyles[toast.type] || toneStyles.info} text-white rounded-lg shadow-lg px-4 py-3`}
          >
            <p className="text-sm font-medium">{toast.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
