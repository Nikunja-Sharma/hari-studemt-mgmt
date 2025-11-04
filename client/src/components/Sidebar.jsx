import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';
import { 
    LayoutDashboard, 
    Users, 
    Building2, 
    FileText,
    Settings,
    X
} from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

const Sidebar = ({ isOpen, onClose }) => {
    // Get user role from localStorage
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const isAdmin = user?.role === 'Admin';

    const navItems = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutDashboard,
            show: true
        },
        {
            title: 'Students',
            href: '/students',
            icon: Users,
            show: true
        },
        {
            title: 'Departments',
            href: '/departments',
            icon: Building2,
            show: true
        },
        {
            title: 'Reports',
            href: '/reports',
            icon: FileText,
            show: true
        },
        {
            title: 'Users',
            href: '/users',
            icon: Users,
            show: isAdmin // Only show for admins
        },
        {
            title: 'Settings',
            href: '/settings',
            icon: Settings,
            show: true // Show for all users
        }
    ];

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:top-[113px]",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Mobile close button */}
                <div className="flex items-center justify-between p-4 lg:hidden border-b border-slate-200">
                    <h2 className="text-lg font-semibold">Menu</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2">
                    {navItems.map((item) => {
                        if (!item.show) return null;

                        return (
                            <NavLink
                                key={item.href}
                                to={item.href}
                                onClick={() => onClose()}
                                className={({ isActive }) =>
                                    cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-blue-50 text-blue-700"
                                            : "text-slate-700 hover:bg-slate-100"
                                    )
                                }
                            >
                                <item.icon className="h-5 w-5" />
                                {item.title}
                            </NavLink>
                        );
                    })}
                </nav>

                <Separator className="my-4" />

                {/* User info section */}
                <div className="px-4 py-2">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-2">
                        Logged in as
                    </p>
                    <div className="bg-slate-50 rounded-lg p-3">
                        <p className="text-sm font-medium text-slate-900">
                            {user?.username || 'User'}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            {user?.role}
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
