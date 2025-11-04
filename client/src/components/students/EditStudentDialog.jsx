import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { studentAPI, departmentAPI } from '../../lib/api';

const EditStudentDialog = ({ student, open, onOpenChange, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        rollNumber: '',
        email: '',
        contact: '',
        department: '',
        section: ''
    });
    const [departments, setDepartments] = useState([]);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open && student) {
            setFormData({
                name: student.name || '',
                rollNumber: student.rollNumber || '',
                email: student.email || '',
                contact: student.contact || '',
                department: student.department?._id || '',
                section: student.section?._id || ''
            });
            fetchDepartments();
        }
    }, [open, student]);

    useEffect(() => {
        if (formData.department) {
            fetchSections(formData.department);
        } else {
            setSections([]);
        }
    }, [formData.department]);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await studentAPI.update(student._id, formData);
            onSuccess?.();
            onOpenChange(false);
        } catch (err) {
            setError(err.message || 'Failed to update student');
        } finally {
            setLoading(false);
        }
    };

    if (!student) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Student</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter student name"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="rollNumber">Roll Number *</Label>
                            <Input
                                id="rollNumber"
                                name="rollNumber"
                                value={formData.rollNumber}
                                onChange={handleChange}
                                placeholder="Enter roll number"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="student@example.com"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="contact">Contact Number *</Label>
                            <Input
                                id="contact"
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                placeholder="10-digit number"
                                pattern="[0-9]{10}"
                                required
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="department">Department *</Label>
                            <Select
                                value={formData.department}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, department: value, section: '' }))}
                                disabled={loading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select department" />
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
                            <Label htmlFor="section">Section *</Label>
                            <Select
                                value={formData.section}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, section: value }))}
                                disabled={loading || !formData.department}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select section" />
                                </SelectTrigger>
                                <SelectContent>
                                    {sections.map((section) => (
                                        <SelectItem key={section._id} value={section._id}>
                                            {section.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Student'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditStudentDialog;
