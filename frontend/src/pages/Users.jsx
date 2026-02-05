import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    Users as UsersIcon,
    Search,
    UserX,
    UserCheck,
    Calendar,
    Mail,
    ShieldCheck,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Clock,
    Database
} from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import api from '../services/api';
import ApplicationHeader from '../components/ApplicationHeader';

export default function Users() {
    const { appId } = useParams();
    const [application, setApplication] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    useEffect(() => {
        loadData();
    }, [appId]);

    const loadData = async () => {
        try {
            const [appRes, usersRes] = await Promise.all([
                api.get(`/applications/${appId}`),
                api.get(`/admin/${appId}/users`)
            ]);
            setApplication(appRes.data.data);
            setUsers(usersRes.data.data?.content || usersRes.data.data || []);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBlockUser = async (userId, currentStatus) => {
        const action = currentStatus === 'ACTIVE' ? 'block' : 'unblock';
        if (!confirm(`Are you sure you want to ${action} this user?`)) {
            return;
        }
        try {
            await api.put(`/admin/${appId}/users/${userId}/status`, null, {
                params: { status: currentStatus === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE' }
            });
            loadData();
        } catch (error) {
            console.error('Failed to update user status:', error);
            alert(`Failed to ${action} user`);
        }
    };

    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                    activeTab="users"
                    icon={UsersIcon}
                    actions={
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                            <input
                                placeholder="Search users..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-zinc-900 border border-zinc-800 text-white rounded-xl py-2 h-11 pl-10 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all placeholder:text-zinc-600"
                            />
                        </div>
                    }
                />

                {/* Content */}
                <div className="grid grid-cols-1 gap-6">
                    {filteredUsers.length === 0 ? (
                        <Card className="p-20 text-center flex flex-col items-center justify-center border-dashed border-2 border-zinc-800">
                            <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mb-6">
                                <UsersIcon className="w-10 h-10 text-zinc-600" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No users found</h3>
                            <p className="text-zinc-400 max-w-sm mx-auto">
                                {searchTerm
                                    ? `We couldn't find any users matching "${searchTerm}".`
                                    : "Users will appear here once they sign up through your application."}
                            </p>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredUsers.map((user) => (
                                <UserCard
                                    key={user.id}
                                    user={user}
                                    onView={() => {
                                        setSelectedUser(user);
                                        setShowDetailsModal(true);
                                    }}
                                    onBlock={() => handleBlockUser(user.id, user.status)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* User Details Modal */}
                {selectedUser && (
                    <UserDetailsModal
                        isOpen={showDetailsModal}
                        onClose={() => {
                            setShowDetailsModal(false);
                            setSelectedUser(null);
                        }}
                        user={selectedUser}
                        onBlock={() => handleBlockUser(selectedUser.id, selectedUser.status)}
                    />
                )}
            </div>
        </DashboardLayout>
    );
}

function UserCard({ user, onView, onBlock }) {
    return (
        <Card className="p-6 group hover:border-zinc-700 transition-all flex flex-col justify-between">
            <div>
                <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-blue-400 transition-colors">
                        <UsersIcon className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col items-end">
                        <Badge className={`${user.status === 'ACTIVE'
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                            } border text-[10px] px-2 py-0.5 mb-2`}>
                            {user.status}
                        </Badge>
                        {user.emailVerified && (
                            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 border text-[10px] px-2 py-0.5">
                                VERIFIED
                            </Badge>
                        )}
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-bold text-white truncate mb-1" title={user.email}>
                        {user.email}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                        {user.lastLoginAt && (
                            <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {new Date(user.lastLoginAt).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex gap-3">
                <Button variant="secondary" size="sm" onClick={onView} className="flex-1 bg-zinc-800 border-zinc-700 hover:border-zinc-500">
                    Details
                </Button>
                <Button
                    variant={user.status === 'ACTIVE' ? 'danger' : 'primary'}
                    size="sm"
                    onClick={onBlock}
                    className="p-2 min-w-[40px]"
                    title={user.status === 'ACTIVE' ? 'Block User' : 'Unblock User'}
                >
                    {user.status === 'ACTIVE' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                </Button>
            </div>
        </Card>
    );
}

function UserDetailsModal({ isOpen, onClose, user, onBlock }) {
    const sections = [
        { label: 'Email Address', value: user.email, icon: Mail },
        { label: 'Account Status', value: user.status, icon: ShieldCheck, isBadge: true, type: user.status === 'ACTIVE' ? 'success' : 'danger' },
        { label: 'Email Verified', value: user.emailVerified ? 'Verified' : 'Unverified', icon: CheckCircle2, isBadge: true, type: user.emailVerified ? 'primary' : 'warning' },
        { label: 'Member Since', value: new Date(user.createdAt).toLocaleString(), icon: Calendar },
        { label: 'Last Login', value: user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never logged in', icon: Clock },
        { label: 'User ID', value: user.id, icon: Database, isMono: true },
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="User Profile Details"
            footer={
                <div className="flex gap-4 w-full">
                    <Button variant="secondary" onClick={onClose} className="flex-1">
                        Close
                    </Button>
                    <Button
                        variant={user.status === 'ACTIVE' ? 'danger' : 'primary'}
                        onClick={() => {
                            onBlock();
                            onClose();
                        }}
                        className="flex-1"
                    >
                        {user.status === 'ACTIVE' ? (
                            <><UserX className="w-4 h-4 mr-2" /> Block User</>
                        ) : (
                            <><UserCheck className="w-4 h-4 mr-2" /> Unblock User</>
                        )}
                    </Button>
                </div>
            }
        >
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sections.map((section, idx) => (
                        <div key={idx} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
                            <div className="flex items-center gap-2 text-zinc-500 mb-1">
                                <section.icon className="w-3.5 h-3.5" />
                                <span className="text-xs font-semibold uppercase tracking-wider">{section.label}</span>
                            </div>
                            {section.isBadge ? (
                                <Badge className={`${section.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                    section.type === 'danger' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                                        section.type === 'primary' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                            'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                    } border text-xs px-2 py-0.5 mt-1`}>
                                    {section.value}
                                </Badge>
                            ) : (
                                <p className={`text-white text-sm ${section.isMono ? 'font-mono break-all' : ''}`}>
                                    {section.value}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                {user.customFields && Object.keys(user.customFields).length > 0 && (
                    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
                        <div className="flex items-center gap-2 text-zinc-500 mb-4">
                            <Database className="w-4 h-4" />
                            <span className="text-xs font-semibold uppercase tracking-wider">Custom Attributes</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {Object.entries(user.customFields).map(([key, value]) => (
                                <div key={key} className="flex flex-col p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/30">
                                    <span className="text-[10px] text-zinc-500 uppercase font-bold mb-1">{key}</span>
                                    <span className="text-sm text-white font-medium truncate">{String(value)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}
