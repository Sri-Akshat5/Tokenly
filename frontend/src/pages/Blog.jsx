import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight, Tag, Search, BookOpen } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import SEO from '../components/seo/SEO';
import blogPosts, { categories } from '../data/blogData';
import { FooterSection } from './Landing';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const categoryColors = {
    Authentication: 'from-blue-500/20 to-blue-600/5 border-blue-500/30 text-blue-400',
    Authorization: 'from-purple-500/20 to-purple-600/5 border-purple-500/30 text-purple-400',
    Platform: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30 text-emerald-400',
    'API Security': 'from-amber-500/20 to-amber-600/5 border-amber-500/30 text-amber-400',
    Architecture: 'from-rose-500/20 to-rose-600/5 border-rose-500/30 text-rose-400',
};

const categoryBadgeColors = {
    Authentication: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Authorization: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Platform: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'API Security': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Architecture: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

export default function Blog() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPosts = blogPosts.filter((post) => {
        const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
        const matchesSearch =
            searchQuery === '' ||
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const blogSchema = [
        {
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'Tokenly Blog',
            description:
                'Developer guides, tutorials, and insights on JWT authentication, OAuth 2.0, API security, and modern auth architecture.',
            url: 'https://tokenly.codes/blog',
            publisher: {
                '@type': 'Organization',
                name: 'Tokenly',
                url: 'https://tokenly.codes',
                logo: 'https://tokenly.codes/favicon.png',
            },
            blogPost: blogPosts.map((post) => ({
                '@type': 'BlogPosting',
                headline: post.title,
                description: post.description,
                datePublished: post.date,
                url: `https://tokenly.codes/blog/${post.slug}`,
                author: {
                    '@type': 'Person',
                    name: post.author.name,
                },
            })),
        },
    ];

    return (
        <div className="min-h-screen bg-black overflow-x-hidden">
            <SEO
                title="Blog – Developer Guides on JWT, OAuth & API Security"
                description="Read expert guides on JWT authentication, OAuth 2.0, magic link login, API key security, and multi-tenant auth architecture. Built by the Tokenly team."
                url="https://tokenly.codes/blog"
                schema={blogSchema}
            />

            {/* Subtle grid background */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10" />

            <Navbar />

            {/* Hero Section */}
            <section className="container mx-auto px-6 lg:px-12 pt-12 lg:pt-20 pb-16">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="text-center max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-full mb-8">
                        <BookOpen className="w-4 h-4 text-white" />
                        <span className="text-zinc-400 text-sm font-medium tracking-wide">
                            DEVELOPER BLOG
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
                        Auth Insights &{' '}
                        <span className="text-zinc-500">Developer Guides</span>
                    </h1>

                    <p className="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto mb-10">
                        Deep dives into JWT, OAuth, passwordless login, API security, and
                        modern authentication architecture — written for developers, by
                        developers.
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-md mx-auto mb-12">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search articles..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3.5 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-2xl text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-700 transition-all"
                        />
                    </div>
                </motion.div>

                {/* Category Filter */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeUp}
                    className="flex flex-wrap justify-center gap-3 mb-16"
                >
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${activeCategory === category
                                ? 'bg-white text-black shadow-lg shadow-white/20'
                                : 'bg-zinc-900/50 text-zinc-400 border border-zinc-800/50 hover:border-zinc-600 hover:text-white'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </motion.div>
            </section>

            {/* Blog Grid */}
            <section className="container mx-auto px-6 lg:px-12 pb-24">
                {filteredPosts.length > 0 ? (
                    <motion.div
                        key={activeCategory + searchQuery}
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {filteredPosts.map((post, index) => (
                            <BlogCard key={post.slug} post={post} index={index} />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <p className="text-zinc-500 text-lg">
                            No articles found matching your criteria.
                        </p>
                    </motion.div>
                )}
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-6 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden bg-gradient-to-br from-zinc-900 to-black border border-zinc-800/50 rounded-3xl p-8 md:p-16 text-center"
                >
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                            Ready to implement secure auth?
                        </h2>
                        <p className="text-lg text-zinc-400 max-w-xl mx-auto">
                            Stop reading about authentication. Start building with it. Tokenly
                            gives you production-ready auth APIs in minutes.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                            <Link to="/signup">
                                <button className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-zinc-100 hover:shadow-lg hover:shadow-white/20 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer">
                                    Start Building Free
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </Link>
                            <Link to="/docs">
                                <button className="px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-zinc-700 hover:border-white hover:bg-white/5 transition-all duration-300 cursor-pointer">
                                    View Documentation
                                </button>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </section>

            <FooterSection />
        </div>
    );
}

function BlogCard({ post }) {
    const colorClass = categoryColors[post.category] || categoryColors.Authentication;
    const badgeClass = categoryBadgeColors[post.category] || categoryBadgeColors.Authentication;

    return (
        <motion.div variants={cardVariants}>
            <Link to={`/blog/${post.slug}`} className="block group h-full">
                <article className="relative h-full bg-zinc-950/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl overflow-hidden hover:border-zinc-700 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/5 flex flex-col">
                    {/* Image Placeholder */}
                    <div
                        className={`relative h-48 bg-gradient-to-br ${colorClass} border-b border-zinc-800/50 flex items-center justify-center overflow-hidden`}
                    >
                        {post.coverImage ? (
                            <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                            />
                        ) : (
                            <>
                                {/* Animated background pattern */}
                                <div className="absolute inset-0 opacity-20">
                                    <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[size:2rem_2rem]" />
                                </div>

                                {/* Floating icon */}
                                <motion.div
                                    animate={{
                                        y: [0, -8, 0],
                                        rotate: [0, 3, -3, 0],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                    className="relative z-10"
                                >
                                    <div className="w-16 h-16 bg-black/30 backdrop-blur-sm border border-white/10 rounded-2xl flex items-center justify-center">
                                        <BookOpen className="w-8 h-8 text-white/70" />
                                    </div>
                                </motion.div>
                            </>
                        )}

                        {/* Shimmer overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                        {/* Category & Meta */}
                        <div className="flex items-center justify-between mb-4">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium border ${badgeClass}`}
                            >
                                {post.category}
                            </span>
                            <div className="flex items-center gap-3 text-zinc-600 text-xs">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(post.date).toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                    })}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {post.readTime}
                                </span>
                            </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-lg font-bold text-white mb-3 leading-snug group-hover:text-zinc-200 transition-colors line-clamp-2">
                            {post.title}
                        </h2>

                        {/* Description */}
                        <p className="text-zinc-500 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
                            {post.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="flex items-center gap-1 px-2 py-1 bg-zinc-900/50 border border-zinc-800/50 rounded-lg text-[11px] text-zinc-500"
                                >
                                    <Tag className="w-2.5 h-2.5" />
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Read More */}
                        <div className="flex items-center gap-2 text-sm font-medium text-zinc-400 group-hover:text-white transition-colors mt-auto">
                            Read Article
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </article>
            </Link>
        </motion.div>
    );
}
