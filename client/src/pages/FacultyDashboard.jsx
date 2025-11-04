import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Users, Building2, Layers, FileText, Search, Eye } from 'lucide-react';
import { dashboardAPI } from '../lib/api';

const FacultyDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await dashboardAPI.getStats();
            setStats(data.data);
        } catch (err) {
            setError(err.message || 'An error occurred while fetching statistics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    const statCards = [
        {
            title: 'Total Students',
            value: stats?.overview?.totalStudents || 0,
            icon: Users,
            color: 'bg-green-500',
            action: () => navigate('/students')
        },
        {
            title: 'Departments',
            value: stats?.overview?.totalDepartments || 0,
            icon: Building2,
            color: 'bg-blue-500',
            action: () => navigate('/departments')
        },
        {
            title: 'Sections',
            value: stats?.overview?.totalSections || 0,
            icon: Layers,
            color: 'bg-purple-500',
            action: () => navigate('/departments')
        }
    ];

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Faculty Dashboard</h2>
                    <p className="text-slate-600 mt-1">View and manage student information</p>
                </div>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold">
                    Faculty Member
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {statCards.map((stat, index) => (
                    <Card 
                        key={index} 
                        className="cursor-pointer hover:shadow-lg transition-shadow"
                        onClick={stat.action}
                    >
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600">
                                {stat.title}
                            </CardTitle>
                            <div className={`${stat.color} p-2 rounded-lg`}>
                                <stat.icon className="h-5 w-5 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Department Distribution */}
            <Card>
                <CardHeader>
                    <CardTitle>Department-wise Student Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                    {stats?.departmentDistribution && stats.departmentDistribution.length > 0 ? (
                        <div className="space-y-4">
                            {stats.departmentDistribution.map((dept) => (
                                <div key={dept._id} className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-slate-900">{dept.departmentName}</p>
                                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                                {dept.departmentCode}
                                            </span>
                                        </div>
                                        <div className="mt-2 bg-slate-200 rounded-full h-2 overflow-hidden">
                                            <div 
                                                className="bg-green-600 h-full rounded-full transition-all"
                                                style={{ 
                                                    width: `${stats.overview.totalStudents > 0 ? (dept.studentCount / stats.overview.totalStudents) * 100 : 0}%` 
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="ml-4 text-right">
                                        <p className="text-2xl font-bold text-slate-900">{dept.studentCount}</p>
                                        <p className="text-xs text-slate-500">students</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500 text-center py-8">No data available</p>
                    )}
                </CardContent>
            </Card>

            {/* Faculty Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Button 
                            onClick={() => navigate('/students')}
                            className="w-full"
                        >
                            <Eye className="h-4 w-4 mr-2" />
                            View Students
                        </Button>
                        <Button 
                            onClick={() => navigate('/students')}
                            className="w-full"
                            variant="outline"
                        >
                            <Search className="h-4 w-4 mr-2" />
                            Search Students
                        </Button>
                        <Button 
                            onClick={() => navigate('/reports')}
                            className="w-full"
                            variant="outline"
                        >
                            <FileText className="h-4 w-4 mr-2" />
                            View Reports
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Information Card */}
            <Card className="bg-blue-50 border-blue-200">
                <CardHeader>
                    <CardTitle className="text-blue-900">Faculty Access</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-blue-800">
                        As a faculty member, you have read-only access to student records and can generate reports. 
                        Contact an administrator for any modifications or additional permissions.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};

export default FacultyDashboard;
