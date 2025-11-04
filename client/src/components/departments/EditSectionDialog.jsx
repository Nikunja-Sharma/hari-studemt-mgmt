import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Alert, AlertDescription } from '../ui/alert';
import { sectionAPI } from '../../lib/api';

const EditSectionDialog = ({ department, section, open, onOpenChange, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: '',
        capacity: 60
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open && section) {
            setFormData({
                name: section.name || '',
                capacity: section.capacity || 60
            });
            setError('');
        }
    }, [open, section]);

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
            await sectionAPI.update(section._id, {
                ...formData,
                department: department._id
            });
            onSuccess?.();
            onOpenChange(false);
        } catch (err) {
            setError(err.message || 'Failed to update section');
        } finally {
            setLoading(false);
        }
    };

    if (!section || !department) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Section</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="name">Section Name *</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., A, B, C"
                            required
                            disabled={loading}
                            maxLength={5}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="capacity">Capacity *</Label>
                        <Input
                            id="capacity"
                            name="capacity"
                            type="number"
                            value={formData.capacity}
                            onChange={handleChange}
                            placeholder="60"
                            required
                            disabled={loading}
                            min="1"
                            max="200"
                        />
                        <p className="text-xs text-slate-500">
                            Current strength: {section.currentStrength || 0} students
                        </p>
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
                            {loading ? 'Updating...' : 'Update Section'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditSectionDialog;
