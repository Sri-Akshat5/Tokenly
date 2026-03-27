import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Settings,
    Shield,
    Key,
    Mail,
    UserPlus,
    Save,
    Clock,
    CheckCircle2,
    AlertCircle,
    Info,
    RefreshCw
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import ApplicationHeader from '../components/ApplicationHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import api from '../services/api';

export default function AuthConfig() {
    const { appId } = useParams();
    const [application, setApplication] = useState(null);
    const [fields, setFields] = useState([]);
    const [config, setConfig] = useState({
        accessTokenTtlMinutes: 60,
        refreshTokenTtlMinutes: 43200,
        refreshTokenEnabled: true,
        emailVerificationRequired: false,
        signupEnabled: true,
        jwtCustomClaims: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, [appId]);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const appRes = await api.get(`/applications/${appId}`);
            const configRes = await api.get(`/admin/${appId}/auth-config`);
            const fieldsRes = await api.get(`/admin/${appId}/fields`);
            setApplication(appRes.data.data);
            if (configRes.data.data) {
                const data = configRes.data.data;
                setConfig({
                    ...data,
                    passwordHashAlgorithm: data.hashingAlgorithm, // Map backend field to frontend state
                    accessTokenTtlMinutes: data.accessTokenTtlMinutes ?? 60,
                    refreshTokenTtlMinutes: data.refreshTokenTtlMinutes ?? 43200,
                });
            }
            setFields(fieldsRes.data.data || []);
        } catch (error) {
            console.error('Failed to load data:', error);
            setError('Failed to load configuration data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        // Validation
        if (config.loginMethod === 'OAUTH') {
            if (config.githubClientId && !config.githubClientSecret) {
                setMessage({ type: 'error', text: 'GitHub Client Secret is required' });
                return;
            }
            if (config.githubClientSecret && !config.githubClientId) {
                setMessage({ type: 'error', text: 'GitHub Client ID is required' });
                return;
            }
            if (config.metaAppId && !config.metaAppSecret) {
                setMessage({ type: 'error', text: 'Meta App Secret is required' });
                return;
            }
            if (config.metaAppSecret && !config.metaAppId) {
                setMessage({ type: 'error', text: 'Meta App ID is required' });
                return;
            }
            if (config.auth0Domain && !config.auth0ClientId) {
                setMessage({ type: 'error', text: 'Auth0 Client ID is required' });
                return;
            }
            if (config.auth0ClientId && !config.auth0Domain) {
                setMessage({ type: 'error', text: 'Auth0 Domain is required' });
                return;
            }
        }

        setSaving(true);
        setMessage({ type: '', text: '' });
        try {
            await api.put(`/admin/${appId}/auth-config`, config);
            setMessage({ type: 'success', text: 'Configuration saved successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save configuration' });
        } finally {
            setSaving(false);
        }
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

    if (error) {
        return (
            <DashboardLayout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Something went wrong</h3>
                    <p className="text-zinc-400 mb-6">{error}</p>
                    <Button onClick={loadData}>
                        Try Again
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto pb-12">
                <ApplicationHeader
                    application={application}
                    appId={appId}
                    activeTab="auth-config"
                    icon={Settings}
                    actions={
                        <div className="flex items-center gap-3">
                            {message.text && (
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${message.type === 'success'
                                    ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                                    }`}>
                                    {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                    <span className="text-sm font-medium">{message.text}</span>
                                </div>
                            )}
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="shadow-lg shadow-white/10"
                            >
                                {saving ? (
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <Save className="w-4 h-4 mr-2" />
                                )}
                                Save Changes
                            </Button>
                        </div>
                    }
                />

                {/* Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Security Engine */}
                    <div className="space-y-8">
                        <Card className="p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-blue-500/10 rounded-lg">
                                    <Shield className="w-5 h-5 text-blue-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white">Security Engine</h2>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block px-1">Authentication Mode</label>
                                    <Select
                                        value={config.authMode}
                                        onChange={(e) => setConfig({ ...config, authMode: e.target.value })}
                                    >
                                        <option value="JWT">Stateless JWT Tokens</option>
                                        <option value="SESSION">Stateful Sessions</option>
                                        <option value="API_TOKEN">Simple API Tokens</option>
                                        <option value="PASETO_LOCAL">PASETO V2 Local (Symmetric)</option>
                                        <option value="PASETO_PUBLIC">PASETO V2 Public (Asymmetric)</option>
                                    </Select>
                                    <p className="text-[10px] text-zinc-600 px-1 italic">Determines how persistence is handled between client and server.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                            {config.authMode?.includes('PASETO') ? 'Custom PASETO Claims' : 'Custom JWT Payload'}
                                        </label>
                                        <Badge className="bg-zinc-800 text-zinc-500 border-zinc-700 text-[9px] px-1.5 py-0">
                                            {config.authMode?.includes('PASETO') ? 'PASETO TOKEN' : 'IDENTITY TOKEN'}
                                        </Badge>
                                    </div>

                                    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
                                        {fields.length > 0 ? (
                                            <>
                                                {/* Current Selected Claims */}
                                                <div className="flex flex-wrap gap-2">
                                                    {(config.jwtCustomClaims || '').split(',').filter(c => c.trim()).length > 0 ? (
                                                        (config.jwtCustomClaims || '').split(',').filter(c => c.trim()).map(claim => (
                                                            <button
                                                                key={claim}
                                                                onClick={() => {
                                                                    const newClaims = config.jwtCustomClaims.split(',')
                                                                        .filter(c => c.trim() !== claim.trim())
                                                                        .join(', ');
                                                                    setConfig({ ...config, jwtCustomClaims: newClaims });
                                                                }}
                                                                className="group flex items-center gap-1.5 px-3 py-1.5 bg-white text-black rounded-lg text-xs font-bold shadow-sm hover:bg-zinc-200 transition-all"
                                                            >
                                                                {claim.trim()}
                                                                <Badge className="bg-black/10 text-black/50 border-none p-0 group-hover:text-black transition-colors">
                                                                    ×
                                                                </Badge>
                                                            </button>
                                                        ))
                                                    ) : (
                                                        <div className="w-full text-center py-4 border-2 border-dashed border-zinc-800 rounded-xl">
                                                            <p className="text-[11px] text-zinc-600">No custom claims selected</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="h-px bg-zinc-800" />

                                                {/* Available Options */}
                                                <div className="space-y-3">
                                                    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Available Attributes</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {/* Platform Defaults */}
                                                        {['status', 'verified', 'email', 'id'].map(stdField => {
                                                            const isSelected = (config.jwtCustomClaims || '').split(',').some(c => c.trim() === stdField);
                                                            if (isSelected) return null;
                                                            return (
                                                                <button
                                                                    key={stdField}
                                                                    onClick={() => {
                                                                        const current = config.jwtCustomClaims || '';
                                                                        const newClaims = current ? `${current}, ${stdField}` : stdField;
                                                                        setConfig({ ...config, jwtCustomClaims: newClaims });
                                                                    }}
                                                                    className="px-2.5 py-1 rounded-md border border-zinc-800 text-[11px] text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 transition-all"
                                                                >
                                                                    {stdField}
                                                                    <span className="ml-1 opacity-40 text-[9px] uppercase">std</span>
                                                                </button>
                                                            );
                                                        })}

                                                        {/* Custom Fields */}
                                                        {fields.map(field => {
                                                            const isSelected = (config.jwtCustomClaims || '').split(',').some(c => c.trim() === field.fieldName);
                                                            if (isSelected) return null;
                                                            return (
                                                                <button
                                                                    key={field.fieldName}
                                                                    onClick={() => {
                                                                        const current = config.jwtCustomClaims || '';
                                                                        const newClaims = current ? `${current}, ${field.fieldName}` : field.fieldName;
                                                                        setConfig({ ...config, jwtCustomClaims: newClaims });
                                                                    }}
                                                                    className="px-2.5 py-1 rounded-md border border-zinc-800 text-[11px] text-zinc-400 hover:border-emerald-500/50 hover:text-emerald-400 transition-all"
                                                                >
                                                                    {field.fieldName}
                                                                    <span className="ml-1 opacity-40 text-[9px] uppercase">{field.fieldType.substring(0, 3)}</span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="text-center py-4 space-y-4">
                                                <div className="w-12 h-12 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto text-zinc-500">
                                                    <AlertCircle className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-white mb-1">Custom Fields Required</p>
                                                    <p className="text-[10px] text-zinc-500 max-w-[200px] mx-auto leading-relaxed">
                                                        Define at least one custom field to activate dynamic JWT claims.
                                                    </p>
                                                </div>
                                                <Link
                                                    to={`/app/${appId}/custom-fields`}
                                                    className="inline-block text-[11px] font-bold text-white hover:text-zinc-300 underline underline-offset-4"
                                                >
                                                    Go to Custom Fields →
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-zinc-600 px-1 italic">
                                        These values will be injected into the {config.authMode?.includes('PASETO') ? 'PASETO token' : 'Identity Token (JWT)'} payload during authentication.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block px-1">Login Architecture</label>
                                    <Select
                                        value={config.loginMethod}
                                        onChange={(e) => setConfig({ ...config, loginMethod: e.target.value })}
                                    >
                                        <option value="PASSWORD">Standard Email + Password</option>
                                        <option value="OTP">One-Time Password (OTP)</option>
                                        <option value="MAGIC_LINK">Magic Link Delivery</option>
                                        <option value="OAUTH">Managed Social OAuth</option>
                                    </Select>
                                </div>

                                {config.loginMethod === 'MAGIC_LINK' && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block px-1">Default Redirect URL</label>
                                        <Input
                                            placeholder="https://yourapp.com/dashboard"
                                            value={config.defaultRedirectUrl || ''}
                                            onChange={(e) => setConfig({ ...config, defaultRedirectUrl: e.target.value })}
                                            className="h-11"
                                        />
                                        <p className="text-[10px] text-zinc-600 px-1 italic">
                                            Fallback destination for magic link logins when no redirect URL is specified in the request.
                                        </p>
                                    </div>
                                )}

                                {config.loginMethod === 'OAUTH' && (
                                    <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                                        {/* Google OAuth */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center p-1">
                                                    <svg viewBox="0 0 24 24" className="w-full h-full">
                                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                                    </svg>
                                                </div>
                                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Google OAuth</label>
                                            </div>
                                            <Input
                                                placeholder="your-google-client-id.apps.googleusercontent.com"
                                                value={config.googleClientId || ''}
                                                onChange={(e) => setConfig({ ...config, googleClientId: e.target.value })}
                                                className="h-11"
                                            />
                                            <p className="text-[10px] text-zinc-600 px-1 italic">Found in your Google Cloud Console Credentials page.</p>
                                        </div>

                                        {/* GitHub OAuth */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-[#24292e] rounded-md flex items-center justify-center p-1">
                                                    <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
                                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                                    </svg>
                                                </div>
                                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">GitHub OAuth</label>
                                            </div>
                                            <div className="space-y-3">
                                                <Input
                                                    placeholder="GitHub Client ID"
                                                    value={config.githubClientId || ''}
                                                    onChange={(e) => setConfig({ ...config, githubClientId: e.target.value })}
                                                    className="h-11"
                                                />
                                                <Input
                                                    placeholder="GitHub Client Secret"
                                                    type="password"
                                                    value={config.githubClientSecret || ''}
                                                    onChange={(e) => setConfig({ ...config, githubClientSecret: e.target.value })}
                                                    className="h-11"
                                                />
                                            </div>
                                            <p className="text-[10px] text-zinc-600 px-1 italic">Create an OAuth App in your GitHub Developer Settings.</p>
                                        </div>

                                        {/* Meta (Facebook) OAuth */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-[#1877F2] rounded-md flex items-center justify-center p-1">
                                                    <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
                                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                    </svg>
                                                </div>
                                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Meta (Facebook) OAuth</label>
                                            </div>
                                            <div className="space-y-3">
                                                <Input
                                                    placeholder="Meta App ID"
                                                    value={config.metaAppId || ''}
                                                    onChange={(e) => setConfig({ ...config, metaAppId: e.target.value })}
                                                    className="h-11"
                                                />
                                                <Input
                                                    placeholder="Meta App Secret"
                                                    type="password"
                                                    value={config.metaAppSecret || ''}
                                                    onChange={(e) => setConfig({ ...config, metaAppSecret: e.target.value })}
                                                    className="h-11"
                                                />
                                            </div>
                                            <p className="text-[10px] text-zinc-600 px-1 italic">Found in your Meta for Developers App Dashboard.</p>
                                        </div>

                                        {/* Auth0 OAuth */}
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-[#EB5424] rounded-md flex items-center justify-center p-1">
                                                    <svg viewBox="0 0 24 24" className="w-full h-full fill-white">
                                                        <path d="M16.695 10.383L13.88 13.804C13.987 14.072 14.047 14.363 14.047 14.667C14.047 16.03 12.946 17.133 11.583 17.133C10.22 17.133 9.117 16.03 9.117 14.667C9.117 13.303 10.22 12.2 11.583 12.2C11.968 12.2 12.33 12.296 12.651 12.467L13.268 11.733L16.695 10.383ZM21.98 7.448L20 9.826C20.36 10.762 20.57 11.782 20.57 12.85C20.57 17.535 16.765 21.34 12.08 21.34C7.395 21.34 3.59 17.535 3.59 12.85C3.59 8.165 7.395 4.36 12.08 4.36C13.568 4.36 14.955 4.745 16.17 5.414L18.3 2.858C16.48 0.653 14.33 0 12.08 0C5.408 0 0 5.408 0 12.08C0 18.752 5.408 24.16 12.08 24.16C18.752 24.16 24.16 18.752 24.16 12.08C24.16 10.184 23.7 8.396 22.888 6.8L21.98 7.448Z" />
                                                    </svg>
                                                </div>
                                                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Auth0 OAuth</label>
                                            </div>
                                            <div className="space-y-3">
                                                <Input
                                                    placeholder="Auth0 Domain (e.g. dev-xyz.us.auth0.com)"
                                                    value={config.auth0Domain || ''}
                                                    onChange={(e) => setConfig({ ...config, auth0Domain: e.target.value })}
                                                    className="h-11"
                                                />
                                                <Input
                                                    placeholder="Auth0 Client ID"
                                                    value={config.auth0ClientId || ''}
                                                    onChange={(e) => setConfig({ ...config, auth0ClientId: e.target.value })}
                                                    className="h-11"
                                                />
                                            </div>
                                            <p className="text-[10px] text-zinc-600 px-1 italic">Found in your Auth0 Application Settings.</p>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block px-1">Password Hashing Algorithm</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {[
                                            { id: 'BCRYPT', label: 'BCrypt', desc: 'Secure Default' },
                                            { id: 'ARGON2', label: 'Argon2', desc: 'Winner of PHC' },
                                            { id: 'PBKDF2', label: 'PBKDF2', desc: 'Legacy Safe' }
                                        ].map((algo) => (
                                            <button
                                                key={algo.id}
                                                type="button"
                                                onClick={() => setConfig({ ...config, passwordHashAlgorithm: algo.id })}
                                                className={`p-3 rounded-xl border-2 transition-all text-left ${config.passwordHashAlgorithm === algo.id
                                                    ? 'bg-zinc-800 border-white text-white'
                                                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                                                    }`}
                                            >
                                                <p className="font-bold text-xs">{algo.label}</p>
                                                <p className="text-[9px] opacity-60 mt-0.5">{algo.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex items-start gap-2 p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                                        <AlertCircle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                                        <p className="text-[10px] text-blue-400 leading-relaxed font-medium">
                                            <span className="font-bold">INFO:</span> Changing the hashing algorithm will automatically migrate existing users to the new algorithm on their next login.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-purple-500/10 rounded-lg">
                                    <Clock className="w-5 h-5 text-purple-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white">Token Lifetimes</h2>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <Input
                                        label="Access Token Duration (m)"
                                        type="number"
                                        value={config.accessTokenTtlMinutes}
                                        onChange={(e) => setConfig({ ...config, accessTokenTtlMinutes: parseInt(e.target.value) })}
                                        min="1"
                                    />
                                    <Input
                                        label="Refresh Token Duration (m)"
                                        type="number"
                                        value={config.refreshTokenTtlMinutes}
                                        onChange={(e) => setConfig({ ...config, refreshTokenTtlMinutes: parseInt(e.target.value) })}
                                        min="1"
                                    />
                                </div>

                                <div className="p-4 bg-zinc-800/30 rounded-2xl border border-zinc-800 flex items-start gap-4 hover:border-zinc-700 transition-colors cursor-pointer" onClick={() => setConfig({ ...config, refreshTokenEnabled: !config.refreshTokenEnabled })}>
                                    <div className="pt-1">
                                        <input
                                            type="checkbox"
                                            checked={config.refreshTokenEnabled}
                                            onChange={(e) => setConfig({ ...config, refreshTokenEnabled: e.target.checked })}
                                            className="w-5 h-5 rounded-lg border-zinc-700 bg-zinc-900 text-white outline-none ring-0 focus:ring-0"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-white text-sm font-bold cursor-pointer">Enable Refresh Loop</label>
                                        <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
                                            Grants long-lived credentials for continuous access.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Authentication Flow */}
                    <div className="space-y-8">
                        <Card className="p-8">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-green-500/10 rounded-lg">
                                    <UserPlus className="w-5 h-5 text-green-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white">Lifecycle Management</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-zinc-800/30 rounded-2xl border border-zinc-800 flex items-start gap-4 hover:border-zinc-700 transition-colors cursor-pointer" onClick={() => setConfig({ ...config, signupEnabled: !config.signupEnabled })}>
                                    <div className="pt-1">
                                        <input
                                            type="checkbox"
                                            checked={config.signupEnabled}
                                            onChange={(e) => setConfig({ ...config, signupEnabled: e.target.checked })}
                                            className="w-5 h-5 rounded-lg border-zinc-700 bg-zinc-900 text-white outline-none ring-0"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-white text-sm font-bold cursor-pointer">Allow Public Onboarding</label>
                                        <p className="text-[11px] text-zinc-500 mt-0.5">
                                            Exposes the registration endpoint to the public Internet.
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 bg-zinc-800/30 rounded-2xl border border-zinc-800 flex items-start gap-4 hover:border-zinc-700 transition-colors cursor-pointer" onClick={() => setConfig({ ...config, emailVerificationRequired: !config.emailVerificationRequired })}>
                                    <div className="pt-1">
                                        <input
                                            type="checkbox"
                                            checked={config.emailVerificationRequired}
                                            onChange={(e) => setConfig({ ...config, emailVerificationRequired: e.target.checked })}
                                            className="w-5 h-5 rounded-lg border-zinc-700 bg-zinc-900 text-white outline-none ring-0"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-white text-sm font-bold cursor-pointer">Strict Verification Mode</label>
                                        <p className="text-[11px] text-zinc-500 mt-0.5">
                                            Blocks login attempts until the user's email is cryptographically verified.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-8 border-dashed border-2 border-zinc-800 bg-transparent shadow-none">
                            <div className="flex items-center gap-3 mb-4">
                                <Mail className="w-5 h-5 text-zinc-600" />
                                <h3 className="text-lg font-bold text-zinc-600 tracking-tight">External Notification Engine</h3>
                            </div>
                            <p className="text-xs text-zinc-600 mb-6 leading-relaxed">
                                Connect external providers to manage high-volume communications like verification codes and password recovery.
                            </p>
                            <Button variant="secondary" className="w-full border-zinc-800 text-zinc-600 hover:text-zinc-500 cursor-not-allowed h-11" disabled>
                                Coming Soon
                            </Button>
                        </Card>
                    </div>
                </div>
            </div >
        </DashboardLayout >
    );
}
