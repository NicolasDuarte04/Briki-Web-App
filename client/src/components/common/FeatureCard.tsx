import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Activity, BadgeCheck, Check, CheckSquare, Clock, ClipboardList, 
  Globe, HelpCircle, Pill, PhoneOutgoing, Shield, ShieldCheck, 
  Stethoscope, User, Users, Video, Wrench
} from "lucide-react";
import { ElementType } from "react";

// Map of icon names to icon components
const IconMap: Record<string, ElementType> = {
  Activity,
  BadgeCheck,
  Check,
  CheckSquare,
  Clock,
  ClipboardList,
  Globe,
  HelpCircle,
  Pill,
  PhoneOutgoing,
  Shield,
  ShieldCheck,
  Stethoscope,
  User,
  Users,
  Video,
  Wrench
};

interface FeatureCardProps {
  title: string;
  description: string;
  iconName: string;
  iconColor?: string;
  iconBgColor?: string;
  delay?: number;
  className?: string;
}

/**
 * Reusable FeatureCard component for displaying features across the application
 * Uses predefined icons from the IconMap
 */
export function FeatureCard({
  title,
  description,
  iconName,
  iconColor = "text-primary",
  iconBgColor = "bg-primary/10",
  delay = 0,
  className,
}: FeatureCardProps) {
  // Get the icon component from our map, or fall back to HelpCircle
  const Icon = IconMap[iconName] || HelpCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className={cn("bg-white p-6 rounded-xl border shadow-sm h-full", className)}
    >
      <div className={cn("rounded-full w-12 h-12 flex items-center justify-center mb-4", iconBgColor)}>
        <Icon className={cn("h-6 w-6", iconColor)} />
      </div>
      
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );
}