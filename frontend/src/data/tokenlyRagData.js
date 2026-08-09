/**
 * Tokenly RAG Knowledge Base & Screen Suggestion Dataset
 * 
 * This dataset is optimized for Retrieval-Augmented Generation (RAG), vector embeddings,
 * and contextual Screen Suggestion AI Explainer systems.
 * 
 * It contains:
 * 1. Screen-by-Screen contextual metadata & proactive suggestions for user workflows.
 * 2. High-density semantic knowledge chunks covering core architecture, auth modes, and security.
 * 3. Exhaustive API endpoint schemas with request/response payloads and code snippets.
 * 4. Q&A pairs for semantic question answering and intent matching.
 */

export const TOKENLY_SYSTEM_OVERVIEW = {
    name: "Tokenly",
    tagline: "Open Source Multi-Tenant Authentication-as-a-Service",
    version: "1.0.0",
    description: "Tokenly is a production-ready, multi-tenant Auth-as-a-Service platform. It sits between client applications and users, handling registration, login, session persistence, password hashing, JWT/PASETO issuance, OAuth 2.0, magic links, OTP, and API key management via clean RESTful APIs with zero SDK lock-in.",
    architecture: {
        backend: "Spring Boot 3.x, Java 17, Spring Security, Hibernate/JPA, Jakarta Mail",
        frontend: "React 19, Vite, TailwindCSS / Vanilla CSS, Framer Motion, Lucide Icons",
        database: "MySQL 8.0+",
        cache: "Redis Cache Cluster (for stateful sessions & rate limiting)",
        deployment: "Docker, Docker Compose, Self-hosted or Cloud"
    },
    keyDifferentiators: [
        "Zero SDK Lock-in: Standard REST APIs callable from any language (JavaScript, Python, Go, Rust, PHP, etc.)",
        "5 Authentication Modes: Stateless JWT, Redis Stateful Sessions, Simple API Tokens, PASETO V2 Local, PASETO V2 Public",
        "Multi-Tenant Isolation: Each Client account can manage multiple isolated Applications (e.g., Dev, Staging, Production)",
        "Cryptographic Agility: Bcrypt, Argon2id, PBKDF2 password hashing, RS256/RS512 JWTs, Ed25519 PASETO signatures",
        "Passwordless Native: Built-in Magic Links (15-min single-use UUIDs) and Email OTP (6-digit codes)",
        "Social Login Ready: Google, GitHub, and Meta (Facebook) OAuth 2.0 integration out of the box",
        "Dynamic Custom Fields: Attach custom typed attributes (Text, Number, Boolean, Date) to user profiles"
    ]
};

/**
 * Screen Suggestion Matrix: Maps current frontend routes to contextual guidance,
 * common questions, user goals, and proactive AI suggestions.
 */
