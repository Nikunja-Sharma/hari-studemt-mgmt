import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useToast } from '../../hooks/use-toast';
import { profileAPI } from '../../lib/api';
import { Loader2, Upload } from 'lucide-react';

const ProfileSettings = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({
        firstName: '',
        lastName: '',
        contact: '',
        dateOfBirth: '',
        address: '',
        profilePicture: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const response = await profileAPI.getProfile();
            if (response.success && response.user) {
                // Initialize profile with default empty values if not present
                const userProfile = response.user.profile || {};
                setProfile({
                    firstName: userProfile.firstName || '',
                    lastName: userProfile.lastName || '',
                    contact: userProfile.contact || '',
                    dateOfBirth: userProfile.dateOfBirth || '',
                    address: userProfile.address || '',
                    profilePicture: userProfile.profilePicture || ''
                });
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to load profile',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate contact if provided
        if (profile.contact && !/^\d{10}$/.test(profile.contact)) {
            toast({
                title: 'Validation Error',
                description: 'Contact must be exactly 10 digits',
                variant: 'destructive'
            });
            return;
        }

        try {
            setSaving(true);
            const response = await profileAPI.updateProfile({ profile });
            
            if (response.success) {
                toast({
                    title: 'Success',
                    description: 'Profile updated successfully'
                });
                
                // Update user in localStorage
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    user.profile = response.user.profile;
                    localStorage.setItem('user', JSON.stringify(user));
                }
            }
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update profile',
                variant: 'destructive'
            });
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            toast({
                title: 'Error',
                description: 'Image size must be less than 2MB',
                variant: 'destructive'
            });
            return;
        }

        // Convert to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const base64String = reader.result;
                const response = await profileAPI.uploadAvatar(base64String);
                
                if (response.success) {
                    setProfile(prev => ({ ...prev, profilePicture: response.profilePicture }));
                    toast({
                        title: 'Success',
                        description: 'Profile picture updated successfully'
                    });
                }
            } catch (error) {
                toast({
                    title: 'Error',
                    description: error.message || 'Failed to upload image',
                    variant: 'destructive'
                });
            }
        };
        reader.readAsDataURL(file);
    };

    const getInitials = () => {
        if (profile.firstName && profile.lastName) {
            return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
        }
        const userStr = localStorage.getItem('user');
        const user = userStr ? JSON.parse(userStr) : null;
        return user?.username?.substring(0, 2).toUpperCase() || 'U';
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
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                    Update your personal information and profile picture
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24">
                            {profile.profilePicture ? (
                                <img src={profile.profilePicture} alt="Profile" className="object-cover" />
                            ) : (
                                <AvatarFallback className="bg-blue-600 text-white text-2xl">
                                    {getInitials()}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <div>
                            <Label htmlFor="avatar-upload" className="cursor-pointer">
                                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                                    <Upload className="h-4 w-4" />
                                    <span className="text-sm font-medium">Upload Photo</span>
                                </div>
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                />
                            </Label>
                            <p className="text-xs text-slate-500 mt-2">
                                JPG, PNG or GIF. Max size 2MB
                            </p>
                        </div>
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                value={profile.firstName || ''}
                                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                placeholder="Enter first name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                value={profile.lastName || ''}
                                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                placeholder="Enter last name"
                            />
                        </div>
                    </div>

                    {/* Contact */}
                    <div className="space-y-2">
                        <Label htmlFor="contact">Contact Number</Label>
                        <Input
                            id="contact"
                            value={profile.contact || ''}
                            onChange={(e) => setProfile({ ...profile, contact: e.target.value })}
                            placeholder="10-digit phone number"
                            maxLength={10}
                        />
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-2">
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                            id="dateOfBirth"
                            type="date"
                            value={profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : ''}
                            onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                        />
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                            id="address"
                            value={profile.address || ''}
                            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                            placeholder="Enter your address"
                            rows={3}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button type="submit" disabled={saving}>
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default ProfileSettings;
