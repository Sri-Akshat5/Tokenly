import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Key,
    Plus,
    Copy,
    Trash2,
    CheckCircle2,
    ShieldAlert,
    Clock,
    Check,
    Info
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import api from '../services/api';
import ApplicationHeader from '../components/ApplicationHeader';
import env from '../config/env';

export default function ApiKeys() {
    const { appId } = useParams();
    const [application, setApplication] = useState(null);
    const [apiKeys, setApiKeys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newKey, setNewKey] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadData();
    }, [appId]);

    const loadData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [appRes, keysRes] = await Promise.all([
                api.get(`/applications/${appId}`),
                api.get(`/admin/${appId}/api-keys`)
            ]);
            setApplication(appRes.data.data);
            setApiKeys(keysRes.data.data || []);
        } catch (error) {
            console.error('Failed to load data:', error);
            setError('Failed to load application data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const [copiedKeyId, setCopiedKeyId] = useState(null);

    const handleCreateKey = async (name) => {
        try {
            const response = await api.post(`/admin/${appId}/api-keys`, { name });
            setNewKey(response.data.data);
            loadData();
        } catch (error) {
            console.error('Failed to create key:', error);
            // Optionally set an error state here specifically for creation if needed
            alert('Failed to create API key');
        }
    };

    const handleRevokeKey = async (keyId) => {
        if (!window.confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
            return;
        }

        try {
            await api.delete(`/admin/${appId}/api-keys/${keyId}`);
            loadData();
        } catch (error) {
            console.error('Failed to revoke key:', error);
            alert('Failed to revoke API key');
        }
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedKeyId(id);
        setTimeout(() => setCopiedKeyId(null), 2000);
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
                        <ShieldAlert className="w-8 h-8 text-red-500" />
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
                    activeTab="api-keys"
                    icon={Key}
                    actions={
                        <Button onClick={() => setShowCreateModal(true)} className="shadow-lg shadow-white/10">
                            <Plus className="w-4 h-4 mr-2" />
                            Generate New Key
                        </Button>
                    }
                />

                {/* Content */}
                <div className="grid grid-cols-1 gap-6">
                    {apiKeys.length === 0 ? (
                        <Card className="p-20 text-center flex flex-col items-center justify-center border-dashed border-2 border-zinc-800">
                            <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mb-6 text-zinc-600">
                                <Key className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No API keys generated</h3>
                            <p className="text-zinc-400 max-w-sm mx-auto mb-8">
                                Generate an API key to start authenticating requests from your application.
                            </p>
                            <Button onClick={() => setShowCreateModal(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Generate First Key
                            </Button>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 gap-4">
                            {apiKeys.map((key, index) => (
                                <ApiKeyCard
                                    key={key.id || index}
                                    apiKey={key}
                                    onRevoke={handleRevokeKey}
                                    onCopy={copyToClipboard}
                                    isCopied={copiedKeyId === key.id}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Help Section */}
                <div className="mt-12 p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl flex items-start gap-5">
                    <div className="p-3 bg-zinc-800 rounded-xl text-zinc-400">
                        <Info className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-white mb-2 tracking-tight">Understanding API Keys</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                            <div>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    Your API Keys are used to authenticate requests to the {env.appName} API. Keep them secret and never expose them in client-side code unless you are using restricted public keys.
                                </p>
                            </div>
                            <ul className="text-sm text-zinc-500 space-y-2">
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full" />
                                    Use different keys for development and production.
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full" />
                                    Revoke keys immediately if they are compromised.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Create Key Modal */}
                <CreateKeyModal
                    isOpen={showCreateModal}
                    onClose={() => {
                        setShowCreateModal(false);
                        setNewKey(null);
                    }}
                    onCreate={handleCreateKey}
                    newKey={newKey}
                />
            </div>
        </DashboardLayout>
    );
}

function ApiKeyCard({ apiKey, onRevoke, onCopy, isCopied }) {
    return (
        <Card className="p-6 transition-all hover:bg-zinc-900/60 group">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-1.5 bg-zinc-800 rounded-lg">
                            <Key className="w-4 h-4 text-zinc-400" />
                        </div>
                        <h3 className="text-lg font-bold text-white truncate">{apiKey.keyName || 'API Key'}</h3>
                        <Badge className={`${apiKey.active
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                            } border text-xs px-2 py-0.5`}>
                            {apiKey.active ? 'ACTIVE' : 'REVOKED'}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="flex-1 bg-black/40 border border-zinc-800/80 px-4 py-2.5 rounded-xl font-mono text-sm text-zinc-400 selection:bg-white selection:text-black truncate">
                            {apiKey.publicKey}
                        </div>
                        <button
                            onClick={() => onCopy(apiKey.publicKey, apiKey.id)}
                            className={`p-2.5 rounded-xl border transition-all ${isCopied
                                ? 'bg-green-500/10 border-green-500/30 text-green-400'
                                : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500'
                                }`}
                            title="Copy Key"
                        >
                            {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Created on {new Date(apiKey.createdAt).toLocaleDateString()}
                        </span>
                        {apiKey.expiresAt && (
                            <span className="flex items-center gap-1">
                                <ShieldAlert className="w-3 h-3" />
                                Expires {new Date(apiKey.expiresAt).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex md:flex-col items-center gap-3">
                    {apiKey.active && (
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => onRevoke(apiKey.id)}
                            className="bg-transparent border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white group"
                        >
                            <Trash2 className="w-4 h-4 mr-2 group-hover:animate-bounce" />
                            Revoke Key
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}

function CreateKeyModal({ isOpen, onClose, onCreate, newKey }) {
    const [keyName, setKeyName] = useState('');
    const [isCopied, setIsCopied] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        onCreate(keyName);
        setKeyName('');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(newKey.publicKey);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={newKey ? 'Key Generated Successfully!' : 'Generate New API Key'}
            footer={
                newKey ? (
                    <Button onClick={onClose} className="w-full">
                        I've Saved the Key
                    </Button>
                ) : null
            }
        >
            {newKey ? (
                <div className="space-y-6">
                    <div className="bg-orange-500/10 border border-orange-500/20 p-5 rounded-2xl flex items-start gap-4">
                        <ShieldAlert className="w-6 h-6 text-orange-400 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-orange-300 font-bold mb-1">Critical Security Warning!</p>
                            <p className="text-sm text-orange-200/70 leading-relaxed">
                                This key will only be shown **ONCE**. Copy and save it in a secure place (like a password manager) immediately. You will not be able to retrieve it later.
                            </p>
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="bg-black/80 border-2 border-zinc-800 p-6 rounded-2xl font-mono text-green-400 break-all pr-14 leading-relaxed group-hover:border-green-500/30 transition-colors">
                            {newKey.publicKey}
                        </div>
                        <button
                            onClick={handleCopy}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl border transition-all ${isCopied
                                ? 'bg-green-500/20 border-green-500/50 text-green-300'
                                : 'bg-zinc-800/80 border-zinc-700 text-zinc-400 hover:text-white'
                                }`}
                        >
                            {isCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        </button>
                    </div>

                    <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                        <span className="text-zinc-400 text-sm italic">Ready to be used in your application</span>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Friendly Key Name"
                        placeholder="e.g. Production Mobile App"
                        value={keyName}
                        onChange={(e) => setKeyName(e.target.value)}
                        required
                        autoFocus
                    />
                    <div className="pt-2">
                        <Button type="submit" className="w-full h-12 text-lg">
                            Generate Key
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
}
