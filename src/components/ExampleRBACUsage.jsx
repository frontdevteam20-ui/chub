import React from 'react';
import { useRBAC } from '../contexts/RBACContext';
import { RoleBasedComponent, PermissionBasedComponent, RoleBasedDropdown } from './RBACComponents';

// Example component showing different dropdowns based on role
const ExampleRBACUsage = () => {
  const { userRole, hasPermission } = useRBAC();

  // Example dropdown options with role requirements
  const adminDropdownOptions = [
    { label: 'Manage Users', requiredRole: 'admin' },
    { label: 'System Settings', requiredRole: 'admin' },
    { label: 'View Analytics', requiredPermission: 'editor' },
    { label: 'Basic Dashboard', requiredPermission: 'viewer' }
  ];

  const editorDropdownOptions = [
    { label: 'Create Content', requiredRole: 'editor' },
    { label: 'Edit Content', requiredRole: 'editor' },
    { label: 'View Analytics', requiredPermission: 'editor' },
    { label: 'Basic Dashboard', requiredPermission: 'viewer' }
  ];

  const viewerDropdownOptions = [
    { label: 'View Dashboard', requiredPermission: 'viewer' },
    { label: 'View Reports', requiredPermission: 'viewer' }
  ];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">RBAC Example Components</h2>
      
      {/* Show current user role */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          Current User Role: <span className="font-bold">{userRole || 'Not logged in'}</span>
        </p>
      </div>

      {/* Admin-only section */}
      <RoleBasedComponent requiredRole="admin">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Admin Section</h3>
          <p className="text-red-700">This content is only visible to administrators.</p>
          <div className="mt-3">
            <RoleBasedDropdown 
              options={adminDropdownOptions}
              className="space-y-2"
            />
          </div>
        </div>
      </RoleBasedComponent>

      {/* Editor or higher permission section */}
      <PermissionBasedComponent requiredPermission="editor">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Editor Section</h3>
          <p className="text-yellow-700">This content is visible to editors and admins.</p>
          <div className="mt-3">
            <RoleBasedDropdown 
              options={editorDropdownOptions}
              className="space-y-2"
            />
          </div>
        </div>
      </PermissionBasedComponent>

      {/* Viewer or higher permission section */}
      <PermissionBasedComponent requiredPermission="viewer">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-green-800 mb-2">Viewer Section</h3>
          <p className="text-green-700">This content is visible to all authenticated users.</p>
          <div className="mt-3">
            <RoleBasedDropdown 
              options={viewerDropdownOptions}
              className="space-y-2"
            />
          </div>
        </div>
      </PermissionBasedComponent>

      {/* Example of conditional rendering with fallback */}
      <RoleBasedComponent 
        requiredRole="admin" 
        fallback={
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-gray-600">You need admin privileges to see the full content.</p>
          </div>
        }
      >
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">Admin Only Content</h3>
          <p className="text-purple-700">This is only visible to admins with a custom fallback for others.</p>
        </div>
      </RoleBasedComponent>
    </div>
  );
};

export default ExampleRBACUsage; 