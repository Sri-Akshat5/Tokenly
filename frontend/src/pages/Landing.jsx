import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
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
        <div className="min-h-screen bg-black">
            {/* Subtle grid background */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10" />

            {/* Navigation */}
            <nav className="container mx-auto px-6 py-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/20">
                            <Shield className="w-6 h-6 text-black" />
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight">{env.appName}</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link to="/login">
                            <button className="px-5 py-2.5 text-zinc-400 hover:text-white transition-colors font-medium">
                                Login
                            </button>
                        </Link>
                        <Link to="/signup">
                            <Button size="md">
                                Get Started
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto px-8 lg:px-12 pt-20 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    {/* Left Column - Text */}
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-full">
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                            <span className="text-zinc-400 text-sm font-medium tracking-wide">MULTI-TENANT AUTH-AS-A-SERVICE</span>
                        </div>

                        <h1 className="text-7xl font-bold text-white leading-[1.1] tracking-tight">
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
                    <div className="relative">
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
                    <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
                        Production-ready authentication without the complexity.
                    </h2>
                    <p className="text-2xl text-zinc-400">
                        One API. Multiple apps. Secure by default.
                    </p>
                </div>
            </section>

            {/* Problem Statement Section */}
            <section className="container mx-auto px-6 py-20 border-t border-zinc-900">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-950/20 border border-red-900/30 rounded-full text-red-400 text-sm font-medium mb-6">
                            <Shield className="w-4 h-4" />
                            THE PROBLEM
                        </span>
                        <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">
                            Building authentication is risky,<br />time-consuming, and easy to get wrong.
                        </h2>
                        <p className="text-2xl text-zinc-400 leading-relaxed">
                            {env.appName} centralizes authentication so teams can ship faster without compromising security.
                        </p>
                    </div>
                </div>
            </section>

            {/* What {env.appName} Does */}
            <section className="container mx-auto px-6 py-20 border-t border-zinc-900">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">
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

            {/* Security First Section */}
            <section className="container mx-auto px-6 py-20 border-t border-zinc-900">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-white text-sm font-medium mb-6">
                            <Shield className="w-4 h-4" />
                            SECURITY FIRST
                        </span>
                        <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">
                            Security is not an add-on.<br />It's the default.
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="p-6 bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-2xl text-center hover:border-white/20 transition-all hover:shadow-lg hover:shadow-white/5">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Lock className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Strong password hashing</h3>
                            <p className="text-zinc-400 text-sm">Bcrypt with configurable rounds</p>
                        </div>

                        <div className="p-6 bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-2xl text-center hover:border-white/20 transition-all hover:shadow-lg hover:shadow-white/5">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Database className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Application-level isolation</h3>
                            <p className="text-zinc-400 text-sm">Complete data separation</p>
                        </div>

                        <div className="p-6 bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-2xl text-center hover:border-white/20 transition-all hover:shadow-lg hover:shadow-white/5">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Key className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">API-key protected access</h3>
                            <p className="text-zinc-400 text-sm">Secure all endpoints by default</p>
                        </div>

                        <div className="p-6 bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-2xl text-center hover:border-white/20 transition-all hover:shadow-lg hover:shadow-white/5">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Stateless authentication</h3>
                            <p className="text-zinc-400 text-sm">JWT tokens, no server sessions</p>
                        </div>

                        <div className="p-6 bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-2xl text-center hover:border-white/20 transition-all hover:shadow-lg hover:shadow-white/5">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Production-safe defaults</h3>
                            <p className="text-zinc-400 text-sm">Secure out of the box</p>
                        </div>

                        <div className="p-6 bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-2xl text-center hover:border-white/20 transition-all hover:shadow-lg hover:shadow-white/5">
                            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <Zap className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">Rate limiting built-in</h3>
                            <p className="text-zinc-400 text-sm">Prevent abuse automatically</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Developer Confidence Section */}
            <section className="container mx-auto px-6 py-20 border-t border-zinc-900">
                <div className="max-w-4xl mx-auto bg-zinc-900/30 backdrop-blur-sm border border-zinc-800/50 rounded-3xl p-12 text-center">
                    <Terminal className="w-16 h-16 text-white mx-auto mb-6" />
                    <h2 className="text-4xl font-bold text-white mb-6 tracking-tight">
                        If you understand APIs, you can use {env.appName} in 10 minutes.
                    </h2>
                    <p className="text-xl text-zinc-400 mb-8">
                        No SDK lock-in. No black box. Just clean APIs.
                    </p>
                    <div className="flex gap-4 justify-center">
                        <Link to="/signup">
                            <Button size="lg">
                                Get Started Free
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                        <Link to="/docs">
                            <Button size="lg" variant="secondary">
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

            {/* Features Grid */}
            <section id="features" className="container mx-auto px-6 py-20 border-t border-zinc-900">
                <div className="text-center mb-20">
                    <h2 className="text-5xl font-bold text-white mb-6 tracking-tight">
                        Everything you need to ship faster
                    </h2>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                        Production-ready authentication with enterprise-grade security
                    </p>
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
            </section>

            {/* Stats Section */}
            <section className="container mx-auto px-6 py-32">
                <div className="relative bg-zinc-950/50 backdrop-blur-xl border border-zinc-800/50 rounded-3xl p-16 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent -z-10" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center relative z-10">
                        <div className="space-y-3">
                            <div className="text-6xl font-bold text-white mb-2 tracking-tight">
                                99.9%
                            </div>
                            <div className="text-zinc-300 text-lg font-medium">Uptime SLA</div>
                            <div className="text-sm text-zinc-600">Enterprise reliability</div>
                        </div>
                        <div className="space-y-3">
                            <div className="text-6xl font-bold text-white mb-2 tracking-tight">
                                50ms
                            </div>
                            <div className="text-zinc-300 text-lg font-medium">P95 Response Time</div>
                            <div className="text-sm text-zinc-600">Lightning fast APIs</div>
                        </div>
                        <div className="space-y-3">
                            <div className="text-6xl font-bold text-white mb-2 tracking-tight">
                                100K+
                            </div>
                            <div className="text-zinc-300 text-lg font-medium">API Calls Daily</div>
                            <div className="text-sm text-zinc-600">Scalable infrastructure</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-6 py-32">
                <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 to-black border border-zinc-800/50 rounded-3xl p-20 text-center">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-6xl font-bold text-white tracking-tight">Ready to get started?</h2>
                        <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                            Join thousands of developers building authentication the easy way.
                            Deploy in minutes, scale to millions.
                        </p>
                        <div className="flex gap-4 justify-center pt-4">
                            <Link to="/signup">
                                <Button size="lg">
                                    Start Building Free
                                </Button>
                            </Link>
                            <Link to="/docs">
                                <Button variant="secondary" size="lg">
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
