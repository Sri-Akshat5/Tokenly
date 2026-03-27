import { Helmet } from 'react-helmet-async';

const DEFAULT_TITLE = 'Tokenly – Auth-as-a-Service for Developers (JWT & PASETO)';
const DEFAULT_DESCRIPTION =
    'Tokenly is a secure, multi-tenant Auth-as-a-Service. Add login, signup, JWT, PASETO, OAuth, magic links, and API key auth to any app in minutes. No SDK lock-in.';
const DEFAULT_IMAGE = 'https://tokenly.codes/favicon.png';
const SITE_URL = 'https://tokenly.codes';

export default function SEO({
    title = DEFAULT_TITLE,
    description = DEFAULT_DESCRIPTION,
    url = SITE_URL,
    image = DEFAULT_IMAGE,
    noIndex = false,
    schema = null,
}) {
    const fullTitle = title === DEFAULT_TITLE ? title : `${title} | Tokenly`;

    return (
        <Helmet>
            {/* Primary */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow'} />
            <link rel="canonical" href={url} />

            {/* SEO Enhancements */}
            <meta name="theme-color" content="#0f172a" />
            <meta name="author" content="Tokenly" />
            <meta name="keywords" content="auth service, jwt auth, paseto auth, oauth provider, multi tenant auth, authentication api" />
            <meta name="language" content="en" />
            <meta name="geo.region" content="IN" />

            {/* Icons */}
            <link rel="icon" href="/favicon.ico" />
            <link rel="apple-touch-icon" href="/favicon.png" />
            <link rel="manifest" href="/site.webmanifest" />

            {/* Performance */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />

            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="Tokenly" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
            <meta name="twitter:site" content="@tokenly" />

            {/* Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(schema || defaultSchema)}
            </script>
        </Helmet>
    );
}
