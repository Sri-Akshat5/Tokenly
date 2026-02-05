import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import env from '../config/env';

export default function Terms() {
    return (
        <div className="min-h-screen bg-black text-zinc-300 py-20 px-6">
            <div className="max-w-3xl mx-auto">
                <Link to="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-12 group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                <div className="flex items-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/20">
                        <Shield className="w-7 h-7 text-black" />
                    </div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">{env.appName} Terms of Service</h1>
                </div>

                <div className="space-y-8 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                        <p>
                            By accessing or using the {env.appName} Auth-as-a-Service, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">2. Description of Service</h2>
                        <p>
                            {env.appName} provides authentication and user management services for multi-tenant applications. We provide APIs, dashboards, and security infrastructure to help developers secure their applications.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">3. User Accounts</h2>
                        <p>
                            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">4. Acceptable Use</h2>
                        <p>
                            You agree not to use {env.appName} for any illegal or unauthorized purpose. You must not violate any laws in your jurisdiction, including but not limited to copyright laws and data protection regulations.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">5. API Usage</h2>
                        <p>
                            Usage of our APIs is subject to rate limiting and quotas. We reserve the right to modify or discontinue service to any API key that we believe is being abused or used in a way that harms our infrastructure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">6. Limitation of Liability</h2>
                        <p>
                            {env.appName} is provided "as is" without any warranties. In no event shall we be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use of the service.
                        </p>
                    </section>

                    <footer className="pt-12 border-t border-zinc-900 text-sm text-zinc-500">
                        Last updated: February 5, 2026
                    </footer>
                </div>
            </div>
        </div>
    );
}
