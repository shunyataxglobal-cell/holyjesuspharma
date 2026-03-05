"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function ConsultationPopup({ open, onClose, title, content }: any) {
  return (
    <AnimatePresence>

      {open && (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
        >

          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white max-w-2xl w-full rounded-2xl shadow-xl p-8 relative"
          >

            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-xl"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold mb-6">
              {title}
            </h2>

            <p className="text-gray-600 leading-relaxed">
              {content}
            </p>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>
  );
}