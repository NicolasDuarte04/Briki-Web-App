import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Testimonial {
  quote: string;
  author: string;
  title: string;
  avatar: string;
  rating?: number;
}

const testimonialsData: Testimonial[] = [
  {
    quote: "Briki made finding travel insurance so much simpler. I could compare multiple options side-by-side and understand exactly what I was buying.",
    author: "Maria C.",
    title: "Frequent Traveler",
    avatar: "MC",
    rating: 5
  },
  {
    quote: "The platform allowed us to target customer segments that were previously out of reach. Our conversion rates have improved considerably.",
    author: "Ricardo M.",
    title: "Insurance Provider",
    avatar: "RM",
    rating: 5
  },
  {
    quote: "I love how the AI explains complex policy terms. It's like having an insurance expert guide me through the process.",
    author: "Carlos R.",
    title: "Auto Insurance Customer",
    avatar: "CR",
    rating: 5
  },
  {
    quote: "Joining Briki's marketplace has transformed our digital distribution. The analytics dashboard gives us valuable insights.",
    author: "Elena V.",
    title: "Partner Insurance Company",
    avatar: "EV",
    rating: 5
  }
];

/**
 * Testimonials section showing quotes from both customers and partners
 */
export default function Testimonials() {
  return (
    <section id="testimonials" className="py-40 bg-gradient-to-b from-white to-[#F8FBFC] relative overflow-hidden scroll-mt-20">
      {/* Dotted background pattern */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'radial-gradient(circle, #0077B6 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}
        />
        {/* Soft radial gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-gradient-radial from-[#00C7C4]/3 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10 max-w-7xl">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Badge className="mb-8 px-4 py-2 bg-gradient-to-r from-[#00C7C4]/10 to-[#0077B6]/10 text-[#0077B6] border-[#00C7C4]/20 backdrop-blur-sm shadow-sm">
            <Star className="w-3.5 h-3.5 mr-2" />
            Customer Stories
          </Badge>
          
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00C7C4] to-[#0077B6]">Users & Partners</span>
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            See what our community has to say about their experience with Briki.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.15,
                ease: [0.21, 0.61, 0.35, 1]
              }}
              className="h-full"
            >
              <Card className="group h-full flex flex-col p-8 bg-white backdrop-blur-sm border border-gray-200/60 rounded-2xl hover:shadow-2xl hover:shadow-[#00C7C4]/10 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300">
                <CardContent className="flex-grow p-0">
                  <div className="flex items-center justify-between mb-6">
                    <Quote className="h-8 w-8 text-[#00C7C4]/20 group-hover:text-[#00C7C4]/30 transition-colors" />
                    {testimonial.rating && (
                      <div className="flex gap-0.5">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-[#00C7C4] text-[#00C7C4]" />
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </CardContent>
                <CardFooter className="p-0 pt-6 mt-auto">
                  <div className="flex items-center">
                    <Avatar className="h-12 w-12 mr-4 ring-2 ring-[#00C7C4]/20 group-hover:ring-[#00C7C4]/40 transition-all">
                      <AvatarFallback className="bg-gradient-to-br from-[#00C7C4] to-[#0077B6] text-white font-semibold">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-gray-600">
                        {testimonial.title}
                      </p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}