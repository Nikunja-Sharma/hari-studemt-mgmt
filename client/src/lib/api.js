// API utility functions with credentials included

const API_BASE_URL = '/api';

// Helper function to make API calls with credentials
const apiCall = async (endpoint, options = {}) => {
    const defaultOptions = {
        credentials: 'include', // Always include cookies
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        }
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...defaultOptions,
        ...options
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error?.message || 'API request failed');
    }

    return data;
};

// Auth API
export const authAPI = {
    login: (credentials) => apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),

    signup: (userData) => apiCall('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(userData)
    }),

    logout: () => apiCall('/auth/logout', {
        method: 'POST'
    }),

    verify: () => apiCall('/auth/verify'),

    register: (userData) => apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    })
};

// Student API
export const studentAPI = {
    getAll: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiCall(`/students${queryString ? `?${queryString}` : ''}`);
    },

    getById: (id) => apiCall(`/students/${id}`),

    create: (studentData) => apiCall('/students', {
        method: 'POST',
        body: JSON.stringify(studentData)
    }),

    update: (id, studentData) => apiCall(`/students/${id}`, {
        method: 'PUT',
        body: JSON.stringify(studentData)
    }),

    delete: (id) => apiCall(`/students/${id}`, {
        method: 'DELETE'
    }),

    search: (query) => {
        const queryString = new URLSearchParams({ q: query }).toString();
        return apiCall(`/students/search?${queryString}`);
    }
};

// Department API
export const departmentAPI = {
    getAll: () => apiCall('/departments'),

    getById: (id) => apiCall(`/departments/${id}`),

    create: (departmentData) => apiCall('/departments', {
        method: 'POST',
        body: JSON.stringify(departmentData)
    }),

    update: (id, departmentData) => apiCall(`/departments/${id}`, {
        method: 'PUT',
        body: JSON.stringify(departmentData)
    }),

    delete: (id) => apiCall(`/departments/${id}`, {
        method: 'DELETE'
    }),

    getSections: (id) => apiCall(`/departments/${id}/sections`)
};

// Section API
export const sectionAPI = {
    getAll: () => apiCall('/sections'),

    create: (sectionData) => apiCall('/sections', {
        method: 'POST',
        body: JSON.stringify(sectionData)
    }),

    update: (id, sectionData) => apiCall(`/sections/${id}`, {
        method: 'PUT',
        body: JSON.stringify(sectionData)
    }),

    delete: (id) => apiCall(`/sections/${id}`, {
        method: 'DELETE'
    })
};

// Dashboard API
export const dashboardAPI = {
    getStats: () => apiCall('/dashboard/stats')
};

// Report API
export const reportAPI = {
    getDepartmentReport: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiCall(`/reports/department${queryString ? `?${queryString}` : ''}`);
    },

    getSectionReport: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiCall(`/reports/section${queryString ? `?${queryString}` : ''}`);
    },

    getCompleteReport: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiCall(`/reports/complete${queryString ? `?${queryString}` : ''}`);
    },

    exportCSV: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        // For CSV export, we need to handle it differently
        return fetch(`${API_BASE_URL}/reports/export/csv${queryString ? `?${queryString}` : ''}`, {
            credentials: 'include'
        });
    }
};

// Profile API
export const profileAPI = {
    getProfile: () => apiCall('/users/profile'),

    updateProfile: (profileData) => apiCall('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
    }),

    getPreferences: () => apiCall('/users/profile/preferences'),

    updatePreferences: (preferences) => apiCall('/users/profile/preferences', {
        method: 'PUT',
        body: JSON.stringify({ preferences })
    }),

    changePassword: (passwordData) => apiCall('/users/profile/change-password', {
        method: 'POST',
        body: JSON.stringify(passwordData)
    }),

    uploadAvatar: (profilePicture) => apiCall('/users/profile/upload-avatar', {
        method: 'POST',
        body: JSON.stringify({ profilePicture })
    })
};

// Admin User Management API
export const adminUserAPI = {
    getAll: (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiCall(`/admin/users${queryString ? `?${queryString}` : ''}`);
    },

    getById: (id) => apiCall(`/admin/users/${id}`),

    getStats: () => apiCall('/admin/users/stats'),

    banUser: (id, reason) => apiCall(`/admin/users/${id}/ban`, {
        method: 'POST',
        body: JSON.stringify({ reason })
    }),

    unbanUser: (id) => apiCall(`/admin/users/${id}/unban`, {
        method: 'POST'
    }),

    deleteUser: (id) => apiCall(`/admin/users/${id}`, {
        method: 'DELETE'
    })
};
