import React, { useState } from 'react';
import { PublicLayout } from '../components/layout/public-layout';
import { motion } from 'framer-motion';
import { useNavigation } from '../lib/navigation';
import { CalendarIcon, Clock, User, ArrowRight, Search } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  author_name: string;
  category_name?: string;
  category_slug?: string;
  category_color?: string;
  read_time: number;
  view_count: number;
  featured: boolean;
  published_at: string;
  tags: Array<{ id: number; name: string; slug: string }>;
}

interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  color: string;
}

export default function BlogPage() {
  const { navigate } = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Get blog posts
  const { data: posts = [], isLoading: postsLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog/posts', { category: selectedCategory, limit: 20 }],
  });

  // Get categories
  const { data: categories = [] } = useQuery<BlogCategory[]>({
    queryKey: ['/api/blog/categories'],
  });

  // Filter posts by search query
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const featuredPosts = filteredPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

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
        <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white" aria-labelledby="blog-heading">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-600/10 to-cyan-500/10 rounded-full opacity-70 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-600/10 to-cyan-500/10 rounded-full opacity-70 blur-3xl" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-center"
            >
              <h1 id="blog-heading" className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Insurance <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Insights</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Expert advice, tips, and insights to help you make informed insurance decisions. 
                Stay updated with the latest trends and save money on your coverage.
              </p>

              {/* Search and Filter */}
              <div className="max-w-2xl mx-auto mb-8">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search articles..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 py-3 text-lg"
                    />
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    <Button
                      variant={selectedCategory === '' ? 'default' : 'outline'}
                      onClick={() => setSelectedCategory('')}
                      className={`whitespace-nowrap ${selectedCategory === '' ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-600/25' : ''}`}
                    >
                      All
                    </Button>
                    {categories.map(category => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.slug ? 'default' : 'outline'}
                        onClick={() => setSelectedCategory(category.slug)}
                        className={`whitespace-nowrap ${selectedCategory === category.slug ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg hover:shadow-blue-600/25' : ''}`}
                      >
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Articles */}
        {featuredPosts.length > 0 && (
          <section className="py-16 bg-white" aria-labelledby="featured-heading">
            <div className="max-w-7xl mx-auto px-4">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                className="text-center mb-12"
              >
                <h2 id="featured-heading" className="text-3xl font-bold text-gray-900 mb-4">Featured Articles</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Our most popular and insightful articles to help you navigate the insurance landscape.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredPosts.slice(0, 3).map((post, index) => (
                  <BlogCard key={post.id} post={post} featured={true} index={index} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Regular Articles */}
        <section className="py-16 bg-gray-50" aria-labelledby="articles-heading">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-center mb-12"
            >
              <h2 id="articles-heading" className="text-3xl font-bold text-gray-900 mb-4">Latest Articles</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Stay informed with our latest insurance insights, tips, and industry updates.
              </p>
            </motion.div>

            {postsLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {regularPosts.map((post, index) => (
                  <BlogCard key={post.id} post={post} featured={false} index={index} />
                ))}
              </motion.div>
            )}

            {filteredPosts.length === 0 && !postsLoading && (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-500">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="text-white"
            >
              <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Insurance?</h2>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Get personalized recommendations from our AI assistant and compare plans from top providers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary"
                  onClick={() => navigate('/ask-briki')}
                  className="bg-white text-blue-600 hover:bg-gray-50 hover:shadow-lg hover:shadow-white/25"
                >
                  Get AI Recommendations
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/insurance')}
                  className="border-white text-white hover:bg-white/10 hover:border-white"
                >
                  Compare Plans
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </PublicLayout>
  );
}

interface BlogCardProps {
  post: BlogPost;
  featured: boolean;
  index: number;
}

function BlogCard({ post, featured, index }: BlogCardProps) {
  const { navigate } = useNavigation();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, delay: index * 0.1 }
    }
  };

  const publishedDate = new Date(post.published_at);

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={`
        bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer group
        ${featured ? 'ring-2 ring-blue-600/20' : ''}
      `}
      onClick={() => navigate(`/blog/${post.slug}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          navigate(`/blog/${post.slug}`);
        }
      }}
      aria-label={`Read article: ${post.title}`}
    >
      {/* Category badge and featured indicator */}
      <div className="p-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {post.category_name && (
              <span 
                className="px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-600 to-cyan-500 text-white"
              >
                {post.category_name}
              </span>
            )}
            {featured && (
              <span className="px-3 py-1 bg-gradient-to-r from-blue-600/10 to-cyan-500/10 text-blue-600 rounded-full text-xs font-medium">
                Featured
              </span>
            )}
          </div>
          <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
          {post.title}
        </h3>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>{post.author_name}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-3 h-3" />
              <span>{format(publishedDate, 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{post.read_time} min</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {post.tags.slice(0, 3).map(tag => (
              <span
                key={tag.id}
                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.article>
  );
}