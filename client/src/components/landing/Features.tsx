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
  },
  {
    icon: Calculator,
    title: "Instant Quotes",
    description: "Get personalized quotes in seconds with our AI-powered recommendation engine",
    badge: "Real-time",
  },
  {
    icon: Users,
    title: "Family-Friendly",
    description: "Find plans that cover your entire family with flexible options and benefits",
    badge: "For Everyone",
  },
  {
    icon: Globe,
    title: "Colombia-Focused",
    description: "Tailored specifically for Colombian residents with local provider expertise",
    badge: "Local",
  },
  {
    icon: Zap,
    title: "AI-Powered Insights",
    description: "Get intelligent recommendations based on your unique needs and budget",
    badge: "Smart",
  },
  {
    icon: MessageSquare,
    title: "24/7 Support",
    description: "Chat with our AI assistant anytime for instant answers to your questions",
    badge: "Always On",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-32 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden scroll-mt-20">
      {/* Subtle background decoration with Briki colors */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -right-48 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -left-48 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
        {/* Additional subtle gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-blue-600/3 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10 max-w-7xl">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-8 px-4 py-2 bg-gradient-to-r from-blue-600/10 to-cyan-500/10 text-blue-600 border-blue-600/20 backdrop-blur-sm shadow-sm">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              Platform Features
            </Badge>
          </motion.div>
          
          <motion.h2 
            className="text-5xl md:text-6xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Everything You Need
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Built with the latest technology to make insurance simple, transparent, and accessible for everyone
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => {
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="group h-full bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-2xl hover:bg-white hover:shadow-2xl hover:shadow-blue-600/10 hover:scale-[1.02] hover:border-gray-200 transition-all duration-300 overflow-hidden">
                  <CardHeader className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="rounded-2xl w-14 h-14 bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-600/25 transition-all duration-300">
                        <feature.icon className="h-7 w-7 text-white" strokeWidth={1.5} />
                      </div>
                      <Badge variant="secondary" className="px-3 py-1 bg-gradient-to-r from-blue-600/5 to-cyan-500/5 text-blue-600 border-blue-600/10 text-xs font-medium">
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl font-semibold text-gray-900">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-8 pb-8">
                    <CardDescription className="text-base leading-relaxed text-gray-600">
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
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-12 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-white" />
              </div>
              <span>98% Customer Satisfaction</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">
                <Lock className="h-4 w-4 text-white" />
              </div>
              <span>Bank-Level Security</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span>Instant Processing</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}