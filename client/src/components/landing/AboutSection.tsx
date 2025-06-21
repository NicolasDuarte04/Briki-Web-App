import { motion } from "framer-motion";
import { Section } from "@/components/ui/section";
import { Card } from "@/components/ui/card";

export default function AboutSection() {
  return (
    <Section background="gradient" className="py-20 md:py-32">
      <div className="container px-4 md:px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="p-8 md:p-12 bg-background/80 backdrop-blur-sm border-primary/10 shadow-xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8 text-center">
              About <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400">Briki Insurance Platform</span>
            </h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-6">
                Briki is a cutting-edge insurance marketplace designed to make insurance accessible, 
                understandable, and tailored to your unique needs. Operating across Colombia and Mexico, 
                our platform uses intelligent technology to compare insurance options across multiple categories, 
                including travel, auto, pet, and health.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                For consumers, Briki provides a human-centered experience that simplifies the complex world 
                of insurance. Our AI-powered tools analyze your specific needs and preferences to match you 
                with the perfect coverage options, ensuring you're never over or under-insured.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                For insurance companies and partners, Briki offers a sophisticated distribution channel to 
                connect with qualified customers. Our advanced analytics platform provides valuable market 
                insights while streamlining the process of showcasing your products to the right audience.
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </Section>
  );
} 