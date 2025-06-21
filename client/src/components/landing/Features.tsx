import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Calculator, 
  Users, 
  Globe, 
  Zap, 
  MessageSquare,
  TrendingUp,
  Lock,
  Sparkles
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Comprehensive Coverage",
    description: "Access health, auto, travel, and pet insurance from Colombia's top providers",
    badge: "All Types",
    color: "blue",
  },
  {
    icon: Calculator,
    title: "Instant Quotes",
    description: "Get personalized quotes in seconds with our AI-powered recommendation engine",
    badge: "Real-time",
    color: "emerald",
  },
  {
    icon: Users,
    title: "Family-Friendly",
    description: "Find plans that cover your entire family with flexible options and benefits",
    badge: "For Everyone",
    color: "purple",
  },
  {
    icon: Globe,
    title: "Colombia-Focused",
    description: "Tailored specifically for Colombian residents with local provider expertise",
    badge: "Local",
    color: "amber",
  },
  {
    icon: Zap,
    title: "AI-Powered Insights",
    description: "Get intelligent recommendations based on your unique needs and budget",
    badge: "Smart",
    color: "cyan",
  },
  {
    icon: MessageSquare,
    title: "24/7 Support",
    description: "Chat with our AI assistant anytime for instant answers to your questions",
    badge: "Always On",
    color: "pink",
  },
];

const getColorClasses = (color: string) => {
  const colorMap = {
    blue: {
      bg: "bg-blue-50",
      icon: "text-blue-600",
      badge: "bg-blue-100 text-blue-700 border-blue-200",
    },
    emerald: {
      bg: "bg-emerald-50",
      icon: "text-emerald-600",
      badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    },
    purple: {
      bg: "bg-purple-50",
      icon: "text-purple-600",
      badge: "bg-purple-100 text-purple-700 border-purple-200",
    },
    amber: {
      bg: "bg-amber-50",
      icon: "text-amber-600",
      badge: "bg-amber-100 text-amber-700 border-amber-200",
    },
    cyan: {
      bg: "bg-cyan-50",
      icon: "text-cyan-600",
      badge: "bg-cyan-100 text-cyan-700 border-cyan-200",
    },
    pink: {
      bg: "bg-pink-50",
      icon: "text-pink-600",
      badge: "bg-pink-100 text-pink-700 border-pink-200",
    },
  };
  return colorMap[color as keyof typeof colorMap] || colorMap.blue;
};

export default function Features() {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-slate-50/50 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -right-48 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-cyan-100/20 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 px-3 py-1 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 border-blue-200/50">
              <Sparkles className="w-3 h-3 mr-1" />
              Platform Features
            </Badge>
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Everything You Need
          </motion.h2>
          
          <motion.p 
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Built with the latest technology to make insurance simple, transparent, and accessible for everyone
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const colors = getColorClasses(feature.color);
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group h-full bg-white/80 backdrop-blur-sm border-gray-100 hover:bg-white hover:shadow-xl hover:border-gray-200 transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className={`rounded-xl w-12 h-12 ${colors.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <feature.icon className={`h-6 w-6 ${colors.icon}`} />
                      </div>
                      <Badge variant="secondary" className={`text-xs ${colors.badge}`}>
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Additional visual elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <span>98% Customer Satisfaction</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-blue-600" />
              <span>Bank-Level Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-600" />
              <span>Instant Processing</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}