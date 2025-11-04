import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { authAPI } from '../lib/api';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const userStr = localStorage.getItem('user');

            try {
                // Verify token with backend (token is in HTTP-only cookie)
                const data = await authAPI.verify();
                setIsAuthenticated(true);
                setUserRole(data.user?.role || (userStr ? JSON.parse(userStr)?.role : null));
            } catch (error) {
                console.error('Auth verification error:', error);
                // Token is invalid or expired
                localStorage.removeItem('user');
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    // Show loading state while checking authentication
    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check role-based access if roles are specified
    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
                    <p className="text-xl text-gray-600 mb-4">Access Denied</p>
                    <p className="text-gray-500">You don't have permission to access this page.</p>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
