const blogPosts = [
    {
        slug: 'what-is-jwt-authentication',
        title: 'What is JWT Authentication? A Complete Guide for Developers',
        description:
            'Learn how JSON Web Token (JWT) authentication works, why it\'s the preferred method for securing modern APIs, and how to implement it in your application with Tokenly.',
        date: '2026-02-18',
        readTime: '8 min read',
        category: 'Authentication',
        tags: ['JWT', 'Authentication', 'API Security', 'Stateless Auth'],
        coverImage: '/images/blog/jwt-flow-diagram.svg', // Space for future image
        author: {
            name: 'Tokenly Team',
            avatar: null,
        },
        content: [
            {
                type: 'paragraph',
                text: 'JSON Web Tokens (JWTs) have become the de-facto standard for securing APIs and handling authentication in modern web applications. Whether you\'re building a single-page app, a mobile backend, or a microservices architecture, understanding JWT is essential for any developer.',
            },
            {
                type: 'heading',
                level: 2,
                text: 'How Does JWT Authentication Work?',
                id: 'how-jwt-works',
            },
            {
                type: 'paragraph',
                text: 'JWT authentication is a stateless mechanism where the server issues a digitally signed token after verifying user credentials. The client stores this token and sends it with every subsequent request, eliminating the need for server-side session storage.',
            },
            {
                type: 'image',
                src: '/images/blog/jwt-flow-diagram.svg', // Space for JWT flow diagram
                alt: 'JWT Authentication Flow Diagram',
                caption: 'The request-response lifecycle of JWT authentication',
            },
            {
                type: 'heading',
                level: 3,
                text: 'The Three Parts of a JWT',
                id: 'jwt-structure',
            },
            {
                type: 'list',
                items: [
                    'Header — Contains the signing algorithm (e.g., HS256 or RS256) and token type.',
                    'Payload — Carries claims such as user ID, email, roles, and token expiration time.',
                    'Signature — A cryptographic hash that ensures the token hasn\'t been tampered with.',
                ],
            },
            {
                type: 'code',
                language: 'javascript',
                code: `// Authenticating a user with Tokenly's JWT API
const response = await fetch('https://api.tokenly.codes/auth/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'tk_live_your_api_key'
    },
    body: JSON.stringify({
        email: 'user@example.com',
        password: 'securePassword123'
    })
});

const { token, refreshToken } = await response.json();
// Store token securely and include in subsequent requests
// Authorization: Bearer <token>`,
            },
            {
                type: 'heading',
                level: 2,
                text: 'Why Choose JWT Over Session-Based Auth?',
                id: 'jwt-vs-sessions',
            },
            {
                type: 'paragraph',
                text: 'Traditional session-based authentication requires the server to store session data in memory or a database, creating scalability challenges. JWT tokens are self-contained — the server doesn\'t need to look anything up. This makes JWT ideal for distributed systems, microservices, and serverless architectures.',
            },
            {
                type: 'list',
                items: [
                    'Stateless — No server-side session storage required.',
                    'Scalable — Works seamlessly across multiple servers and load balancers.',
                    'Cross-Domain — Easily shared between different services and origins.',
                    'Mobile-Friendly — Perfect for mobile apps that need persistent auth.',
                ],
            },
            {
                type: 'heading',
                level: 2,
                text: 'JWT Security Best Practices',
                id: 'jwt-best-practices',
            },
            {
                type: 'list',
                items: [
                    'Always use HTTPS to prevent token interception.',
                    'Set short expiration times (15-30 minutes) and use refresh tokens.',
                    'Never store sensitive data in the JWT payload — it\'s base64-encoded, not encrypted.',
                    'Use strong signing algorithms like RS256 for production.',
                    'Implement token revocation using a blacklist or short-lived tokens.',
                ],
            },
            {
                type: 'heading',
                level: 2,
                text: 'Implementing JWT with Tokenly',
                id: 'jwt-with-tokenly',
            },
            {
                type: 'paragraph',
                text: 'Tokenly provides a production-ready JWT authentication API out of the box. Create an application, configure your auth settings, and start issuing JWTs in minutes — no need to build token signing, validation, or refresh logic from scratch.',
            },
            {
                type: 'image',
                src: '/images/blog/dashboard-jwt-config.svg', // Space for Tokenly dashboard screenshot
                alt: 'Tokenly Dashboard showing JWT configuration',
                caption: 'Configure JWT settings directly from the Tokenly dashboard',
            },
        ],
    },
    {
        slug: 'oauth-2-explained',
        title: 'OAuth 2.0 Explained: How It Works & Why Your App Needs It',
        description:
            'A developer-friendly guide to OAuth 2.0 authorization. Understand the flows, use cases, and how to add Google/GitHub social login to your app using Tokenly.',
        date: '2026-02-15',
        readTime: '10 min read',
        category: 'Authorization',
        tags: ['OAuth 2.0', 'Social Login', 'Google Auth', 'Authorization'],
        coverImage: '/images/blog/oauth-flow-diagram.svg',
        author: {
            name: 'Tokenly Team',
            avatar: null,
        },
        content: [
            {
                type: 'paragraph',
                text: 'OAuth 2.0 is the industry-standard protocol for authorization. It enables applications to obtain limited access to user accounts on third-party services like Google, GitHub, and Facebook — without ever seeing the user\'s password.',
            },
            {
                type: 'heading',
                level: 2,
                text: 'What Problem Does OAuth 2.0 Solve?',
                id: 'oauth-problem',
            },
            {
                type: 'paragraph',
                text: 'Before OAuth, sharing access between applications required sharing passwords directly. OAuth 2.0 introduces a secure delegation model: users authorize your app to access their data through a trusted provider, using short-lived tokens instead of credentials.',
            },
            {
                type: 'image',
                src: '/images/blog/oauth-flow-diagram.svg',
                alt: 'OAuth 2.0 Authorization Code Flow Diagram',
                caption: 'The Authorization Code flow — the most secure OAuth 2.0 grant type',
            },
            {
                type: 'heading',
                level: 2,
                text: 'OAuth 2.0 Grant Types',
                id: 'oauth-grant-types',
            },
            {
                type: 'list',
                items: [
                    'Authorization Code — Best for server-side apps. The user authenticates with the provider and your server exchanges the code for tokens.',
                    'Authorization Code + PKCE — Extends the Authorization Code flow for single-page apps and mobile apps, adding a code verifier for security.',
                    'Client Credentials — Machine-to-machine auth where no user interaction is needed.',
                    'Implicit (Deprecated) — Previously used for SPAs; replaced by Authorization Code + PKCE.',
                ],
            },
            {
                type: 'heading',
                level: 2,
                text: 'Adding Social Login with Tokenly',
                id: 'social-login-tokenly',
            },
            {
                type: 'paragraph',
                text: 'Tokenly handles the entire OAuth 2.0 flow for you. Configure Google or GitHub as a provider in your dashboard, and let Tokenly manage the redirect URIs, token exchange, and user account creation.',
            },
            {
                type: 'code',
                language: 'javascript',
                code: `// Initiate Google OAuth login via Tokenly
const oauthUrl = 'https://api.tokenly.codes/oauth/google/authorize'
    + '?app_id=your_app_id'
    + '&redirect_uri=https://yourapp.com/callback';

// Redirect the user to Google's consent screen
window.location.href = oauthUrl;

// After consent, Tokenly handles the callback and returns a JWT
// GET /oauth/google/callback?code=...&state=...`,
            },
            {
                type: 'heading',
                level: 2,
                text: 'OAuth 2.0 Security Considerations',
                id: 'oauth-security',
            },
            {
                type: 'list',
                items: [
                    'Always validate the `state` parameter to prevent CSRF attacks.',
                    'Use PKCE for public clients (SPAs, mobile apps).',
                    'Store tokens securely — never in localStorage for sensitive apps.',
                    'Request only the scopes your app actually needs (principle of least privilege).',
                    'Implement token refresh to avoid re-prompting users.',
                ],
            },
            {
                type: 'image',
                src: '/images/blog/dashboard-oauth-config.svg',
                alt: 'Tokenly OAuth Configuration Panel',
                caption: 'Set up OAuth providers in seconds from the Tokenly dashboard',
            },
        ],
    },
    {
        slug: 'what-is-auth-as-a-service',
        title: 'What is Auth-as-a-Service? Why Developers Are Switching',
        description:
            'Discover what Auth-as-a-Service (AaaS) is, how it compares to building auth in-house, and why platforms like Tokenly are becoming the go-to choice for startups and enterprises.',
        date: '2026-02-12',
        readTime: '7 min read',
        category: 'Platform',
        tags: ['Auth-as-a-Service', 'Authentication', 'SaaS', 'Developer Tools'],
        coverImage: '/images/blog/tokenly-architecture.svg',
        author: {
            name: 'Tokenly Team',
            avatar: null,
        },
        content: [
            {
                type: 'paragraph',
                text: 'Building authentication from scratch is one of the most common sources of security vulnerabilities in modern applications. Auth-as-a-Service (AaaS) platforms like Tokenly eliminate this risk by providing a complete, battle-tested authentication backend via simple REST APIs.',
            },
            {
                type: 'heading',
                level: 2,
                text: 'The Hidden Cost of Building Auth In-House',
                id: 'hidden-cost',
            },
            {
                type: 'paragraph',
                text: 'What seems like a weekend project ("just add login") quickly balloons into weeks of work: password hashing, token issuance, refresh flows, email verification, password reset, rate limiting, brute-force protection, GDPR compliance — the list goes on.',
            },
            {
                type: 'image',
                src: '/images/blog/auth-cost-comparison.svg',
                alt: 'Time comparison: building auth in-house vs using Auth-as-a-Service',
                caption: 'Auth-as-a-Service saves hundreds of engineering hours',
            },
            {
                type: 'heading',
                level: 2,
                text: 'What Does an Auth-as-a-Service Platform Provide?',
                id: 'aaas-features',
            },
            {
                type: 'list',
                items: [
                    'User registration and login APIs',
                    'JWT and session token management',
                    'OAuth 2.0 social login integration',
                    'Passwordless auth (magic links, OTP)',
                    'API key management for machine-to-machine auth',
                    'Multi-tenant user isolation',
                    'Email verification and password reset flows',
                    'Rate limiting and brute-force protection',
                ],
            },
            {
                type: 'heading',
                level: 2,
                text: 'Tokenly vs. Building It Yourself',
                id: 'tokenly-vs-diy',
            },
            {
                type: 'paragraph',
                text: 'Tokenly gives you all of the above through clean, RESTful APIs — with zero SDK lock-in. You call our endpoints from any language or framework. No proprietary client libraries, no vendor lock-in, no hidden costs.',
            },
            {
                type: 'code',
                language: 'bash',
                code: `# Sign up a user with a single API call
curl -X POST https://api.tokenly.codes/auth/signup \\
  -H "X-API-Key: tk_live_your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"email": "user@example.com", "password": "securePass123"}'

# Response includes JWT + refresh token — ready to use immediately`,
            },
            {
                type: 'heading',
                level: 2,
                text: 'When Should You Use Auth-as-a-Service?',
                id: 'when-to-use',
            },
            {
                type: 'list',
                items: [
                    'You\'re a startup that needs to ship fast without compromising on security.',
                    'You\'re building a SaaS product that needs multi-tenant auth.',
                    'You want to support multiple auth methods (JWT, OAuth, magic links) without building each one.',
                    'Your team wants to focus on product features, not authentication infrastructure.',
                ],
            },
            {
                type: 'image',
                src: '/images/blog/tokenly-architecture.svg',
                alt: 'Tokenly platform architecture overview',
                caption: 'Tokenly handles the entire auth stack so you can focus on your product',
            },
        ],
    },
    {
        slug: 'magic-link-login-guide',
        title: 'Magic Link Login: The Passwordless Authentication Revolution',
        description:
            'Learn how magic link authentication works, why it improves security and UX, and how to implement passwordless login in your app using Tokenly\'s magic link API.',
        date: '2026-02-08',
        readTime: '6 min read',
        category: 'Authentication',
        tags: ['Magic Links', 'Passwordless', 'Email Auth', 'User Experience'],
        coverImage: '/images/blog/magic-link-flow.svg',
        author: {
            name: 'Tokenly Team',
            avatar: null,
        },
        content: [
            {
                type: 'paragraph',
                text: 'Passwords are broken. Users reuse them, forget them, and fall victim to phishing attacks. Magic link login offers a better alternative: a secure, one-time-use link sent directly to the user\'s email — no password required.',
            },
            {
                type: 'heading',
                level: 2,
                text: 'How Do Magic Links Work?',
                id: 'how-magic-links-work',
            },
            {
                type: 'paragraph',
                text: 'The flow is simple: the user enters their email, your app calls the magic link API, and the user receives an email with a unique, time-limited link. Clicking the link authenticates them instantly and returns a JWT token.',
            },
            {
                type: 'image',
                src: '/images/blog/magic-link-flow.svg',
                alt: 'Magic Link Authentication Flow',
                caption: 'The user clicks a link in their email to log in — no password needed',
            },
            {
                type: 'heading',
                level: 2,
                text: 'Benefits of Passwordless Authentication',
                id: 'passwordless-benefits',
            },
            {
                type: 'list',
                items: [
                    'Eliminates password-related security risks (reuse, phishing, brute-force).',
                    'Reduces friction at login — users don\'t need to remember anything.',
                    'No password reset flows to build or support.',
                    'Higher conversion rates — fewer abandoned signups.',
                    'Simpler backend — no password hashing or storage needed.',
                ],
            },
            {
                type: 'heading',
                level: 2,
                text: 'Implementing Magic Links with Tokenly',
                id: 'magic-links-tokenly',
            },
            {
                type: 'code',
                language: 'javascript',
                code: `// Request a magic link for the user
const response = await fetch('https://api.tokenly.codes/auth/magic-link', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'tk_live_your_api_key'
    },
    body: JSON.stringify({
        email: 'user@example.com',
        redirectUrl: 'https://yourapp.com/dashboard'
    })
});
// Tokenly sends the email automatically
// User clicks the link → redirected with a valid JWT`,
            },
            {
                type: 'heading',
                level: 2,
                text: 'Magic Link Security Best Practices',
                id: 'magic-link-security',
            },
            {
                type: 'list',
                items: [
                    'Set short expiration times (5-15 minutes) for magic link tokens.',
                    'Ensure links are single-use — invalidate after first click.',
                    'Use HTTPS for all redirect URLs.',
                    'Rate-limit magic link requests to prevent email abuse.',
                    'Log and monitor magic link usage for anomaly detection.',
                ],
            },
            {
                type: 'image',
                src: '/images/blog/magic-link-email.svg',
                alt: 'Magic link email template example',
                caption: 'A well-designed magic link email inspires trust and increases click-through rates',
            },
        ],
    },
    {
        slug: 'api-key-authentication-best-practices',
        title: 'API Key Authentication: Best Practices for Secure API Access',
        description:
            'Everything you need to know about API key authentication — how it works, when to use it, common mistakes to avoid, and how Tokenly simplifies API key management.',
        date: '2026-02-04',
        readTime: '7 min read',
        category: 'API Security',
        tags: ['API Keys', 'API Security', 'Machine Auth', 'REST API'],
        coverImage: '/images/blog/api-key-vs-jwt.svg',
        author: {
            name: 'Tokenly Team',
            avatar: null,
        },
        content: [
            {
                type: 'paragraph',
                text: 'API keys are one of the most widely used authentication methods for programmatic API access. They\'re simple, effective, and perfect for server-to-server communication. But mismanaged API keys are also one of the most common causes of security breaches.',
            },
            {
                type: 'heading',
                level: 2,
                text: 'What Are API Keys?',
                id: 'what-are-api-keys',
            },
            {
                type: 'paragraph',
                text: 'An API key is a unique, high-entropy string that identifies and authenticates a client application. Unlike JWT tokens, API keys are typically long-lived and tied to an application rather than a user.',
            },
            {
                type: 'image',
                src: '/images/blog/api-key-vs-jwt.svg',
                alt: 'API Key vs JWT comparison diagram',
                caption: 'API keys authenticate applications; JWTs authenticate users',
            },
            {
                type: 'heading',
                level: 2,
                text: 'When to Use API Keys',
                id: 'when-to-use-api-keys',
            },
            {
                type: 'list',
                items: [
                    'Server-to-server communication where no user context is needed.',
                    'Third-party integrations that need persistent access.',
                    'Rate limiting and usage tracking per client application.',
                    'Identifying which application is making requests to your API.',
                ],
            },
            {
                type: 'heading',
                level: 2,
                text: 'API Key Security Best Practices',
                id: 'api-key-security',
            },
            {
                type: 'list',
                items: [
                    'Never expose API keys in client-side code or public repositories.',
                    'Use environment variables to store keys securely.',
                    'Implement key rotation — regularly generate new keys and deprecate old ones.',
                    'Scope keys with specific permissions (read-only, write, admin).',
                    'Monitor key usage and set up alerts for anomalous patterns.',
                    'Use separate keys for development, staging, and production environments.',
                ],
            },
            {
                type: 'heading',
                level: 2,
                text: 'Managing API Keys with Tokenly',
                id: 'api-keys-tokenly',
            },
            {
                type: 'code',
                language: 'javascript',
                code: `// All Tokenly API requests use your API key for authentication
const response = await fetch('https://api.tokenly.codes/auth/signup', {
    method: 'POST',
    headers: {
        'X-API-Key': 'tk_live_your_api_key',  // Your Tokenly API key
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email: 'newuser@example.com',
        password: 'securePassword123'
    })
});
// Tokenly validates the API key, identifies your app, and processes the request`,
            },
            {
                type: 'paragraph',
                text: 'Tokenly provides a complete API key lifecycle management system. Generate keys from your dashboard, rotate them on demand, and revoke compromised keys instantly — all without any downtime.',
            },
            {
                type: 'image',
                src: '/images/blog/dashboard-api-keys.svg',
                alt: 'Tokenly API Key Management Dashboard',
                caption: 'Generate, rotate, and revoke API keys from the Tokenly dashboard',
            },
        ],
    },
    {
        slug: 'multi-tenant-authentication-architecture',
        title: 'Multi-Tenant Authentication Architecture: A Developer\'s Guide',
        description:
            'Learn how multi-tenant authentication works, why tenant isolation matters, and how Tokenly\'s multi-tenant architecture lets you manage users across multiple applications securely.',
        date: '2026-01-30',
        readTime: '9 min read',
        category: 'Architecture',
        tags: ['Multi-Tenant', 'Architecture', 'SaaS', 'User Isolation'],
        coverImage: '/images/blog/multi-tenant-architecture.svg',
        author: {
            name: 'Tokenly Team',
            avatar: null,
        },
        content: [
            {
                type: 'paragraph',
                text: 'If you\'re building a SaaS product, a platform with multiple environments, or any system that serves multiple clients — you need multi-tenant authentication. This guide covers the core concepts, architecture patterns, and how Tokenly makes it effortless.',
            },
            {
                type: 'heading',
                level: 2,
                text: 'What is Multi-Tenant Authentication?',
                id: 'what-is-multi-tenant',
            },
            {
                type: 'paragraph',
                text: 'Multi-tenant authentication means each "tenant" (application, client, or environment) gets its own isolated authentication context. Users in Tenant A cannot access Tenant B\'s resources, even if they share the same email address.',
            },
            {
                type: 'image',
                src: '/images/blog/multi-tenant-architecture.svg',
                alt: 'Multi-tenant authentication architecture diagram',
                caption: 'Each tenant has isolated users, sessions, and authentication configuration',
            },
            {
                type: 'heading',
                level: 2,
                text: 'Why Tenant Isolation Matters',
                id: 'tenant-isolation',
            },
            {
                type: 'list',
                items: [
                    'Security — A breach in one tenant doesn\'t affect others.',
                    'Compliance — Meet data residency and privacy requirements per client.',
                    'Customization — Each tenant can have different auth methods, password policies, and branding.',
                    'Scalability — Add new tenants without architectural changes.',
                ],
            },
            {
                type: 'heading',
                level: 2,
                text: 'Common Multi-Tenant Patterns',
                id: 'multi-tenant-patterns',
            },
            {
                type: 'list',
                items: [
                    'Shared Database, Shared Schema — Tenants share tables with a tenant_id column. Simple but risks data leaks.',
                    'Shared Database, Separate Schemas — Each tenant gets its own schema. Better isolation, moderate complexity.',
                    'Separate Databases — Complete isolation. Best security, highest operational cost.',
                    'Hybrid — Critical data isolated, shared infrastructure for common operations.',
                ],
            },
            {
                type: 'heading',
                level: 2,
                text: 'How Tokenly Handles Multi-Tenancy',
                id: 'tokenly-multi-tenancy',
            },
            {
                type: 'paragraph',
                text: 'Tokenly is built multi-tenant from the ground up. Every application you create gets its own isolated user pool, auth configuration, and API keys. There\'s no cross-tenant data leakage — ever.',
            },
            {
                type: 'code',
                language: 'javascript',
                code: `// Each Tokenly application is a separate tenant
// App 1: Production environment
const prodResponse = await fetch('https://api.tokenly.codes/auth/login', {
    headers: { 'X-API-Key': 'tk_live_prod_key' },
    // ... users are isolated to this application
});

// App 2: Staging environment — completely separate user pool
const stagingResponse = await fetch('https://api.tokenly.codes/auth/login', {
    headers: { 'X-API-Key': 'tk_live_staging_key' },
    // ... different users, different config, same API
});`,
            },
            {
                type: 'heading',
                level: 2,
                text: 'Getting Started with Multi-Tenant Auth',
                id: 'getting-started',
            },
            {
                type: 'list',
                items: [
                    'Sign up at tokenly.codes and create your first application.',
                    'Create additional applications for each environment or client.',
                    'Configure auth settings independently per application.',
                    'Use the application-specific API key to route users to the correct tenant.',
                ],
            },
            {
                type: 'image',
                src: '/images/blog/dashboard-multi-app.svg',
                alt: 'Tokenly multi-app dashboard',
                caption: 'Manage multiple applications with independent auth from one dashboard',
            },
        ],
    },
    {
        slug: 'paseto-authentication-modern-alternative-to-jwt',
        title: 'PASETO: The Modern, Secure Alternative to JWT Authentication',
        description:
            'Discover why Platform-Agnostic Security Tokens (PASETO) are rapidly replacing JSON Web Tokens (JWT) for secure, tamper-proof API authentication.',
        date: '2026-03-24',
        readTime: '8 min read',
        category: 'API Security',
        tags: ['PASETO', 'JWT', 'API Security', 'Cryptography'],
        coverImage: '/images/blog/paseto-vs-jwt.svg',
        author: {
            name: 'Tokenly Team',
            avatar: null,
        },
        content: [
            {
                type: 'paragraph',
                text: 'For years, JSON Web Tokens (JWT) have been the undisputed king of stateless authentication. But as systems have evolved, critical cryptographic flaws in the JWT standard have come to light. Enter PASETO (Platform-Agnostic Security Tokens) — a modern, radically secure alternative designed to eliminate the vulnerabilities inherent in JWT.',
            },
            {
                type: 'heading',
                level: 2,
                text: 'The Fatal Flaw of JWT: Algorithmic Agility',
                id: 'jwt-flaws',
            },
            {
                type: 'paragraph',
                text: 'JWT allows the token itself to declare the cryptographic algorithm used to sign it (via the `alg` header). This "algorithmic agility" has led to devastating vulnerabilities, such as the infamous `alg: "none"` attack where attackers bypassed authentication entirely, or "Algorithmic Confusion" attacks where a backend is tricked into verifying an RSA signature using an HMAC algorithm.',
            },
            {
                type: 'paragraph',
                text: 'PASETO solves this fundamentally by deprecating algorithm agility. Instead of letting the token dictate the algorithm, PASETO uses fixed, versioned cryptographic suites. If you use PASETO V2, the algorithm is hardcoded to use modern, state-of-the-art cryptography (Ed25519 for public keys, XChaCha20-Poly1305 for local encryption).',
            },
            {
                type: 'image',
                src: '/images/blog/paseto-vs-jwt.svg',
                alt: 'PASETO vs JWT Architecture Comparison',
                caption: 'PASETO enforces strict cryptographic suites, eliminating algorithmic confusion out of the box',
            },
            {
                type: 'heading',
                level: 2,
                text: 'PASETO Local vs. PASETO Public',
                id: 'paseto-versions',
            },
            {
                type: 'list',
                items: [
                    'PASETO V2 Local (Symmetric): Completely encrypts the token using a shared secret key (AES-256-GCM in Tokenly). Unlike JWTs which are merely base64-encoded and publicly readable, PASETO Local entirely hides your claims from the end-user. Perfect for closed ecosystems.',
                    'PASETO V2 Public (Asymmetric): Digitally signed using the highly secure Ed25519 curve. The payload is readable, but mathematically immune to the signature forgery attacks that plague RSA-backed JWTs. Ideal for distributed microservices.',
                ],
            },
            {
                type: 'heading',
                level: 2,
                text: 'Why You Should Switch to PASETO',
                id: 'why-switch',
            },
            {
                type: 'list',
                items: [
                    'Idiot-Proof Security: Developers don\'t have to choose between a dozen confusing algorithms. You just choose "Local" or "Public" and the library does the rest.',
                    'Payload Privacy: PASETO Local encrypts your data inherently. If you store internal user IDs or permissions in the token, the user cannot inspect or decode them.',
                    'Immune to Forgery: Mathematically immune to Algorithmic Confusion and None-Algorithm attacks.',
                ],
            },
            {
                type: 'heading',
                level: 2,
                text: 'Using PASETO with Tokenly',
                id: 'paseto-tokenly',
            },
            {
                type: 'paragraph',
                text: 'Tokenly embraces modern security standards, which is why we natively support both PASETO V2 Local and PASETO V2 Public as drop-in replacements for your authentication architecture. You can switch your entire application\'s persistence layer from JWT to PASETO with a single click in your Dashboard.',
            },
            {
                type: 'code',
                language: 'javascript',
                code: `// Logging in exactly the same way...
const response = await fetch('https://api.tokenly.codes/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-API-Key': 'tk_live_your_key' },
    body: JSON.stringify({ email: 'user@example.com', password: 'securePassword123' })
});

const { token } = await response.json();

// Since you configured your Tokenly App to use PASETO, the generated token
// is automatically a highly secure PASETO token:
// v2.local.xE8d... (Encrypted!)

// Pass it to your APIs normally!
// Authorization: Bearer v2.local.xE8d...`,
            },
        ],
    },
];

export const categories = ['All', ...new Set(blogPosts.map((post) => post.category))];

export default blogPosts;
