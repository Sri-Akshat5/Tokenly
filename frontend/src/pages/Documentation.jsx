import { Shield, Book, Code, Lock, Zap, Server, Key, Users, Settings as SettingsIcon, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import env from '../config/env';
import Button from '../components/ui/Button';

export default function Documentation() {
    const [activeSection, setActiveSection] = useState('introduction');

    const scrollToSection = (id) => {
        setActiveSection(id);
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="min-h-screen bg-black text-zinc-300">
            {/* Navigation */}
            <nav className="border-b border-zinc-900 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                            <img src="/favicon.png" alt="Tokenly Logo" className="w-8 h-8 object-contain" />
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
                    {/* Sticky Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="lg:sticky lg:top-24 space-y-8">
                            <NavSection
                                title="Getting Started"
                                items={[
                                    { id: 'introduction', label: 'Introduction' },
                                    { id: 'quickstart', label: 'Quickstart' },
                                    { id: 'core-concepts', label: 'Core Concepts' },
                                ]}
                                activeSection={activeSection}
                                scrollToSection={scrollToSection}
                            />
                            <NavSection
                                title="Authentication"
                                items={[
                                    { id: 'auth-overview', label: 'Overview' },
                                    { id: 'email-password', label: 'Email & Password' },
                                    { id: 'magic-links', label: 'Magic Links' },
                                    { id: 'otp', label: 'One-Time Passwords' },
                                    { id: 'google-oauth', label: 'Google OAuth' },
                                    { id: 'token-refresh', label: 'Token Refresh' },
                                ]}
                                activeSection={activeSection}
                                scrollToSection={scrollToSection}
                            />
                            <NavSection
                                title="API Reference"
                                items={[
                                    { id: 'api-register', label: 'Register User' },
                                    { id: 'api-login', label: 'Login' },
                                    { id: 'api-magic-link', label: 'Magic Link' },
                                    { id: 'api-otp', label: 'OTP' },
                                    { id: 'api-refresh', label: 'Refresh Token' },
                                    { id: 'api-logout', label: 'Logout' },
                                    { id: 'api-profile', label: 'User Profile' },
                                ]}
                                activeSection={activeSection}
                                scrollToSection={scrollToSection}
                            />
                            <NavSection
                                title="Configuration"
                                items={[
                                    { id: 'auth-config', label: 'Auth Config' },
                                    { id: 'custom-fields', label: 'Custom Fields' },
                                ]}
                                activeSection={activeSection}
                                scrollToSection={scrollToSection}
                            />
                            <NavSection
                                title="Resources"
                                items={[
                                    { id: 'security', label: 'Security Best Practices' },
                                    { id: 'troubleshooting', label: 'Troubleshooting' },
                                ]}
                                activeSection={activeSection}
                                scrollToSection={scrollToSection}
                            />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3 space-y-20">
                        {/* Introduction */}
                        <Section id="introduction" icon={<Book className="w-8 h-8 text-white" />} title="Introduction">
                            <p className="text-xl leading-relaxed text-zinc-400 mb-8">
                                Welcome to the {env.appName} documentation. {env.appName} is a complete, multi-tenant authentication-as-a-service designed for developers who want to ship secure applications faster.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FeatureCard
                                    icon={<Zap className="w-6 h-6 text-white" />}
                                    title="Fast Integration"
                                    description="Get up and running in minutes with our RESTful APIs."
                                />
                                <FeatureCard
                                    icon={<Lock className="w-6 h-6 text-white" />}
                                    title="Enterprise Security"
                                    description="Bcrypt/Argon2/PBKDF2 hashing, JWT tokens, and secure defaults."
                                />
                                <FeatureCard
                                    icon={<Users className="w-6 h-6 text-white" />}
                                    title="Multi-Tenant"
                                    description="Manage multiple applications and user bases from one account."
                                />
                                <FeatureCard
                                    icon={<Key className="w-6 h-6 text-white" />}
                                    title="Flexible Auth"
                                    description="Email/Password, Magic Links, OTP - choose what fits your app."
                                />
                            </div>
                        </Section>

                        {/* Quickstart */}
                        <Section id="quickstart" icon={<Zap className="w-8 h-8 text-white" />} title="Quickstart">
                            <p className="text-lg text-zinc-400 mb-8">Get started with {env.appName} in 5 minutes.</p>
                            <div className="space-y-6">
                                <Step number="1" title="Create an Account" description="Sign up for a Tokenly account to access the dashboard." />
                                <Step number="2" title="Create an Application" description="Define your application (Dev, Staging, Production) and configure auth settings." />
                                <Step number="3" title="Generate API Keys" description="Generate a public/private key pair to authenticate your API requests." />
                                <Step number="4" title="Make Your First API Call" description="Use our endpoints to register and login users." />
                            </div>
                            <CodeExample
                                title="Example: Register a User"
                                language="bash"
                                code={`curl -X POST https://api.tokenly.com/api/auth/signup \\
  -H "X-API-Key: pk_your_public_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'`}
                            />
                        </Section>

                        {/* Core Concepts */}
                        <Section id="core-concepts" icon={<Server className="w-8 h-8 text-white" />} title="Core Concepts">
                            <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
                                Understanding the {env.appName} hierarchy is key to a successful integration.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ConceptCard
                                    title="Client"
                                    subtitle="Your Account"
                                    description="The top-level entity. Your account that contains all applications and manages billing."
                                />
                                <ConceptCard
                                    title="Application"
                                    subtitle="Environment"
                                    description="Represents a specific platform or environment (e.g., 'iOS App', 'Production Web'). Each app has its own users and auth settings."
                                />
                                <ConceptCard
                                    title="User"
                                    subtitle="End User"
                                    description="A person belonging to a specific application. Users are isolated between applications by default for security."
                                />
                                <ConceptCard
                                    title="API Keys"
                                    subtitle="Security Pair"
                                    description="Public keys (pk_) for client-side use, Private keys (sk_) for server-side operations only."
                                />
                            </div>
                        </Section>

                        {/* Auth Overview */}
                        <Section id="auth-overview" icon={<Lock className="w-8 h-8 text-white" />} title="Authentication Overview">
                            <p className="text-lg text-zinc-400 mb-8">
                                {env.appName} provides multiple authentication methods to fit your application's needs.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <AuthMethodCard
                                    title="Email & Password"
                                    description="Traditional authentication with secure password hashing (Bcrypt/Argon2/PBKDF2)."
                                />
                                <AuthMethodCard
                                    title="Magic Links"
                                    description="Passwordless authentication via email links. Perfect for improving UX."
                                />
                                <AuthMethodCard
                                    title="One-Time Passwords"
                                    description="6-digit codes sent via email for secure, temporary access."
                                />
                                <AuthMethodCard
                                    title="Google OAuth"
                                    description="Let users sign in with their Google account for seamless authentication."
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <KeyTypeCard
                                    title="Public Keys"
                                    prefix="pk_"
                                    description="Safe for use in browsers and mobile apps."
                                    uses={['Initialize SDKs', 'Trigger Passwordless Flows', 'Client-side operations']}
                                />
                                <KeyTypeCard
                                    title="Private Keys"
                                    prefix="sk_"
                                    description="Server-to-server communication only. Never expose these!"
                                    uses={['Verify Tokens', 'Manage Users', 'Admin operations']}
                                />
                            </div>
                        </Section>

                        {/* Email & Password Auth */}
                        <Section id="email-password" icon={<Lock className="w-6 h-6 text-white" />} title="Email & Password Authentication">
                            <p className="text-zinc-400 mb-6">
                                Traditional email and password authentication with industry-standard security.
                            </p>
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-white font-bold mb-3">How it Works</h4>
                                    <ol className="space-y-3 text-sm text-zinc-400">
                                        <li className="flex gap-3">
                                            <span className="text-white font-mono bg-zinc-800 px-2 rounded shrink-0">1</span>
                                            <span>User provides email and password</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-white font-mono bg-zinc-800 px-2 rounded shrink-0">2</span>
                                            <span>Password is hashed using Bcrypt, Argon2, or PBKDF2 (configurable)</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-white font-mono bg-zinc-800 px-2 rounded shrink-0">3</span>
                                            <span>Server returns JWT access token and refresh token</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="text-white font-mono bg-zinc-800 px-2 rounded shrink-0">4</span>
                                            <span>Client includes JWT in Authorization header for subsequent requests</span>
                                        </li>
                                    </ol>
                                </div>
                                <CodeExample
                                    title="Register a New User"
                                    language="bash"
                                    code={`curl -X POST https://api.tokenly.com/api/auth/signup \\
  -H "X-API-Key: pk_your_public_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Doe"
  }'`}
                                />
                                <CodeExample
                                    title="Login with Email & Password"
                                    language="bash"
                                    code={`curl -X POST https://api.tokenly.com/api/auth/login \\
  -H "X-API-Key: pk_your_public_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "SecurePassword123!"
  }'`}
                                />
                            </div>
                        </Section>

                        {/* Magic Links */}
                        <Section id="magic-links" icon={<Zap className="w-6 h-6 text-white" />} title="Magic Links">
                            <p className="text-zinc-400 mb-6">
                                Passwordless authentication via secure email links. Users click a link and are automatically authenticated.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h4 className="text-white font-bold mb-3">1. Request Link</h4>
                                    <p className="text-sm text-zinc-500 mb-4">Trigger a magic link request with the user's email.</p>
                                    <CodeExample
                                        language="bash"
                                        code={`curl -X POST "https://api.tokenly.com/api/auth/request-magic-link?email=user@example.com" \\
  -H "X-API-Key: pk_your_public_key"`}
                                    />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-3">2. Verify Token</h4>
                                    <p className="text-sm text-zinc-500 mb-4">When user clicks the link, verify the token to authenticate.</p>
                                    <CodeExample
                                        language="bash"
                                        code={`curl -X POST https://api.tokenly.com/api/auth/login \\
  -H "X-API-Key: pk_your_public_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "token": "uuid-token-from-link"
  }'`}
                                    />
                                </div>
                            </div>
                            <Alert type="info" title="Security">
                                Magic Link tokens are single-use and expire within 15 minutes. They are cryptographically secure and cannot be reused.
                            </Alert>
                        </Section>

                        {/* OTP */}
                        <Section id="otp" icon={<Key className="w-6 h-6 text-white" />} title="One-Time Passwords (OTP)">
                            <p className="text-zinc-400 mb-6">
                                6-digit codes sent via email for secure, temporary access. Perfect for mobile apps or as a second factor.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h4 className="text-white font-bold mb-3">1. Request OTP</h4>
                                    <p className="text-sm text-zinc-500 mb-4">Generate and send a 6-digit code to the user's email.</p>
                                    <CodeExample
                                        language="bash"
                                        code={`curl -X POST "https://api.tokenly.com/api/auth/request-otp?email=user@example.com" \\
  -H "X-API-Key: pk_your_public_key"`}
                                    />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold mb-3">2. Verify OTP</h4>
                                    <p className="text-sm text-zinc-500 mb-4">User submits the code to authenticate.</p>
                                    <CodeExample
                                        language="bash"
                                        code={`curl -X POST https://api.tokenly.com/api/auth/login \\
  -H "X-API-Key: pk_your_public_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "otp": "123456"
  }'`}
                                    />
                                </div>
                            </div>
                        </Section>

                        {/* OAuth Providers */}
                        <Section id="google-oauth" icon={<Users className="w-6 h-6 text-white" />} title="OAuth Providers (Social Login)">
                            <p className="text-zinc-400 mb-6">
                                Let users sign in with their social accounts for seamless, secure authentication. {env.appName} supports Google, GitHub, and Meta (Facebook).
                            </p>

                            {/* Google */}
                            <div className="space-y-6 mb-8">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center p-1.5">
                                        <svg viewBox="0 0 24 24" className="w-full h-full">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                    </div>
                                    Google OAuth
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-white font-bold mb-3">How it Works</h4>
                                        <ol className="space-y-3 text-sm text-zinc-400">
                                            <li className="flex gap-3">
                                                <span className="text-white font-mono bg-zinc-800 px-2 rounded shrink-0">1</span>
                                                <span>Configure Google Client ID in your application's Auth Config</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="text-white font-mono bg-zinc-800 px-2 rounded shrink-0">2</span>
                                                <span>User clicks "Sign in with Google" on your app</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="text-white font-mono bg-zinc-800 px-2 rounded shrink-0">3</span>
                                                <span>Google returns an ID token after user authentication</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="text-white font-mono bg-zinc-800 px-2 rounded shrink-0">4</span>
                                                <span>Send the ID token to Tokenly for verification and user creation/login</span>
                                            </li>
                                        </ol>
                                    </div>
                                    <CodeExample
                                        title="Login with Google OAuth"
                                        language="bash"
                                        code={`curl -X POST https://api.tokenly.com/api/auth/login \\
  -H "X-API-Key: pk_your_public_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "provider": "GOOGLE",
    "providerToken": "google_id_token_here"
  }'`}
                                    />
                                </div>
                            </div>

                            {/* GitHub */}
                            <div className="space-y-6 mb-8">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <div className="w-8 h-8 bg-[#24292e] rounded-md flex items-center justify-center p-1.5">
                                        <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                        </svg>
                                    </div>
                                    GitHub OAuth
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-white font-bold mb-3">How it Works</h4>
                                        <ol className="space-y-3 text-sm text-zinc-400">
                                            <li className="flex gap-3">
                                                <span className="text-white font-mono bg-zinc-800 px-2 rounded shrink-0">1</span>
                                                <span>Configure GitHub Client ID and Secret in your Auth Config</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="text-white font-mono bg-zinc-800 px-2 rounded shrink-0">2</span>
                                                <span>User authenticates with GitHub and receives an access token</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="text-white font-mono bg-zinc-800 px-2 rounded shrink-0">3</span>
                                                <span>Send the access token to Tokenly for verification</span>
                                            </li>
                                        </ol>
                                    </div>
                                    <CodeExample
                                        title="Login with GitHub OAuth"
                                        language="bash"
                                        code={`curl -X POST https://api.tokenly.com/api/auth/login \\
  -H "X-API-Key: pk_your_public_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "provider": "GITHUB",
    "providerToken": "github_access_token_here"
  }'`}
                                    />
                                </div>
                            </div>

                            {/* Meta (Facebook) */}
                            <div className="space-y-6 mb-8">
                                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <div className="w-8 h-8 bg-[#1877F2] rounded-md flex items-center justify-center p-1.5">
                                        <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                        </svg>
                                    </div>
                                    Meta (Facebook) OAuth
                                </h3>
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-white font-bold mb-3">How it Works</h4>
                                        <ol className="space-y-3 text-sm text-zinc-400">
                                            <li className="flex gap-3">
                                                <span className="text-white font-mono bg-zinc-800 px-2 rounded shrink-0">1</span>
                                                <span>Configure Meta App ID and Secret in your Auth Config</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="text-white font-mono bg-zinc-800 px-2 rounded shrink-0">2</span>
                                                <span>User authenticates with Facebook and receives an access token</span>
                                            </li>
                                            <li className="flex gap-3">
                                                <span className="text-white font-mono bg-zinc-800 px-2 rounded shrink-0">3</span>
                                                <span>Send the access token to Tokenly for verification</span>
                                            </li>
                                        </ol>
                                    </div>
                                    <CodeExample
                                        title="Login with Meta OAuth"
                                        language="bash"
                                        code={`curl -X POST https://api.tokenly.com/api/auth/login \\
  -H "X-API-Key: pk_your_public_key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "provider": "META",
    "providerToken": "facebook_access_token_here"
  }'`}
                                    />
                                </div>
                            </div>

                            <Alert type="info" title="Configuration Required">
                                Configure your OAuth provider credentials in the Auth Config section of your application dashboard before using social login.
                            </Alert>
                        </Section>

                        {/* Token Refresh */}
                        <Section id="token-refresh" icon={<Zap className="w-6 h-6 text-white" />} title="Token Refresh">
                            <p className="text-zinc-400 mb-6">
                                Access tokens expire for security. Use refresh tokens to get new access tokens without requiring the user to log in again.
                            </p>
                            <CodeExample
                                title="Refresh Access Token"
                                language="bash"
                                code={`curl -X POST https://api.tokenly.com/api/auth/refresh \\
  -H "X-API-Key: pk_your_public_key" \\
  -H "Authorization: Bearer your_refresh_token"`}
                            />
                            <Alert type="warning" title="Refresh Token Rotation">
                                For security, {env.appName} implements refresh token rotation. Each time you use a refresh token, it's invalidated and a new one is issued.
                            </Alert>
                        </Section>

                        {/* API Reference Sections */}
                        <Section id="api-register" icon={<Code className="w-6 h-6 text-white" />} title="API: Register User">
                            <ApiEndpoint
                                method="POST"
                                path="/api/auth/signup"
                                description="Register a new user account"
                                headers={[
                                    { name: 'X-API-Key', value: 'pk_your_public_key', required: true },
                                    { name: 'Content-Type', value: 'application/json', required: true }
                                ]}
                                requestBody={{
                                    email: 'user@example.com',
                                    password: 'SecurePassword123!',
                                    firstName: 'John',
                                    lastName: 'Doe'
                                }}
                                response={{
                                    success: true,
                                    message: 'User registered successfully',
                                    data: null
                                }}
                            />
                        </Section>

                        <Section id="api-login" icon={<Code className="w-6 h-6 text-white" />} title="API: Login">
                            <ApiEndpoint
                                method="POST"
                                path="/api/auth/login"
                                description="Authenticate user with email and password"
                                headers={[
                                    { name: 'X-API-Key', value: 'pk_your_public_key', required: true },
                                    { name: 'Content-Type', value: 'application/json', required: true }
                                ]}
                                requestBody={{
                                    email: 'user@example.com',
                                    password: 'SecurePassword123!'
                                }}
                                response={{
                                    success: true,
                                    data: {
                                        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                                        refreshToken: 'uuid-refresh-token',
                                        expiresIn: 3600,
                                        user: {
                                            id: 'user-uuid',
                                            email: 'user@example.com',
                                            firstName: 'John',
                                            lastName: 'Doe'
                                        }
                                    }
                                }}
                            />
                        </Section>

                        {/* Configuration */}
                        <Section id="auth-config" icon={<SettingsIcon className="w-6 h-6 text-white" />} title="Auth Configuration">
                            <p className="text-zinc-400 mb-6">
                                Configure authentication settings for your application from the dashboard.
                            </p>
                            <div className="space-y-4">
                                <ConfigOption
                                    name="Authentication Type"
                                    options={['JWT', 'SESSION']}
                                    description="Choose between stateless JWT tokens or server-side sessions."
                                />
                                <ConfigOption
                                    name="Password Hashing"
                                    options={['BCRYPT', 'ARGON2', 'PBKDF2']}
                                    description="Select the hashing algorithm for password storage."
                                />
                                <ConfigOption
                                    name="Access Token TTL"
                                    options={['15 min', '1 hour', '24 hours', 'Custom']}
                                    description="How long access tokens remain valid."
                                />
                                <ConfigOption
                                    name="Refresh Token TTL"
                                    options={['7 days', '30 days', '90 days', 'Custom']}
                                    description="How long refresh tokens remain valid."
                                />
                            </div>
                        </Section>

                        <Section id="custom-fields" icon={<Users className="w-6 h-6 text-white" />} title="Custom Fields">
                            <p className="text-zinc-400 mb-6">
                                Add custom fields to your user profiles to store additional data specific to your application.
                            </p>
                            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
                                <h4 className="text-white font-bold mb-4">Supported Field Types</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                    <div className="text-zinc-400">• Text</div>
                                    <div className="text-zinc-400">• Number</div>
                                    <div className="text-zinc-400">• Boolean</div>
                                    <div className="text-zinc-400">• Date</div>
                                </div>
                            </div>
                        </Section>

                        {/* Security */}
                        <Section id="security" icon={<Lock className="w-6 h-6 text-white" />} title="Security Best Practices">
                            <div className="space-y-4">
                                <BestPractice
                                    title="Never Expose Private Keys"
                                    description="Private keys (sk_) should only be used on your backend server. Never include them in client-side code."
                                />
                                <BestPractice
                                    title="Use HTTPS Only"
                                    description="Always use HTTPS in production to encrypt data in transit."
                                />
                                <BestPractice
                                    title="Validate Tokens on Backend"
                                    description="Never trust tokens from the client. Always verify them on your backend."
                                />
                                <BestPractice
                                    title="Implement Rate Limiting"
                                    description="Protect your endpoints from brute force attacks with rate limiting."
                                />
                            </div>
                        </Section>

                        {/* Troubleshooting */}
                        <Section id="troubleshooting" icon={<AlertCircle className="w-6 h-6 text-white" />} title="Troubleshooting">
                            <div className="space-y-6">
                                <ErrorGuide
                                    code="401"
                                    title="Unauthorized"
                                    causes={[
                                        'Invalid or expired access token',
                                        'Missing Authorization header',
                                        'Invalid API key'
                                    ]}
                                    solution="Ensure you're including a valid access token in the Authorization header and using the correct API key."
                                />
                                <ErrorGuide
                                    code="403"
                                    title="Forbidden"
                                    causes={[
                                        'Signup disabled for this application',
                                        'Insufficient permissions'
                                    ]}
                                    solution="Check your application's auth configuration or contact support if you believe this is an error."
                                />
                                <ErrorGuide
                                    code="400"
                                    title="Bad Request"
                                    causes={[
                                        'Invalid request body format',
                                        'Missing required fields',
                                        'Validation errors'
                                    ]}
                                    solution="Check the error message for specific validation failures and ensure your request matches the API specification."
                                />
                            </div>
                        </Section>
                    </main>
                </div>
            </div>
        </div>
    );
}

// Helper Components
function NavSection({ title, items, activeSection, scrollToSection }) {
    return (
        <div>
            <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-widest text-zinc-500">{title}</h3>
            <ul className="space-y-3">
                {items.map(item => (
                    <li key={item.id}>
                        <button
                            onClick={() => scrollToSection(item.id)}
                            className={`hover:text-white transition-colors text-left w-full ${activeSection === item.id ? 'text-white font-semibold' : ''
                                }`}
                        >
                            {item.label}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

function Section({ id, icon, title, children }) {
    return (
        <section id={id} className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                    {icon}
                </div>
                <h2 className="text-4xl font-bold text-white tracking-tight">{title}</h2>
            </div>
            {children}
        </section>
    );
}

function FeatureCard({ icon, title, description }) {
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

function CodeExample({ title, language, code }) {
    const [copied, setCopied] = useState(false);

    const copyCode = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
            {title && (
                <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
                    <span className="text-zinc-400 text-sm">{title}</span>
                    <button
                        onClick={copyCode}
                        className="text-xs text-zinc-500 hover:text-white transition-colors"
                    >
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>
            )}
            <div className="p-6 overflow-x-auto">
                <pre className="text-sm text-zinc-300 font-mono">{code}</pre>
            </div>
        </div>
    );
}

function ConceptCard({ title, subtitle, description }) {
    return (
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
            <div className="text-white font-bold mb-2">{title}</div>
            <p className="text-zinc-500 text-sm italic mb-4">{subtitle}</p>
            <p className="text-zinc-400 text-sm">{description}</p>
        </div>
    );
}

function AuthMethodCard({ title, description }) {
    return (
        <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-950">
            <h4 className="text-white font-bold mb-2">{title}</h4>
            <p className="text-sm text-zinc-500">{description}</p>
        </div>
    );
}

function KeyTypeCard({ title, prefix, description, uses }) {
    return (
        <div className="p-6 border border-zinc-800 rounded-2xl bg-zinc-950">
            <h4 className="text-white font-bold mb-2">{title}</h4>
            <p className="text-sm text-zinc-500 mb-4">
                {description} Prefixed with <code className="text-zinc-300">{prefix}</code>
            </p>
            <ul className="text-xs text-zinc-400 space-y-2">
                {uses.map((use, i) => (
                    <li key={i} className="flex items-center gap-2">
                        ✓ {use}
                    </li>
                ))}
            </ul>
        </div>
    );
}

function Alert({ type, title, children }) {
    const colors = {
        info: 'bg-blue-500/10 border-blue-500/20 text-blue-200',
        warning: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-200',
    };

    return (
        <div className={`p-4 border rounded-xl ${colors[type]}`}>
            <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div>
                    <p className="font-bold mb-1">{title}</p>
                    <p className="text-xs leading-relaxed opacity-90">{children}</p>
                </div>
            </div>
        </div>
    );
}

function ApiEndpoint({ method, path, description, headers, requestBody, response }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded font-mono text-sm font-bold">
                    {method}
                </span>
                <code className="text-zinc-300">{path}</code>
            </div>
            <p className="text-zinc-400">{description}</p>

            <div>
                <h5 className="text-white font-bold mb-3 text-sm">Headers</h5>
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 space-y-2">
                    {headers.map((header, i) => (
                        <div key={i} className="flex justify-between text-sm">
                            <code className="text-zinc-400">{header.name}</code>
                            <code className="text-zinc-300">{header.value}</code>
                        </div>
                    ))}
                </div>
            </div>

            {requestBody && (
                <div>
                    <h5 className="text-white font-bold mb-3 text-sm">Request Body</h5>
                    <CodeExample language="json" code={JSON.stringify(requestBody, null, 2)} />
                </div>
            )}

            {response && (
                <div>
                    <h5 className="text-white font-bold mb-3 text-sm">Response</h5>
                    <CodeExample language="json" code={JSON.stringify(response, null, 2)} />
                </div>
            )}
        </div>
    );
}

function ConfigOption({ name, options, description }) {
    return (
        <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <h5 className="text-white font-bold mb-2">{name}</h5>
            <p className="text-sm text-zinc-500 mb-3">{description}</p>
            <div className="flex gap-2 flex-wrap">
                {options.map((opt, i) => (
                    <span key={i} className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded text-xs">
                        {opt}
                    </span>
                ))}
            </div>
        </div>
    );
}

function BestPractice({ title, description }) {
    return (
        <div className="flex gap-4 p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <div className="w-6 h-6 bg-green-500/10 border border-green-500/20 rounded flex items-center justify-center shrink-0">
                <span className="text-green-400 text-xs">✓</span>
            </div>
            <div>
                <h5 className="text-white font-bold mb-1">{title}</h5>
                <p className="text-sm text-zinc-500">{description}</p>
            </div>
        </div>
    );
}

function ErrorGuide({ code, title, causes, solution }) {
    return (
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded font-mono text-sm font-bold">
                    {code}
                </span>
                <h4 className="text-white font-bold">{title}</h4>
            </div>
            <div className="space-y-3">
                <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Common Causes</p>
                    <ul className="text-sm text-zinc-400 space-y-1">
                        {causes.map((cause, i) => (
                            <li key={i}>• {cause}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Solution</p>
                    <p className="text-sm text-zinc-400">{solution}</p>
                </div>
            </div>
        </div>
    );
}
