import { motion } from 'framer-motion'

export default function LoadingAnimation() {
  return (
    <motion.div
      className="card my-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex flex-col items-center justify-center py-12">
        <div className="relative">
          <motion.div
            className="w-16 h-16 border-4 border-primary-200 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute top-0 left-0 w-16 h-16 border-4 border-primary-600 rounded-full border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        
        <motion.p
          className="mt-6 text-lg font-medium text-gray-700"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Analyzing your code...
        </motion.p>
        
        <div className="flex space-x-2 mt-4">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-primary-600 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Running static analysis, security checks, and AI suggestions...
        </p>
      </div>
    </motion.div>
  )
}
