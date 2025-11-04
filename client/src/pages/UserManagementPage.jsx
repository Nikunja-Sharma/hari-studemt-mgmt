import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Alert, AlertDescription } from '../components/ui/alert';
import { 
    Users, 
    Search, 
    Ban, 
    Trash2, 
    ShieldCheck, 
    UserX,
    CheckCircle,
    XCircle,
    Calendar,
    Mail,
    Shield
} from 'lucide-react';
import { adminUserAPI } from '../lib/api';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
    
    // Dialog states
    const [banDialog, setBanDialog] = useState({ open: false, user: null, reason: '' });
    const [deleteDialog, setDeleteDialog] = useState({ open: false, user: null });

    useEffect(() => {
        fetchStats();
        fetchUsers();
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, roleFilter, pagination.page]);

    const fetchStats = async () => {
        try {
            const data = await adminUserAPI.getStats();
            setStats(data.data);
        } catch (err) {
            console.error('Error fetching stats:', err);
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.page,
                limit: pagination.limit
            };
            if (searchTerm) params.search = searchTerm;
            if (roleFilter) params.role = roleFilter;

            const data = await adminUserAPI.getAll(params);
            setUsers(data.data.users);
            setPagination(data.data.pagination);
            setError('');
        } catch (err) {
            setError(err.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const handleBanUser = async () => {
        try {
            await adminUserAPI.banUser(banDialog.user._id, banDialog.reason);
            setSuccess(`User ${banDialog.user.username} has been banned`);
            setBanDialog({ open: false, user: null, reason: '' });
            fetchUsers();
            fetchStats();
        } catch (err) {
            setError(err.message || 'Failed to ban user');
        }
    };

    const handleUnbanUser = async (user) => {
        try {
            await adminUserAPI.unbanUser(user._id);
            setSuccess(`User ${user.username} has been unbanned`);
            fetchUsers();
            fetchStats();
        } catch (err) {
            setError(err.message || 'Failed to unban user');
        }
    };

    const handleDeleteUser = async () => {
        try {
            await adminUserAPI.deleteUser(deleteDialog.user._id);
            setSuccess(`User ${deleteDialog.user.username} has been deleted`);
            setDeleteDialog({ open: false, user: null });
            fetchUsers();
            fetchStats();
        } catch (err) {
            setError(err.message || 'Failed to delete user');
        }
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading && !users.length) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Loading users...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold text-slate-900">User Management</h2>
                <p className="text-slate-600 mt-1">Manage faculty accounts and permissions</p>
            </div>

            {/* Alerts */}
            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}
            {success && (
                <Alert className="mb-4 bg-green-50 text-green-900 border-green-200">
                    <AlertDescription>{success}</AlertDescription>
                </Alert>
            )}

            {/* Statistics Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">Total Users</CardTitle>
                            <Users className="h-5 w-5 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalUsers}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">Faculty</CardTitle>
                            <Shield className="h-5 w-5 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalFaculty}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">Active</CardTitle>
                            <CheckCircle className="h-5 w-5 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.activeUsers}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">Banned</CardTitle>
                            <XCircle className="h-5 w-5 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.bannedUsers}</div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search by username, email, or name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                            className="px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Roles</option>
                            <option value="Admin">Admin</option>
                            <option value="Faculty">Faculty</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Users ({pagination.total})</CardTitle>
                </CardHeader>
                <CardContent>
                    {users.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                            <p className="text-slate-500">No users found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">User</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Role</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Status</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Joined</th>
                                        <th className="text-left py-3 px-4 font-semibold text-slate-700">Last Login</th>
                                        <th className="text-right py-3 px-4 font-semibold text-slate-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map((user) => (
                                        <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50">
                                            <td className="py-3 px-4">
                                                <div>
                                                    <div className="font-medium text-slate-900">{user.username}</div>
                                                    <div className="text-sm text-slate-500 flex items-center gap-1">
                                                        <Mail className="h-3 w-3" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                                    user.role === 'Admin' 
                                                        ? 'bg-purple-100 text-purple-800' 
                                                        : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                    <ShieldCheck className="h-3 w-3" />
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                {user.isBanned ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                        <UserX className="h-3 w-3" />
                                                        Banned
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        <CheckCircle className="h-3 w-3" />
                                                        Active
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="text-sm text-slate-600 flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {formatDate(user.createdAt)}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="text-sm text-slate-600">
                                                    {formatDate(user.lastLogin)}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    {user.isBanned ? (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => handleUnbanUser(user)}
                                                            className="text-green-600 hover:text-green-700"
                                                        >
                                                            <CheckCircle className="h-4 w-4 mr-1" />
                                                            Unban
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            onClick={() => setBanDialog({ open: true, user, reason: '' })}
                                                            className="text-orange-600 hover:text-orange-700"
                                                        >
                                                            <Ban className="h-4 w-4 mr-1" />
                                                            Ban
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setDeleteDialog({ open: true, user })}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
                            <div className="text-sm text-slate-600">
                                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                                    disabled={pagination.page === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                                    disabled={pagination.page === pagination.pages}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Ban User Dialog */}
            <Dialog open={banDialog.open} onOpenChange={(open) => setBanDialog({ ...banDialog, open })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ban User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to ban {banDialog.user?.username}? They will not be able to log in.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Reason for ban (optional)
                        </label>
                        <Textarea
                            value={banDialog.reason}
                            onChange={(e) => setBanDialog({ ...banDialog, reason: e.target.value })}
                            placeholder="Enter reason for banning this user..."
                            rows={3}
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setBanDialog({ open: false, user: null, reason: '' })}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleBanUser}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Ban User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete User Dialog */}
            <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to permanently delete {deleteDialog.user?.username}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialog({ open: false, user: null })}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDeleteUser}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserManagementPage;
