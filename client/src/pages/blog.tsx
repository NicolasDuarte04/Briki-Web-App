import React from 'react';
import { PublicLayout } from '@/components/layout/public-layout';
import { motion } from 'framer-motion';
import { useNavigation } from '@/lib/navigation';
import { CalendarIcon, Clock, User, ArrowRight, Tag } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';

// Mock blog posts (these would come from an API in a real implementation)
const blogPosts = [
  {
    id: 1,
    title: "Understanding Travel Insurance: What's Really Worth Paying For",
    excerpt: "Not all travel insurance is created equal. Find out which features actually matter and which ones you can safely skip...",
    author: "Emma Chen",
    date: "May 15, 2025",
    readTime: "7 min read",
    category: "Travel",
    image: "bg-blue-100"
  },
  {
    id: 2,
    title: "Pet Insurance Explained: Coverage Options for Your Furry Friends",
    excerpt: "From accidents to hereditary conditions, learn what pet insurance covers and how to choose the right plan for your pet's needs...",
    author: "Marcus Johnson",
    date: "May 10, 2025",
    readTime: "5 min read",
    category: "Pet",
    image: "bg-purple-100"
  },
  {
    id: 3,
    title: "Auto Insurance Myths Debunked: What Really Affects Your Premium",
    excerpt: "The color of your car doesn't matter, but these surprising factors do. Discover what really impacts your auto insurance rates...",
    author: "Sofia Rodriguez",
    date: "May 5, 2025",
    readTime: "6 min read",
    category: "Auto",
    image: "bg-green-100"
  },
  {
    id: 4,
    title: "Health Insurance Terms Everyone Should Know",
    excerpt: "From deductibles to coinsurance, we break down the essential health insurance vocabulary you need to understand your coverage...",
    author: "David Kim",
    date: "April 28, 2025",
    readTime: "8 min read",
    category: "Health",
    image: "bg-red-100"
  },
  {
    id: 5,
    title: "The Future of Insurance: How AI is Changing the Industry",
    excerpt: "Artificial intelligence is revolutionizing how insurance works. Learn how these changes will affect your coverage and premiums...",
    author: "Aisha Washington",
    date: "April 20, 2025",
    readTime: "10 min read",
    category: "Technology",
    image: "bg-indigo-100"
  },
  {
    id: 6,
    title: "Insurance for Digital Nomads: What You Need to Know",
    excerpt: "Working remotely across multiple countries creates unique insurance challenges. Here's how to stay protected wherever you go...",
    author: "Liam O'Connor",
    date: "April 15, 2025",
    readTime: "9 min read",
    category: "Lifestyle",
    image: "bg-amber-100"
  }
];

// Featured post is the first one
const featuredPost = blogPosts[0];
// Regular posts are the rest
const regularPosts = blogPosts.slice(1);

export default function BlogPage() {
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
        <title>Briki Blog – Insurance Insights, Tips, and Expert Advice</title>
        <meta name="description" content="Stay informed with the latest insurance trends, tips, and expert advice from Briki. Learn how to save money and get better coverage." />
        <meta property="og:title" content="Briki Blog – Insurance Insights, Tips, and Expert Advice" />
        <meta property="og:description" content="Stay informed with the latest insurance trends, tips, and expert advice from Briki. Learn how to save money and get better coverage." />
        <meta property="og:type" content="website" />
        <meta name="robots" content="index, follow" />
      </Helmet>
      
      <main id="main-content">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white" aria-labelledby="blog-heading">
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
              <h1 id="blog-heading" className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Insurance <span className="text-primary">Insights</span> & Expertise
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Get helpful advice and perspectives from insurance experts who speak in plain language, not industry jargon.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Featured Post */}
        <section className="py-12 md:py-16" aria-labelledby="featured-post-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="featured-post-heading" className="text-2xl font-bold text-gray-900 mb-8">Featured Article</h2>
            
            <motion.div
              className="bg-white rounded-xl shadow-md overflow-hidden"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="md:flex">
                <div className={`md:w-1/3 ${featuredPost.image} p-6 flex items-center justify-center`}>
                  <div className="h-full w-full bg-gray-200 rounded-lg opacity-50" aria-hidden="true"></div>
                </div>
                <div className="p-6 md:p-8 md:w-2/3">
                  <div className="flex items-center gap-4 mb-4">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded inline-flex items-center">
                      <Tag className="h-3 w-3 mr-1" aria-hidden="true" />
                      {featuredPost.category}
                    </span>
                    <span className="text-sm text-gray-500 inline-flex items-center">
                      <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                      {featuredPost.readTime}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {featuredPost.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 mr-3" aria-hidden="true"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{featuredPost.author}</p>
                        <p className="text-xs text-gray-500">{featuredPost.date}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                      onClick={() => navigate(`/blog/${featuredPost.id}`)}
                      aria-label={`Read full article: ${featuredPost.title}`}
                    >
                      Read more 
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Regular Posts Grid */}
        <section className="py-12 md:py-16 bg-gray-50" aria-labelledby="latest-posts-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 id="latest-posts-heading" className="text-2xl font-bold text-gray-900 mb-8">Latest Articles</h2>
            
            <motion.div 
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
              {regularPosts.map((post) => (
                <motion.div
                  key={post.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden h-full flex flex-col"
                  variants={fadeIn}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className={`${post.image} p-4 h-40 flex items-center justify-center`}>
                    <div className="h-full w-full bg-gray-200 rounded-lg opacity-50" aria-hidden="true"></div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded inline-flex items-center">
                        <Tag className="h-3 w-3 mr-1" aria-hidden="true" />
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500 inline-flex items-center">
                        <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-6 flex-grow">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-400 to-indigo-400 mr-2" aria-hidden="true"></div>
                        <p className="text-xs text-gray-500">{post.author}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 text-sm"
                        onClick={() => navigate(`/blog/${post.id}`)}
                        aria-label={`Read full article: ${post.title}`}
                      >
                        Read more
                        <ArrowRight className="ml-1 h-3 w-3" aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white" aria-labelledby="newsletter-heading">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 id="newsletter-heading" className="text-3xl font-bold mb-4">Stay Informed</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Get our latest insurance insights delivered directly to your inbox.
              </p>
              <div className="flex flex-col md:flex-row gap-3 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 rounded-lg text-gray-900 w-full"
                  aria-label="Email address for newsletter"
                />
                <Button
                  className="bg-indigo-800 hover:bg-indigo-900 text-white md:px-8"
                  aria-label="Subscribe to newsletter"
                >
                  Subscribe
                </Button>
              </div>
              <p className="text-sm mt-4 text-blue-100">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}