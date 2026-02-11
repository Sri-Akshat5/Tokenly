import { useState, useEffect } from 'react';
import { Calendar, CheckCircle, XCircle, Clock, Activity, Filter } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Select from '../components/ui/Select';
import dashboardService from '../services/dashboardService';
import applicationService from '../services/applicationService';

export default function RequestLogs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [apps, setApps] = useState([]);
    const [selectedApp, setSelectedApp] = useState('');
    const [selectedType, setSelectedType] = useState('');

    useEffect(() => {
        loadApps();
    }, []);

    useEffect(() => {
        loadLogs();
    }, [page, selectedApp, selectedType]);

    const loadApps = async () => {
        try {
            const response = await applicationService.list();
            setApps(response.data || []);
        } catch (error) {
            console.error('Failed to load apps:', error);
        }
    };

    const loadLogs = async () => {
        try {
            setLoading(true);
            const response = await dashboardService.getRequestLogs(page, 50, selectedApp || null, selectedType || null);
            setLogs(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
        } catch (error) {
            console.error('Failed to load request logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const getStatusBadge = (success, statusCode) => {
        if (success) {
            return (
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {statusCode}
                </Badge>
            );
        }
        return (
            <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                <XCircle className="w-3 h-3 mr-1" />
                {statusCode}
            </Badge>
        );
    };

    const getMethodBadge = (method) => {
        const colors = {
            GET: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            POST: 'bg-green-500/10 text-green-400 border-green-500/20',
            PUT: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
            PATCH: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
            DELETE: 'bg-red-500/10 text-red-400 border-red-500/20',
        };
        return (
            <Badge className={colors[method] || 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}>
                {method}
            </Badge>
        );
    };

    return (
        <DashboardLayout>
            <div className="p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Activity className="w-8 h-8 text-white" />
                        <h1 className="text-4xl font-bold text-white tracking-tight">API Request Logs</h1>
                    </div>
                    <p className="text-zinc-500">Track all API requests made to your applications</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="w-full sm:w-64">
                        <Select
                            value={selectedApp}
                            onChange={(e) => { setSelectedApp(e.target.value); setPage(0); }}
                        >
                            <option value="">All Applications</option>
                            {apps.map(app => (
                                <option key={app.id} value={app.id}>{app.appName}</option>
                            ))}
                        </Select>
                    </div>
                    <div className="w-full sm:w-48">
                        <Select
                            value={selectedType}
                            onChange={(e) => { setSelectedType(e.target.value); setPage(0); }}
                        >
                            <option value="">All Request Types</option>
                            <option value="LOGIN">Login</option>
                            <option value="SIGNUP">Signup</option>
                            <option value="OTP">OTP</option>
                            <option value="MAGIC_LINK">Magic Link</option>
                        </Select>
                    </div>
                </div>

                {/* Table */}
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-zinc-900/50 border-b border-zinc-800">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Timestamp</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Application</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Method</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Endpoint</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">Response Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-zinc-500">
                                            Loading logs...
                                        </td>
                                    </tr>
                                ) : logs.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-zinc-500">
                                            No API requests logged yet
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-zinc-900/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2 text-sm text-zinc-400">
                                                    <Calendar className="w-4 h-4" />
                                                    {formatDate(log.loggedAt)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm font-medium text-white">{log.applicationName}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getMethodBadge(log.method)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <code className="text-sm text-zinc-300 font-mono">{log.endpoint}</code>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getStatusBadge(log.success, log.statusCode)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5 text-sm text-zinc-400">
                                                    <Clock className="w-4 h-4" />
                                                    {log.responseTimeMs}ms
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-zinc-800 flex items-center justify-between">
                            <p className="text-sm text-zinc-500">
                                Page {page + 1} of {totalPages}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                    className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                    disabled={page >= totalPages - 1}
                                    className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </DashboardLayout>
    );
}
