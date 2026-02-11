import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Activity, Settings, AlertTriangle } from 'lucide-react';
import Card from './ui/Card';
import Button from './ui/Button';
import applicationService from '../services/applicationService';

export default function ApplicationCard({ application, onStatusChange }) {
    const [isToggling, setIsToggling] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingStatus, setPendingStatus] = useState(null);

    const handleToggleClick = (newStatus) => {
        setPendingStatus(newStatus);
        setShowConfirmModal(true);
    };

    const handleConfirm = async () => {
        setShowConfirmModal(false);
        setIsToggling(true);
        try {
            await applicationService.toggleStatus(application.id, pendingStatus);
            if (onStatusChange) {
                onStatusChange();
            }
        } catch (error) {
            console.error('Failed to toggle status:', error);
            alert('Failed to update application status. Please try again.');
        } finally {
            setIsToggling(false);
            setPendingStatus(null);
        }
    };

    const handleCancel = () => {
        setShowConfirmModal(false);
        setPendingStatus(null);
    };

    const environmentStyles = {
        DEV: {
            border: 'border-blue-500/30',
            text: 'text-blue-400',
            bg: 'bg-blue-500/5',
            dot: 'bg-blue-500',
            accent: 'from-blue-500/20'
        },
        STAGING: {
            border: 'border-yellow-500/30',
            text: 'text-yellow-400',
            bg: 'bg-yellow-500/5',
            dot: 'bg-yellow-500',
            accent: 'from-yellow-500/20'
        },
        PROD: {
            border: 'border-green-500/30',
            text: 'text-green-400',
            bg: 'bg-green-500/5',
            dot: 'bg-green-500',
            accent: 'from-green-500/20'
        },
    };

    const env = environmentStyles[application.environment];

    return (
        <>
            <div className="group relative">
                {/* Unique angled corner accent */}
                <div className={`absolute -top-1 -right-1 w-16 h-16 ${env.bg} ${env.border} border-l border-b transform rotate-45 origin-top-right opacity-50 group-hover:opacity-100 transition-opacity duration-300`} />

                <Card className="relative overflow-hidden border-zinc-800 hover:border-zinc-700 transition-all duration-500 card-premium">
                    {/* Terminal-style header bar */}
                    <div className="h-8 bg-zinc-900/80 border-b border-zinc-800/50 flex items-center px-4 gap-2">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                        </div>
                        <div className="flex-1 flex items-center justify-center">
                            <span className="text-[9px] text-zinc-600 font-mono tracking-wider">
                                {application.id.substring(0, 8)}...
                            </span>
                        </div>
                        <div className={`w-1.5 h-1.5 rounded-full ${env.dot} animate-pulse`} />
                    </div>

                    {/* Main content area */}
                    <div className="p-6 space-y-6">
                        {/* App name with environment indicator */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className={`px-2 py-0.5 rounded ${env.bg} ${env.border} border`}>
                                    <span className={`text-[9px] font-bold font-mono ${env.text} tracking-widest`}>
                                        {application.environment}
                                    </span>
                                </div>
                                <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent" />
                            </div>
                            <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-zinc-500 transition-all">
                                {application.appName}
                            </h3>
                        </div>

                        {/* Stats grid - unique layout */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50 group-hover:border-zinc-700/50 transition-colors">
                                <div className="flex items-center gap-1.5">
                                    <Users className="w-3 h-3 text-zinc-600" />
                                    <span className="text-[9px] text-zinc-600 uppercase tracking-wider font-semibold">Users</span>
                                </div>
                                <p className="text-2xl font-bold text-white tabular-nums">
                                    {application.userCount || 0}
                                </p>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    const newStatus = application.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
                                    handleToggleClick(newStatus);
                                }}
                                disabled={isToggling}
                                className="space-y-1 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/50 hover:border-zinc-700/50 transition-all cursor-pointer text-left disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Click to toggle status"
                            >
                                <div className="flex items-center gap-1.5">
                                    <Activity className={`w-3 h-3 ${application.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}`} />
                                    <span className="text-[9px] text-zinc-600 uppercase tracking-wider font-semibold">Status</span>
                                </div>
                                <p className={`text-sm font-bold flex items-center gap-1.5 ${application.status === 'ACTIVE' ? 'text-green-500' :
                                    application.status === 'INACTIVE' ? 'text-red-500' :
                                        application.status === 'DISABLED' ? 'text-orange-500' :
                                            'text-yellow-500'
                                    }`}>
                                    {application.status === 'ACTIVE' && <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />}
                                    {application.status || 'ACTIVE'}
                                </p>
                            </button>
                        </div>

                        {/* Action buttons - horizontal layout */}
                        <div className="flex gap-2 pt-2">
                            <Link
                                to={`/app/${application.id}`}
                                className="flex-1 h-10 inline-flex items-center justify-center bg-white text-black rounded-lg hover:bg-zinc-200 transition-all font-semibold text-sm tracking-tight group/btn relative overflow-hidden"
                            >
                                <span className="relative z-10">Open Console</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                            </Link>
                            <Link
                                to={`/app/${application.id}/auth-config`}
                                className="w-10 h-10 inline-flex items-center justify-center border border-zinc-800 rounded-lg hover:border-zinc-600 hover:bg-zinc-800/50 transition-all text-zinc-500 hover:text-white"
                                title="Settings"
                            >
                                <Settings className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Subtle bottom accent line */}
                    <div className={`h-0.5 bg-gradient-to-r ${env.accent} via-zinc-800 to-transparent opacity-0 group-hover:opacity-50 transition-opacity`} />
                </Card>
            </div>

            {/* Custom Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                <AlertTriangle className="w-6 h-6 text-yellow-500" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-white mb-2">
                                    {pendingStatus === 'ACTIVE' ? 'Activate' : 'Deactivate'} Application?
                                </h3>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    Are you sure you want to {pendingStatus === 'ACTIVE' ? 'activate' : 'deactivate'} <span className="font-semibold text-white">"{application.appName}"</span>?
                                </p>
                                <p className="text-xs text-zinc-500 mt-2">
                                    This will {pendingStatus === 'ACTIVE' ? 'enable' : 'disable'} all authentication endpoints for this application.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={handleCancel}
                                variant="secondary"
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                className="flex-1"
                            >
                                {pendingStatus === 'ACTIVE' ? 'Activate' : 'Deactivate'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
