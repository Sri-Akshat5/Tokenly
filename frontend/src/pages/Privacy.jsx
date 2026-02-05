import { Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import env from '../config/env';

export default function Privacy() {
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
                    <h1 className="text-3xl font-bold text-white tracking-tight">{env.appName} Privacy Policy</h1>
                </div>

                <div className="space-y-8 leading-relaxed">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">1. Data Collection</h2>
                        <p>
                            We collect information necessary to provide our authentication services, including email addresses, hashed passwords, and metadata about the applications you create on {env.appName}.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">2. Use of Information</h2>
                        <p>
                            Your information is used solely to provide and improve our service. We do not sell your personal data to third parties. We use industry-standard encryption to protect all sensitive information.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">3. Cookies and Tracking</h2>
                        <p>
                            We use essential cookies to maintain your session and provide security. We do not use third-party tracking cookies for advertising purposes.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">4. Security</h2>
                        <p>
                            Security is our top priority. We use bcrypt for password hashing, JWT for stateless authentication, and TLS for all data transmission. We regularly audit our systems for vulnerabilities.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-4">5. Your Rights</h2>
                        <p>
                            You have the right to access, collect, or delete your personal data. You can manage your account and application data through our dashboard or by contacting our support.
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
