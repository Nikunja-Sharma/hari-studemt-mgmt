# shadcn/ui Setup Documentation

## Overview
This document describes the shadcn/ui setup and configuration for the Student Management System.

## Installed Components

All required shadcn/ui components have been successfully installed:

- ✅ **Button** - Primary action buttons with multiple variants
- ✅ **Card** - Container component for content sections
- ✅ **Form** - Form wrapper with react-hook-form integration
- ✅ **Input** - Text input fields
- ✅ **Label** - Form labels
- ✅ **Table** - Data table component
- ✅ **Dialog** - Modal dialogs
- ✅ **Select** - Dropdown select component
- ✅ **Toast** - Toast notifications with Toaster provider
- ✅ **Alert** - Alert messages
- ✅ **Badge** - Status badges
- ✅ **Tabs** - Tabbed interface
- ✅ **DropdownMenu** - Dropdown menus for actions
- ✅ **Avatar** - User avatar component
- ✅ **NavigationMenu** - Navigation menu component
- ✅ **Separator** - Visual separator
- ✅ **Accordion** - Collapsible content sections

## Theme Configuration

### Color Palette
The theme has been configured with a professional blue color palette suitable for an educational management system:

- **Primary**: Blue (#3B82F6) - Used for primary actions and branding
- **Secondary**: Light blue/gray - Used for secondary elements
- **Destructive**: Red - Used for delete/warning actions
- **Muted**: Gray tones - Used for less prominent content
- **Accent**: Light blue - Used for highlights and hover states

### CSS Variables
All theme colors are defined as CSS variables in `src/index.css` using HSL color space, supporting both light and dark modes.

## File Structure

```
client/src/
├── components/
│   ├── ui/                      # shadcn/ui components
│   │   ├── accordion.jsx
│   │   ├── alert.jsx
│   │   ├── avatar.jsx
│   │   ├── badge.jsx
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── dialog.jsx
│   │   ├── dropdown-menu.jsx
│   │   ├── form.jsx
│   │   ├── input.jsx
│   │   ├── label.jsx
│   │   ├── navigation-menu.jsx
│   │   ├── select.jsx
│   │   ├── separator.jsx
│   │   ├── table.jsx
│   │   ├── tabs.jsx
│   │   ├── toast.jsx
│   │   ├── toaster.jsx
│   │   └── index.js            # Central export file
│   └── ComponentShowcase.jsx    # Demo/reference component
├── hooks/
│   └── use-toast.js             # Toast notification hook
└── lib/
    ├── utils.js                 # Tailwind utility (cn function)
    └── ui-utils.js              # Custom UI utilities
```

## Utility Files

### `lib/utils.js`
Contains the `cn()` function for merging Tailwind classes with class-variance-authority.

### `lib/ui-utils.js`
Custom utility functions for the Student Management System:
- `formatStudentForDisplay()` - Format student data for tables
- `getInitials()` - Generate initials for avatars
- `formatRole()` - Format user roles
- `getBadgeVariant()` - Get badge variant based on status
- `truncateText()` - Truncate long text
- `formatDate()` / `formatDateTime()` - Date formatting
- `isValidEmail()` / `isValidPhone()` - Validation helpers
- `generateAvatarColor()` - Generate consistent avatar colors
- `debounce()` - Debounce function for search
- `sortByKey()` - Sort arrays by key
- `filterBySearch()` - Filter arrays by search term
- `getErrorMessage()` - Extract error messages
- `hasRole()` - Check user permissions

## Dependencies Added

The following npm packages were automatically installed:

### UI Framework
- `@radix-ui/react-*` - Headless UI primitives
- `lucide-react` - Icon library

### Form Management
- `react-hook-form` - Form state management
- `@hookform/resolvers` - Form validation resolvers
- `zod` - Schema validation

### Styling
- `class-variance-authority` - Component variants
- `tailwindcss-animate` - Animation utilities

## Usage Examples

### Importing Components

```jsx
// Import individual components
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Or import from the central index
import { Button, Card, CardHeader, CardTitle } from '@/components/ui';
```

### Using Utilities

```jsx
import { cn } from '@/lib/utils';
import { getInitials, formatDate } from '@/lib/ui-utils';

// Merge classes
<div className={cn('base-class', isActive && 'active-class')} />

// Get initials for avatar
const initials = getInitials('John Doe'); // "JD"

// Format date
const formatted = formatDate(new Date()); // "Nov 4, 2025"
```

### Toast Notifications

```jsx
import { useToast } from '@/hooks/use-toast';

function MyComponent() {
  const { toast } = useToast();
  
  const showSuccess = () => {
    toast({
      title: "Success",
      description: "Student added successfully",
    });
  };
  
  return <Button onClick={showSuccess}>Add Student</Button>;
}

// Don't forget to add <Toaster /> to your app root
```

## Configuration Files

### `components.json`
shadcn/ui configuration file defining:
- Style: "new-york"
- TypeScript: Disabled (using JSX)
- Path aliases for imports
- Icon library: lucide-react

### `tailwind.config.js`
Extended with:
- Custom color variables
- Border radius variables
- Accordion animations
- Chart color palette

### `vite.config.js`
Configured with path aliases:
- `@/` maps to `src/`

## Next Steps

1. Add `<Toaster />` component to your app root (App.jsx or main layout)
2. Use components in your feature implementations
3. Refer to `ComponentShowcase.jsx` for usage examples
4. Customize theme colors in `src/index.css` if needed

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix UI Documentation](https://www.radix-ui.com)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [React Hook Form Documentation](https://react-hook-form.com)
