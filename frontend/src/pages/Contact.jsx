import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { Mail, Linkedin, Github, Globe } from 'lucide-react';
import env from '../config/env';

export default function Contact() {
    return (
        <div className="min-h-screen bg-black overflow-x-hidden text-white flex flex-col">
            {/* Background Grid */}
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#18181b_1px,transparent_1px),linear-gradient(to_bottom,#18181b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] -z-10" />

            <Navbar />

            <main className="flex-grow container mx-auto px-6 py-20 lg:py-32 flex flex-col items-center text-center">
                <div className="max-w-3xl mx-auto space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/50 rounded-full">
                        <span className="text-zinc-400 text-sm font-medium tracking-wide">WE'RE HERE TO HELP</span>
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
                        Get in touch
                    </h1>

                    <p className="text-xl text-zinc-400 max-w-xl mx-auto leading-relaxed">
                        Have questions about {env.appName}? Want to discuss integration or enterprise needs? Reach out to us directly.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 w-full max-w-2xl text-left">
                        {/* LinkedIn Card */}
                        <a
                            href="https://www.linkedin.com/in/sriakshat5/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group p-8 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 hover:border-blue-500/50 rounded-2xl transition-all duration-300 hover:bg-zinc-900/80"
                        >
                            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Linkedin className="w-6 h-6 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">LinkedIn</h3>
                            <p className="text-zinc-400">Connect with me professionally. View updates and career info.</p>
                        </a>

                        {/* Email Card */}
                        <a
                            href="mailto:akshatsrivastava566@gmail.com"
                            className="group p-8 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 hover:border-emerald-500/50 rounded-2xl transition-all duration-300 hover:bg-zinc-900/80"
                        >
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Mail className="w-6 h-6 text-emerald-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Email</h3>
                            <p className="text-zinc-400">Shoot us an email for direct inquiries or support.</p>
                        </a>

                        {/* GitHub Card */}
                        <a
                            href="https://github.com/Sri-Akshat5/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group p-8 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 hover:border-zinc-500/50 rounded-2xl transition-all duration-300 hover:bg-zinc-900/80"
                        >
                            <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Github className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">GitHub</h3>
                            <p className="text-zinc-400">Check out the code and contribute to open source.</p>
                        </a>

                        {/* Website Card */}
                        <div
                            className="group p-8 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl"
                        >
                            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6">
                                <Globe className="w-6 h-6 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Website</h3>
                            <p className="text-zinc-400">You are already here! Explore our documentation.</p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="container mx-auto px-6 py-8 border-t border-zinc-900 text-center text-zinc-600 text-sm">
                <p>© 2026 {env.footerText}. All rights reserved.</p>
            </footer>
        </div>
    );
}
