import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Section } from "@/components/ui/section";

interface Testimonial {
  quote: string;
  author: string;
  title: string;
  avatar: string;
}

const testimonialsData: Testimonial[] = [
  {
    quote: "Briki made finding travel insurance so much simpler. I could compare multiple options side-by-side and understand exactly what I was buying.",
    author: "Maria C.",
    title: "Frequent Traveler",
    avatar: "MC"
  },
  {
    quote: "The platform allowed us to target customer segments that were previously out of reach. Our conversion rates have improved considerably.",
    author: "Ricardo M.",
    title: "Insurance Provider",
    avatar: "RM"
  },
  {
    quote: "I love how the AI explains complex policy terms. It's like having an insurance expert guide me through the process.",
    author: "Carlos R.",
    title: "Auto Insurance Customer",
    avatar: "CR"
  },
  {
    quote: "Joining Briki's marketplace has transformed our digital distribution. The analytics dashboard gives us valuable insights.",
    author: "Elena V.",
    title: "Partner Insurance Company",
    avatar: "EV"
  }
];

/**
 * Testimonials section showing quotes from both customers and partners
 */
export default function Testimonials() {
  return (
    <Section background="dots" divider="slant" className="py-20 md:py-32">
      <div className="container px-4 md:px-6 mx-auto">
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tighter mb-4">
            Trusted by <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-400">Users & Partners</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            See what our community has to say about their experience with Briki.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonialsData.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="h-full"
            >
              <Card className="group h-full flex flex-col p-6 bg-background/60 backdrop-blur-sm hover:bg-background/90 border-border/50 hover:shadow-xl hover:border-primary/20 transition-all transform hover:-translate-y-2">
                <CardContent className="flex-grow p-0">
                  <Quote className="h-6 w-6 text-primary/30 mb-4 group-hover:text-primary/50 transition-colors" />
                  <p className="text-foreground/90 italic">
                    "{testimonial.quote}"
                  </p>
                </CardContent>
                <CardFooter className="p-0 pt-6 mt-auto">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-4 ring-2 ring-primary/10 group-hover:ring-primary/20 transition-all">
                      <AvatarFallback className="bg-gradient-to-br from-primary/20 to-cyan-400/20 text-primary font-semibold">
                        {testimonial.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-foreground">
                        {testimonial.author}
                      </p>
                      <p className="text-sm text-muted-foreground">
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
    </Section>
  );
}