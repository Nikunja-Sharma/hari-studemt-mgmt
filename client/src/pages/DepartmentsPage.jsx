import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';
import { Badge } from '../components/ui/badge';
import { Plus, Building2, Layers, Edit, Trash2, Users } from 'lucide-react';
import { departmentAPI } from '../lib/api';
import AddDepartmentDialog from '../components/departments/AddDepartmentDialog';
import EditDepartmentDialog from '../components/departments/EditDepartmentDialog';
import AddSectionDialog from '../components/departments/AddSectionDialog';
import EditSectionDialog from '../components/departments/EditSectionDialog';

const DepartmentsPage = () => {
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Dialog states
    const [addDeptDialogOpen, setAddDeptDialogOpen] = useState(false);
    const [editDeptDialogOpen, setEditDeptDialogOpen] = useState(false);
    const [addSectionDialogOpen, setAddSectionDialogOpen] = useState(false);
    const [editSectionDialogOpen, setEditSectionDialogOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedSection, setSelectedSection] = useState(null);

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user?.role === 'Admin';

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        setLoading(true);
        setError('');

        try {
            const data = await departmentAPI.getAll();
            // Fetch sections for each department
            const deptWithSections = await Promise.all(
                (data.data || []).map(async (dept) => {
                    try {
                        const sectionsData = await departmentAPI.getSections(dept._id);
                        return { ...dept, sections: sectionsData.data || [] };
                    } catch (err) {
                        return { ...dept, sections: [] };
                    }
                })
            );
            setDepartments(deptWithSections);
        } catch (err) {
            setError(err.message || 'Failed to fetch departments');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDepartment = async (deptId) => {
        if (!window.confirm('Are you sure you want to delete this department? This will also affect all students in this department.')) {
            return;
        }

        try {
            await departmentAPI.delete(deptId);
            fetchDepartments();
        } catch (err) {
            setError(err.message || 'Failed to delete department');
        }
    };

    const handleDeleteSection = async (sectionId) => {
        if (!window.confirm('Are you sure you want to delete this section? This will affect all students in this section.')) {
            return;
        }

        try {
            const { sectionAPI } = await import('../lib/api');
            await sectionAPI.delete(sectionId);
            fetchDepartments();
        } catch (err) {
            setError(err.message || 'Failed to delete section');
        }
    };

    const handleEditDepartment = (dept) => {
        setSelectedDepartment(dept);
        setEditDeptDialogOpen(true);
    };

    const handleAddSection = (dept) => {
        setSelectedDepartment(dept);
        setAddSectionDialogOpen(true);
    };

    const handleEditSection = (dept, section) => {
        setSelectedDepartment(dept);
        setSelectedSection(section);
        setEditSectionDialogOpen(true);
    };

    const handleDialogSuccess = () => {
        fetchDepartments();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Loading departments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Departments & Sections</h2>
                    <p className="text-slate-600 mt-1">Manage academic departments and their sections</p>
                </div>
                {isAdmin && (
                    <Button onClick={() => setAddDeptDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Department
                    </Button>
                )}
            </div>

            {/* Error Alert */}
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Departments List */}
            {departments.length === 0 ? (
                <Card>
                    <CardContent className="py-12">
                        <div className="text-center">
                            <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                            <p className="text-slate-500 text-lg">No departments found</p>
                            <p className="text-slate-400 text-sm mt-2">
                                {isAdmin ? 'Add your first department to get started' : 'Contact an administrator to add departments'}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <Accordion type="multiple" className="space-y-4">
                    {departments.map((dept) => (
                        <AccordionItem key={dept._id} value={dept._id} className="border rounded-lg">
                            <Card>
                                <AccordionTrigger className="hover:no-underline px-6 py-4">
                                    <div className="flex items-center justify-between w-full pr-4">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-blue-100 p-3 rounded-lg">
                                                <Building2 className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-lg font-semibold text-slate-900">
                                                    {dept.name}
                                                </h3>
                                                <p className="text-sm text-slate-500">{dept.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge variant="secondary" className="text-sm">
                                                {dept.code}
                                            </Badge>
                                            <Badge variant="outline" className="text-sm">
                                                {dept.sections?.length || 0} sections
                                            </Badge>
                                            {isAdmin && (
                                                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditDepartment(dept)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteDepartment(dept._id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="px-6 pb-4 space-y-4">
                                        {/* Add Section Button */}
                                        {isAdmin && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleAddSection(dept)}
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Add Section
                                            </Button>
                                        )}

                                        {/* Sections List */}
                                        {dept.sections && dept.sections.length > 0 ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {dept.sections.map((section) => (
                                                    <Card key={section._id} className="bg-slate-50">
                                                        <CardHeader className="pb-3">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <Layers className="h-5 w-5 text-purple-600" />
                                                                    <CardTitle className="text-lg">
                                                                        Section {section.name}
                                                                    </CardTitle>
                                                                </div>
                                                                {isAdmin && (
                                                                    <div className="flex gap-1">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => handleEditSection(dept, section)}
                                                                        >
                                                                            <Edit className="h-3 w-3" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                            onClick={() => handleDeleteSection(section._id)}
                                                                        >
                                                                            <Trash2 className="h-3 w-3 text-red-600" />
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <div className="space-y-2">
                                                                <div className="flex items-center justify-between text-sm">
                                                                    <span className="text-slate-600">Capacity:</span>
                                                                    <span className="font-medium">{section.capacity}</span>
                                                                </div>
                                                                <div className="flex items-center justify-between text-sm">
                                                                    <span className="text-slate-600">Current:</span>
                                                                    <span className="font-medium flex items-center gap-1">
                                                                        <Users className="h-3 w-3" />
                                                                        {section.currentStrength}
                                                                    </span>
                                                                </div>
                                                                <div className="mt-2">
                                                                    <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                                                                        <div
                                                                            className={`h-full rounded-full transition-all ${
                                                                                section.currentStrength >= section.capacity
                                                                                    ? 'bg-red-600'
                                                                                    : section.currentStrength >= section.capacity * 0.8
                                                                                    ? 'bg-yellow-600'
                                                                                    : 'bg-green-600'
                                                                            }`}
                                                                            style={{
                                                                                width: `${Math.min(
                                                                                    (section.currentStrength / section.capacity) * 100,
                                                                                    100
                                                                                )}%`
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-slate-500 text-sm text-center py-4">
                                                No sections added yet
                                            </p>
                                        )}
                                    </div>
                                </AccordionContent>
                            </Card>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}

            {/* Dialogs */}
            <AddDepartmentDialog
                open={addDeptDialogOpen}
                onOpenChange={setAddDeptDialogOpen}
                onSuccess={handleDialogSuccess}
            />

            <EditDepartmentDialog
                department={selectedDepartment}
                open={editDeptDialogOpen}
                onOpenChange={setEditDeptDialogOpen}
                onSuccess={handleDialogSuccess}
            />

            <AddSectionDialog
                department={selectedDepartment}
                open={addSectionDialogOpen}
                onOpenChange={setAddSectionDialogOpen}
                onSuccess={handleDialogSuccess}
            />

            <EditSectionDialog
                department={selectedDepartment}
                section={selectedSection}
                open={editSectionDialogOpen}
                onOpenChange={setEditSectionDialogOpen}
                onSuccess={handleDialogSuccess}
            />
        </div>
    );
};

export default DepartmentsPage;
