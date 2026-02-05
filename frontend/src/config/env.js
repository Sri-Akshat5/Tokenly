/**
 * Environment Configuration
 * Centralizes all environment variables for easy access
 */

export const env = {
    // API Configuration
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8084',
    apiTimeout: parseInt(import.meta.env.VITE_API_TIMEOUT) || 30000,

    // Application Configuration
    appName: import.meta.env.VITE_APP_NAME || 'Tokenly',
    appDescription: import.meta.env.VITE_APP_DESCRIPTION || 'Authentication as a Service Platform',

    // Feature Flags
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableDebug: import.meta.env.VITE_ENABLE_DEBUG === 'true',

    // Branding
    footerText: import.meta.env.VITE_FOOTER_TEXT || 'Tokenly',
    securedByText: import.meta.env.VITE_SECURED_BY_TEXT || 'Tokenly Cyber Security',

    // Environment Info
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
    mode: import.meta.env.MODE,
};

// Validate required environment variables
const requiredEnvVars = ['VITE_API_BASE_URL'];

requiredEnvVars.forEach((varName) => {
    if (!import.meta.env[varName]) {
        console.warn(`Warning: Required environment variable ${varName} is not set`);
    }
});

// Log configuration in development
if (env.enableDebug && env.isDevelopment) {
    console.log('🔧 Environment Configuration:', env);
}

export default env;
