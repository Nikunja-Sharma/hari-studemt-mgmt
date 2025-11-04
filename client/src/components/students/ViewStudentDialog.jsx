import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Mail, Phone, Hash, Building2, Layers } from 'lucide-react';

const ViewStudentDialog = ({ student, open, onOpenChange }) => {
    if (!student) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Student Details</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-6">
                    {/* Header with name and roll number */}
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900">{student.name}</h3>
                            <div className="flex items-center gap-2 mt-2">
                                <Hash className="h-4 w-4 text-slate-500" />
                                <span className="text-slate-600 font-medium">{student.rollNumber}</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-slate-900">Contact Information</h4>
                        <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                <Mail className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="text-xs text-slate-500">Email</p>
                                    <p className="text-sm font-medium text-slate-900">{student.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                                <Phone className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="text-xs text-slate-500">Contact</p>
                                    <p className="text-sm font-medium text-slate-900">{student.contact}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Academic Information */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-slate-900">Academic Information</h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                <Building2 className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="text-xs text-slate-500">Department</p>
                                    <p className="text-sm font-medium text-slate-900">
                                        {student.department?.name || 'N/A'}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {student.department?.code || ''}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                                <Layers className="h-5 w-5 text-purple-600" />
                                <div>
                                    <p className="text-xs text-slate-500">Section</p>
                                    <p className="text-sm font-medium text-slate-900">
                                        {student.section?.name || 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timestamps */}
                    {student.createdAt && (
                        <div className="pt-4 border-t">
                            <p className="text-xs text-slate-500">
                                Added on {new Date(student.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ViewStudentDialog;
