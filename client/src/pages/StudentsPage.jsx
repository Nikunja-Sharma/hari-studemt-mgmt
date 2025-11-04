import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Plus, Search, Edit, Trash2, Eye, Filter } from 'lucide-react';
import { studentAPI, departmentAPI } from '../lib/api';
import ViewStudentDialog from '../components/students/ViewStudentDialog';
import AddStudentDialog from '../components/students/AddStudentDialog';
import EditStudentDialog from '../components/students/EditStudentDialog';

const StudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('all');
    const [selectedSection, setSelectedSection] = useState('all');
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const studentsPerPage = 10;

    // Dialog states
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user?.role === 'Admin';

    useEffect(() => {
        fetchDepartments();
        fetchStudents();
    }, []);

    useEffect(() => {
        if (selectedDepartment && selectedDepartment !== 'all') {
            fetchSectionsByDepartment(selectedDepartment);
        } else {
            setSections([]);
            setSelectedSection('all');
        }
    }, [selectedDepartment]);

    useEffect(() => {
        fetchStudents();
    }, [searchQuery, selectedDepartment, selectedSection, currentPage]);

    const fetchDepartments = async () => {
        try {
            const data = await departmentAPI.getAll();
            setDepartments(data.data || []);
        } catch (err) {
            console.error('Error fetching departments:', err);
        }
    };

    const fetchSectionsByDepartment = async (departmentId) => {
        try {
            const data = await departmentAPI.getSections(departmentId);
            setSections(data.data || []);
        } catch (err) {
            console.error('Error fetching sections:', err);
        }
    };

    const fetchStudents = async () => {
        setLoading(true);
        setError('');
        
        try {
            const params = {
                page: currentPage,
                limit: studentsPerPage
            };
            
            if (searchQuery) params.search = searchQuery;
            if (selectedDepartment !== 'all') params.department = selectedDepartment;
            if (selectedSection !== 'all') params.section = selectedSection;

            const data = await studentAPI.getAll(params);
            setStudents(data.data || []);
            setTotalPages(data.pagination?.pages || 1);
        } catch (err) {
            setError(err.message || 'Failed to fetch students');
        } finally {
            setLoading(false);
        }
    };

    const handleView = async (studentId) => {
        try {
            const data = await studentAPI.getById(studentId);
            setSelectedStudent(data.data);
            setViewDialogOpen(true);
        } catch (err) {
            setError(err.message || 'Failed to fetch student details');
        }
    };

    const handleEdit = async (studentId) => {
        try {
            const data = await studentAPI.getById(studentId);
            setSelectedStudent(data.data);
            setEditDialogOpen(true);
        } catch (err) {
            setError(err.message || 'Failed to fetch student details');
        }
    };

    const handleDelete = async (studentId) => {
        if (!window.confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
            return;
        }

        try {
            await studentAPI.delete(studentId);
            fetchStudents();
        } catch (err) {
            setError(err.message || 'Failed to delete student');
        }
    };

    const handleDialogSuccess = () => {
        fetchStudents();
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    const handleDepartmentChange = (value) => {
        setSelectedDepartment(value);
        setCurrentPage(1);
    };

    const handleSectionChange = (value) => {
        setSelectedSection(value);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedDepartment('all');
        setSelectedSection('all');
        setCurrentPage(1);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Students</h2>
                    <p className="text-slate-600 mt-1">Manage student records</p>
                </div>
                {isAdmin && (
                    <Button onClick={() => setAddDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Student
                    </Button>
                )}
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filters
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search by name, roll number, email, or contact..."
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="pl-10"
                            />
                        </div>

                        {/* Department Filter */}
                        <Select value={selectedDepartment} onValueChange={handleDepartmentChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="All Departments" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Departments</SelectItem>
                                {departments.map((dept) => (
                                    <SelectItem key={dept._id} value={dept._id}>
                                        {dept.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Section Filter */}
                        <Select 
                            value={selectedSection} 
                            onValueChange={handleSectionChange}
                            disabled={selectedDepartment === 'all'}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Sections" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Sections</SelectItem>
                                {sections.map((section) => (
                                    <SelectItem key={section._id} value={section._id}>
                                        {section.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Clear Filters */}
                        <Button variant="outline" onClick={clearFilters}>
                            Clear Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Error Alert */}
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Students Table */}
            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-500 text-lg">No students found</p>
                            <p className="text-slate-400 text-sm mt-2">
                                {searchQuery || selectedDepartment !== 'all' || selectedSection !== 'all'
                                    ? 'Try adjusting your filters'
                                    : 'Add your first student to get started'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Roll Number</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Department</TableHead>
                                        <TableHead>Section</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {students.map((student) => (
                                        <TableRow key={student._id}>
                                            <TableCell className="font-medium">{student.rollNumber}</TableCell>
                                            <TableCell>{student.name}</TableCell>
                                            <TableCell>{student.department?.name || 'N/A'}</TableCell>
                                            <TableCell>{student.section?.name || 'N/A'}</TableCell>
                                            <TableCell>{student.email}</TableCell>
                                            <TableCell>{student.contact}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={() => handleView(student._id)}
                                                        title="View details"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    {isAdmin && (
                                                        <>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm"
                                                                onClick={() => handleEdit(student._id)}
                                                                title="Edit student"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="sm"
                                                                onClick={() => handleDelete(student._id)}
                                                                title="Delete student"
                                                            >
                                                                <Trash2 className="h-4 w-4 text-red-600" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pagination */}
            {!loading && students.length > 0 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-600">
                        Page {currentPage} of {totalPages}
                    </p>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            {/* Dialogs */}
            <ViewStudentDialog
                student={selectedStudent}
                open={viewDialogOpen}
                onOpenChange={setViewDialogOpen}
            />
            
            <AddStudentDialog
                open={addDialogOpen}
                onOpenChange={setAddDialogOpen}
                onSuccess={handleDialogSuccess}
            />
            
            <EditStudentDialog
                student={selectedStudent}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                onSuccess={handleDialogSuccess}
            />
        </div>
    );
};

export default StudentsPage;
