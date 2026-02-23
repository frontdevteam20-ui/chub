import React, { useState, useEffect } from 'react';
import { useRBAC } from '../contexts/RBACContext';
import { getAllUsers, updateUserRole, isValidRole } from '../utils/userManagement';
import { RoleBasedComponent } from './RBACComponents';

const UserRoleManagement = () => {
  const { hasRole } = useRBAC();
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const usersData = await getAllUsers();
    setUsers(usersData);
    setLoading(false);
  };

  const handleRoleChange = async (uid, newRole) => {
    if (!isValidRole(newRole)) {
      setMessage('Invalid role selected');
      return;
    }

    const success = await updateUserRole(uid, newRole);
    if (success) {
      setMessage('Role updated successfully');
      loadUsers(); // Reload users
    } else {
      setMessage('Failed to update role');
    }

    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  if (!hasRole('admin')) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Access denied. Admin privileges required.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">User Role Management</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.includes('successfully') 
            ? 'bg-green-100 border border-green-400 text-green-700' 
            : 'bg-red-100 border border-red-400 text-red-700'
        }`}>
          {message}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Current Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(users).map(([uid, userData]) => (
              <tr key={uid}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {uid}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    userData.role === 'admin' ? 'bg-red-100 text-red-800' :
                    userData.role === 'editor' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {userData.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <select
                    value={userData.role || 'viewer'}
                    onChange={(e) => handleRoleChange(uid, e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserRoleManagement; 