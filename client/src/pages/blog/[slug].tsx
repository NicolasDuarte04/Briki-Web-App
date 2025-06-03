import React from 'react';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { PublicLayout } from '@/components/layout/public-layout';
import { motion } from 'framer-motion';
import { CalendarIcon, Clock, User, ArrowLeft, Share2, Eye } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { useNavigation } from '@/lib/navigation';
import { format } from 'date-fns';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  author_name: string;
  author_email: string;
  category_name?: string;
  category_slug?: string;
  category_color?: string;
  status: string;
  read_time: number;
  view_count: number;
  featured: boolean;
  seo_title?: string;
  seo_description?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  tags?: Array<{ id: number; name: string; slug: string }>;
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { navigate } = useNavigation();

  const { data: post, isLoading, error } = useQuery<BlogPost>({
    queryKey: ['/api/blog/posts', slug],
    queryFn: () => fetch(`/api/blog/posts/${slug}`).then(res => {
      if (!res.ok) throw new Error('Post not found');
      return res.json();
    }),
    enabled: !!slug,
  });

  const sharePost = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        // Fall back to copying link
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      // Fall back to copying link
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (isLoading) {
    return (
      <PublicLayout>
        <main className="min-h-screen bg-gray-50">
          {/* Header skeleton */}
          <div className="bg-white border-b">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <div className="w-24 h-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          
          {/* Content skeleton */}
          <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-8 animate-pulse">
              {/* Category badge skeleton */}
              <div className="w-20 h-6 bg-gray-200 rounded-full mb-4"></div>
              
              {/* Title skeleton */}
              <div className="space-y-3 mb-6">
                <div className="h-6 sm:h-8 bg-gray-200 rounded"></div>
                <div className="h-6 sm:h-8 bg-gray-200 rounded w-4/5"></div>
              </div>
              
              {/* Excerpt skeleton */}
              <div className="space-y-2 mb-6">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              
              {/* Meta info skeleton */}
              <div className="flex flex-wrap gap-4 mb-8 pb-6 border-b">
                <div className="w-20 h-4 bg-gray-200 rounded"></div>
                <div className="w-24 h-4 bg-gray-200 rounded"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
              
              {/* Content skeleton */}
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </main>
      </PublicLayout>
    );
  }

  if (error || !post) {
    return (
      <PublicLayout>
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-6">The article you're looking for doesn't exist or has been moved.</p>
            <Button onClick={() => navigate('/blog')} className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Button>
          </div>
        </main>
      </PublicLayout>
    );
  }

  const publishedDate = post.published_at ? new Date(post.published_at) : new Date(post.created_at);

  return (
    <PublicLayout>
      <Helmet>
        <title>{post.seo_title || post.title} - Briki Blog</title>
        <meta name="description" content={post.seo_description || post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="article:author" content={post.author_name} />
        <meta property="article:published_time" content={post.published_at} />
        {post.category_name && <meta property="article:section" content={post.category_name} />}
        {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && post.tags.map(tag => (
          <meta key={tag.id} property="article:tag" content={tag.name} />
        ))}
      </Helmet>

      <main id="main-content" className="min-h-screen bg-gray-50">
        {/* Header with back button */}
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/blog')}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Button>
          </div>
        </div>

        {/* Article content */}
        <article className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden"
          >
            {/* Featured image */}
            {post.featured_image && (
              <div className="w-full h-48 sm:h-64 md:h-80 overflow-hidden">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Article header */}
            <div className="p-4 sm:p-8 pb-4 sm:pb-6">
              {post.category_name && (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span 
                    className="px-3 py-1 rounded-full text-xs sm:text-sm font-medium text-white"
                    style={{ backgroundColor: post.category_color || '#3B82F6' }}
                  >
                    {post.category_name}
                  </span>
                  {post.featured && (
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs sm:text-sm font-medium">
                      Featured
                    </span>
                  )}
                </div>
              )}

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {post.title}
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 mb-6 leading-relaxed">
                {post.excerpt}
              </p>

              {/* Article meta */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-gray-500 pb-4 sm:pb-6 border-b">
                <div className="flex items-center gap-1 sm:gap-2">
                  <User className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>By {post.author_name}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{format(publishedDate, 'MMMM d, yyyy')}</span>
                  <span className="sm:hidden">{format(publishedDate, 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{post.read_time} min read</span>
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{post.view_count} views</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={sharePost}
                  className="flex items-center gap-1 sm:gap-2 ml-auto text-xs sm:text-sm p-1 sm:p-2"
                >
                  <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </div>
            </div>

            {/* Article content */}
            <div className="px-8 pb-8">
              <div 
                className="prose prose-lg max-w-none prose-blue prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-a:text-blue-600 hover:prose-a:text-blue-800"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                <div className="mt-8 pt-8 border-t">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <span
                        key={tag.id}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 cursor-pointer transition-colors"
                        onClick={() => navigate(`/blog?tag=${tag.slug}`)}
                      >
                        #{tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Call to action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-center text-white"
          >
            <h2 className="text-2xl font-bold mb-4">Ready to Find Your Perfect Insurance?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Get personalized insurance recommendations with our AI-powered platform. Compare plans, save money, and get covered in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate('/ask-briki')}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Get Recommendations
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/insurance')}
                className="border-white text-white hover:bg-white hover:text-blue-600"
              >
                Compare Plans
              </Button>
            </div>
          </motion.div>
        </article>
      </main>
    </PublicLayout>
  );
}