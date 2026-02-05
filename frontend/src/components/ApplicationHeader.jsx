import { Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Key,
    Settings,
    Database,
    Users,
    FileText,
    Activity
} from 'lucide-react';
import Badge from './ui/Badge';

export default function ApplicationHeader({
    application,
    appId,
    activeTab,
    actions,
    icon: Icon
}) {
    const navigate = useNavigate();

    const tabs = [
        { id: 'api-keys', label: 'API Keys', icon: Key, to: `/app/${appId}` },
        { id: 'auth-config', label: 'Auth Config', icon: Settings, to: `/app/${appId}/auth-config` },
        { id: 'custom-fields', label: 'Custom Fields', icon: Database, to: `/app/${appId}/custom-fields` },
        { id: 'users', label: 'Users', icon: Users, to: `/app/${appId}/users` },
        { id: 'docs', label: 'Integration Guide', icon: FileText, to: `/app/${appId}/docs` },
    ];

    return (
        <div className="mb-8">
            <div
                className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors mb-6 group cursor-pointer w-fit"
                onClick={() => navigate('/dashboard')}
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to Dashboard</span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-gradient-to-br from-zinc-700 to-black rounded-2xl flex items-center justify-center text-white shadow-lg shadow-white/5 border border-zinc-800">
                        {Icon ? <Icon className="w-8 h-8" /> : <Activity className="w-8 h-8" />}
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white tracking-tight mb-2">
                            {application?.appName || 'Loading...'}
                        </h1>
                        <div className="flex items-center gap-3 text-sm">
                            <Badge className={`${application?.environment === 'PROD'
                                ? 'bg-green-500/10 text-green-400 border-green-500/30'
                                : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                } border px-2 py-0.5`}>
                                {application?.environment || 'ENV'}
                            </Badge>
                            <span className="text-zinc-500">•</span>
                            <span className="text-zinc-400 flex items-center gap-1">
                                <Activity className="w-3 h-3 text-green-500" />
                                {application?.status || 'Active'}
                            </span>
                        </div>
                    </div>
                </div>

                {actions && <div className="flex gap-3">{actions}</div>}
            </div>

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 p-1 bg-zinc-900/50 backdrop-blur-md rounded-2xl border border-zinc-800/50 w-fit">
                {tabs.map((tab) => (
                    <Link
                        key={tab.id}
                        to={tab.to}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-medium ${activeTab === tab.id
                            ? 'bg-white text-black shadow-lg shadow-white/10'
                            : 'text-zinc-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}
