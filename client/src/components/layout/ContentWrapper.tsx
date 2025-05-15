import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ContentWrapperProps {
  title?: string;
  description?: string;
  variant?: "white" | "gray";
  centerContent?: boolean;
  maxWidth?: string;
  topSpacing?: string;
  bottomSpacing?: string;
  zIndex?: number;
  animationDelay?: number;
  children: ReactNode;
}

export const ContentWrapper = ({
  title,
  description,
  variant = "white",
  centerContent = true,
  maxWidth = "2xl",
  topSpacing = "16",
  bottomSpacing = "16",
  zIndex = 10,
  animationDelay = 0,
  children
}: ContentWrapperProps) => {
  const bgColor = variant === "gray" ? "bg-gray-50" : "";
  const paddingY = `py-${topSpacing} pb-${bottomSpacing}`;
  const maxWidthClass = maxWidth ? `max-w-${maxWidth}` : "";
  const textAlign = centerContent ? "text-center" : "text-left";
  
  return (
    <section className={`${paddingY} ${bgColor} relative z-${zIndex}`}>
      <div className="container">
        {(title || description) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: animationDelay }}
            viewport={{ once: true }}
            className={`${textAlign} mb-12 ${centerContent ? "mx-auto" : ""} ${maxWidthClass}`}
          >
            {title && (
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-muted-foreground mx-auto">
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