import { useState } from 'react';
import { User, Lock, Info, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import authService from '../services/authService';
import api from '../services/api';

export default function Settings() {
    const client = authService.getCurrentClient();
    const [profileData, setProfileData] = useState({
        companyName: client?.companyName || '',
        email: client?.email || '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState({
        profile: false,
        password: false,
    });
    const [message, setMessage] = useState({ type: '', text: '', field: '' });

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setLoading({ ...loading, profile: true });
        setMessage({ type: '', text: '', field: '' });

        try {
            await api.put('/clients/profile', {
                companyName: profileData.companyName
            });
            setMessage({ type: 'success', text: 'Profile updated successfully!', field: 'profile' });

            // Update local storage
            const updatedClient = { ...client, companyName: profileData.companyName };
            localStorage.setItem('client', JSON.stringify(updatedClient));

            setTimeout(() => setMessage({ type: '', text: '', field: '' }), 3000);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to update profile',
                field: 'profile'
            });
        } finally {
            setLoading({ ...loading, profile: false });
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Passwords do not match', field: 'password' });
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setMessage({ type: 'error', text: 'Password must be at least 8 characters', field: 'password' });
            return;
        }

        setLoading({ ...loading, password: true });
        setMessage({ type: '', text: '', field: '' });

        try {
            await api.put('/clients/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setMessage({ type: 'success', text: 'Password changed successfully!', field: 'password' });
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
            setTimeout(() => setMessage({ type: '', text: '', field: '' }), 3000);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to change password',
                field: 'password'
            });
        } finally {
            setLoading({ ...loading, password: false });
        }
    };

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto pb-12">
                <div className="mb-10">
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Settings</h1>
                    <p className="text-zinc-400">Manage your company profile and account security</p>
                </div>

                <div className="space-y-8">
                    {/* Profile Settings */}
                    <Card className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <User className="w-5 h-5 text-blue-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                        </div>

                        {message.field === 'profile' && message.text && (
                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-6 border ${message.type === 'success'
                                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                : 'bg-red-500/10 border-red-500/20 text-red-400'
                                }`}>
                                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                <span className="font-medium">{message.text}</span>
                            </div>
                        )}

                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            <Input
                                label="Company Name"
                                placeholder="Your Awesome Company"
                                value={profileData.companyName}
                                onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                                required
                            />

                            <div>
                                <Input
                                    label="Email Address"
                                    type="email"
                                    value={profileData.email}
                                    disabled
                                    className="bg-zinc-800/50 cursor-not-allowed opacity-70"
                                />
                                <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1.5">
                                    <Info className="w-3 h-3" />
                                    Account email cannot be modified. Contact support for assistance.
                                </p>
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button
                                    type="submit"
                                    disabled={loading.profile}
                                    className="w-full sm:w-auto"
                                >
                                    {loading.profile ? 'Updating...' : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Update Profile
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Card>

                    {/* Password Settings */}
                    <Card className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <Lock className="w-5 h-5 text-purple-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Change Password</h2>
                        </div>

                        {message.field === 'password' && message.text && (
                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-6 border ${message.type === 'success'
                                ? 'bg-green-500/10 border-green-500/20 text-green-400'
                                : 'bg-red-500/10 border-red-500/20 text-red-400'
                                }`}>
                                {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                <span className="font-medium">{message.text}</span>
                            </div>
                        )}

                        <form onSubmit={handlePasswordChange} className="space-y-6">
                            <Input
                                label="Current Password"
                                type="password"
                                placeholder="••••••••"
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                required
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="New Password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    required
                                />

                                <Input
                                    label="Confirm New Password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button
                                    type="submit"
                                    disabled={loading.password}
                                    className="w-full sm:w-auto"
                                >
                                    {loading.password ? 'Changing...' : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Change Password
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Card>

                    {/* Account Information */}
                    <Card className="p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-zinc-500/10 rounded-lg">
                                <Info className="w-5 h-5 text-zinc-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-white">Account Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-4 bg-zinc-800/40 rounded-xl border border-zinc-700/50">
                                <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-1">Account ID</p>
                                <p className="font-mono text-sm text-zinc-200 truncate" title={client?.id}>{client?.id || 'N/A'}</p>
                            </div>
                            <div className="p-4 bg-zinc-800/40 rounded-xl border border-zinc-700/50">
                                <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-1">Created At</p>
                                <p className="text-zinc-200">
                                    {client?.createdAt ? new Date(client.createdAt).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    }) : 'N/A'}
                                </p>
                            </div>
                            <div className="p-4 bg-zinc-800/40 rounded-xl border border-zinc-700/50">
                                <p className="text-xs text-zinc-500 uppercase tracking-widest font-semibold mb-1">Status</p>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                    <p className="font-semibold text-green-400">ACTIVE</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
}