export const SCREEN_SUGGESTION_DATA = {
    "/": {
        screenName: "Landing Page (Home)",
        file: "frontend/src/pages/Landing.jsx",
        route: "/",
        purpose: "Product discovery, architectural value proposition, interactive code preview, live uptime metrics, and navigation to documentation or signup.",
        keyFeatures: [
            "Hero section with dynamic API feature toggler (JWT, PASETO, Bcrypt, OAuth, Redis, API Keys)",
            "Live copyable cURL signup code preview with animated syntax highlighting",
            "Problem statement highlighting time saved vs in-house auth implementation",
            "Animated marquee of Technical Specifications (Hashing algos, Auth modes, Login flows)",
            "Interactive technical comparison matrix vs traditional auth providers",
            "Enterprise reliability stats (99.9% uptime, 50ms P95 latency, 100K+ daily API calls)",
            "Floating video tour modal for quick product onboarding"
        ],
        proactiveSuggestions: [
            {
                trigger: "User browsing hero section",
                suggestion: "Want to see how Tokenly compares to Auth0 or Firebase? Check out our comparison matrix below or click 'Explore the Docs' for code samples."
            },
            {
                trigger: "User inspecting code block",
                suggestion: "You can copy this exact cURL snippet to test user registration right now, or visit the Interactive API Docs (/api-docs) to test endpoints in your browser."
            },
            {
                trigger: "User hovering technical specs",
                suggestion: "Tokenly uniquely supports PASETO V2 (both Local AES-256 and Public Ed25519) to eliminate JWT algorithmic confusion attacks. Click any card to learn more."
            }
        ],
        commonQuestions: [
            "What is Tokenly and how does it work?",
            "Is Tokenly really free and open source?",
            "How do I get started with Tokenly in under 5 minutes?",
            "Why should I choose PASETO over JWT?",
            "Does Tokenly require installing an SDK?"
        ]
    },
    "/docs": {
        screenName: "Documentation",
        file: "frontend/src/pages/Documentation.jsx",
        route: "/docs",
        purpose: "Comprehensive developer guide with sticky navigation, implementation walk-throughs, architecture diagrams, curl snippets, and troubleshooting.",
        keyFeatures: [
            "Sticky sidebar with 6 navigation categories: Getting Started, Authentication, API Reference, Configuration, Deployment, Resources",
            "Deep-dive explanations for 5 Auth Modes (JWT, Session, API Tokens, PASETO Local, PASETO Public)",
            "Step-by-step guides for Email/Password, Magic Links, Email OTP, and Social OAuth (Google, GitHub, Meta)",
            "API reference with required headers (X-API-Key, Authorization) and JSON payloads",
            "Self-hosting guide with Spring Boot, MySQL, Redis, and Vite requirements",
            "Security best practices: Key rotation, HTTPS enforcement, and OWASP compliance"
        ],
        proactiveSuggestions: [
            {
                trigger: "User viewing Auth Modes section",
                suggestion: "Building microservices? We recommend PASETO V2 Public (Ed25519) for trustless offline verification without database lookups."
            },
            {
                trigger: "User viewing Magic Links section",
                suggestion: "Magic link tokens expire in 15 minutes and are single-use. Make sure your application passes your public API key (pk_) in the X-API-KEY header."
            },
            {
                trigger: "User reading Self-Hosting",
                suggestion: "You can configure your MySQL credentials, Redis host, and JWT secret in backend/src/main/resources/application.properties before running 'mvn clean package'."
            }
        ],
        commonQuestions: [
            "How do I make my first API call with Tokenly?",
            "What is the difference between pk_ (public) and sk_ (secret) keys?",
            "How do I implement refresh token rotation?",
            "How do I self-host Tokenly with Docker?",
            "How do I configure Google OAuth 2.0?"
        ]
    },
    "/api-docs": {
        screenName: "Interactive API Documentation",
        file: "frontend/src/pages/ApiDocumentation.jsx",
        route: "/api-docs",
        purpose: "Interactive API explorer allowing developers to inspect endpoints, headers, query parameters, request bodies, and copy live curl / JS / Python snippets.",
        keyFeatures: [
            "Complete endpoint listing across Client Auth, App Auth, and Admin APIs",
            "Header specification: X-API-KEY (Public Key pk_ or Private Key sk_) and Authorization Bearer",
            "Sample request and response payloads with status codes (200, 201, 400, 401, 403, 404, 500)",
            "Multi-language code generation (cURL, JavaScript Fetch, Python Requests, Node.js Axios)",
            "Error response models and troubleshooting tips"
        ],
        proactiveSuggestions: [
            {
                trigger: "User inspecting /api/auth/login",
                suggestion: "The login endpoint automatically adapts to your app's AuthConfig: send 'email' + 'password', 'token' (for Magic Link), 'otp' (for One-Time Password), or 'provider' + 'providerToken' (for OAuth)."
            },
            {
                trigger: "User testing client-side calls",
                suggestion: "Always use your Public Key (pk_...) for browser and mobile requests. Never expose your Secret Key (sk_...) in client-side code."
            }
        ],
        commonQuestions: [
            "Which header is required for end-user auth?",
            "What payload does /api/auth/login return?",
            "How do I exchange an OAuth provider token for a Tokenly JWT?",
            "What format should the refresh token be sent in?"
        ]
    },
    "/dashboard": {
        screenName: "Admin Dashboard",
        file: "frontend/src/pages/Dashboard.jsx",
        route: "/dashboard",
        purpose: "Primary control center for managing multi-tenant applications, viewing aggregate metrics (total users, active sessions, daily auths, API calls), and quick navigation.",
        keyFeatures: [
            "Application switcher dropdown to toggle between environments (e.g., Production, Staging, Dev)",
            "Real-time analytics cards: Total Users, Active Sessions, Today's Authentications, Total API Requests",
            "Quick action shortcuts: Configure Auth, Manage API Keys, View Users, Define Custom Fields",
            "Recent activity feed displaying latest logins, registrations, and token refreshes",
            "Create New Application modal with instant API key generation"
        ],
        proactiveSuggestions: [
            {
                trigger: "User created a new application",
                suggestion: "Next step: Go to 'Auth Config' to choose your token mode (JWT/PASETO/Session) and 'API Keys' to copy your public key (pk_) for your frontend."
            },
            {
                trigger: "User switching applications",
                suggestion: "Remember that all users, custom fields, and API keys are completely isolated per application environment."
            }
        ],
        commonQuestions: [
            "How do I create a new application environment?",
            "How are metrics calculated on the dashboard?",
            "Can I export user analytics from this screen?"
        ]
    },
    "/auth-config": {
        screenName: "Auth Configuration",
        file: "frontend/src/pages/AuthConfig.jsx",
        route: "/auth-config",
        purpose: "Fine-grained security configuration per application: Authentication Mode, Password Hashing, Token TTLs, and Social OAuth credentials.",
        keyFeatures: [
            "Authentication Mode Selector: JWT (Stateless RS256), SESSION (Redis), API_TOKEN (M2M), PASETO_LOCAL (AES-256), PASETO_PUBLIC (Ed25519)",
            "Password Hashing Algorithm Selector: BCRYPT (default), ARGON2 (memory-hard), PBKDF2 (NIST compliant)",
            "Token Lifecycle Sliders: Access Token TTL (15m to 24h) and Refresh Token TTL (7d to 90d)",
            "Social OAuth Provider Credentials: Google (Client ID), GitHub (Client ID + Secret), Meta (App ID + Secret)",
            "Login method toggles: Enable/disable Password, Magic Link, OTP, or OAuth independently"
        ],
        proactiveSuggestions: [
            {
                trigger: "User selecting PASETO_LOCAL",
                suggestion: "PASETO Local encrypts token claims with AES-256-GCM. The client cannot read the internal JSON payload, maximizing privacy for internal IDs and roles."
            },
            {
                trigger: "User choosing Argon2id hashing",
                suggestion: "Argon2id provides state-of-the-art resistance against GPU/ASIC brute-force attacks. Recommended for high-security applications."
            },
            {
                trigger: "User configuring OAuth",
                suggestion: "Make sure you add your frontend domain to the 'Authorized JavaScript Origins' in your Google Cloud Console."
            }
        ],
        commonQuestions: [
            "Can I switch from JWT to PASETO without breaking existing users?",
            "What happens when I change the Access Token TTL?",
            "How do I set up GitHub OAuth credentials?",
            "Which password hashing algorithm is most secure?"
        ]
    },
    "/api-keys": {
        screenName: "API Keys Management",
        file: "frontend/src/pages/ApiKeys.jsx",
        route: "/api-keys",
        purpose: "Generate, inspect, copy, rotate, and revoke cryptographic API key pairs (Public pk_ and Secret sk_) for the active application.",
        keyFeatures: [
            "Public API Key (pk_...): Designed for frontend apps, mobile apps, and browser requests. Passed via X-API-KEY header.",
            "Secret API Key (sk_...): Designed for backend server-to-server operations, admin actions, and privileged user management.",
            "One-click copy and key masking for security",
            "Key Rotation modal: Generate new keys with zero-downtime grace periods",
            "Revocation confirmation with instant Redis cache invalidation"
        ],
        proactiveSuggestions: [
            {
                trigger: "User generating a new Secret Key (sk_)",
                suggestion: "Copy your secret key immediately! For security reasons, the full secret key is never displayed again after generation."
            },
            {
                trigger: "User embedding keys in frontend",
                suggestion: "Only use pk_ keys in client-side code (e.g., React, Vue, iOS, Android). Never commit sk_ keys to version control."
            }
        ],
        commonQuestions: [
            "What is the difference between pk_ and sk_ keys?",
            "How do I rotate an API key without breaking production?",
            "Can I restrict an API key to specific IP addresses?"
        ]
    },
    "/custom-fields": {
        screenName: "Custom User Fields",
        file: "frontend/src/pages/CustomFields.jsx",
        route: "/custom-fields",
        purpose: "Define dynamic user schema attributes to capture and validate custom metadata (phone number, company, role, beta flag) during signup and profile updates.",
        keyFeatures: [
            "Field builder supporting 4 data types: Text, Number, Boolean, Date",
            "Configurable validation rules: Required vs Optional, Min/Max length, Default values",
            "Dynamic injection into registration forms and /api/auth/signup validation",
            "Custom field data included in the user profile response (/api/auth/profile)",
            "Field reordering and deprecation without corrupting existing user records"
        ],
        proactiveSuggestions: [
            {
                trigger: "User adding a new required field",
                suggestion: "Marking a field as 'Required' means any future signup without this field will return a 400 Bad Request error."
            },
            {
                trigger: "User needing role-based flags",
                suggestion: "You can create a Boolean field named 'is_admin' or a Text field 'organization_role' to store user permissions directly in Tokenly."
            }
        ],
        commonQuestions: [
            "How do I pass custom field values in the signup API?",
            "Are custom fields returned in the JWT / PASETO token payload?",
            "What happens to existing users when I add a new custom field?"
        ]
    },
    "/users": {
        screenName: "User Directory & Management",
        file: "frontend/src/pages/Users.jsx",
        route: "/users",
        purpose: "Search, filter, inspect, and manage registered end-users for the active application, including session management, status toggles, and password resets.",
        keyFeatures: [
            "Paginated user table with search by email, name, or user ID",
            "User status badges: Active, Pending Verification, Suspended/Disabled",
            "User detail drawer: View creation date, last login timestamp, auth provider (Email, Google, GitHub, etc.)",
            "Custom field viewer displaying app-specific metadata per user",
            "Administrative actions: Disable account, Revoke active sessions, Trigger password reset email, Delete user"
        ],
        proactiveSuggestions: [
            {
                trigger: "User searching for a specific user",
                suggestion: "You can filter users by authentication provider (e.g., only Google OAuth users) or search by exact email address."
            },
            {
                trigger: "User disabling a compromised account",
                suggestion: "Disabling a user immediately revokes all active Redis sessions and invalidates refresh tokens, blocking subsequent API requests."
            }
        ],
        commonQuestions: [
            "How do I reset a user's password from the admin dashboard?",
            "How do I instantly terminate a user's active session?",
            "Can I export the user list as CSV or JSON?"
        ]
    },
    "/request-logs": {
        screenName: "Request & Audit Logs",
        file: "frontend/src/pages/RequestLogs.jsx",
        route: "/request-logs",
        purpose: "Real-time audit log stream showing incoming API requests, HTTP status codes, latency in milliseconds, endpoint routes, and client IP addresses.",
        keyFeatures: [
            "Live streaming request log table with auto-refresh toggle",
            "Color-coded HTTP status badges (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 500 Server Error)",
            "Detailed log inspector: View request headers, query params, auth mode used, and error messages",
            "Filtering by date range, HTTP status, endpoint, or API key prefix",
            "Latency monitoring to identify performance bottlenecks"
        ],
        proactiveSuggestions: [
            {
                trigger: "User seeing 401 Unauthorized spikes",
                suggestion: "Check if the client application is passing an expired access token or forgetting the 'X-API-KEY' header in the request."
            },
            {
                trigger: "User debugging a failed signup",
                suggestion: "Click on the 400 Bad Request log entry to see validation error details (e.g., missing custom field or weak password)."
            }
        ],
        commonQuestions: [
            "Why am I getting a 401 Unauthorized error in my API call?",
            "How long are request logs retained?",
            "How can I filter logs for a specific user ID?"
        ]
    },
    "/auth/:appId": {
        screenName: "Hosted Universal Login",
        file: "frontend/src/pages/UserAuth.jsx",
        route: "/auth/:appId",
        purpose: "Pre-built, hosted universal authentication page that dynamically renders enabled login flows (Email/Password, Magic Link, OTP, Social Login) for any Tokenly application.",
        keyFeatures: [
            "Dynamic branding and application name fetched via /api/auth/app-info using the appId (pk_)",
            "Automatic tab switching based on enabled auth methods in AuthConfig",
            "Passwordless email entry with automatic Magic Link or OTP dispatch",
            "One-click Google, GitHub, and Meta OAuth sign-in buttons",
            "Responsive, mobile-optimized dark mode UI matching Tokenly design standards"
        ],
        proactiveSuggestions: [
            {
                trigger: "User integrating hosted auth",
                suggestion: "You can redirect users to /auth/{your_public_key} and pass a redirect_url query parameter to send authenticated users back to your app with tokens."
            }
        ],
        commonQuestions: [
            "How do I embed or redirect to Tokenly's hosted login screen?",
            "Can I customize the logo and colors on the hosted login page?"
        ]
    },
    "/settings": {
        screenName: "Account & Organization Settings",
        file: "frontend/src/pages/Settings.jsx",
        route: "/settings",
        purpose: "Manage client account credentials, company profile, team members, billing plan, and global security defaults.",
        keyFeatures: [
            "Organization name and contact email configuration",
            "Client password change with current password verification",
            "Active subscription plan details and API usage limits",
            "Two-Factor Authentication (2FA) for admin dashboard access",
            "Danger zone: Account deletion and data export"
        ],
        proactiveSuggestions: [
            {
                trigger: "User updating account email",
                suggestion: "Updating your account email will also change the email used to log into the Tokenly admin dashboard."
            }
        ],
        commonQuestions: [
            "How do I invite team members to my Tokenly organization?",
            "How do I enable 2FA for my admin account?"
        ]
    }
};

