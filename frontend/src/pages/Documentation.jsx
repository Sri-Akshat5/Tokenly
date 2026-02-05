import { Shield, ArrowLeft, Book, Code, Lock, Zap, Server, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import env from '../config/env';
import Button from '../components/ui/Button';

export default function Documentation() {
    return (
        <div className="min-h-screen bg-black text-zinc-300">
            {/* Navigation */}
            <nav className="border-b border-zinc-900 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-black" />
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">{env.appName} Docs</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link to="/login">
                            <Button variant="secondary" size="sm">Log In</Button>
                        </Link>
                        <Link to="/signup">
                            <Button size="sm">Get Started</Button>
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-12 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1 space-y-8">
                        <div>
                            <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-widest text-zinc-500">Getting Started</h3>
                            <ul className="space-y-3">
                                <li><a href="#introduction" className="hover:text-white transition-colors">Introduction</a></li>
                                <li><a href="#quickstart" className="hover:text-white transition-colors">Quickstart</a></li>
                                <li><a href="#core-concepts" className="hover:text-white transition-colors">Core Concepts</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-widest text-zinc-500">Authentication</h3>
                            <ul className="space-y-3">
                                <li><a href="#auth-overview" className="hover:text-white transition-colors">Overview</a></li>
                                <li><a href="#jwt" className="hover:text-white transition-colors">JWT Flow</a></li>
                                <li><a href="#magic-links" className="hover:text-white transition-colors">Magic Links</a></li>
                                <li><a href="#otp" className="hover:text-white transition-colors">One-Time Passwords</a></li>
                            </ul>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3 space-y-20">
                        <section id="introduction">
                            <h1 className="text-5xl font-bold text-white mb-6 tracking-tight">Introduction</h1>
                            <p className="text-xl leading-relaxed text-zinc-400 mb-8">
                                Welcome to the {env.appName} documentation. {env.appName} is a complete, multi-tenant authentication-as-a-service designed for developers who want to ship secure applications faster.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DocCard
                                    icon={<Zap className="w-6 h-6 text-white" />}
                                    title="Fast Integration"
                                    description="Get up and running in minutes with our RESTful APIs."
                                />
                                <DocCard
                                    icon={<Lock className="w-6 h-6 text-white" />}
                                    title="Enterprise Security"
                                    description="Bcrypt hashing, JWT tokens, and secure defaults."
                                />
                            </div>
                        </section>

                        <section id="quickstart">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                                    <Book className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-4xl font-bold text-white tracking-tight">Quickstart</h2>
                            </div>
                            <div className="space-y-6">
                                <Step number="1" title="Create an Account" description="Sign up for a Tokenly account to access the dashboard." />
                                <Step number="2" title="Create an Application" description="Define your application (Staging, Production) and configure auth settings." />
                                <Step number="3" title="Generate API Keys" description="Generate a public/private key pair to authenticate your API requests." />
                                <Step number="4" title="Integrate API" description="Use our endpoints to register and login users." />
                            </div>
                        </section>

                        <section id="core-concepts">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                                    <ShieldCheck className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-4xl font-bold text-white tracking-tight">Core Concepts</h2>
                            </div>
                            <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
                                Understanding the {env.appName} hierarchy is key to a successful integration. Our architecture is designed for multi-tenancy from the ground up.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                                <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                                    <div className="text-white font-bold mb-2">Project</div>
                                    <p className="text-zinc-500 text-sm italic mb-4">The Top-Level Entity</p>
                                    <p className="text-zinc-400 text-sm">A Project is the primary container for your resources. It groups multiple Applications and shares team members/billing.</p>
                                </div>
                                <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                                    <div className="text-white font-bold mb-2">Application</div>
                                    <p className="text-zinc-500 text-sm italic mb-4">The Logical Environment</p>
                                    <p className="text-zinc-400 text-sm">Represents a specific platform or environment (e.g., "iOS App", "Production Web"). Each app has its own users and auth settings.</p>
                                </div>
                                <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                                    <div className="text-white font-bold mb-2">User & Identity</div>
                                    <p className="text-zinc-500 text-sm italic mb-4">The Person</p>
                                    <p className="text-zinc-400 text-sm">A person belonging to a specific application. Users are isolated between applications by default for security.</p>
                                </div>
                                <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                                    <div className="text-white font-bold mb-2">API Keys</div>
                                    <p className="text-zinc-500 text-sm italic mb-4">The Security Pair</p>
                                    <p className="text-zinc-400 text-sm">We provide Public and Private keys. Public keys are for client-side use, while Private keys must remain secure on your server.</p>
                                </div>
                            </div>
                        </section>

                        <section id="auth-overview">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                                    <Lock className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-4xl font-bold text-white tracking-tight">Authentication Overview</h2>
                            </div>
                            <div className="space-y-8">
                                <p className="text-lg text-zinc-400 leading-relaxed">
                                    {env.appName} provides a multi-tenant authentication system. This means you can manage different user bases for different applications under a single {env.appName} account.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-950">
                                        <h4 className="text-white font-bold mb-2">Public Keys</h4>
                                        <p className="text-sm text-zinc-500 mb-4">Safe for use in browsers and mobile apps. prefixed with <code>pk_</code>.</p>
                                        <ul className="text-xs text-zinc-400 space-y-2">
                                            <li className="flex items-center gap-2 flex-shrink-0">✓ Initialize SDKs</li>
                                            <li className="flex items-center gap-2 flex-shrink-0">✓ Trigger Passwordless Flows</li>
                                        </ul>
                                    </div>
                                    <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-950">
                                        <h4 className="text-white font-bold mb-2">Private Keys</h4>
                                        <p className="text-sm text-zinc-500 mb-4">Server-to-server communication only. prefixed with <code>sk_</code>.</p>
                                        <ul className="text-xs text-zinc-400 space-y-2">
                                            <li className="flex items-center gap-2 flex-shrink-0">✓ Verify Tokens</li>
                                            <li className="flex items-center gap-2 flex-shrink-0">✓ Manage Users/Applications</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="authentication">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                                    <Lock className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-4xl font-bold text-white tracking-tight">Authentication Methods</h2>
                            </div>
                            <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
                                {env.appName} supports multiple authentication strategies to fit your application's security requirements.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-950">
                                    <h4 className="text-white font-bold mb-2">Stateless (JWT)</h4>
                                    <p className="text-sm text-zinc-500">Industry standard tokens for modern web and mobile apps. Scalable and secure.</p>
                                </div>
                                <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-950">
                                    <h4 className="text-white font-bold mb-2">Passwordless</h4>
                                    <p className="text-sm text-zinc-500">Improve UX and security with Magic Links and One-Time Passwords (OTP).</p>
                                </div>
                                <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-950">
                                    <h4 className="text-white font-bold mb-2">OAuth 2.0</h4>
                                    <p className="text-sm text-zinc-500">Allow users to log in with their favorite social providers (Coming Soon).</p>
                                </div>
                            </div>
                        </section>

                        <section id="jwt">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                                    <Shield className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-4xl font-bold text-white tracking-tight">JWT Flow</h2>
                            </div>
                            <div className="space-y-8">
                                <p className="text-zinc-400 leading-relaxed">
                                    JSON Web Tokens (JWT) allow for stateless authentication. {env.appName} uses a two-token system: <code>accessTokens</code> for short-lived authorization and <code>refreshTokens</code> for long-lived session management.
                                </p>

                                <div className="space-y-4">
                                    <h4 className="text-white font-bold">Refresh Token Rotation</h4>
                                    <p className="text-sm text-zinc-500">
                                        For maximum security, Tokenly implements <b>Refresh Token Rotation</b>. Every time a refresh token is used to get a new access token, the old refresh token is invalidated and a new one is issued. This prevents replay attacks.
                                    </p>
                                </div>

                                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                                    <div className="text-xs text-zinc-500 mb-4 uppercase tracking-widest font-bold">Sequence</div>
                                    <ol className="space-y-4">
                                        <li className="flex gap-4">
                                            <span className="text-white font-mono bg-zinc-800 px-2 rounded h-fit">1</span>
                                            <div>
                                                <span className="text-zinc-300 block font-medium">Authentication</span>
                                                <span className="text-sm text-zinc-500">Post credentials to <code>/auth/login</code> with your App ID.</span>
                                            </div>
                                        </li>
                                        <li className="flex gap-4">
                                            <span className="text-white font-mono bg-zinc-800 px-2 rounded h-fit">2</span>
                                            <div>
                                                <span className="text-zinc-300 block font-medium">Issue Tokens</span>
                                                <span className="text-sm text-zinc-500">Server returns <code>accessToken</code> (JWT) and a <code>refreshToken</code> (opaque).</span>
                                            </div>
                                        </li>
                                        <li className="flex gap-4">
                                            <span className="text-white font-mono bg-zinc-800 px-2 rounded h-fit">3</span>
                                            <div>
                                                <span className="text-zinc-300 block font-medium">Authorized Request</span>
                                                <span className="text-sm text-zinc-500">Include JWT in <code>Authorization: Bearer &lt;token&gt;</code> header.</span>
                                            </div>
                                        </li>
                                        <li className="flex gap-4">
                                            <span className="text-white font-mono bg-zinc-800 px-2 rounded h-fit">4</span>
                                            <div>
                                                <span className="text-zinc-300 block font-medium">Token Refresh</span>
                                                <span className="text-sm text-zinc-500">When JWT expires, use <code>/auth/refresh</code> to get a fresh pair.</span>
                                            </div>
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </section>

                        <section id="magic-links">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                                    <Zap className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-4xl font-bold text-white tracking-tight">Magic Links</h2>
                            </div>
                            <div className="space-y-8">
                                <p className="text-zinc-400 leading-relaxed">
                                    Magic links eliminate the need for passwords. Users enter their email, receive a secure link, and are automatically authenticated upon clicking it. This is the ultimate frictionless experience.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h4 className="text-white font-bold">1. Request Link</h4>
                                        <p className="text-sm text-zinc-500 mb-4">You trigger a request from your client or server providing the user's email.</p>
                                        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 font-mono text-[10px] text-green-400">
                                            POST /api/auth/magic-link/request
                                            <br />
                                            {'{ "email": "user@email.com" }'}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-white font-bold">2. Verify Token</h4>
                                        <p className="text-sm text-zinc-500 mb-4">When the user clicks the link, they land on your callback URL with a token parameter.</p>
                                        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 font-mono text-[10px] text-green-400">
                                            POST /api/auth/magic-link/verify
                                            <br />
                                            {'{ "token": "uuid-token" }'}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                    <div className="flex gap-3">
                                        <Shield className="w-5 h-5 text-blue-400 shrink-0" />
                                        <p className="text-xs text-blue-200 leading-relaxed">
                                            <b>Security:</b> Magic Link tokens are single-use and expire within 15 minutes by default. They are cryptographically secure and stored in an encrypted state in our Redis cache.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="otp">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                                    <Server className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-4xl font-bold text-white tracking-tight">One-Time Passwords</h2>
                            </div>
                            <div className="space-y-8">
                                <p className="text-zinc-400 leading-relaxed">
                                    OTPs provide an extra layer of security (MFA) or a standalone login method. A 6-digit code is sent via email or SMS, providing a secure way to verify identity without a permanent secret.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h4 className="text-white font-bold">Standalone Login</h4>
                                        <p className="text-sm text-zinc-500">Perfect for mobile apps where users prefer a quick code over a password.</p>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="text-white font-bold">Multi-Factor (MFA)</h4>
                                        <p className="text-sm text-zinc-500">Add an extra layer of security on top of standard email/password login.</p>
                                    </div>
                                </div>

                                <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold shrink-0">1</div>
                                        <div className="space-y-2">
                                            <p className="text-white font-medium text-sm">Request OTP</p>
                                            <p className="text-xs text-zinc-500">Call <code>/auth/otp/request</code>. {env.appName} generates a 6-digit code and sends it to the user.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-xs font-bold shrink-0">2</div>
                                        <div className="space-y-2">
                                            <p className="text-white font-medium text-sm">Verify OTP</p>
                                            <p className="text-xs text-zinc-500">User submits the code to <code>/auth/otp/verify</code>. If valid, a session is established.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section id="api-example">
                            <h2 className="text-3xl font-bold text-white mb-6 tracking-tight">Common API Reference</h2>
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden font-mono text-sm">
                                <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
                                    <span className="text-zinc-400">POST /api/auth/login</span>
                                    <span className="text-zinc-500">JSON</span>
                                </div>
                                <div className="p-6 overflow-x-auto text-zinc-300">
                                    <pre>{`{
  "email": "user@example.com",
  "password": "securepassword123",
  "appId": "your-app-id"
}`}</pre>
                                </div>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </div>
    );
}

function DocCard({ icon, title, description }) {
    return (
        <div className="p-6 bg-zinc-900/30 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all">
            <div className="mb-4">{icon}</div>
            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
        </div>
    );
}

function Step({ number, title, description }) {
    return (
        <div className="flex gap-6">
            <div className="flex-shrink-0 w-8 h-8 bg-white text-black rounded-full flex items-center justify-center font-bold">
                {number}
            </div>
            <div>
                <h4 className="text-white font-bold mb-1">{title}</h4>
                <p className="text-zinc-500 text-sm">{description}</p>
            </div>
        </div>
    );
}
