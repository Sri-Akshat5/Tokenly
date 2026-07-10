import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    ArrowLeft,
    ArrowRight,
    Tag,
    ChevronRight,
    BookOpen,
    Share2,
    Copy,
    Check,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import SEO from '../components/seo/SEO';
import blogPosts from '../data/blogData';
import { FooterSection } from './Landing';
import env from '../config/env';

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
    }),
};

const categoryBadgeColors = {
    Authentication: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    Authorization: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    Platform: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'API Security': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Architecture: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
};

const categoryHeroColors = {
    Authentication: 'from-blue-500/20 to-blue-900/5',
    Authorization: 'from-purple-500/20 to-purple-900/5',
    Platform: 'from-emerald-500/20 to-emerald-900/5',
    'API Security': 'from-amber-500/20 to-amber-900/5',
    Architecture: 'from-rose-500/20 to-rose-900/5',
};

export default function BlogPost() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const [activeHeading, setActiveHeading] = useState('');

    const postIndex = blogPosts.findIndex((p) => p.slug === slug);
    const post = blogPosts[postIndex];

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [slug]);

    // Track active heading for ToC highlight
    useEffect(() => {
        if (!post) return;
        const headings = post.content
            .filter((b) => b.type === 'heading' && b.id)
            .map((b) => b.id);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveHeading(entry.target.id);
                    }
                });
            },
            { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
        );

        headings.forEach((id) => {
            const el = document.getElementById(id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [post, slug]);

    if (!post) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Post Not Found</h1>
                    <Link
                        to="/blog"
                        className="text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    const headings = post.content.filter((b) => b.type === 'heading' && b.id);
    const relatedPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);
    const prevPost = postIndex > 0 ? blogPosts[postIndex - 1] : null;
    const nextPost = postIndex < blogPosts.length - 1 ? blogPosts[postIndex + 1] : null;

    const badgeClass = categoryBadgeColors[post.category] || categoryBadgeColors.Authentication;
    const heroColor = categoryHeroColors[post.category] || categoryHeroColors.Authentication;

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`https://tokenly.codes/blog/${post.slug}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const postSchema = [
        {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            dateModified: post.date,
            url: `https://tokenly.codes/blog/${post.slug}`,
            author: {
                '@type': 'Person',
                name: post.author.name,
            },
            publisher: {
                '@type': 'Organization',
                name: 'Tokenly',
                url: 'https://tokenly.codes',
                logo: 'https://tokenly.codes/favicon.png',
            },
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': `https://tokenly.codes/blog/${post.slug}`,
            },
            keywords: post.tags.join(', '),
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://tokenly.codes/',
                },
                {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Blog',
                    item: 'https://tokenly.codes/blog',
                },
                {
                    '@type': 'ListItem',
                    position: 3,
                    name: post.title,
                    item: `https://tokenly.codes/blog/${post.slug}`,
                },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-black overflow-x-hidden">
            <SEO
                title={post.title}
                description={post.description}
                url={`https://tokenly.codes/blog/${post.slug}`}
                schema={postSchema}
                ogType="article"
                keywords={post.tags.join(', ')}
                date={post.date}
                authorName={post.author.name}
                tags={post.tags}
            />

            {/* Subtle grid background */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10" />

            <Navbar />

            {/* Breadcrumbs */}
            <div className="container mx-auto px-6 lg:px-12 pt-6">
                <motion.nav
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-2 text-sm text-zinc-500"
                >
                    <Link to="/" className="hover:text-white transition-colors">
                        Home
                    </Link>
                    <ChevronRight className="w-3 h-3" />
                    <Link to="/blog" className="hover:text-white transition-colors">
                        Blog
                    </Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-zinc-400 truncate max-w-[200px]">{post.title}</span>
                </motion.nav>
            </div>

            {/* Hero / Header */}
            <section className="container mx-auto px-6 lg:px-12 pt-8 pb-8">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    className="max-w-4xl mx-auto"
                >
                    {/* Image Placeholder Hero */}
                    <motion.div
                        variants={fadeUp}
                        className={`relative w-full h-64 md:h-80 rounded-3xl bg-gradient-to-br ${heroColor} border border-zinc-800/50 mb-10 overflow-hidden flex items-center justify-center`}
                    >
                        {post.coverImage ? (
                            <img
                                src={post.coverImage}
                                alt={post.title}
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                            />
                        ) : (
                            <>
                                {/* Grid overlay */}
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:3rem_3rem]" />

                                {/* Animated floating elements */}
                                <motion.div
                                    animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
                                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                                    className="relative z-10"
                                >
                                    <div className="w-20 h-20 bg-black/30 backdrop-blur-md border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl">
                                        <BookOpen className="w-10 h-10 text-white/60" />
                                    </div>
                                </motion.div>
                            </>
                        )}

                        {/* Shimmer */}
                        <div className="absolute inset-0 animate-shimmer pointer-events-none" />
                    </motion.div>

                    {/* Meta */}
                    <motion.div
                        variants={fadeUp}
                        custom={1}
                        className="flex flex-wrap items-center gap-4 mb-6"
                    >
                        <span
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border ${badgeClass}`}
                        >
                            {post.category}
                        </span>
                        <div className="flex items-center gap-4 text-zinc-500 text-sm">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {new Date(post.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                {post.readTime}
                            </span>
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        variants={fadeUp}
                        custom={2}
                        className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight mb-6"
                    >
                        {post.title}
                    </motion.h1>

                    {/* Description */}
                    <motion.p
                        variants={fadeUp}
                        custom={3}
                        className="text-lg text-zinc-400 leading-relaxed mb-6"
                    >
                        {post.description}
                    </motion.p>

                    {/* Tags + Share */}
                    <motion.div
                        variants={fadeUp}
                        custom={4}
                        className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-zinc-800/50"
                    >
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-zinc-900/50 border border-zinc-800/50 rounded-lg text-xs text-zinc-500"
                                >
                                    <Tag className="w-3 h-3" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <button
                            onClick={handleCopyLink}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 border border-zinc-800/50 rounded-xl text-sm text-zinc-400 hover:text-white hover:border-zinc-600 transition-all cursor-pointer"
                        >
                            {copied ? (
                                <>
                                    <Check className="w-4 h-4 text-emerald-400" />
                                    <span className="text-emerald-400">Copied!</span>
                                </>
                            ) : (
                                <>
                                    <Share2 className="w-4 h-4" />
                                    Share
                                </>
                            )}
                        </button>
                    </motion.div>
                </motion.div>
            </section>

            {/* Content + Sidebar */}
            <section className="container mx-auto px-6 lg:px-12 pb-20">
                <div className="max-w-6xl mx-auto flex gap-12">
                    {/* Main Content */}
                    <motion.article
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex-1 max-w-4xl"
                    >
                        {post.content.map((block, i) => (
                            <ContentBlock key={i} block={block} index={i} />
                        ))}
                    </motion.article>

                    {/* Table of Contents Sidebar */}
                    {headings.length > 0 && (
                        <motion.aside
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                            className="hidden xl:block w-64 flex-shrink-0"
                        >
                            <div className="sticky top-8">
                                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
                                    On This Page
                                </h4>
                                <nav className="space-y-1">
                                    {headings.map((heading) => (
                                        <a
                                            key={heading.id}
                                            href={`#${heading.id}`}
                                            className={`block text-sm py-1.5 border-l-2 pl-4 transition-all duration-200 ${activeHeading === heading.id
                                                ? 'text-white border-white'
                                                : 'text-zinc-600 border-zinc-800 hover:text-zinc-300 hover:border-zinc-500'
                                                }`}
                                        >
                                            {heading.text}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        </motion.aside>
                    )}
                </div>
            </section>

            {/* Prev / Next Navigation */}
            <section className="container mx-auto px-6 lg:px-12 pb-16">
                <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                    {prevPost ? (
                        <Link
                            to={`/blog/${prevPost.slug}`}
                            className="group p-6 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl hover:border-zinc-700 transition-all duration-300"
                        >
                            <span className="text-xs text-zinc-600 uppercase tracking-wider">
                                Previous
                            </span>
                            <p className="text-white font-medium mt-2 group-hover:text-zinc-200 transition-colors flex items-center gap-2">
                                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                {prevPost.title}
                            </p>
                        </Link>
                    ) : (
                        <div />
                    )}
                    {nextPost && (
                        <Link
                            to={`/blog/${nextPost.slug}`}
                            className="group p-6 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl hover:border-zinc-700 transition-all duration-300 text-right"
                        >
                            <span className="text-xs text-zinc-600 uppercase tracking-wider">
                                Next
                            </span>
                            <p className="text-white font-medium mt-2 group-hover:text-zinc-200 transition-colors flex items-center justify-end gap-2">
                                {nextPost.title}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </p>
                        </Link>
                    )}
                </div>
            </section>

            {/* Related Posts */}
            <section className="container mx-auto px-6 lg:px-12 pb-20">
                <div className="max-w-6xl mx-auto">
                    <h3 className="text-2xl font-bold text-white mb-8 tracking-tight">
                        More Articles
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {relatedPosts.map((related) => (
                            <Link
                                key={related.slug}
                                to={`/blog/${related.slug}`}
                                className="group p-6 bg-zinc-950/50 border border-zinc-800/50 rounded-2xl hover:border-zinc-700 hover:-translate-y-1 transition-all duration-300"
                            >
                                <span
                                    className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-medium border mb-3 ${categoryBadgeColors[related.category] ||
                                        categoryBadgeColors.Authentication
                                        }`}
                                >
                                    {related.category}
                                </span>
                                <h4 className="text-white font-semibold mb-2 group-hover:text-zinc-200 transition-colors line-clamp-2">
                                    {related.title}
                                </h4>
                                <p className="text-zinc-500 text-sm line-clamp-2">
                                    {related.description}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="container mx-auto px-6 lg:px-12 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden bg-gradient-to-br from-zinc-900 to-black border border-zinc-800/50 rounded-3xl p-8 md:p-16 text-center max-w-4xl mx-auto"
                >
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
                            Try Tokenly for free
                        </h2>
                        <p className="text-lg text-zinc-400 max-w-xl mx-auto">
                            Add JWT, OAuth, magic links, and API key auth to your app in
                            minutes. No SDK lock-in.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                            {import.meta.env.VITE_INTERNAL_USE === 'true' ? (
                                <a
                                    href="https://github.com/Sri-Akshat5/Tokenly"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <button className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-zinc-100 hover:shadow-lg hover:shadow-white/20 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer">
                                        Clone Repository
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </a>
                            ) : (
                                <Link to="/signup">
                                    <button className="px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-zinc-100 hover:shadow-lg hover:shadow-white/20 transition-all duration-300 inline-flex items-center gap-2 cursor-pointer">
                                        Start Building Free
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </Link>
                            )}
                            <Link to="/docs">
                                <button className="px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-zinc-700 hover:border-white hover:bg-white/5 transition-all duration-300 cursor-pointer">
                                    Read the Docs
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

function ContentBlock({ block, index }) {
    switch (block.type) {
        case 'heading':
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.4 }}
                >
                    {block.level === 2 ? (
                        <h2
                            id={block.id}
                            className="text-2xl md:text-3xl font-bold text-white mt-14 mb-5 tracking-tight scroll-mt-8"
                        >
                            {block.text}
                        </h2>
                    ) : (
                        <h3
                            id={block.id}
                            className="text-xl md:text-2xl font-semibold text-white mt-10 mb-4 tracking-tight scroll-mt-8"
                        >
                            {block.text}
                        </h3>
                    )}
                </motion.div>
            );

        case 'paragraph':
            return (
                <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.4 }}
                    className="text-zinc-400 text-lg leading-relaxed mb-6"
                >
                    {block.text}
                </motion.p>
            );

        case 'list':
            return (
                <motion.ul
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.4 }}
                    className="space-y-3 mb-8 pl-2"
                >
                    {block.items.map((item, i) => (
                        <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                            className="flex items-start gap-3 text-zinc-400 text-base leading-relaxed"
                        >
                            <span className="w-1.5 h-1.5 bg-white rounded-full mt-2.5 flex-shrink-0" />
                            {item}
                        </motion.li>
                    ))}
                </motion.ul>
            );

        case 'code':
            return (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.5 }}
                    className="my-8 relative group"
                >
                    <div className="bg-zinc-950 border border-zinc-800/50 rounded-2xl overflow-hidden">
                        {/* Header bar */}
                        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800/50 bg-zinc-900/30">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                            </div>
                            <span className="text-xs text-zinc-600 font-mono">
                                {block.language}
                            </span>
                        </div>
                        {/* Code */}
                        <div className="overflow-x-auto p-5">
                            <pre className="text-sm text-zinc-300 leading-relaxed">
                                <code>{block.code}</code>
                            </pre>
                        </div>
                    </div>
                    {/* Copy button */}
                    <CopyCodeButton code={block.code} />
                </motion.div>
            );

        case 'image':
            return (
                <motion.figure
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '-30px' }}
                    transition={{ duration: 0.5 }}
                    className="my-10"
                >
                    <div className="relative w-full rounded-2xl overflow-hidden bg-zinc-900/50 border border-zinc-800/50 flex justify-center">
                        {block.src ? (
                            <img
                                src={block.src}
                                alt={block.alt}
                                className="max-w-full h-auto max-h-[500px] object-contain block py-4"
                            />
                        ) : (
                            <div className="relative w-full h-56 md:h-72 bg-gradient-to-br from-zinc-800/30 to-zinc-900/50 flex items-center justify-center">
                                {/* Grid pattern */}
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:2rem_2rem]" />

                                {/* Floating placeholder icon */}
                                <motion.div
                                    animate={{ y: [0, -10, 0] }}
                                    transition={{
                                        duration: 5,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                    className="flex flex-col items-center gap-3 relative z-10"
                                >
                                    <div className="w-14 h-14 bg-zinc-800/50 border border-zinc-700/50 rounded-2xl flex items-center justify-center">
                                        <BookOpen className="w-7 h-7 text-zinc-500" />
                                    </div>
                                    <span className="text-xs text-zinc-600 max-w-48 text-center">
                                        {block.alt}
                                    </span>
                                </motion.div>

                                {/* Decorative blur */}
                                <div className="absolute top-6 right-10 w-24 h-24 bg-white/3 rounded-full blur-2xl" />
                                <div className="absolute bottom-6 left-10 w-32 h-32 bg-white/2 rounded-full blur-3xl" />
                            </div>
                        )}
                    </div>
                    {block.caption && (
                        <figcaption className="text-center text-sm text-zinc-600 mt-3 italic">
                            {block.caption}
                        </figcaption>
                    )}
                </motion.figure>
            );

        default:
            return null;
    }
}

function CopyCodeButton({ code }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-2 bg-zinc-800/80 border border-zinc-700/50 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-700 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            title="Copy code"
        >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
    );
}