/**
 * High-Density RAG Knowledge Chunks:
 * Optimized for vector embeddings, keyword search, and LLM context injection.
 */
export const RAG_KNOWLEDGE_CHUNKS = [
    {
        id: "chunk-arch-001",
        category: "Architecture",
        title: "Tokenly Multi-Tenant Hierarchy & Entity Model",
        keywords: ["multi-tenant", "client", "application", "user", "api keys", "pk_", "sk_", "hierarchy", "isolation"],
        summary: "Explains the 4-level entity hierarchy of Tokenly: Client (Tenant Account) -> Applications (Environments) -> Users (Isolated Pool) -> API Keys (Public pk_ and Secret sk_).",
        content: `Tokenly is engineered from the ground up as a multi-tenant authentication platform.
The platform hierarchy consists of four distinct levels:

1. Client (Tenant Account):
   - The top-level account representing the developer or company organization.
   - Manages billing, global organization settings, and owns all underlying applications.
   - Authenticates to Tokenly via /api/clients/signup and /api/clients/login.

2. Application (Environment):
   - A dedicated project or environment created under a Client (e.g., "Mobile iOS App", "Web Production", "Staging Environment").
   - Each Application has its own isolated user pool, AuthConfig, custom fields, and API key pairs.
   - Cross-application data leakage is strictly prohibited by database schema isolation and tenant filtering.

3. User (End-User Identity):
   - An individual registered user belonging exclusively to a single Application.
   - Stores email, password hash, status (ACTIVE, DISABLED), auth provider (LOCAL, GOOGLE, GITHUB, META), and dynamic custom field values.
   - Identified by a unique UUID.

4. API Keys (Security Key Pair):
   - Public Key (pk_...): Client-side safe. Used in frontend apps, mobile apps, and hosted login. Sent via X-API-KEY header.
   - Secret Key (sk_...): Backend-only privileged key. Used for server-to-server operations, user administration, and token verification. Never exposed to browsers.`
    },
    {
        id: "chunk-auth-001",
        category: "Auth Modes",
        title: "Stateless JWT (JSON Web Tokens - RFC 7519)",
        keywords: ["jwt", "stateless", "rs256", "rs512", "jwks", "microservices", "asymmetric", "rfc 7519"],
        summary: "Comprehensive guide to Tokenly's Stateless JWT mode: Asymmetric RS256/RS512 signatures, offline gateway verification, and payload structure.",
        content: `MODE: JWT — Stateless JSON Web Token (RFC 7519)

Architecture & Mechanics:
- Tokenly generates digitally signed, base64url-encoded JSON payloads.
- Signed using asymmetric RSA keys (RS256 or RS512), where Tokenly backend signs with a private RSA key and services verify using public JWKS.
- Perfect for high-throughput distributed microservices because API gateways and peripheral services can validate token authenticity completely offline without performing database or cache lookups.

Payload Contents:
- sub: User UUID
- email: User email address
- appId: Application UUID
- iat: Issued-at timestamp
- exp: Expiration timestamp (determined by configured Access Token TTL)
- custom_fields: Optional attached user metadata

Usage:
Clients include the token in the HTTP header:
Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...

Offline Backend Verification (Node.js/Express Example):
const jwt = require('jsonwebtoken');
const publicKey = '-----BEGIN PUBLIC KEY...';
const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });`
    },
    {
        id: "chunk-auth-002",
        category: "Auth Modes",
        title: "Stateful Redis Sessions (MODE: SESSION)",
        keywords: ["session", "stateful", "redis", "revocation", "concurrency", "instant logout", "device management"],
        summary: "Details Tokenly's Redis-backed Stateful Session mode: Opaque session identifiers, sub-millisecond cache lookups, instant revocation, and device limits.",
        content: `MODE: SESSION — Redis-Backed Stateful Sessions

Architecture & Mechanics:
- Upon successful login, Tokenly generates an opaque, cryptographically random Session ID (e.g., sid_8f92j...).
- The Session ID is mapped to the user identity and stored in a high-speed Redis cluster with automatic TTL expiration.
- Enables absolute, real-time control over active sessions, including instant server-side revocation (forced logout) and device concurrency limiting.

Why Choose Stateful Sessions?
- Instant Revocation: Unlike stateless JWTs which remain valid until their expiration timestamp, a Redis session can be deleted immediately by an admin or user.
- Breach Mitigation: If a user's device is stolen or credentials compromised, revoking the session terminates access in under 1 millisecond.
- Strict Concurrency: Limit users to 1, 3, or N simultaneous active devices.

Usage:
Clients pass the session identifier:
Authorization: Bearer sid_8f92j...

Verification Endpoint:
Backend services verify the session via Tokenly's internal Redis verification hook or API endpoint.`
    },
    {
        id: "chunk-auth-003",
        category: "Auth Modes",
        title: "PASETO V2 Local (Symmetric Encryption)",
        keywords: ["paseto", "paseto local", "symmetric", "aes-256-gcm", "xchacha20", "privacy", "encrypted token"],
        summary: "Explains PASETO V2 Local mode: AES-256-GCM symmetric encryption that completely hides token claims from end-users.",
        content: `MODE: PASETO_LOCAL — Platform-Agnostic Security Tokens (Symmetric Encryption)

Architecture & Mechanics:
- PASETO Local uses heavy symmetric encryption (AES-256-GCM / XChaCha20-Poly1305).
- Crucial Difference from JWT: While JWT payloads are merely base64-encoded strings that anyone can decode and inspect, PASETO Local fully encrypts the internal payload.
- End-users and browsers see only an opaque cipher string (e.g., v2.local.h9J1k...) and cannot read user IDs, roles, email, or custom claims.

Ideal Use Cases:
- Closed-circuit ecosystems where a single centralized backend issues and verifies tokens.
- Applications storing sensitive metadata or permission scopes in tokens that must remain confidential from the client.

Usage:
Authorization: Bearer v2.local.h9J1k...`
    },
    {
        id: "chunk-auth-004",
        category: "Auth Modes",
        title: "PASETO V2 Public (Asymmetric Ed25519 Signatures)",
        keywords: ["paseto", "paseto public", "ed25519", "asymmetric", "algorithmic confusion", "none algorithm", "cryptographic security"],
        summary: "Deep dive into PASETO V2 Public mode: Ed25519 curve signatures, elimination of JWT algorithmic agility vulnerabilities, and microservice validation.",
        content: `MODE: PASETO_PUBLIC — Platform-Agnostic Security Tokens (Asymmetric Digital Signatures)

Architecture & Mechanics:
- Leverages the modern, high-speed Ed25519 elliptic curve for asymmetric digital signatures.
- Solves JWT's Fatal Flaw: JWT allows the token header ('alg') to specify the algorithm. This design flaw created catastrophic vulnerabilities like the 'alg: none' bypass and 'Algorithmic Confusion' (forcing an RSA key to verify with HMAC).
- PASETO categorically separates the algorithm from the token header. In PASETO V2 Public, the algorithm is hardcoded to Ed25519, making signature forgery mathematically impossible.

Ideal Use Cases:
- Modern distributed microservices requiring trustless, offline verification using public keys without the security risks of legacy JWT libraries.

Usage:
Authorization: Bearer v2.public.yT5m...`
    },
    {
        id: "chunk-auth-005",
        category: "Auth Modes",
        title: "Simple API Tokens (MODE: API_TOKEN)",
        keywords: ["api token", "m2m", "machine to machine", "cli", "infinite ttl", "non-expiring", "backend integration"],
        summary: "Details Simple API Tokens for Machine-to-Machine communication, CLI tools, and automated background jobs with infinite TTL until revoked.",
        content: `MODE: API_TOKEN — Simple Machine-to-Machine API Tokens

Architecture & Mechanics:
- High-entropy, opaque access tokens generated with an infinite TTL (non-expiring).
- Designed specifically for automated background workers, cron jobs, CLI tools, and server-to-server daemon processes that cannot handle interactive login or token refresh flows.
- Tokens persist until explicitly revoked by an administrator via the Tokenly dashboard or Admin API.

Usage:
Clients can provide the token via standard headers:
Authorization: Bearer atk_9a10c...
OR
X-API-Key: atk_9a10c...`
    },
    {
        id: "chunk-flows-001",
        category: "Auth Flows",
        title: "Email & Password Authentication Lifecycle",
        keywords: ["email password", "signup", "login", "bcrypt", "argon2", "pbkdf2", "hash", "refresh token"],
        summary: "Step-by-step lifecycle of email & password authentication, hashing with Bcrypt/Argon2/PBKDF2, and token issuance.",
        content: `Email & Password Authentication Flow:

1. User Registration:
   - Client sends POST /api/auth/signup with email, password, firstName, lastName, and custom field values.
   - Header must include 'X-API-KEY: pk_your_public_key'.
   - Server checks if email exists in the Application's user pool (multi-tenant isolated).
   - Server hashes the password using the configured algorithm (Bcrypt cost factor 12, Argon2id, or PBKDF2).
   - User entity is created in MySQL with status 'ACTIVE'.
   - Server returns 201 Created with user profile info.

2. User Login:
   - Client sends POST /api/auth/login with email and password.
   - Server fetches user record and verifies password hash using constant-time comparison.
   - If valid, server generates Access Token (JWT/PASETO/Session) and a secure cryptographically random Refresh Token.
   - Server returns 200 OK with accessToken, refreshToken, expiresIn (seconds), and user metadata.

3. Subsequent Requests:
   - Client attaches Access Token: 'Authorization: Bearer <accessToken>'.
   - Backend verifies token and processes the request.`
    },
    {
        id: "chunk-flows-002",
        category: "Auth Flows",
        title: "Passwordless Magic Link Lifecycle",
        keywords: ["magic link", "passwordless", "email token", "request-magic-link", "uuid", "15 minutes", "single-use"],
        summary: "Lifecycle of passwordless magic link login: Request link, SMTP dispatch, single-use UUID verification, and instant token generation.",
        content: `Passwordless Magic Link Authentication Flow:

1. Requesting Magic Link:
   - User enters email on client application.
   - Client sends POST /api/auth/request-magic-link?email=user@example.com with 'X-API-KEY: pk_your_public_key'.
   - Tokenly generates a cryptographically secure, random UUID token with a strict 15-minute TTL.
   - Tokenly stores token in Redis and dispatches an HTML email via SMTP containing the magic link:
     https://yourapp.com/verify-magic-link?token=uuid-token-here

2. Verifying Magic Link:
   - User clicks link in email, opening the client's verification page.
   - Client extracts token from query string and sends POST /api/auth/login:
     Body: { "token": "uuid-token-from-link" }
   - Tokenly checks Redis for token validity.
   - Token is immediately invalidated (single-use anti-replay guarantee).
   - Tokenly resolves user, generates Access Token and Refresh Token, and returns 200 OK.`
    },
    {
        id: "chunk-flows-003",
        category: "Auth Flows",
        title: "Email One-Time Password (OTP) Flow",
        keywords: ["otp", "one-time password", "6 digit code", "request-otp", "2fa", "passwordless"],
        summary: "Lifecycle of 6-digit email OTP authentication: Request code, time-windowed storage, rate limiting, and code verification.",
        content: `Email One-Time Password (OTP) Authentication Flow:

1. Requesting OTP:
   - Client sends POST /api/auth/request-otp?email=user@example.com with 'X-API-KEY: pk_...'.
   - Tokenly generates a random 6-digit numeric passcode (e.g., 482910).
   - Passcode is saved in Redis with a 5-minute expiration and rate-limit counter (maximum 3 attempts).
   - Email is dispatched to the user containing the 6-digit code.

2. Submitting OTP:
   - User enters 6-digit code into application.
   - Client sends POST /api/auth/login:
     Body: { "email": "user@example.com", "otp": "482910" }
   - Tokenly verifies code matches Redis value for that email.
   - On match, OTP is purged from Redis, user is authenticated, and Access Token + Refresh Token are returned.`
    },
    {
        id: "chunk-flows-004",
        category: "Auth Flows",
        title: "OAuth 2.0 Social Login (Google, GitHub, Meta)",
        keywords: ["oauth", "social login", "google oauth", "github oauth", "meta oauth", "providerToken", "sso"],
        summary: "Implementation of OAuth 2.0 social login: Client-side SDK authentication, sending provider tokens to Tokenly, and automatic account linking.",
        content: `OAuth 2.0 Social Login Flow:

Supported Providers: GOOGLE, GITHUB, META (Facebook)

Prerequisites:
Configure provider Client ID and Secret in Tokenly Dashboard -> Auth Config.

Step-by-Step Flow:
1. Client initiates OAuth consent flow with Google, GitHub, or Meta.
2. User grants permission; provider returns an identity credential or access token:
   - Google: returns ID Token (JWT signed by Google)
   - GitHub: returns OAuth Access Token
   - Meta: returns User Access Token
3. Client forwards provider token to Tokenly:
   POST /api/auth/login
   Header: 'X-API-KEY: pk_your_public_key'
   Body: {
     "provider": "GOOGLE",
     "providerToken": "eyJhbGciOiJSUzI1NiIs..."
   }
4. Tokenly backend verifies provider token directly against Google/GitHub/Meta verification APIs.
5. Tokenly extracts verified user profile (email, name, provider ID).
6. If user does not exist, Tokenly automatically provisions a new User record. If user exists, accounts are linked.
7. Tokenly issues application-scoped Access Token and Refresh Token.`
    },
    {
        id: "chunk-flows-005",
        category: "Auth Flows",
        title: "Token Refresh & Refresh Token Rotation",
        keywords: ["refresh token", "rotation", "anti-replay", "token refresh", "security", "jwt refresh"],
        summary: "Mechanism of Tokenly's Refresh Token Rotation: Single-use refresh tokens, issuance of new key pairs, and breach protection.",
        content: `Refresh Token Rotation Architecture:

Why Refresh Tokens?
Access tokens have a short lifespan (e.g., 15 minutes) to minimize damage if intercepted. Refresh tokens allow clients to obtain new access tokens silently without prompting the user to re-login.

How Tokenly Implements Rotation:
1. When user logs in, they receive:
   - accessToken (15 min TTL)
   - refreshToken (30 days TTL, stored in Redis/DB)
2. When accessToken expires, client calls:
   POST /api/auth/refresh
   Header: 'X-API-KEY: pk_your_public_key'
   Header: 'Authorization: Bearer <refreshToken>'
3. Tokenly validates the refresh token:
   - The used refresh token is IMMEDIATELY INVALIDATED and deleted.
   - Tokenly generates a BRAND NEW accessToken and a BRAND NEW refreshToken.
4. Client replaces stored tokens with the new pair.

Breach Detection (Anti-Replay):
If a stolen refresh token is reused after it was already rotated, Tokenly detects the anomaly and revokes all active sessions for that user family, forcing re-authentication.`
    },
    {
        id: "chunk-api-001",
        category: "API Reference",
        title: "End-User Authentication REST API Catalog",
        keywords: ["api catalog", "endpoints", "signup", "login", "refresh", "profile", "app-info", "rest api"],
        summary: "Exhaustive specification of end-user endpoints, HTTP methods, headers, request bodies, and response schemas.",
        content: `Tokenly End-User API Specification:

Base URL: https://api.tokenly.codes (or http://localhost:8084 in development)

1. Register User:
   POST /api/auth/signup
   Header: X-API-KEY: pk_...
   Header: Content-Type: application/json
   Body: {
     "email": "user@example.com",
     "password": "SecurePassword123!",
     "firstName": "Alex",
     "lastName": "Rivera",
     "customFields": { "phone": "+1234567890", "role": "developer" }
   }
   Response (201 Created):
   { "success": true, "message": "User registered successfully", "data": null }

2. Authenticate / Login (Multi-Flow):
   POST /api/auth/login
   Header: X-API-KEY: pk_...
   Header: Content-Type: application/json
   Body Options:
   - Password: { "email": "user@example.com", "password": "SecurePassword123!" }
   - Magic Link: { "token": "uuid-token" }
   - OTP: { "email": "user@example.com", "otp": "123456" }
   - OAuth: { "provider": "GOOGLE", "providerToken": "id_token_here" }
   Response (200 OK):
   {
     "success": true,
     "data": {
       "accessToken": "eyJhbGci...",
       "refreshToken": "uuid-refresh-token",
       "expiresIn": 3600,
       "user": { "id": "uuid", "email": "user@example.com", "firstName": "Alex", "lastName": "Rivera" }
     }
   }

3. Request Magic Link:
   POST /api/auth/request-magic-link?email=user@example.com
   Header: X-API-KEY: pk_...

4. Request OTP:
   POST /api/auth/request-otp?email=user@example.com
   Header: X-API-KEY: pk_...

5. Refresh Token:
   POST /api/auth/refresh
   Header: X-API-KEY: pk_...
   Header: Authorization: Bearer <refreshToken>

6. Get User Profile:
   GET /api/auth/profile
   Header: X-API-KEY: pk_...
   Header: Authorization: Bearer <accessToken>

7. Get Public Application Info:
   GET /api/auth/app-info
   Header: X-API-KEY: pk_...`
    },
    {
        id: "chunk-int-001",
        category: "Integration",
        title: "Frontend Integration Guide (React & JavaScript)",
        keywords: ["react", "frontend", "javascript", "fetch", "auth context", "token storage", "protected routes"],
        summary: "Step-by-step guide and clean code patterns for integrating Tokenly with React applications and single-page apps.",
        content: `Integrating Tokenly with React Applications:

1. Storing Public Key:
In your frontend environment file (.env):
VITE_TOKENLY_PUBLIC_KEY=pk_live_your_public_key_here
VITE_TOKENLY_API_URL=https://api.tokenly.codes

2. Auth Service Helper (JavaScript Fetch):
const API_URL = import.meta.env.VITE_TOKENLY_API_URL;
const PUBLIC_KEY = import.meta.env.VITE_TOKENLY_PUBLIC_KEY;

export async function loginUser(email, password) {
  const res = await fetch(\`\${API_URL}/api/auth/login\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': PUBLIC_KEY
    },
    body: JSON.stringify({ email, password })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || 'Login failed');
  
  // Store tokens securely
  localStorage.setItem('accessToken', json.data.accessToken);
  localStorage.setItem('refreshToken', json.data.refreshToken);
  return json.data.user;
}

export async function getProfile() {
  const token = localStorage.getItem('accessToken');
  const res = await fetch(\`\${API_URL}/api/auth/profile\`, {
    headers: {
      'X-API-KEY': PUBLIC_KEY,
      'Authorization': \`Bearer \${token}\`
    }
  });
  return res.json();
}`
    },
    {
        id: "chunk-sec-001",
        category: "Security",
        title: "Tokenly Security Architecture & OWASP Best Practices",
        keywords: ["security", "owasp", "rate limiting", "key rotation", "https", "brute force", "paseto vs jwt"],
        summary: "Security protocols, adaptive rate limiting, key storage rules, and OWASP compliance built into Tokenly.",
        content: `Tokenly Security Architecture & Best Practices:

1. Key Separation (Public pk_ vs Private sk_):
   - Never embed secret keys (sk_) in frontend bundles, mobile APKs, or Git repositories.
   - Use public keys (pk_) exclusively for client-facing operations.

2. Password Protection:
   - Automatic protection against rainbow tables via high-entropy salt per user.
   - Support for memory-hard Argon2id and adaptive-work Bcrypt (cost factor 12).

3. Adaptive Rate Limiting:
   - Redis-backed sliding window rate limiters on login, OTP dispatch, and magic link endpoints to prevent brute-force credential stuffing.

4. Cryptographic Integrity:
   - PASETO V2 implementation eliminates algorithm agility exploits.
   - JWT tokens signed with asymmetric RS256/RS512 keys prevent HMAC secret-sharing vulnerabilities.

5. Strict HTTPS:
   - In production environments, all communication must occur over TLS 1.3 to prevent man-in-the-middle token interception.`
    }
];

