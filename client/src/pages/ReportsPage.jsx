import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { FileText, Download, Printer, Building2, Layers, FileSpreadsheet } from 'lucide-react';
import { reportAPI, departmentAPI } from '../lib/api';

const ReportsPage = () => {
    const [activeTab, setActiveTab] = useState('department');
    const [departments, setDepartments] = useState([]);
    const [sections, setSections] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [selectedSection, setSelectedSection] = useState('');
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchDepartments();
    }, []);

    useEffect(() => {
        if (selectedDepartment) {
            fetchSections(selectedDepartment);
        } else {
            setSections([]);
            setSelectedSection('');
        }
    }, [selectedDepartment]);

    const fetchDepartments = async () => {
        try {
            const data = await departmentAPI.getAll();
            setDepartments(data.data || []);
        } catch (err) {
            console.error('Error fetching departments:', err);
        }
    };

    const fetchSections = async (departmentId) => {
        try {
            const data = await departmentAPI.getSections(departmentId);
            setSections(data.data || []);
        } catch (err) {
            console.error('Error fetching sections:', err);
        }
    };

    const generateReport = async () => {
        setLoading(true);
        setError('');
        setReportData(null);

        try {
            let response;
            if (activeTab === 'department' && selectedDepartment) {
                response = await reportAPI.getDepartmentReport({ department: selectedDepartment });
            } else if (activeTab === 'section' && selectedSection) {
                response = await reportAPI.getSectionReport({ section: selectedSection });
            } else if (activeTab === 'complete') {
                response = await reportAPI.getCompleteReport();
            } else {
                setError('Please select required filters');
                setLoading(false);
                return;
            }
            
            // Handle both old and new response formats
            const data = response.data;
            
            // Check if it's the old format (array) or new format (object with summary)
            if (Array.isArray(data)) {
                // Old format: convert to new format
                const allStudents = data.flatMap(dept => 
                    dept.students.map(student => ({
                        _id: student.id,
                        name: student.name,
                        rollNumber: student.rollNumber,
                        email: student.email,
                        contact: student.contact,
                        department: {
                            _id: dept.department.id,
                            name: dept.department.name,
                            code: dept.department.code
                        },
                        section: {
                            _id: student.section.id,
                            name: student.section.name
                        }
                    }))
                );
                
                setReportData({
                    summary: {
                        totalStudents: allStudents.length,
                        departmentName: data.length === 1 ? data[0].department.name : undefined
                    },
                    students: allStudents
                });
            } else {
                // New format: use as is
                setReportData(data);
            }
        } catch (err) {
            setError(err.message || 'Failed to generate report');
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = async () => {
        try {
            const params = {};
            if (activeTab === 'department' && selectedDepartment) {
                params.department = selectedDepartment;
            } else if (activeTab === 'section' && selectedSection) {
                params.section = selectedSection;
            }

            const response = await reportAPI.exportCSV(params);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `report-${activeTab}-${Date.now()}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            setError(err.message || 'Failed to export CSV');
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const renderStudentTable = (students) => {
        if (!students || students.length === 0) {
            return (
                <div className="text-center py-8 text-slate-500">
                    No students found
                </div>
            );
        }

        return (
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Roll Number</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Department</TableHead>
                            <TableHead>Section</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {students.map((student) => (
                            <TableRow key={student._id}>
                                <TableCell className="font-medium">{student.rollNumber}</TableCell>
                                <TableCell>{student.name}</TableCell>
                                <TableCell>{student.email}</TableCell>
                                <TableCell>{student.contact}</TableCell>
                                <TableCell>{student.department?.name || 'N/A'}</TableCell>
                                <TableCell>{student.section?.name || 'N/A'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="print:hidden">
                <h2 className="text-3xl font-bold text-slate-900">Reports</h2>
                <p className="text-slate-600 mt-1">Generate and export student reports</p>
            </div>

            {/* Report Type Tabs */}
            <Card className="print:hidden">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Report Configuration
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="department" className="flex items-center gap-2">
                                <Building2 className="h-4 w-4" />
                                Department-wise
                            </TabsTrigger>
                            <TabsTrigger value="section" className="flex items-center gap-2">
                                <Layers className="h-4 w-4" />
                                Section-wise
                            </TabsTrigger>
                            <TabsTrigger value="complete" className="flex items-center gap-2">
                                <FileSpreadsheet className="h-4 w-4" />
                                Complete Report
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="department" className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Select Department</label>
                                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Choose a department" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {departments.map((dept) => (
                                            <SelectItem key={dept._id} value={dept._id}>
                                                {dept.name} ({dept.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </TabsContent>

                        <TabsContent value="section" className="space-y-4 mt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Select Department</label>
                                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a department" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {departments.map((dept) => (
                                                <SelectItem key={dept._id} value={dept._id}>
                                                    {dept.name} ({dept.code})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Select Section</label>
                                    <Select 
                                        value={selectedSection} 
                                        onValueChange={setSelectedSection}
                                        disabled={!selectedDepartment}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choose a section" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sections.map((section) => (
                                                <SelectItem key={section._id} value={section._id}>
                                                    Section {section.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="complete" className="mt-4">
                            <p className="text-sm text-slate-600">
                                This will generate a complete report of all students across all departments and sections.
                            </p>
                        </TabsContent>
                    </Tabs>

                    <div className="flex gap-2 mt-6">
                        <Button onClick={generateReport} disabled={loading}>
                            {loading ? 'Generating...' : 'Generate Report'}
                        </Button>
                        {reportData && (
                            <>
                                <Button variant="outline" onClick={handleExportCSV}>
                                    <Download className="h-4 w-4 mr-2" />
                                    Export CSV
                                </Button>
                                <Button variant="outline" onClick={handlePrint}>
                                    <Printer className="h-4 w-4 mr-2" />
                                    Print
                                </Button>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Error Alert */}
            {error && (
                <Alert variant="destructive" className="print:hidden">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Report Preview */}
            {reportData && (
                <Card className="print:shadow-none print:border-0">
                    <CardHeader className="print:pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Report Preview</CardTitle>
                                <p className="text-sm text-slate-600 mt-1">
                                    Generated on {new Date().toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div className="print:hidden">
                                <Badge variant="secondary">
                                    {reportData.students?.length || 0} students
                                </Badge>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                        {/* Summary Statistics */}
                        {reportData.summary && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 print:mb-4">
                                <Card className="bg-blue-50 border-blue-200">
                                    <CardContent className="pt-6">
                                        <div className="text-center">
                                            <p className="text-sm text-blue-600 font-medium">Total Students</p>
                                            <p className="text-3xl font-bold text-blue-900 mt-2">
                                                {reportData.summary.totalStudents || 0}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                                {reportData.summary.departmentName && (
                                    <Card className="bg-green-50 border-green-200">
                                        <CardContent className="pt-6">
                                            <div className="text-center">
                                                <p className="text-sm text-green-600 font-medium">Department</p>
                                                <p className="text-xl font-bold text-green-900 mt-2">
                                                    {reportData.summary.departmentName}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                                {reportData.summary.sectionName && (
                                    <Card className="bg-purple-50 border-purple-200">
                                        <CardContent className="pt-6">
                                            <div className="text-center">
                                                <p className="text-sm text-purple-600 font-medium">Section</p>
                                                <p className="text-xl font-bold text-purple-900 mt-2">
                                                    {reportData.summary.sectionName}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        )}

                        {/* Student Table */}
                        {renderStudentTable(reportData.students)}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ReportsPage;
