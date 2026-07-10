
 
<h1 align="center">Tokenly</h1>

<p align="center">
  <strong>Open Source Multi-Tenant Authentication Platform</strong>
</p>

<p align="center">
  Create applications, configure authentication, generate API keys, and integrate production-ready authentication in minutes.
</p>

<p align="center">
  <a href="https://tokenly.codes">Live Demo</a> •
  <a href="https://tokenly.codes/docs">Documentation</a>
</p>

<p align="center">
  <a href="https://tokenly.codes">
    <img src="https://img.shields.io/badge/Live_Demo-tokenly.codes-blue" alt="Live Demo">
  </a>

  <a href="https://tokenly.codes/docs">
    <img src="https://img.shields.io/badge/Documentation-Read_Now-brightgreen" alt="Documentation">
  </a>

  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="MIT License">
  </a>

  <img src="https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?logo=springboot&logoColor=white" alt="Spring Boot">

  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React">

  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white" alt="Docker">
</p>

---
 
## Table of Contents
 
- [What is Tokenly?](#what-is-tokenly)
- [Why Tokenly?](#why-tokenly)
- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [Authentication Modes](#authentication-modes)
- [Configuration](#configuration)
- [Security Best Practices](#security-best-practices)
- [License](#license)
---
 
## What is Tokenly?
 
Tokenly is an open-source, self-hosted, multi-tenant authentication platform that enables developers to add production-ready authentication to any application.
 
Instead of implementing authentication yourself, Tokenly manages:
 
- User Registration
- Login
- Sessions
- Password Hashing
- Access Tokens
- Refresh Tokens
- API Keys
- OAuth Providers
- Passwordless Authentication

Just create an application, configure authentication, copy your API key, and start integrating with clean, RESTful APIs.

No SDK lock-in, no black box.
 
## Why Tokenly?

Authentication is a fundamental part of every modern application, but building and maintaining it is time-consuming, repetitive, and security-critical.

Tokenly provides a production-ready authentication platform that enables developers to add secure authentication to any application in minutes through a simple, API-first approach.

Instead of spending weeks implementing authentication infrastructure, you can:

- Launch authentication without building it from scratch
- Manage multiple applications from a single dashboard
- Choose the authentication strategy that best fits your architecture
- Secure user credentials with industry-standard hashing algorithms
- Integrate using clean, RESTful APIs
- Scale from MVPs to production without changing your authentication stack

Instead of building and maintaining:

- Login & Signup APIs
- Password Storage & Hashing
- Session Management
- JWT & PASETO Token Generation
- Refresh Token Rotation
- Magic Links & Email OTP
- OAuth Integrations
- Multi-Tenant User Management

Focus on building your product while Tokenly handles authentication.

---

## Features

### Authentication

| Feature | Support |
|---|:---:|
| Email & Password | ✓ |
| Magic Links | ✓ |
| Email OTP | ✓ |
| Google OAuth | ✓ |
| GitHub OAuth | ✓ |
| Meta (Facebook) OAuth | ✓ |

### Token & Session Management

| Feature | Support |
|---|:---:|
| JWT (RS256 / RS512) | ✓ |
| PASETO (Local & Public) | ✓ |
| Stateful Sessions | ✓ |
| Simple API Tokens (M2M) | ✓ |
| Access & Refresh Token Rotation | ✓ |

### Security

| Capability | Support |
|---|:---:|
| Bcrypt | ✓ |
| Argon2id | ✓ |
| PBKDF2 | ✓ |
| SHA-256 | ✓ |
| API Key Authentication | ✓ |
| Multi-Tenant Isolation | ✓ |
| Adaptive Rate Limiting | ✓ |
| Refresh Token Rotation | ✓ |
| Configurable Token TTL | ✓ |
| Strict Email Verification | ✓ |

### Developer Experience

| Feature | Support |
|---|:---:|
| Multi-Tenant Applications | ✓ |
| User Management Dashboard | ✓ |
| REST API | ✓ |
| OpenAPI Documentation | ✓ |
| Docker Support | ✓ |
| Custom User Fields | ✓ |
 
## Architecture

```text
Developer
     │
     ▼
Clone Repository
     │
     ▼
Configure Properties (MySQL, Redis, SMTP, JWT)
     │
     ▼
Deploy Backend (Spring Boot) & Frontend (React/Vite)
     │
     ▼
Create Application via Dashboard
     │
     ▼
Generate API Keys
     │
     ▼
Integrate Tokenly API with Your Application
     │
     ▼
Authenticate Users Securely
```

Tokenly sits between your client applications and your users, handling the full authentication lifecycle so your core product code never has to.

---
 
## Quick Start

Run your own instance of Tokenly locally or on your server in four simple steps.

### Prerequisites

* **Java 17 (OpenJDK)** and **Maven 3.8+**
* **Node.js 18.x** and **npm**
* **MySQL Database 8.0+**
* **Redis Cache Server**

---

### 1. Clone the Repository

```bash
git clone https://github.com/Sri-Akshat5/Tokenly.git
cd Tokenly
```

### 2. Configure Settings

Create a local copy of the properties and environment files:

```bash
# Backend configurations (MySQL connection, Redis, SMTP, and JWT secret)
cp backend/src/main/resources/application.properties.example backend/src/main/resources/application.properties

# Frontend configurations (VITE_API_BASE_URL)
cp frontend/.env.example frontend/.env
```

Ensure you edit `backend/src/main/resources/application.properties` to fill in your MySQL database credentials, Redis host, and your JWT signing secret key.

### 3. Build & Run Backend

```bash
cd backend
mvn clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

The Spring Boot server will start on port `8084` by default.

### 4. Build & Run Frontend

```bash
cd ../frontend
npm install
npm run dev
```

The Vite preview server will launch the dashboard client (by default on port `5173`).
 
## Core Concepts
 
Understanding the Tokenly hierarchy is key to a successful integration.
 
| Entity | Description |
|---|---|
| **Client** | Your top-level account. Contains all applications and manages billing. |
| **Application** | A specific platform or environment (e.g., "iOS App", "Production Web"). Each app has its own users and auth settings. |
| **User** | An end user belonging to a specific application. Users are isolated between applications by default. |
| **API Keys** | Public keys (`pk_`) for client-side use, private keys (`sk_`) for server-side operations only. |
 
---
 
## Authentication Modes
 
Tokenly offers five distinct state architectures, configurable per application from the dashboard.
 
### Stateless JWT Tokens
`MODE: JWT` — JSON Web Token (RFC 7519)
 
Self-contained, base64-encoded JSON payloads, cryptographically signed with RS256/RS512. Ideal for high-throughput distributed microservices, since gateways can validate authenticity offline without a database lookup.
 
```bash
curl -X GET https://api.yourservice.com/data \
  -H "Authorization: Bearer eyJhbGciOiJSUzI1..."
```
 
### Stateful Sessions
`MODE: SESSION` — Redis-backed
 
An opaque, cryptographically random Session ID is generated and mapped to the user in a high-speed Redis cluster, giving you immediate backend revocation and strict device concurrency limits.
 
```bash
curl -X GET https://api.yourservice.com/data \
  -H "Authorization: Bearer sid_8f92j..."
```
 
### Simple API Tokens
`MODE: API_TOKEN` — Infinite TTL
 
Opaque, non-expiring tokens for machine-to-machine communication, CLI tools, and backend integrations. They exist until explicitly revoked.
 
```bash
curl -X GET https://api.yourservice.com/data \
  -H "X-API-Key: atk_9a10c..."
```
 
### PASETO V2 Local (Symmetric)
`MODE: PASETO_LOCAL` — AES-256-GCM Encryption
 
Fully encrypts the internal payload (unlike JWTs, which are merely base64-encoded and readable), obfuscating custom claims from the end user. Best for closed-circuit apps with a single backend issuing and verifying tokens.
 
```bash
curl -X GET https://api.yourservice.com/data \
  -H "Authorization: Bearer v2.local.h9J1k..."
```
 
### PASETO V2 Public (Asymmetric)
`MODE: PASETO_PUBLIC` — Ed25519 Signatures
 
Separates algorithm from header entirely, removing "none algorithm" and algorithm-confusion attack vectors. Suited to distributed microservices needing trustless verification via public key.
 
```bash
curl -X GET https://api.yourservice.com/data \
  -H "Authorization: Bearer v2.public.yT5m..."
```
 
### Supported Authentication Modes

- ✓ JWT
- ✓ PASETO Local
- ✓ PASETO Public
- ✓ Stateful Sessions
- ✓ API Tokens
- ✓ OAuth
- ✓ Magic Links
- ✓ Email OTP
 

 
## Configuration
 
### Auth Config
 
Configure per-application from the dashboard:
 
| Setting | Options |
|---|---|
| **Authentication Type** | `JWT`, `SESSION`, `PASETO_LOCAL`, `PASETO_PUBLIC` |
| **Password Hashing** | `BCRYPT`, `ARGON2`, `PBKDF2` |
| **Access Token TTL** | 15 min / 1 hour / 24 hours / Custom |
| **Refresh Token TTL** | 7 days / 30 days / 90 days / Custom |
 
### Custom Fields
 
Capture custom data during signup (e.g., `phone_number`, `is_beta_user`) and store it directly on the user object.
 
Supported field types: `Text`, `Number`, `Boolean`, `Date`
 

---
 
## Security Best Practices
 
- **Never expose private keys** — `sk_` keys are backend-only; never ship them in client-side code.
- **Use HTTPS only** — always encrypt data in transit in production.
- **Validate tokens on the backend** — never trust a token's claims without server-side verification.
- **Implement rate limiting** — protect endpoints from brute-force attacks.
Tokenly ships with secure-by-default configuration compliant with OWASP standards, including enterprise-grade Bcrypt/Argon2id hashing, RS256-signed JWTs, PASETO tokens, and adaptive rate limiting out of the box.
 

 
## License
 
Licensed under the MIT License.

See the LICENSE file for details.
 
---
  
## Contributing

...

---

<p align="center">
Built with ❤️ by the Tokenly community.
</p>
