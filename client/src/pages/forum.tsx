import React from 'react';
import { PublicLayout } from '@/components/layout/public-layout';
import { motion } from 'framer-motion';
import { useNavigation } from '@/lib/navigation';
import { Button } from '@/components/ui/button';
import { Helmet } from 'react-helmet';
import { MessageCircle, Users, ArrowRight, ThumbsUp, Reply, Lock, Eye, Award, Search } from 'lucide-react';

// Mock forum categories
const forumCategories = [
  {
    id: 1,
    name: "Travel Insurance",
    description: "Discussions about travel coverage, international policies, and trip protection",
    postsCount: 145,
    icon: <MessageCircle className="h-5 w-5 text-blue-500" />
  },
  {
    id: 2,
    name: "Auto Insurance",
    description: "Topics on car insurance, rates, claims, and coverage options",
    postsCount: 289,
    icon: <MessageCircle className="h-5 w-5 text-green-500" />
  },
  {
    id: 3,
    name: "Pet Insurance",
    description: "Conversations about insuring your pets, breed-specific coverage, and claims",
    postsCount: 103,
    icon: <MessageCircle className="h-5 w-5 text-purple-500" />
  },
  {
    id: 4,
    name: "Health Insurance",
    description: "Discussions about health plans, providers, and coverage details",
    postsCount: 256,
    icon: <MessageCircle className="h-5 w-5 text-red-500" />
  },
  {
    id: 5,
    name: "General Questions",
    description: "Ask anything insurance-related that doesn't fit elsewhere",
    postsCount: 321,
    icon: <MessageCircle className="h-5 w-5 text-indigo-500" />
  }
];

// Mock trending topics
const trendingTopics = [
  {
    id: 101,
    title: "Does travel insurance cover COVID-related cancellations?",
    author: "Sarah M.",
    category: "Travel Insurance",
    replies: 24,
    views: 873,
    lastActive: "2 hours ago"
  },
  {
    id: 102,
    title: "How much does pet insurance typically cost for a senior dog?",
    author: "Mark T.",
    category: "Pet Insurance",
    replies: 18,
    views: 647,
    lastActive: "5 hours ago"
  },
  {
    id: 103,
    title: "Does my auto insurance cover rental cars?",
    author: "David K.",
    category: "Auto Insurance",
    replies: 32,
    views: 1254,
    lastActive: "Yesterday"
  }
];

export default function ForumPage() {
  const { navigate } = useNavigation();

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <PublicLayout>
      <Helmet>
        <title>Briki Community Forum – Insurance Discussion & Support</title>
        <meta name="description" content="Join the Briki community forum to discuss insurance topics, get advice from experts and fellow users, and share your experiences." />
        <meta property="og:title" content="Briki Community Forum – Insurance Discussion & Support" />
        <meta property="og:description" content="Join the Briki community forum to discuss insurance topics, get advice from experts and fellow users, and share your experiences." />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      
      <main id="main-content">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white" aria-labelledby="forum-heading">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-70 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full opacity-70 blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto py-16 md:py-20 px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <h1 id="forum-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Community <span className="text-primary">Forum</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Share experiences, get advice, and learn from others in our insurance community. 
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <div className="relative max-w-md w-full mx-auto">
                  <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                  <input
                    type="text"
                    placeholder="Search the forum..."
                    className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    aria-label="Search the forum"
                  />
                </div>
                <Button
                  onClick={() => navigate("/auth")}
                  className="bg-blue-600 hover:bg-blue-700 py-3 px-6"
                >
                  Join the Discussion
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Forum Stats Overview */}
        <section className="py-8 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-blue-500 mr-2" aria-hidden="true" />
                  <span className="text-2xl font-bold text-gray-900">2,458</span>
                </div>
                <p className="text-gray-600">Active Members</p>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <MessageCircle className="h-6 w-6 text-indigo-500 mr-2" aria-hidden="true" />
                  <span className="text-2xl font-bold text-gray-900">12,984</span>
                </div>
                <p className="text-gray-600">Forum Posts</p>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <ThumbsUp className="h-6 w-6 text-green-500 mr-2" aria-hidden="true" />
                  <span className="text-2xl font-bold text-gray-900">5,248</span>
                </div>
                <p className="text-gray-600">Helpful Answers</p>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-center mb-2">
                  <Award className="h-6 w-6 text-amber-500 mr-2" aria-hidden="true" />
                  <span className="text-2xl font-bold text-gray-900">43</span>
                </div>
                <p className="text-gray-600">Insurance Experts</p>
              </div>
            </div>
          </div>
        </section>

        {/* Trending Topics */}
        <section className="py-12 md:py-16" aria-labelledby="trending-topics-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="trending-topics-heading" className="text-2xl font-bold text-gray-900 mb-8">Trending Discussions</h2>
            
            <motion.div
              className="space-y-4"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {trendingTopics.map((topic) => (
                <motion.div
                  key={topic.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
                  variants={fadeIn}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                          <a href={`/forum/topic/${topic.id}`} aria-label={`View topic: ${topic.title}`}>
                            {topic.title}
                          </a>
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <span className="flex items-center mr-4">
                            <Users className="h-4 w-4 mr-1" aria-hidden="true" />
                            {topic.author}
                          </span>
                          <span className="mr-4">
                            in <span className="text-blue-600">{topic.category}</span>
                          </span>
                          <span className="text-gray-400">
                            Last active {topic.lastActive}
                          </span>
                        </div>
                      </div>
                      <div className="rounded-md bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600">
                        Hot
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="flex items-center mr-4">
                        <Reply className="h-4 w-4 mr-1" aria-hidden="true" />
                        {topic.replies} replies
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" aria-hidden="true" />
                        {topic.views} views
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
              <div className="text-center mt-8">
                <Button variant="outline" onClick={() => navigate("/auth")} className="text-blue-600 border-blue-200">
                  View More Discussions <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Forum Categories */}
        <section className="py-12 md:py-16 bg-gray-50" aria-labelledby="forum-categories-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="forum-categories-heading" className="text-2xl font-bold text-gray-900 mb-8">Forum Categories</h2>
            
            <motion.div
              className="grid gap-6"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {forumCategories.map((category) => (
                <motion.div
                  key={category.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100"
                  variants={fadeIn}
                >
                  <div className="flex items-start">
                    <div className="mr-4 mt-1">
                      {category.icon}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 hover:text-blue-600 transition-colors">
                        <a href={`/forum/category/${category.id}`} aria-label={`Browse ${category.name} category`}>
                          {category.name}
                        </a>
                      </h3>
                      <p className="text-gray-600 mb-2">
                        {category.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {category.postsCount} posts
                      </p>
                    </div>
                    <div className="hidden md:block">
                      <Button 
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        onClick={() => navigate(`/forum/category/${category.id}`)}
                        aria-label={`Browse ${category.name} category`}
                      >
                        Browse 
                        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Join Community CTA */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white" aria-labelledby="join-community-heading">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Lock className="h-10 w-10 mx-auto mb-4 text-blue-300" aria-hidden="true" />
              <h2 id="join-community-heading" className="text-3xl font-bold mb-4">Join Our Insurance Community</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Sign up to participate in discussions, ask questions, and get personalized advice from our community of users and insurance experts.
              </p>
              <Button
                className="bg-white text-blue-600 hover:bg-white/90 py-3 px-8 text-lg font-medium rounded-lg"
                onClick={() => navigate("/auth")}
                aria-label="Sign up to join community"
              >
                Sign Up Now
                <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}