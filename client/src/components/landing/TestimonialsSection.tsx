import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: "María González",
      role: "Small Business Owner",
      location: "Bogotá",
      content: "Briki's AI assistant helped me find the perfect health insurance for my family. The process was so simple and the recommendations were spot-on.",
      rating: 5,
      avatar: "MG"
    },
    {
      name: "Carlos Herrera",
      role: "IT Professional",
      location: "Medellín",
      content: "I was overwhelmed by insurance options until I found Briki. The AI explained everything clearly and saved me hours of research.",
      rating: 5,
      avatar: "CH"
    },
    {
      name: "Ana Rodríguez",
      role: "Teacher",
      location: "Cali",
      content: "The document analysis feature is amazing! Briki analyzed my existing policies and found gaps I didn't even know existed.",
      rating: 5,
      avatar: "AR"
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="text-center space-y-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 px-4 py-2 rounded-full">
              <Star className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                Customer Stories
              </span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
              What Our Customers{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-500">
                Say
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Real stories from real people who found their perfect insurance coverage through Briki. 
              Join thousands of satisfied customers.
            </p>
          </motion.div>

          {/* Testimonials Grid */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="grid md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative"
              >
                {/* Quote icon */}
                <div className="absolute top-6 right-6 w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <Quote className="h-4 w-4 text-blue-600" />
                </div>

                <div className="space-y-6">
                  {/* Rating */}
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role} • {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto"
          >
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">4.8/5</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Average Rating</div>
                <div className="flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">2,847</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Reviews</div>
                <div className="text-xs text-green-600 font-medium">
                  ↗ 98% Positive
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">94%</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Would Recommend</div>
                <div className="text-xs text-blue-600 font-medium">
                  To Family & Friends
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}; 