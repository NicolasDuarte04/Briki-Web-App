import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-40 bg-gradient-to-b from-[#F4F9FC] to-[#E6F3F7] relative overflow-hidden scroll-mt-20">
      {/* Subtle background decoration */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1400px] h-[700px] bg-gradient-radial from-[#00C7C4]/5 via-[#0077B6]/3 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <Badge className="mb-8 px-4 py-2 bg-gradient-to-r from-[#00C7C4]/10 to-[#0077B6]/10 text-[#0077B6] border-[#00C7C4]/20 backdrop-blur-sm shadow-sm">
            <Building2 className="w-3.5 h-3.5 mr-2" />
            About Us
          </Badge>

          <Card className="p-12 md:p-16 bg-white/90 backdrop-blur-sm border border-gray-200/50 shadow-xl rounded-3xl">
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-16 text-center">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C7C4] to-[#0077B6]">Briki Insurance Platform</span>
            </h2>
            
            <div className="space-y-10 max-w-3xl mx-auto">
              <p className="text-xl text-gray-600 leading-relaxed lg:leading-loose">
                Briki is a cutting-edge insurance marketplace designed to make insurance accessible, 
                understandable, and tailored to your unique needs. Operating across Colombia and Mexico, 
                our platform uses intelligent technology to compare insurance options across multiple categories, 
                including travel, auto, pet, and health.
              </p>
              
              <p className="text-xl text-gray-600 leading-relaxed lg:leading-loose">
                For consumers, Briki provides a human-centered experience that simplifies the complex world 
                of insurance. Our AI-powered tools analyze your specific needs and preferences to match you 
                with the perfect coverage options, ensuring you're never over or under-insured.
              </p>
              
              <p className="text-xl text-gray-600 leading-relaxed lg:leading-loose">
                For insurance companies and partners, Briki offers a sophisticated distribution channel to 
                connect with qualified customers. Our advanced analytics platform provides valuable market 
                insights while streamlining the process of showcasing your products to the right audience.
              </p>
            </div>

            {/* Stats or trust indicators */}
            <div className="mt-20 pt-16 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00C7C4] to-[#0077B6]">50K+</div>
                  <p className="text-gray-600 mt-3 text-lg">Active Users</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00C7C4] to-[#0077B6]">20+</div>
                  <p className="text-gray-600 mt-3 text-lg">Partner Companies</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00C7C4] to-[#0077B6]">98%</div>
                  <p className="text-gray-600 mt-3 text-lg">Satisfaction Rate</p>
                </motion.div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
} 