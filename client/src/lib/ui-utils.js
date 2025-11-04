/**
 * UI Utilities for Student Management System
 * Common patterns and helpers for UI components
 */

/**
 * Format student data for display in tables
 * @param {Object} student - Student object
 * @returns {Object} Formatted student data
 */
export function formatStudentForDisplay(student) {
  return {
    ...student,
    departmentName: student.department?.name || 'N/A',
    sectionName: student.section?.name || 'N/A',
  };
}

/**
 * Get initials from a name for avatar display
 * @param {string} name - Full name
 * @returns {string} Initials (max 2 characters)
 */
export function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/**
 * Format role for display with proper casing
 * @param {string} role - User role
 * @returns {string} Formatted role
 */
export function formatRole(role) {
  if (!role) return 'Unknown';
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

/**
 * Get badge variant based on status or type
 * @param {string} status - Status or type
 * @returns {string} Badge variant
 */
export function getBadgeVariant(status) {
  const variants = {
    active: 'default',
    inactive: 'secondary',
    pending: 'outline',
    admin: 'default',
    faculty: 'secondary',
  };
  return variants[status?.toLowerCase()] || 'default';
}

/**
 * Truncate text with ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 50) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Format date for display
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
export function formatDate(date) {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date and time for display
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date and time
 */
export function formatDateTime(date) {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Is valid phone number
 */
export function isValidPhone(phone) {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phone && phone.length >= 10 && phoneRegex.test(phone);
}

/**
 * Generate a random color for avatars
 * @param {string} seed - Seed string for consistent colors
 * @returns {string} HSL color string
 */
export function generateAvatarColor(seed) {
  if (!seed) return 'hsl(221.2, 83.2%, 53.3%)';
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`;
}

/**
 * Debounce function for search inputs
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Sort array of objects by a key
 * @param {Array} array - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} order - 'asc' or 'desc'
 * @returns {Array} Sorted array
 */
export function sortByKey(array, key, order = 'asc') {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Filter array by search term across multiple fields
 * @param {Array} array - Array to filter
 * @param {string} searchTerm - Search term
 * @param {Array} fields - Fields to search in
 * @returns {Array} Filtered array
 */
export function filterBySearch(array, searchTerm, fields) {
  if (!searchTerm) return array;
  const term = searchTerm.toLowerCase();
  return array.filter(item =>
    fields.some(field => {
      const value = field.split('.').reduce((obj, key) => obj?.[key], item);
      return value?.toString().toLowerCase().includes(term);
    })
  );
}

/**
 * Get error message from error object
 * @param {Error|Object} error - Error object
 * @returns {string} Error message
 */
export function getErrorMessage(error) {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.error?.message) return error.response.data.error.message;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'An unexpected error occurred';
}

/**
 * Check if user has required role
 * @param {string} userRole - User's role
 * @param {string|Array} requiredRoles - Required role(s)
 * @returns {boolean} Has required role
 */
export function hasRole(userRole, requiredRoles) {
  if (!userRole) return false;
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return roles.includes(userRole);
}
