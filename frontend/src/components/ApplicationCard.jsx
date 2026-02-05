import { Link } from 'react-router-dom';
import { Users, Activity, Settings, Globe } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';

export default function ApplicationCard({ application }) {
    const environmentStyles = {
        DEV: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        STAGING: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
        PROD: 'bg-green-500/10 text-green-400 border-green-500/30',
    };

    return (
        <Card className="flex flex-col overflow-hidden group hover:bg-zinc-900/40 transition-all duration-300">
            <div className="p-8 flex-1">
                <div className="flex items-start justify-between mb-8">
                    <div className="w-14 h-14 bg-zinc-800 border border-zinc-700/50 rounded-2xl flex items-center justify-center text-zinc-500 group-hover:text-white group-hover:bg-zinc-700/50 transition-all duration-300">
                        <Globe className="w-7 h-7" />
                    </div>
                    <Badge className={`${environmentStyles[application.environment]} border px-2 py-0.5 text-[10px] font-bold tracking-widest`}>
                        {application.environment}
                    </Badge>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                    {application.appName}
                </h3>

                <div className="flex items-center gap-4 text-xs font-semibold text-zinc-500 uppercase tracking-widest mt-4">
                    <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" />
                        <span>{application.userCount || 0} Users</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Activity className="w-3.5 h-3.5" />
                        <span className="text-green-500">Live</span>
                    </div>
                </div>
            </div>

            <div className="p-6 bg-zinc-900/30 border-t border-zinc-800/50 flex gap-3">
                <Link
                    to={`/app/${application.id}`}
                    className="flex-1 h-11 inline-flex items-center justify-center bg-white text-black rounded-xl hover:bg-zinc-200 transition-all font-bold text-sm tracking-tight shadow-lg shadow-white/5"
                >
                    Management Console
                </Link>
                <Link
                    to={`/app/${application.id}/auth-config`}
                    className="w-11 h-11 inline-flex items-center justify-center border border-zinc-800 rounded-xl hover:border-zinc-600 transition-all text-zinc-500 hover:text-white"
                >
                    <Settings className="w-4 h-4" />
                </Link>
            </div>
        </Card>
    );
}
