import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Menu, X, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';
import env from '../../config/env';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="container mx-auto px-6 py-8 relative z-50">
            <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-white/20">
                        <Shield className="w-6 h-6 text-black" />
                    </div>
                    <span className="text-2xl font-bold text-white tracking-tight">{env.appName}</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    <Link to="/contact">
                        <button className="px-5 py-2.5 text-zinc-400 hover:text-white transition-colors font-medium">
                            Contact
                        </button>
                    </Link>
                    <Link to="/login">
                        <button className="px-5 py-2.5 text-zinc-400 hover:text-white transition-colors font-medium">
                            Login
                        </button>
                    </Link>
                    <Link to="/signup">
                        <Button size="md">
                            Get Started
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800 p-6 flex flex-col gap-4 md:hidden animate-in slide-in-from-top-4">
                    <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                        <button className="w-full px-5 py-3 text-zinc-400 hover:text-white transition-colors font-medium text-left">
                            Contact
                        </button>
                    </Link>
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <button className="w-full px-5 py-3 text-zinc-400 hover:text-white transition-colors font-medium text-left">
                            Login
                        </button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button size="md" className="w-full justify-center">
                            Get Started
                            <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </Link>
                </div>
            )}
        </nav>
    );
}
