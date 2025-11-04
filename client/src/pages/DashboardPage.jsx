import { useEffect } from 'react';
import AdminDashboard from './AdminDashboard';
import FacultyDashboard from './FacultyDashboard';

const DashboardPage = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userRole = user?.role;

    useEffect(() => {
        // Ensure user data exists
        if (!userRole) {
            console.warn('No user role found in localStorage');
        }
    }, [userRole]);

    // Render dashboard based on user role
    if (userRole === 'Admin') {
        return <AdminDashboard />;
    } else if (userRole === 'Faculty') {
        return <FacultyDashboard />;
    }

    // Fallback if role is not recognized
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Denied</h2>
                <p className="text-slate-600">Unable to determine user role. Please log in again.</p>
            </div>
        </div>
    );
};

export default DashboardPage;
