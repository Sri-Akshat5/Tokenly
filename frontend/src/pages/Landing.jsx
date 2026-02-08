import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import Button from '../components/ui/Button';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import Navbar from '../components/layout/Navbar';
import { Shield, Zap, Code2, Lock, Sparkles, Database, Key, Users, Terminal, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import env from '../config/env';

export default function Landing() {
    const apiFeatures = ['JWT', 'Bcrypt', 'OAuth', 'Redis', 'API Keys'];
    const [currentFeature, setCurrentFeature] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentFeature((prev) => (prev + 1) % apiFeatures.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-black overflow-x-hidden">
            {/* Subtle grid background */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10" />

            {/* Navigation */}
            <Navbar />

            {/* Hero Section */}
            <section className="container mx-auto px-6 lg:px-12 pt-12 lg:pt-20 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Column - Text */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-full">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            <span className="text-zinc-400 text-sm font-medium tracking-wide">MULTI-TENANT AUTH-AS-A-SERVICE</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                            Authentication, done once.
                            <br />
                            <span className="text-zinc-500">
                                Used everywhere.
                            </span>
                        </h1>

                        <p className="text-xl text-zinc-400 leading-relaxed max-w-xl">
                            {env.appName} is a secure, multi-tenant Auth-as-a-Service that lets you add <span className="text-white font-medium">login, signup, and token-based auth</span> to any app in minutes.
                        </p>

                        <div className="bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-2xl p-6 max-w-xl">
                            <p className="text-lg text-white font-semibold mb-2">
                                Stop building auth. Start building your product.
                            </p>
                            <p className="text-zinc-400">
                                {env.appName} handles users, passwords, tokens, and security — so you don't have to.
                            </p>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Link to="/docs">
                                <Button size="lg" className="group">
                                    Explore the Docs
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Button
                                variant="secondary"
                                size="lg"
                                onClick={() => {
                                    const featuresSection = document.getElementById('features');
                                    if (featuresSection) {
                                        featuresSection.scrollIntoView({ behavior: 'smooth' });
                                    }
                                }}
                            >
                                View Demo
                            </Button>
                        </div>

                        {/* Tech Stack */}
                        <div className="flex items-center gap-8 pt-8">
                            <span className="text-zinc-600 text-sm font-medium tracking-wide">WORKS WITH</span>
                            <div className="flex gap-4">
                                {[Terminal, Database, Code2].map((Icon, i) => (
                                    <div key={i} className="w-12 h-12 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-xl flex items-center justify-center hover:border-zinc-700 hover:bg-zinc-900 transition-all cursor-pointer">
                                        <Icon className="w-5 h-5 text-zinc-400" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Code Preview */}
                    <div className="relative w-full max-w-[90vw] lg:max-w-none mx-auto">
                        {/* Enhanced glow effects */}
                        <div className="absolute -inset-6 bg-gradient-to-r from-white/20 via-white/10 to-transparent blur-3xl -z-10" />
                        <div className="absolute -inset-3 bg-white/10 blur-2xl -z-10" />

                        <div className="bg-zinc-950 backdrop-blur-2xl border-2 border-zinc-700 rounded-2xl p-6 shadow-[0_20px_70px_rgba(255,255,255,0.15)] hover:shadow-[0_25px_90px_rgba(255,255,255,0.25)] transition-all duration-500 relative overflow-hidden ring-1 ring-white/20">
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 animate-shimmer pointer-events-none" />

                            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-zinc-800/50">
                                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                                <div className="w-3 h-3 rounded-full bg-zinc-700" />
                                <span className="ml-4 text-zinc-500 text-sm flex items-center gap-2">
                                    ~/workspace/
                                    <span className="text-white font-semibold transition-all duration-300">
                                        {apiFeatures[currentFeature]}.js
                                    </span>
                                </span>
                            </div>

                            <div className="overflow-x-auto pb-2">
                                <pre className="text-sm leading-relaxed">
                                    <code>
                                        <span className="text-zinc-700">// POST /api/auth/signup</span>
                                        {'\n'}
                                        <span className="text-zinc-600">const</span>{' '}
                                        <span className="text-white">response</span>{' '}
                                        <span className="text-zinc-600">=</span>{' '}
                                        <span className="text-zinc-600">await</span>{' '}
                                        <span className="text-white">fetch</span>
                                        <span className="text-zinc-500">{'('}</span>
                                        {'\n  '}
                                        <span className="text-zinc-400">'{env.apiBaseUrl}/auth/signup'</span>
                                        <span className="text-zinc-500">,</span>
                                        {'\n  '}
                                        <span className="text-zinc-500">{'{'}</span>
                                        {'\n    '}
                                        <span className="text-white">method:</span>{' '}
                                        <span className="text-zinc-400">'POST'</span>
                                        <span className="text-zinc-500">,</span>
                                        {'\n    '}
                                        <span className="text-white">headers:</span>{' '}
                                        <span className="text-zinc-500">{'{'}</span>
                                        {'\n      '}
                                        <span className="text-zinc-400">'X-API-Key'</span>
                                        <span className="text-zinc-500">:</span>{' '}
                                        <span className="text-zinc-400">'tk_live_...'</span>
                                        <span className="text-zinc-500">,</span>
                                        {'\n      '}
                                        <span className="text-zinc-400">'Content-Type'</span>
                                        <span className="text-zinc-500">:</span>{' '}
                                        <span className="text-zinc-400">'application/json'</span>
                                        {'\n    '}
                                        <span className="text-zinc-500">{'}'}</span>
                                        <span className="text-zinc-500">,</span>
                                        {'\n    '}
                                        <span className="text-white">body:</span>{' '}
                                        <span className="text-white">JSON</span>
                                        <span className="text-zinc-600">.</span>
                                        <span className="text-white">stringify</span>
                                        <span className="text-zinc-500">{'({'}</span>
                                        {'\n      '}
                                        <span className="text-white">email</span>
                                        <span className="text-zinc-500">,</span>
                                        {'\n      '}
                                        <span className="text-white">password</span>
                                        {'\n    '}
                                        <span className="text-zinc-500">{'})'}</span>
                                        {'\n  '}
                                        <span className="text-zinc-500">{')'}</span>
                                        <span className="text-zinc-500">;</span>
                                    </code>
                                </pre>
                            </div>

                            <div className="mt-4 pt-4 border-t border-zinc-800/50">
                                <div className="flex gap-3">
                                    <div className="px-3 py-1.5 bg-zinc-900 border border-zinc-800/50 rounded-lg text-sm flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-white" />
                                        <span className="font-medium text-white transition-all duration-300">
                                            {apiFeatures[currentFeature]}
                                        </span>
                                    </div>
                                    <div className="px-3 py-1.5 bg-zinc-900/50 border border-zinc-800/50 rounded-lg text-sm text-zinc-500">
                                        TypeScript
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Tagline Section */}
            <section className="container mx-auto px-6 pb-16">
                <div className="text-center max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                        Production-ready authentication without the complexity.
                    </h2>
                    <p className="text-xl md:text-2xl text-zinc-400">
                        One API. Multiple apps. Secure by default.
                    </p>
                </div>
            </section>

            {/* Problem Statement Section - Animated Scroll */}
            <ProblemSection />

            {/* What {env.appName} Does */}
            <section className="container mx-auto px-6 py-20 border-t border-zinc-900">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                            With {env.appName}, you can:
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex gap-4 p-6 bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-2xl hover:border-zinc-700 transition-colors">
                            <Database className="w-6 h-6 text-white flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Create multiple applications</h3>
                                <p className="text-zinc-400">(dev, staging, prod)</p>
                            </div>
                        </div>

                        <div className="flex gap-4 p-6 bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-2xl hover:border-zinc-700 transition-colors">
                            <Users className="w-6 h-6 text-white flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Manage users per application</h3>
                                <p className="text-zinc-400">Complete isolation between environments</p>
                            </div>
                        </div>

                        <div className="flex gap-4 p-6 bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-2xl hover:border-zinc-700 transition-colors">
                            <Key className="w-6 h-6 text-white flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Choose how authentication works</h3>
                                <p className="text-zinc-400">(Simple, JWT, OAuth, OTP)</p>
                            </div>
                        </div>

                        <div className="flex gap-4 p-6 bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-2xl hover:border-zinc-700 transition-colors">
                            <Lock className="w-6 h-6 text-white flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Secure passwords</h3>
                                <p className="text-zinc-400">Industry-grade bcrypt hashing</p>
                            </div>
                        </div>

                        <div className="flex gap-4 p-6 bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-2xl hover:border-zinc-700 transition-colors">
                            <Shield className="w-6 h-6 text-white flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">Issue stateless tokens securely</h3>
                                <p className="text-zinc-400">JWT with configurable expiration</p>
                            </div>
                        </div>

                        <div className="flex gap-4 p-6 bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-2xl hover:border-zinc-700 transition-colors">
                            <Terminal className="w-6 h-6 text-white flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-2">API-first design</h3>
                                <p className="text-zinc-400">Clean, RESTful endpoints</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Security First Section - Animated */}
            <SecuritySection />

            {/* Developer Confidence Section */}
            <section className="container mx-auto px-6 py-20 border-t border-zinc-900">
                <div className="max-w-4xl mx-auto bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-3xl p-8 md:p-12 text-center">
                    <Terminal className="w-16 h-16 text-white mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight">
                        If you understand APIs, you can use {env.appName} in 10 minutes.
                    </h2>
                    <p className="text-lg md:text-xl text-zinc-400 mb-8">
                        No SDK lock-in. No black box. Just clean APIs.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/signup">
                            <Button size="lg" className="w-full sm:w-auto justify-center">
                                Get Started Free
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        <Link to="/docs">
                            <Button size="lg" variant="secondary" className="w-full sm:w-auto justify-center">
                                View Documentation
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Credibility Section */}
            <section className="container mx-auto px-6 py-12">
                <div className="text-center">
                    <p className="text-zinc-500 text-lg">
                        Inspired by Auth0 and Firebase — built for developers who want more control.
                    </p>
                </div>
            </section>

            {/* Features Grid - Animated */}
            <FeaturesSection />

            {/* Stats Section */}
            <section className="container mx-auto px-6 py-10 md:py-20">
                <div className="relative bg-zinc-950/50 backdrop-blur-xl border border-zinc-800/50 rounded-3xl p-8 md:p-16 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent -z-10" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 text-center relative z-10">
                        <div className="space-y-3">
                            <div className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-tight">
                                <AnimatedCounter end={99.9} decimals={1} suffix="%" />
                            </div>
                            <div className="text-zinc-300 text-lg font-medium">Uptime SLA</div>
                            <div className="text-sm text-zinc-600">Enterprise reliability</div>
                        </div>
                        <div className="space-y-3">
                            <div className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-tight">
                                <AnimatedCounter end={50} suffix="ms" />
                            </div>
                            <div className="text-zinc-300 text-lg font-medium">P95 Response Time</div>
                            <div className="text-sm text-zinc-600">Lightning fast APIs</div>
                        </div>
                        <div className="space-y-3">
                            <div className="text-5xl md:text-6xl font-bold text-white mb-2 tracking-tight">
                                <AnimatedCounter end={100} suffix="K+" />
                            </div>
                            <div className="text-zinc-300 text-lg font-medium">API Calls Daily</div>
                            <div className="text-sm text-zinc-600">Scalable infrastructure</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-6 py-10 md:py-20">
                <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 to-black border border-zinc-800/50 rounded-3xl p-8 md:p-20 text-center">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">Ready to get started?</h2>
                        <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                            Join thousands of developers building authentication the easy way.
                            Deploy in minutes, scale to millions.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                            <Link to="/signup">
                                <Button size="lg" className="w-full sm:w-auto justify-center">
                                    Start Building Free
                                </Button>
                            </Link>
                            <Link to="/docs">
                                <Button variant="secondary" size="lg" className="w-full sm:w-auto justify-center">
                                    View Documentation
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="container mx-auto px-6 py-16 border-t border-zinc-900">
                <div className="text-center text-zinc-600">
                    <p className="text-sm">© 2026 {env.footerText}. Built with precision for developers worldwide.</p>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="group relative bg-zinc-950/50 backdrop-blur-xl border border-zinc-800/50 rounded-2xl p-8 hover:border-zinc-700 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 text-black shadow-lg group-hover:shadow-white/20 group-hover:scale-110 transition-all duration-500">
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h3>
                <p className="text-zinc-400 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

function ProblemSection() {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const backgroundColor = useTransform(
        scrollYProgress,
        [0.2, 0.4, 0.6, 0.8],
        ["#000000", "#ffffff", "#ffffff", "#000000"]
    );

    const textColor = useTransform(
        scrollYProgress,
        [0.2, 0.4, 0.6, 0.8],
        ["#ffffff", "#000000", "#000000", "#ffffff"]
    );

    const subTextColor = useTransform(
        scrollYProgress,
        [0.2, 0.4, 0.6, 0.8],
        ["#a1a1aa", "#52525b", "#52525b", "#a1a1aa"]
    );

    return (
        <motion.section
            ref={sectionRef}
            style={{ backgroundColor }}
            className="py-32 relative overflow-hidden"
        >
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-sm font-medium mb-8">
                            <Shield className="w-4 h-4" />
                            THE PROBLEM
                        </span>

                        <motion.h2
                            style={{ color: textColor }}
                            className="text-5xl md:text-7xl font-bold mb-8 tracking-tight"
                        >
                            Building authentication is risky,
                            <br />
                            <span className="opacity-80">time-consuming, and easy to get wrong.</span>
                        </motion.h2>

                        <motion.p
                            style={{ color: subTextColor }}
                            className="text-2xl md:text-3xl leading-relaxed font-medium max-w-3xl mx-auto"
                        >
                            {env.appName} centralizes authentication so teams can ship faster without compromising security.
                        </motion.p>
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
}

function FeaturesSection() {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const backgroundPositionY = useTransform(scrollYProgress, [0, 1], ["0%", "-400%"]);

    return (
        <section ref={sectionRef} id="features" className="relative py-24 overflow-hidden bg-black">
            {/* Parallax Grid Background - Dark Mode */}
            <motion.div
                style={{ backgroundPositionY }}
                className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none opacity-50"
            />

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight"
                    >
                        Everything you need to ship faster
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-zinc-400 max-w-2xl mx-auto"
                    >
                        Production-ready authentication with enterprise-grade security
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<Zap className="w-8 h-8" />}
                        title="Lightning Fast"
                        description="Optimized for performance with Redis caching and efficient database queries. Sub-50ms response times."
                    />
                    <FeatureCard
                        icon={<Lock className="w-8 h-8" />}
                        title="Secure by Default"
                        description="Industry-standard encryption, JWT tokens, and bcrypt password hashing out of the box."
                    />
                    <FeatureCard
                        icon={<Code2 className="w-8 h-8" />}
                        title="Developer First"
                        description="Beautiful documentation, clear APIs, and code examples in every language you need."
                    />
                    <FeatureCard
                        icon={<Database className="w-8 h-8" />}
                        title="Custom Fields"
                        description="Add unlimited custom fields to user profiles. String, number, boolean, or date types."
                    />
                    <FeatureCard
                        icon={<Key className="w-8 h-8" />}
                        title="API Key Management"
                        description="Generate, rotate, and revoke API keys with fine-grained scopes and rate limiting."
                    />
                    <FeatureCard
                        icon={<Users className="w-8 h-8" />}
                        title="User Management"
                        description="Complete user administration dashboard. Search, filter, block, and manage users effortlessly."
                    />
                </div>
            </div>
        </section>
    );
}

function SecuritySection() {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    const backgroundPositionY = useTransform(scrollYProgress, [0, 1], ["0%", "-400%"]);

    return (
        <section ref={sectionRef} className="relative py-32 overflow-hidden bg-white">
            {/* Parallax Grid Background - Infinite Scroll */}
            <motion.div
                style={{ backgroundPositionY }}
                className="absolute inset-0 bg-[linear-gradient(to_right,#d4d4d8_1px,transparent_1px),linear-gradient(to_bottom,#d4d4d8_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"
            />

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row gap-20">
                    {/* Sticky Title */}
                    <div className="lg:w-1/3">
                        <div className="sticky top-32">
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-800 rounded-full text-sm bg-white font-medium mb-8 "
                            >
                                <Shield className="w-4 h-4 text-red-700 bg-red-50/50 backdrop-blur-sm animate-pulse" />
                                SECURITY FIRST
                            </motion.span>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-6xl font-bold mb-8 tracking-tight leading-tight text-black"
                            >
                                Security is not an add-on.
                                <br />
                                <span className="text-zinc-700">It's the default.</span>
                            </motion.h2>
                        </div>
                    </div>

                    {/* Scrolling Cards */}
                    <div className="lg:w-2/3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <SecurityCard
                                icon={<Lock className="w-6 h-6" />}
                                title="Strong password hashing"
                                description="Bcrypt with configurable rounds"
                                delay={0}
                            />
                            <SecurityCard
                                icon={<Database className="w-6 h-6" />}
                                title="App-level isolation"
                                description="Complete data separation"
                                delay={0.1}
                            />
                            <SecurityCard
                                icon={<Key className="w-6 h-6" />}
                                title="API-key protected"
                                description="Secure all endpoints"
                                delay={0.2}
                            />
                            <SecurityCard
                                icon={<Shield className="w-6 h-6" />}
                                title="Stateless auth"
                                description="JWT tokens, no sessions"
                                delay={0.3}
                            />
                            <SecurityCard
                                icon={<CheckCircle2 className="w-6 h-6" />}
                                title="Production-safe"
                                description="Secure out of the box"
                                delay={0.4}
                            />
                            <SecurityCard
                                icon={<Zap className="w-6 h-6" />}
                                title="Rate limiting"
                                description="Prevent abuse automatically"
                                delay={0.5}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function SecurityCard({ icon, title, description, delay }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay }}
            className="p-8 bg-zinc-100 border border-zinc-200 rounded-2xl hover:border-zinc-300 transition-all hover:shadow-lg hover:shadow-zinc-200/50"
        >
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm border border-zinc-100">
                <div className="text-black">
                    {icon}
                </div>
            </div>
            <h3 className="text-lg font-bold text-black mb-2">{title}</h3>
            <p className="text-zinc-500 text-sm leading-relaxed">{description}</p>
        </motion.div>
    );
}
