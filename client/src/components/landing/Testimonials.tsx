import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import GlassCard from "@/components/glass-card";

interface Testimonial {
  quote: string;
  author: string;
  title: string;
  type: "consumer" | "partner";
}

/**
 * Testimonials section showing quotes from both customers and partners
 */
export default function Testimonials() {
  const testimonials: Testimonial[] = [
    {
      quote: "Briki made finding international travel insurance so much simpler. I could compare multiple options side-by-side and understand exactly what I was buying.",
      author: "Maria C.",
      title: "Frequent Traveler",
      type: "consumer"
    },
    {
      quote: "The platform allowed us to target specific customer segments that were previously difficult to reach. Our conversion rates have improved considerably.",
      author: "Ricardo M.",
      title: "Insurance Provider",
      type: "partner"
    },
    {
      quote: "I love how the AI explains complex policy terms in language I can understand. It's like having an insurance expert guide me through the process.",
      author: "Carlos R.",
      title: "Auto Insurance Customer",
      type: "consumer"
    },
    {
      quote: "Joining Briki's marketplace has transformed our digital distribution strategy. The analytics dashboard gives us valuable insights into customer preferences.",
      author: "Elena V.",
      title: "Partner Insurance Company",
      type: "partner"
    }
  ];

  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Trusted by Users & Partners
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            See what our community has to say about their experience with Briki.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.5, 
                delay: index * 0.1 
              }}
            >
              <GlassCard 
                className="h-full p-6 flex flex-col"
                variant={testimonial.type === "consumer" ? "blue" : "primary"}
                hover="lift"
                disableMotion={true}
              >
                <div className="mb-4">
                  <Quote className={`h-8 w-8 ${testimonial.type === "consumer" ? "text-blue-500" : "text-indigo-600"}`} />
                </div>
                <p className="text-gray-700 dark:text-gray-300 flex-grow mb-4">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.title}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}