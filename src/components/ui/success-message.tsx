"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

interface SuccessMessageProps {
  message: string
  onComplete?: () => void
}

export function SuccessMessage({ message, onComplete }: SuccessMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onComplete}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="rounded-2xl bg-white p-8 shadow-2xl max-w-md mx-4"
      >
        <div className="flex flex-col items-center text-center space-y-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle2 className="h-16 w-16 text-accent-700" />
          </motion.div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-slate-900">Success!</h3>
            <p className="text-slate-600">{message}</p>
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5 }}
            className="h-1 bg-gradient-to-r from-accent-700 to-accent-800 rounded-full"
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
