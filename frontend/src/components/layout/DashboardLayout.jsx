import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, Home, Settings as SettingsIcon, LogOut, LayoutDashboard, ChevronRight, Menu, X } from 'lucide-react';
import authService from '../../services/authService';

export default function DashboardLayout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const client = authService.getCurrentClient();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    const isActive = (path) => {
        if (path === '/dashboard' && location.pathname === '/dashboard') return true;
        if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const NavItems = () => (
        <div className="space-y-8">
            <div>
                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-6 px-4">Navigation</p>
                <nav className="space-y-2">
                    <SidebarItem
                        to="/dashboard"
                        icon={LayoutDashboard}
                        label="Dashboard"
                        active={isActive('/dashboard') || isActive('/app/')}
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                    <SidebarItem
                        to="/settings"
                        icon={SettingsIcon}
                        label="Account Settings"
                        active={isActive('/settings')}
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                </nav>
            </div>

            <div className="pt-8 border-t border-zinc-800/50">
                <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800/50">
                    <p className="text-xs font-bold text-white mb-2">Need help?</p>
                    <p className="text-[11px] text-zinc-500 leading-relaxed mb-4">
                        Check our documentation or contact our specialized support team.
                    </p>
                    <Link
                        to="/dashboard"
                        className="text-[11px] font-bold text-white flex items-center gap-1 group"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Documentation
                        <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
            {/* Top Navigation */}
            <nav className="fixed top-0 inset-x-0 h-20 bg-black/80 backdrop-blur-xl border-b border-zinc-800/50 z-50 px-4 md:px-8">
                <div className="h-full max-w-[1600px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Button */}
                        <button
                            className="lg:hidden p-2 text-zinc-400 hover:text-white"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>

                        {/* Brand */}
                        <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <div className="w-9 h-9 md:w-10 md:h-10 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/10">
                                <Shield className="w-5 h-5 md:w-6 md:h-6 text-black" />
                            </div>
                            <span className="text-xl md:text-2xl font-black tracking-tighter hidden md:block">TOKENLY</span>
                        </Link>
                    </div>

                    {/* Right Menu */}
                    <div className="flex items-center gap-3 md:gap-6">
                        <div className="h-10 w-px bg-zinc-800 hidden md:block" />

                        <div className="flex items-center gap-3 md:gap-4">
                            <div className="flex flex-col items-end hidden md:flex">
                                <span className="text-sm font-bold tracking-tight">{client?.companyName || 'Account'}</span>
                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{client?.email}</span>
                            </div>
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 border border-zinc-700 flex items-center justify-center text-zinc-400 font-bold text-sm md:text-base">
                                {client?.companyName?.[0] || 'U'}
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="group p-2 md:p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-500 hover:text-white hover:border-zinc-600 transition-all shadow-xl active:scale-95"
                            title="Sign out of your account"
                        >
                            <LogOut className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </nav>

            <div className="flex pt-20 relative">
                {/* Fixed Sidebar - Desktop */}
                <aside className="fixed left-0 top-20 bottom-0 w-72 bg-black border-r border-zinc-800/50 p-6 hidden lg:block overflow-y-auto">
                    <NavItems />
                </aside>

                {/* Mobile Sidebar Overlay */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-40 lg:hidden">
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                        <aside className="absolute left-0 top-20 bottom-0 w-72 bg-black border-r border-zinc-800/50 p-6 animate-in slide-in-from-left duration-200">
                            <NavItems />
                        </aside>
                    </div>
                )}

                {/* Main Content Area */}
                <main className="flex-1 lg:pl-72 min-h-[calc(100vh-80px)] w-full">
                    <div className="p-4 md:p-8 lg:p-12 max-w-[1400px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

function SidebarItem({ to, icon: Icon, label, active, onClick }) {
    return (
        <Link
            to={to}
            onClick={onClick}
            className={`
                group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300
                ${active
                    ? 'bg-white text-black shadow-2xl shadow-white/10'
                    : 'text-zinc-500 hover:text-white hover:bg-white/5'
                }
            `}
        >
            <Icon className={`w-5 h-5 transition-transform duration-300 ${active ? '' : 'group-hover:scale-110'}`} />
            <span className="font-bold tracking-tight text-sm">{label}</span>
            {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-black shadow-[0_0_8px_white]" />}
        </Link>
    );
}
