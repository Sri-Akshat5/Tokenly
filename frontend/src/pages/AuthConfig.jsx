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

    useEffect(() => {
        loadData();
    }, [appId]);

    const loadData = async () => {
        try {
            const appRes = await api.get(`/applications/${appId}`);
            const configRes = await api.get(`/admin/${appId}/auth-config`);
            const fieldsRes = await api.get(`/admin/${appId}/fields`);
            setApplication(appRes.data.data);
            if (configRes.data.data) {
                setConfig(configRes.data.data);
            }
            setFields(fieldsRes.data.data || []);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
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
                                    <select
                                        value={config.authMode}
                                        onChange={(e) => setConfig({ ...config, authMode: e.target.value })}
                                        className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-medium"
                                    >
                                        <option value="JWT">Stateless JWT Tokens</option>
                                        <option value="SESSION">Stateful Sessions</option>
                                        <option value="API_TOKEN">Simple API Tokens</option>
                                    </select>
                                    <p className="text-[10px] text-zinc-600 px-1 italic">Determines how persistence is handled between client and server.</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-1">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Custom JWT Payload</label>
                                        <Badge className="bg-zinc-800 text-zinc-500 border-zinc-700 text-[9px] px-1.5 py-0">IDENTITY TOKEN</Badge>
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
                                        These values will be injected into the Identity Token (JWT) payload during authentication.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block px-1">Login Architecture</label>
                                    <select
                                        value={config.loginMethod}
                                        onChange={(e) => setConfig({ ...config, loginMethod: e.target.value })}
                                        className="w-full bg-zinc-900 border border-zinc-800 text-white rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-white/20 transition-all font-medium"
                                    >
                                        <option value="PASSWORD">Standard Email + Password</option>
                                        <option value="OTP">One-Time Password (OTP)</option>
                                        <option value="MAGIC_LINK">Magic Link Delivery</option>
                                        <option value="OAUTH">Managed Social OAuth</option>
                                    </select>
                                </div>

                                {config.loginMethod === 'OAUTH' && (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block px-1">Google Client ID</label>
                                        <Input
                                            placeholder="your-google-client-id.apps.googleusercontent.com"
                                            value={config.googleClientId || ''}
                                            onChange={(e) => setConfig({ ...config, googleClientId: e.target.value })}
                                            className="h-11"
                                        />
                                        <p className="text-[10px] text-zinc-600 px-1 italic">Found in your Google Cloud Console Credentials page.</p>
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
                                    <div className="flex items-start gap-2 p-3 bg-red-500/5 border border-red-500/20 rounded-xl">
                                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                                        <p className="text-[10px] text-red-400 leading-relaxed font-medium">
                                            <span className="font-bold">CAUTION:</span> Changing the hashing algorithm will prevent existing users from logging in until they reset their passwords.
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
            </div>
        </DashboardLayout>
    );
}
