import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    FileText,
    Copy,
    Check,
    ArrowLeft,
    Layers,
    Users,
    Settings,
    Key,
    Database,
    Activity,
    Globe,
    Terminal,
    Code2,
    CheckCircle2,
    ChevronRight,
    ExternalLink,
    Lock,
    Zap
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import api from '../services/api';
import applicationService from '../services/applicationService';
import Button from '../components/ui/Button';
import ApplicationHeader from '../components/ApplicationHeader';
import env from '../config/env';

export default function ApiDocumentation() {
    const { appId } = useParams();
    const [application, setApplication] = useState(null);
    const [endpoints, setEndpoints] = useState(null);
    const [fields, setFields] = useState([]);
    const [sampleUser, setSampleUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        loadData();
    }, [appId]);

    const loadData = async () => {
        try {
            const [appRes, endpointsRes, fieldsRes, usersRes] = await Promise.all([
                applicationService.get(appId),
                applicationService.getEndpoints(appId),
                api.get(`/admin/${appId}/fields`),
                api.get(`/admin/${appId}/users?limit=1`)
            ]);
            setApplication(appRes.data);
            setEndpoints(endpointsRes.data);
            setFields(fieldsRes.data.data || []);
            // usersRes.data.data might be a page object or list depending on implementation
            const userList = usersRes.data.data?.content || usersRes.data.data || [];
            if (userList.length > 0) {
                setSampleUser(userList[0]);
            }
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const copyCode = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                </div>
            </DashboardLayout>
        );
    }

    const effectiveBaseUrl = endpoints?.baseUrl || `${env.apiBaseUrl}/api/auth`;

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto pb-12">
                <ApplicationHeader
                    application={application}
                    appId={appId}
                    activeTab="docs"
                    icon={FileText}
                    actions={
                        <a href="/tokenly-postman-collection.json" download="{env.appName}_API_Collection.json" className="no-underline">
                            <Button variant="secondary" className="border-zinc-800 hover:bg-zinc-800">
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Postman Collection
                            </Button>
                        </a>
                    }
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Left Column: Docs */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* Getting Started */}
                        <section id="getting-started scroll-mt-24">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <Zap className="w-5 h-5 text-blue-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">Getting Started</h2>
                            </div>

                            <Card className="p-8">
                                <p className="text-zinc-400 mb-8 leading-relaxed">
                                    {env.appName} provides a RESTful API for seamless user authentication. All endpoints are secured with your application's API key and use standard HTTP methods.
                                </p>

                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Base API URL</label>
                                            <button
                                                onClick={() => copyCode(effectiveBaseUrl, 'baseUrl')}
                                                className="text-zinc-500 hover:text-white transition-colors"
                                            >
                                                {copiedId === 'baseUrl' ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                        <div className="bg-black/50 border border-zinc-800 p-4 rounded-xl font-mono text-blue-400 text-sm overflow-x-auto">
                                            {effectiveBaseUrl}
                                        </div>
                                    </div>

                                    <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl flex items-start gap-4">
                                        <div className="p-2 bg-zinc-800 rounded-lg text-zinc-400">
                                            <Lock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-white mb-1">Authentication Header</h4>
                                            <p className="text-xs text-zinc-500 leading-relaxed">
                                                Include <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-300">X-API-Key: your_api_key</code> in every request. Admin endpoints also require a Bearer token.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </section>

                        {/* Endpoints */}
                        <div className="space-y-10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                    <Globe className="w-5 h-5 text-purple-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white tracking-tight">Authentication Endpoints</h2>
                            </div>

                            {[
                                { ...endpoints?.signup, id: 'signup', title: 'User Signup' },
                                { ...endpoints?.login, id: 'login', title: 'User Login' },
                                { ...endpoints?.profile, id: 'profile', title: 'Get Profile' }
                            ].filter(e => e.url || true).map((endpoint) => {
                                // Provide fallback URLs if endpoints are not loaded from backend yet
                                if (!endpoint.url) {
                                    const fallbackUrls = {
                                        signup: `${effectiveBaseUrl}/signup`,
                                        login: `${effectiveBaseUrl}/login`,
                                        profile: `${effectiveBaseUrl}/profile`
                                    };
                                    endpoint.url = fallbackUrls[endpoint.id];
                                    endpoint.method = endpoint.id === 'profile' ? 'GET' : 'POST';
                                }
                                return (
                                    <EndpointCard
                                        key={endpoint.id}
                                        endpoint={endpoint}
                                        onCopy={copyCode}
                                        isCopied={copiedId === endpoint.id}
                                    />
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Column: Code Examples */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="sticky top-24">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-emerald-500/10 rounded-lg">
                                    <Code2 className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white tracking-tight">Quick Snippets</h2>
                            </div>

                            <div className="space-y-6">
                                <CodeSnippet
                                    label={`cURL Signup (With ${fields.length} Custom Fields)`}
                                    code={generateSignupCurl(endpoints?.signup?.url || `${effectiveBaseUrl}/signup`, application, fields)}
                                    onCopy={copyCode}
                                    isCopied={copiedId === 'snippet-signup'}
                                    id="snippet-signup"
                                    description="Create a new user with all required custom fields."
                                />

                                <CodeSnippet
                                    label={`cURL Login (${application?.authConfig?.loginMethod || 'Standard'})`}
                                    code={generateLoginCurl(endpoints?.login?.url || `${effectiveBaseUrl}/login`, effectiveBaseUrl, application)}
                                    onCopy={copyCode}
                                    isCopied={copiedId === 'snippet-login'}
                                    id="snippet-login"
                                    description={`Authenticate using ${application?.authConfig?.loginMethod?.replace('_', ' ') || 'Password'} flow.`}
                                />

                                <CodeSnippet
                                    label="cURL Get Profile"
                                    code={generateProfileCurl(endpoints?.profile?.url || `${effectiveBaseUrl}/profile`, effectiveBaseUrl, sampleUser)}
                                    onCopy={copyCode}
                                    isCopied={copiedId === 'snippet-profile'}
                                    id="snippet-profile"
                                    description="Retrieve details for a specific user (requires Access Token)."
                                />
                            </div>

                            <div className="mt-6 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">Configuration</h4>
                                <ul className="space-y-2 text-xs text-zinc-400">
                                    <li className="flex justify-between">
                                        <span>Auth Mode:</span>
                                        <span className="text-white font-mono">{application?.authConfig?.authMode}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Login Method:</span>
                                        <span className="text-white font-mono">{application?.authConfig?.loginMethod}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Hashing:</span>
                                        <span className="text-white font-mono">{application?.authConfig?.passwordHashAlgorithm}</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

function EndpointCard({ endpoint, onCopy, isCopied }) {
    return (
        <Card className="overflow-hidden border-zinc-800">
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/40">
                <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-widest ${endpoint.method === 'POST' ? 'bg-emerald-500/10 text-emerald-400' :
                        endpoint.method === 'GET' ? 'bg-blue-500/10 text-blue-400' :
                            'bg-zinc-500/10 text-zinc-400'
                        }`}>
                        {endpoint.method}
                    </span>
                    <h3 className="text-lg font-bold text-white">{endpoint.title}</h3>
                </div>
                <button
                    onClick={() => onCopy(endpoint.url, endpoint.id)}
                    className="p-2 text-zinc-500 hover:text-white transition-colors"
                >
                    {isCopied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>

            <div className="p-8 space-y-6">
                <div>
                    <p className="text-zinc-400 text-sm leading-relaxed">{endpoint.description}</p>
                    <div className="mt-4 bg-black/60 px-4 py-3 rounded-xl font-mono text-sm text-zinc-300 border border-zinc-800 flex items-center justify-between">
                        <span className="truncate">{endpoint.url}</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {endpoint.headers && (
                        <div>
                            <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block mb-2">Request Headers</label>
                            <pre className="p-4 bg-zinc-900 rounded-xl text-zinc-400 text-xs font-mono overflow-auto border border-zinc-800/50">
                                {JSON.stringify(endpoint.headers, null, 2)}
                            </pre>
                        </div>
                    )}
                    {endpoint.body && (
                        <div>
                            <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block mb-2">JSON Body</label>
                            <pre className="p-4 bg-zinc-900 rounded-xl text-blue-300 text-xs font-mono overflow-auto border border-zinc-800/50">
                                {JSON.stringify(endpoint.body, null, 2)}
                            </pre>
                        </div>
                    )}
                </div>

                {endpoint.response && (
                    <div>
                        <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block mb-2">Response Sample (200 OK)</label>
                        <pre className="p-4 bg-black/40 rounded-xl text-green-400 text-xs font-mono overflow-auto border border-zinc-800/30">
                            {JSON.stringify(endpoint.response, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </Card>
    );
}

function CodeSnippet({ label, code, onCopy, isCopied, id, description }) {
    return (
        <div className="space-y-2">
            <div className="bg-zinc-800/50 rounded-xl border border-zinc-800 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{label}</span>
                        {description && <span className="text-[10px] text-zinc-500 mt-0.5">{description}</span>}
                    </div>
                    <button onClick={() => onCopy(code, id)} className="text-zinc-500 hover:text-white transition-colors">
                        {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>
                <pre className="p-4 bg-black/80 font-mono text-xs leading-relaxed text-zinc-300 overflow-x-auto max-h-[400px]">
                    <code>{code}</code>
                </pre>
            </div>
        </div>
    );
}

function generateSignupCurl(url, application, fields) {
    const body = {
        email: "user@example.com",
        password: "Password123!"
    };

    // Add custom fields
    if (fields && fields.length > 0) {
        fields.forEach(field => {
            let sampleValue;
            switch (field.fieldType) {
                case 'NUMBER': sampleValue = 42; break;
                case 'BOOLEAN': sampleValue = true; break;
                case 'DATE': sampleValue = "2024-01-01"; break;
                default: sampleValue = `Sample ${field.fieldName}`;
            }
            body[field.fieldName] = sampleValue;
        });
    }

    return `curl -X POST ${url} \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(body, null, 2)}'`;
}

function generateLoginCurl(loginUrl, baseUrl, application) {
    const method = application?.authConfig?.loginMethod;

    if (method === 'OTP') {
        return `# 1. Request OTP
curl -X POST "${baseUrl}/request-otp?email=user@example.com" \\
  -H "X-API-Key: YOUR_API_KEY"

# 2. Login with OTP
curl -X POST "${loginUrl}" \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "otp": "123456"
  }'`;
    }

    if (method === 'MAGIC_LINK') {
        return `# Request Magic Link
curl -X POST "${baseUrl}/request-magic-link?email=user@example.com" \\
  -H "X-API-Key: YOUR_API_KEY"`;
    }

    // Default: PASSWORD
    return `curl -X POST ${loginUrl} \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "user@example.com",
    "password": "Password123!"
  }'`;
}

function generateProfileCurl(url) {
    return `curl -X GET ${url} \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"`;
}
