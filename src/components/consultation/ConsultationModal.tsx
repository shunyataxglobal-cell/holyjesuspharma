"use client";

import { motion, AnimatePresence } from "framer-motion";
import ConsultationForm from "./ConsultationForm";

export default function ConsultationModal({ isOpen, onClose }: any) {
  return (
    <AnimatePresence>

      {isOpen && (

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-center px-4"
        >

          {/* MODAL BOX */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 0.7 }}
            exit={{ scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
          >

            {/* HEADER */}
            <div className="flex items-center justify-between px-8 py-5 border-b">

              <h2 className="text-2xl font-bold">
                Consultation Form
              </h2>

              <button
                onClick={onClose}
                className="text-2xl hover:text-red-500 transition"
              >
                ✕
              </button>

            </div>

            {/* SCROLLABLE FORM */}
            <div className="flex-1 overflow-y-auto p-8">

              <ConsultationForm onClose={onClose} />

            </div>

          </motion.div>

        </motion.div>

      )}

    </AnimatePresence>
  );
}