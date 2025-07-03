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
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 py-24 relative overflow-hidden">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center space-y-20">
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
            className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative border border-gray-100 dark:border-gray-700"
              >
                {/* Quote icon */}
                <div className="absolute -top-4 right-6 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-md">
                  <Quote className="h-4 w-4 text-white" />
                </div>

                <div className="space-y-6">
                  {/* Rating */}
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    "{testimonial.content}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
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
            className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-xl p-12 max-w-4xl mx-auto border border-gray-100 dark:border-gray-700"
          >
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <div className="space-y-3">
                <div className="text-4xl font-bold text-gray-900 dark:text-white">4.8/5</div>
                <div className="text-base text-gray-600 dark:text-gray-300 font-medium">Average Rating</div>
                <div className="flex justify-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-4xl font-bold text-gray-900 dark:text-white">2,847</div>
                <div className="text-base text-gray-600 dark:text-gray-300 font-medium">Reviews</div>
                <div className="text-sm text-green-600 dark:text-green-400 font-semibold">
                  ↗ 98% Positive
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-4xl font-bold text-gray-900 dark:text-white">94%</div>
                <div className="text-base text-gray-600 dark:text-gray-300 font-medium">Would Recommend</div>
                <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
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