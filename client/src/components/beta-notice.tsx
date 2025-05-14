import { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, Sparkles } from "lucide-react";

interface BetaNoticeProps {
  message?: string;
  detailText?: string;
  dismissible?: boolean;
  icon?: ReactNode;
  className?: string;
  variant?: "primary" | "info" | "warning" | "success" | "beta";
  position?: "top" | "bottom";
}

export default function BetaNotice({
  message = "Briki is currently in beta. We're constantly adding new features!",
  detailText,
  dismissible = true,
  icon = <Sparkles size={18} />,
  className = "",
  variant = "beta",
  position = "top",
}: BetaNoticeProps) {
  const [isVisible, setIsVisible] = useState(true);

  // If not visible, don't render
  if (!isVisible) return null;

  // Variant styles
  const variantStyles = {
    primary: "bg-indigo-600 text-white",
    info: "bg-blue-600 text-white",
    warning: "bg-amber-500 text-white",
    success: "bg-emerald-600 text-white",
    beta: "bg-gradient-to-r from-indigo-600 to-blue-500 text-white",
  };

  // Position styles
  const positionStyles = {
    top: "top-0",
    bottom: "bottom-0",
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className={`fixed left-0 right-0 z-50 ${positionStyles[position]} ${className}`}
          initial={{ y: position === "top" ? -100 : 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: position === "top" ? -100 : 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <div className={`px-4 py-3 ${variantStyles[variant]}`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center">
                <span className="flex-shrink-0 mr-2">
                  {icon || <AlertCircle size={18} />}
                </span>
                <span className="font-medium mr-2">{message}</span>
                {detailText && (
                  <span className="hidden sm:inline text-white/80">{detailText}</span>
                )}
              </div>
              
              {dismissible && (
                <button 
                  onClick={() => setIsVisible(false)}
                  className="flex-shrink-0 ml-1 p-1 rounded-full hover:bg-white/20 transition-colors"
                  aria-label="Dismiss"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}