/**
 * Frequently Asked Questions (FAQ) Embedding Dataset:
 * Direct Q&A mapping for conversational RAG queries.
 */
export const TOKENLY_FAQ_ITEMS = [
    {
        question: "What is Tokenly and what problem does it solve?",
        answer: "Tokenly is an open-source, multi-tenant Auth-as-a-Service platform. It eliminates the need to build authentication from scratch by providing ready-to-use REST APIs for user registration, login, session management, password hashing, JWT/PASETO token issuance, magic links, OTP, and OAuth 2.0 social login with zero SDK lock-in."
    },
    {
        question: "How does Tokenly differ from Auth0, Clerk, or Firebase?",
        answer: "Unlike closed-source or vendor-locked platforms, Tokenly is fully open-source and self-hostable with zero SDK lock-in (standard REST APIs). It uniquely supports 5 authentication modes including PASETO V2 (both Local AES-256 and Public Ed25519) to eliminate JWT security vulnerabilities, full multi-tenant application isolation, and customizable password hashing (Bcrypt, Argon2id, PBKDF2)."
    },
    {
        question: "What is the difference between pk_ (public) and sk_ (secret) API keys?",
        answer: "Public keys (pk_...) are designed for client-side applications (browsers, mobile apps, hosted login) and can only trigger end-user auth flows. Secret keys (sk_...) are high-privilege keys meant strictly for server-to-server communication, token verification, and administrative user management. Secret keys must never be exposed in client code."
    },
    {
        question: "What are the 5 authentication modes supported by Tokenly?",
        answer: "1. Stateless JWT (RS256/RS512 asymmetric signatures for microservices)\n2. Stateful Sessions (Redis-backed session IDs with instant revocation)\n3. Simple API Tokens (Non-expiring tokens for M2M and CLI tools)\n4. PASETO V2 Local (Symmetric AES-256 encryption hiding claims from clients)\n5. PASETO V2 Public (Asymmetric Ed25519 signatures immune to algorithmic confusion)."
    },
    {
        question: "How does PASETO prevent JWT security vulnerabilities?",
        answer: "JWT allows tokens to declare their own signing algorithm in the header ('alg'), enabling 'alg: none' and 'Algorithmic Confusion' attacks. PASETO removes algorithmic agility by hardcoding the cryptographic suite per version (Ed25519 for V2 Public, AES-256-GCM for V2 Local), making signature tampering and algorithm manipulation mathematically impossible."
    },
    {
        question: "How do magic links work in Tokenly?",
        answer: "When a user requests a magic link via POST /api/auth/request-magic-link, Tokenly generates a cryptographic UUID token valid for 15 minutes and emails it via SMTP. When the user clicks the link, the frontend submits the token to POST /api/auth/login. The token is immediately deleted from Redis (single-use guarantee) and an access token is issued."
    },
    {
        question: "How do I configure Google or GitHub OAuth in Tokenly?",
        answer: "In the Tokenly dashboard, navigate to Auth Config for your application. Enter your Google Client ID or GitHub Client ID & Secret. In your frontend, authenticate the user with Google/GitHub and send the resulting ID token or access token to POST /api/auth/login with provider 'GOOGLE' or 'GITHUB'. Tokenly verifies the token and provisions the user automatically."
    },
    {
        question: "How does Tokenly handle multi-tenancy?",
        answer: "Every Client account can manage multiple isolated Applications (e.g., Development, Staging, Production, or separate client portals). Each Application maintains its own isolated database user pool, AuthConfig settings, custom fields, and API key pairs, preventing cross-tenant data leakage."
    },
    {
        question: "How do I self-host Tokenly?",
        answer: "You can clone the repository (git clone https://github.com/Sri-Akshat5/Tokenly.git), configure your MySQL, Redis, and SMTP settings in backend/src/main/resources/application.properties, build the Spring Boot backend with 'mvn clean package', and start the React frontend with 'npm run build && npm run preview'."
    }
];

export default {
    TOKENLY_SYSTEM_OVERVIEW,
    SCREEN_SUGGESTION_DATA,
    RAG_KNOWLEDGE_CHUNKS,
    TOKENLY_FAQ_ITEMS
};
