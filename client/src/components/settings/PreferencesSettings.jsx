import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Input } from '../ui/input';
import { useToast } from '../../hooks/use-toast';
import { profileAPI } from '../../lib/api';
import { Loader2, Moon, Sun } from 'lucide-react';

const PreferencesSettings = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [preferences, setPreferences] = useState({
        theme: 'light',
        language: 'en',
        dateFormat: 'MM/DD/YYYY',
        itemsPerPage: 10,
        emailNotifications: true
    });

    useEffect(() => {
        fetchPreferences();
    }, []);

    const fetchPreferences = async () => {
        try {
            setLoading(true);
            const response = await profileAPI.getPreferences();
            if (response.success && response.preferences) {
                // Merge with defaults to ensure all fields are present
                setPreferences({
                    theme: response.preferences.theme || 'light',
                    language: response.preferences.language || 'en',
                    dateFormat: response.preferences.dateFormat || 'MM/DD/YYYY',
                    itemsPerPage: response.preferences.itemsPerPage || 10,
                    emailNotifications: response.preferences.emailNotifications !== undefined 
                        ? response.preferences.emailNotifications 
                        : true
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to load preferences',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate itemsPerPage
        if (preferences.itemsPerPage < 5 || preferences.itemsPerPage > 100) {
            toast({
                title: 'Validation Error',
                description: 'Items per page must be between 5 and 100',
                variant: 'destructive'
            });
            return;
        }

        try {
            setSaving(true);
            const response = await profileAPI.updatePreferences(preferences);
            
            if (response.success) {
                toast({
                    title: 'Success',
                    description: 'Preferences updated successfully'
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update preferences',
                variant: 'destructive'
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                    Customize your application experience
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                

            

                    {/* Date Format */}
                    <div className="space-y-2">
                        <Label htmlFor="dateFormat">Date Format</Label>
                        <Select
                            value={preferences.dateFormat}
                            onValueChange={(value) => setPreferences({ ...preferences, dateFormat: value })}
                        >
                            <SelectTrigger id="dateFormat">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-slate-500">
                            Choose how dates are displayed
                        </p>
                    </div>

                    {/* Items Per Page */}
                    <div className="space-y-2">
                        <Label htmlFor="itemsPerPage">Items Per Page</Label>
                        <Input
                            id="itemsPerPage"
                            type="number"
                            min="5"
                            max="100"
                            value={preferences.itemsPerPage}
                            onChange={(e) => setPreferences({ ...preferences, itemsPerPage: parseInt(e.target.value) || 10 })}
                        />
                        <p className="text-xs text-slate-500">
                            Number of items to display per page (5-100)
                        </p>
                    </div>

                    {/* Email Notifications */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                        <div className="space-y-0.5">
                            <Label htmlFor="emailNotifications" className="text-base">
                                Email Notifications
                            </Label>
                            <p className="text-sm text-slate-500">
                                Receive email notifications for important updates
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant={preferences.emailNotifications ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPreferences({ ...preferences, emailNotifications: !preferences.emailNotifications })}
                        >
                            {preferences.emailNotifications ? 'Enabled' : 'Disabled'}
                        </Button>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button type="submit" disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Preferences
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default PreferencesSettings;
