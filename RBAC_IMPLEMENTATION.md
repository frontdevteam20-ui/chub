# RBAC (Role-Based Access Control) Implementation

This document explains how to use the RBAC system implemented in your React app with Firebase Realtime Database.

## Overview

The RBAC system provides three roles:
- **Admin**: Full access to all features
- **Editor**: Can create, edit, and view content
- **Viewer**: Can only view content

## Setup Instructions

### 1. Firebase Realtime Database Rules

Deploy the security rules from `firebase-rules.json` to your Firebase Realtime Database:

1. Go to Firebase Console
2. Navigate to Realtime Database
3. Go to Rules tab
4. Replace the rules with the content from `firebase-rules.json`

### 2. Set Up First Admin User

After the first user logs in, you need to set them as admin. You can do this by:

1. Log in with your first user
2. Open browser console
3. Run: `await setupFirstAdmin()`

Or create a temporary admin setup component.

### 3. User Role Management

Access the user management interface at `/admin/user-management` (admin only).

## Usage Examples

### Basic Role-Based Components

```jsx
import { RoleBasedComponent, PermissionBasedComponent } from './components/RBACComponents';

// Show content only to admins
<RoleBasedComponent requiredRole="admin">
  <div>Admin only content</div>
</RoleBasedComponent>

// Show content to editors and admins
<PermissionBasedComponent requiredPermission="editor">
  <div>Editor and admin content</div>
</PermissionBasedComponent>
```

### Using the RBAC Hook

```jsx
import { useRBAC } from './contexts/RBACContext';

function MyComponent() {
  const { userRole, hasPermission, hasRole } = useRBAC();
  
  if (hasRole('admin')) {
    return <AdminDashboard />;
  }
  
  if (hasPermission('editor')) {
    return <EditorDashboard />;
  }
  
  return <ViewerDashboard />;
}
```

### Role-Based Dropdowns

```jsx
import { RoleBasedDropdown } from './components/RBACComponents';

const dropdownOptions = [
  { label: 'Manage Users', requiredRole: 'admin' },
  { label: 'Create Content', requiredRole: 'editor' },
  { label: 'View Reports', requiredPermission: 'viewer' }
];

<RoleBasedDropdown options={dropdownOptions} />
```

## Database Structure

The user roles are stored in Firebase Realtime Database:

```json
{
  "users": {
    "user_uid_1": {
      "role": "admin",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    },
    "user_uid_2": {
      "role": "editor",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

## Security Features

1. **Client-side validation**: Components check user roles before rendering
2. **Server-side validation**: Firebase rules enforce permissions
3. **Role hierarchy**: Admin > Editor > Viewer
4. **Automatic role fetching**: Roles are fetched when user logs in

## Available Components

- `RoleBasedComponent`: Render based on exact role
- `PermissionBasedComponent`: Render based on permission level
- `RoleBasedDropdown`: Show dropdown options based on role
- `withRole`: HOC for role-based access
- `withPermission`: HOC for permission-based access

## Available Utilities

- `setUserRole(uid, role)`: Set user role
- `getUserRole(uid)`: Get user role
- `updateUserRole(uid, newRole)`: Update user role
- `getAllUsers()`: Get all users with roles
- `isValidRole(role)`: Validate role
- `getRoleLevel(role)`: Get role hierarchy level

## Example Routes with RBAC

```jsx
// Admin only routes
<Route path="/admin/user-management" element={
  <ProtectedRoute user={user}>
    <UserRoleManagement />
  </ProtectedRoute>
} />

// Editor and admin routes
<Route path="/admin/blogs" element={
  <ProtectedRoute user={user}>
    <Blogs handleLogout={handleLogout} />
  </ProtectedRoute>
} />
```

## Testing

1. Create multiple users with different roles
2. Test that each user sees only appropriate content
3. Verify that admin can manage user roles
4. Test that unauthorized users cannot access restricted features

## Troubleshooting

- **User role not loading**: Check Firebase connection and rules
- **Components not showing**: Verify user has correct role
- **Permission denied**: Check Firebase security rules
- **Role not updating**: Ensure admin privileges and valid role name 