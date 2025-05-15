import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ContentWrapperProps {
  id?: string;
  title?: string;
  description?: string;
  variant?: "white" | "gray";
  centerContent?: boolean;
  maxWidth?: string;
  className?: string;
  children: ReactNode;
}

export const ContentWrapper = ({
  id,
  title,
  description,
  variant = "white",
  centerContent = true,
  maxWidth = "2xl",
  className = "",
  children
}: ContentWrapperProps) => {
  const bgColor = variant === "gray" ? "bg-gray-50" : "";
  const maxWidthClass = maxWidth ? `max-w-${maxWidth}` : "";
  const textAlign = centerContent ? "text-center" : "text-left";
  
  return (
    <section id={id} className={`py-16 ${bgColor} relative z-10 ${className}`}>
      <div className="container">
        {(title || description) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className={`${textAlign} mb-12 ${centerContent ? "mx-auto" : ""} ${maxWidthClass}`}
          >
            {title && (
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-muted-foreground mx-auto max-w-2xl">
                {description}
              </p>
            )}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
};