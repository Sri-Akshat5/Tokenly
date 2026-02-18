import { Helmet } from 'react-helmet-async';

const DEFAULT_TITLE = 'Tokenly – Auth-as-a-Service for Developers';
const DEFAULT_DESCRIPTION =
    'Tokenly is a secure, multi-tenant Auth-as-a-Service. Add login, signup, JWT, OAuth, magic links, and API key auth to any app in minutes. No SDK lock-in.';
const DEFAULT_IMAGE = 'https://tokenly.dev/favicon.png';
const SITE_URL = 'https://tokenly.dev';

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

            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="Tokenly" />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* JSON-LD Structured Data */}
            {schema && (
                <script type="application/ld+json">{JSON.stringify(schema)}</script>
            )}
        </Helmet>
    );
}
