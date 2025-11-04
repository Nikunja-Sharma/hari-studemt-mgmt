import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useToast } from '../../hooks/use-toast';
import { profileAPI } from '../../lib/api';
import { Loader2, Eye, EyeOff, Shield, Lock } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

const SecuritySettings = () => {
    const { toast } = useToast();
    const [saving, setSaving] = useState(false);
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
            toast({
                title: 'Validation Error',
                description: 'All password fields are required',
                variant: 'destructive'
            });
            return;
        }

        if (passwords.newPassword.length < 8) {
            toast({
                title: 'Validation Error',
                description: 'New password must be at least 8 characters long',
                variant: 'destructive'
            });
            return;
        }

        if (passwords.newPassword !== passwords.confirmPassword) {
            toast({
                title: 'Validation Error',
                description: 'New passwords do not match',
                variant: 'destructive'
            });
            return;
        }

        try {
            setSaving(true);
            const response = await profileAPI.changePassword({
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            
            if (response.success) {
                toast({
                    title: 'Success',
                    description: 'Password changed successfully'
                });
                
                // Reset form
                setPasswords({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to change password',
                variant: 'destructive'
            });
        } finally {
            setSaving(false);
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '' };
        
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.length >= 12) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' };
        if (strength <= 3) return { strength, label: 'Fair', color: 'bg-yellow-500' };
        if (strength <= 4) return { strength, label: 'Good', color: 'bg-blue-500' };
        return { strength, label: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength(passwords.newPassword);

    return (
        <div className="space-y-6">
            {/* Change Password Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-blue-600" />
                        <CardTitle>Change Password</CardTitle>
                    </div>
                    <CardDescription>
                        Update your password to keep your account secure
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Current Password */}
                        <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <div className="relative">
                                <Input
                                    id="currentPassword"
                                    type={showPasswords.current ? 'text' : 'password'}
                                    value={passwords.currentPassword}
                                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                    placeholder="Enter current password"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => togglePasswordVisibility('current')}
                                >
                                    {showPasswords.current ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <div className="relative">
                                <Input
                                    id="newPassword"
                                    type={showPasswords.new ? 'text' : 'password'}
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    placeholder="Enter new password"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => togglePasswordVisibility('new')}
                                >
                                    {showPasswords.new ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            
                            {/* Password Strength Indicator */}
                            {passwords.newPassword && (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all ${passwordStrength.color}`}
                                                style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-medium text-slate-600">
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Use at least 8 characters with a mix of letters, numbers, and symbols
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    value={passwords.confirmPassword}
                                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                    placeholder="Confirm new password"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                >
                                    {showPasswords.confirm ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end pt-4">
                            <Button type="submit" disabled={saving}>
                                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Change Password
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Security Information */}
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-blue-600" />
                        <CardTitle>Security Information</CardTitle>
                    </div>
                    <CardDescription>
                        Important security features and policies
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert>
                        <AlertDescription>
                            <ul className="list-disc list-inside space-y-2 text-sm">
                                <li>Your password must be at least 8 characters long</li>
                                <li>You cannot reuse your last 5 passwords</li>
                                <li>Your account will be locked for 30 minutes after 5 failed login attempts</li>
                                <li>We recommend using a strong, unique password</li>
                            </ul>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
    );
};

export default SecuritySettings;
