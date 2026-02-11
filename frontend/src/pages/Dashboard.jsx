import { useState, useEffect } from 'react';
import { Plus, Layers, Users, Zap, Activity, AlertCircle, TrendingUp, BarChart3, CheckCircle2, Info } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import applicationService from '../services/applicationService';
import dashboardService from '../services/dashboardService';
import ApplicationCard from '../components/ApplicationCard';

export default function Dashboard() {
    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState({
        totalApplications: 0,
        totalUsers: 0,
        apiSuccessRate: 0,
        activeUsers24h: 0
    });
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const appsRes = await applicationService.list();
            const statsRes = await dashboardService.getStats();
            setApplications(appsRes.data || []);
            setStats(statsRes.data || {
                totalApplications: 0,
                totalUsers: 0,
                apiSuccessRate: 0,
                activeUsers24h: 0
            });
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto pb-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-400 tracking-tighter mb-3 animate-gradient">
                            Welcome back
                        </h1>
                        <p className="text-zinc-500 text-lg max-w-2xl leading-relaxed">
                            Monitor your authentication traffic and manage your security configurations across all your digital products.
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowCreateModal(true)}
                        className="h-12 px-8 shadow-xl shadow-white/10 group hover:shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105 relative overflow-hidden"
                    >
                        {/* Button shimmer effect */}
                        <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100" />
                        <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300 relative z-10" />
                        <span className="relative z-10">Create Application</span>
                    </Button>
                </div>

                {/* Performance Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    <StatCard
                        title="Total Applications"
                        value={stats.totalApplications}
                        icon={Layers}
                        description="Across all environments"
                    />
                    <StatCard
                        title="Total Registered Users"
                        value={stats.totalUsers.toLocaleString()}
                        icon={Users}
                        description="Across all applications"
                    />
                    <StatCard
                        title="API Success Rate"
                        value={`${stats.apiSuccessRate?.toFixed(1) || 100}%`}
                        icon={Zap}
                        description="Last 24 hours"
                    />
                    <StatCard
                        title="Total API Requests"
                        value={stats.totalRequests24h?.toLocaleString() || 0}
                        icon={Activity}
                        description="Last 24 hours"
                    />
                </div>

                {/* Applications Section */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                            <BarChart3 className="w-4 h-4 text-zinc-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">Your Infrastructure</h2>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-64 bg-zinc-900/50 border border-zinc-800 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : applications.length === 0 ? (
                        <EmptyState onCreateClick={() => setShowCreateModal(true)} />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {applications.map((app) => (
                                <ApplicationCard
                                    key={app.id}
                                    application={app}
                                    onStatusChange={loadData}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Create Application Modal */}
                <CreateApplicationModal
                    isOpen={showCreateModal}
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={() => {
                        setShowCreateModal(false);
                        loadData();
                    }}
                />
            </div>
        </DashboardLayout>
    );
}

function StatCard({ title, value, icon: Icon, description }) {
    return (
        <Card className="p-4 group hover:border-zinc-700 transition-all duration-300 relative overflow-hidden">
            {/* Subtle gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex items-center gap-3">
                {/* Icon */}
                <div className="p-2.5 rounded-lg bg-zinc-900/50 border border-zinc-800/50 shrink-0">
                    <Icon className="w-5 h-5 text-zinc-400" />
                </div>

                {/* Content - Vertical Stack */}
                <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mb-1">{title}</p>
                    <p className="text-2xl font-bold text-white tracking-tight mb-1">{value}</p>
                    {description && (
                        <p className="text-[10px] text-zinc-600 font-medium flex items-center gap-1">
                            <Info className="w-3 h-3" />
                            {description}
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
}


function EmptyState({ onCreateClick }) {
    return (
        <Card className="p-20 text-center border-dashed border-2 border-zinc-800 bg-transparent flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-8 border border-zinc-800 shadow-2xl">
                <Layers className="w-10 h-10 text-zinc-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">No infrastructure found</h3>
            <p className="text-zinc-500 mb-10 max-w-sm mx-auto leading-relaxed">
                You haven't created any applications yet. Create one now to start integrating secure authentication into your products.
            </p>
            <Button onClick={onCreateClick} className="h-12 px-10">
                <Plus className="w-5 h-5 mr-2" />
                Initialize Application
            </Button>
        </Card>
    );
}

function CreateApplicationModal({ isOpen, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        appName: '',
        environment: 'DEV',
        authMode: 'JWT',
        loginMethod: 'PASSWORD',
        passwordHashAlgorithm: 'BCRYPT'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await applicationService.create(formData);
            onSuccess();
            setFormData({
                appName: '',
                environment: 'DEV',
                authMode: 'JWT',
                loginMethod: 'PASSWORD',
                passwordHashAlgorithm: 'BCRYPT'
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create application');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Create Application"
            footer={
                <div className="flex gap-4 w-full">
                    <Button variant="secondary" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                        {loading ? 'Initializing...' : 'Confirm Infrastructure'}
                    </Button>
                </div>
            }
        >
            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-2xl mb-6 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">{error}</span>
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-8">
                <Input
                    label="Application Identifier"
                    placeholder="e.g. Acme Mobile App"
                    value={formData.appName}
                    onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
                    required
                    autoFocus
                />

                <div className="space-y-4">
                    <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest block px-1">Deployment Environment</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                            { id: 'DEV', label: 'Dev', color: 'blue' },
                            { id: 'STAGING', label: 'Staging', color: 'yellow' },
                            { id: 'PROD', label: 'Prod', color: 'green' }
                        ].map((env) => (
                            <button
                                key={env.id}
                                type="button"
                                onClick={() => setFormData({ ...formData, environment: env.id })}
                                className={`flex items-center justify-center p-3 rounded-xl border-2 transition-all ${formData.environment === env.id
                                    ? 'bg-zinc-800 border-white text-white'
                                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                                    }`}
                            >
                                <span className="font-bold text-xs uppercase">{env.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-6 pt-4 border-t border-zinc-800/50">
                    <div className="flex items-center gap-2 mb-4">
                        <Zap className="w-4 h-4 text-blue-400" />
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Security Configuration</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block px-1">Authentication Mode</label>
                            <Select
                                value={formData.authMode}
                                onChange={(e) => setFormData({ ...formData, authMode: e.target.value })}
                            >
                                <option value="JWT">Stateless (JWT Tokens)</option>
                                <option value="SESSION">Stateful (Sessions)</option>
                                <option value="API_TOKEN">Simple (API Tokens)</option>
                            </Select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block px-1">Login Method</label>
                            <Select
                                value={formData.loginMethod}
                                onChange={(e) => setFormData({ ...formData, loginMethod: e.target.value })}
                            >
                                <option value="PASSWORD">Email + Password</option>
                                <option value="OTP">One-Time Password (OTP)</option>
                                <option value="MAGIC_LINK">Magic Link</option>
                                <option value="OAUTH">OAuth / Social Login</option>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block px-1">Password Hashing Algorithm</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {[
                                { id: 'BCRYPT', label: 'BCrypt', desc: 'Industry standard' },
                                { id: 'ARGON2', label: 'Argon2', desc: 'Modern & secure' },
                                { id: 'PBKDF2', label: 'PBKDF2', desc: 'Classic stability' }
                            ].map((algo) => (
                                <button
                                    key={algo.id}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, passwordHashAlgorithm: algo.id })}
                                    className={`p-3 rounded-xl border-2 transition-all text-left ${formData.passwordHashAlgorithm === algo.id
                                        ? 'bg-zinc-800 border-white text-white'
                                        : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-700'
                                        }`}
                                >
                                    <p className="font-bold text-xs">{algo.label}</p>
                                    <p className="text-[9px] opacity-60 mt-0.5">{algo.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
