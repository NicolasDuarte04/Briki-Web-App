import React from 'react';
import { PublicLayout } from '@/components/layout/public-layout';
import { motion } from 'framer-motion';
import { useNavigation } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { ArrowRight, BriefcaseIcon, GlobeIcon, HeartIcon, LightbulbIcon } from 'lucide-react';

export default function CareersPage() {
  const { navigate } = useNavigation();

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Mock job positions
  const jobPositions = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote (US)",
      type: "Full-time"
    },
    {
      id: 2,
      title: "Product Designer",
      department: "Design",
      location: "New York, NY",
      type: "Full-time"
    },
    {
      id: 3,
      title: "Data Scientist",
      department: "Data",
      location: "Remote (Global)",
      type: "Full-time"
    },
    {
      id: 4,
      title: "Customer Success Manager",
      department: "Customer Support",
      location: "San Francisco, CA",
      type: "Full-time"
    }
  ];

  return (
    <PublicLayout>
      {/* Hero Section with Ambient Background */}
      <section className="relative overflow-hidden">
        {/* Ambient Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white">
          <motion.div 
            className="absolute top-0 right-0 w-1/2 h-96 bg-blue-100/30 rounded-full blur-3xl"
            animate={{
              y: [0, 30, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-1/2 h-96 bg-indigo-100/30 rounded-full blur-3xl"
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto py-20 md:py-28 px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Join the Briki Team
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Help us revolutionize the insurance industry with technology and make insurance accessible to everyone.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-gray-900">Our Values</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={container}
          >
            {/* Value 1 */}
            <motion.div 
              className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow"
              variants={fadeIn}
            >
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <LightbulbIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Innovation</h3>
              <p className="text-gray-600">
                We constantly challenge the status quo and find new ways to solve problems.
              </p>
            </motion.div>

            {/* Value 2 */}
            <motion.div 
              className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow"
              variants={fadeIn}
            >
              <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <HeartIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Customer First</h3>
              <p className="text-gray-600">
                We put our customers at the center of everything we build and every decision we make.
              </p>
            </motion.div>

            {/* Value 3 */}
            <motion.div 
              className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow"
              variants={fadeIn}
            >
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <GlobeIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Diversity</h3>
              <p className="text-gray-600">
                We embrace diverse perspectives and create inclusive experiences for all.
              </p>
            </motion.div>

            {/* Value 4 */}
            <motion.div 
              className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow"
              variants={fadeIn}
            >
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <BriefcaseIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Growth</h3>
              <p className="text-gray-600">
                We invest in continuous learning and personal development for our team.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-gray-900">Open Positions</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Join our growing team and help shape the future of insurance
            </p>
          </motion.div>

          <motion.div 
            className="space-y-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={container}
          >
            {jobPositions.map((job) => (
              <motion.div 
                key={job.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                variants={fadeIn}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600 mt-2">{job.department}</p>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center mt-4 md:mt-0 space-y-2 md:space-y-0 md:space-x-4">
                    <span className="text-sm text-gray-500">{job.location}</span>
                    <span className="bg-blue-100 text-blue-800 text-sm py-1 px-3 rounded-full">{job.type}</span>
                    <Button
                      variant="outline"
                      className="ml-0 md:ml-2"
                      onClick={() => navigate("/auth")}
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Perks and Benefits Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
          >
            <h2 className="text-3xl font-bold text-gray-900">Perks and Benefits</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We take care of our team so they can take care of our customers
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={container}
          >
            {/* Cards for perks */}
            <motion.div variants={fadeIn} className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Flexible Work</h3>
              <p className="text-gray-600">Remote-first with flexible hours. Work from anywhere in the world.</p>
            </motion.div>
            <motion.div variants={fadeIn} className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Comprehensive Healthcare</h3>
              <p className="text-gray-600">Medical, dental, and vision coverage for you and your dependents.</p>
            </motion.div>
            <motion.div variants={fadeIn} className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Learning & Development</h3>
              <p className="text-gray-600">Annual learning stipend and dedicated growth time.</p>
            </motion.div>
            <motion.div variants={fadeIn} className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Equity</h3>
              <p className="text-gray-600">Every employee receives equity in the company.</p>
            </motion.div>
            <motion.div variants={fadeIn} className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Paid Time Off</h3>
              <p className="text-gray-600">Unlimited vacation policy with minimum requirements.</p>
            </motion.div>
            <motion.div variants={fadeIn} className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Wellness Benefits</h3>
              <p className="text-gray-600">Mental health days and wellness reimbursements.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90"></div>
        <div className="absolute inset-0 opacity-30">
          <motion.div 
            className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{
              x: [0, -30, 0],
              y: [0, 30, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <motion.div 
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to join our mission?</h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto">
            Become part of a team that's passionate about making insurance simple, transparent, and accessible to everyone.
          </p>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              className="bg-white text-blue-600 hover:bg-white/90 py-6 px-8 text-lg font-medium rounded-lg shadow-lg"
              onClick={() => navigate("/auth")}
            >
              View All Positions
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </PublicLayout>
  );
}