import { useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback } from './ui/avatar';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';
import { authAPI } from '../lib/api';

const AppLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Get user info from localStorage
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const handleLogout = async () => {
        try {
            // Call logout endpoint to clear HTTP-only cookie
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Clear user info from localStorage
            localStorage.removeItem('user');
            navigate('/login');
        }
    };

    // Get initials for avatar
    const getInitials = (name) => {
        if (!name) return 'U';
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    // Get breadcrumb from current path
    const getBreadcrumb = () => {
        const path = location.pathname;
        const segments = path.split('/').filter(Boolean);
        
        if (segments.length === 0 || segments[0] === 'dashboard') {
            return 'Dashboard';
        }
        
        return segments.map(seg => 
            seg.charAt(0).toUpperCase() + seg.slice(1)
        ).join(' / ');
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Top Navigation Bar */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-4">
                        {/* Mobile menu button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>

                        {/* Logo and Title */}
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">SMS</span>
                            </div>
                            <h1 className="text-lg font-semibold text-slate-900 hidden sm:block">
                                Student Management
                            </h1>
                        </div>
                    </div>

                    {/* User Profile Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                <Avatar>
                                    <AvatarFallback className="bg-blue-600 text-white">
                                        {getInitials(user?.username || user?.email)}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            <DropdownMenuLabel>
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium">{user?.username || 'User'}</p>
                                    <p className="text-xs text-slate-500">{user?.email}</p>
                                    <p className="text-xs text-blue-600 font-medium">{user?.role}</p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate('/settings')}>
                                Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleLogout}>
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Breadcrumb */}
                <div className="px-4 py-2 bg-slate-50 border-t border-slate-200">
                    <p className="text-sm text-slate-600">{getBreadcrumb()}</p>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

                {/* Main Content */}
                <main className="flex-1 p-4 lg:p-6 lg:ml-64">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AppLayout;
