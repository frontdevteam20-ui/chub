import { FiEdit2, FiTrash2, FiMoreVertical, FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from 'react';

const UserList = ({ users, searchTerm, onEdit, onDelete }) => {
  const [showPasswords, setShowPasswords] = useState({});

  const togglePasswordVisibility = (userId) => {
    setShowPasswords(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };
  const getStatusBadgeClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'away':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = users.filter(user => {
    if (!searchTerm.trim()) return true;
    
    const search = searchTerm.toLowerCase().trim();
    const name = (user.name || '').toLowerCase();
    const email = (user.email || '').toLowerCase();
    const role = (user.role || '').toLowerCase();
    const phone = (user.phone || '').toLowerCase();
    
    return (
      name.includes(search) ||
      email.includes(search) ||
      role.includes(search) ||
      phone.includes(search) ||
      name.split(' ').some(part => part.startsWith(search)) ||
      email.split('@')[0].includes(search)
    );
  });

  return (
    <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <span>Name</span>
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black-500 uppercase tracking-wider">
                    Password
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-black-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-bold text-black-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                              <span className="text-blue-600 font-medium text-lg">
                                {user.name?.charAt(0).toUpperCase() || 'U'}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name || 'No Name'}</div>
                            <div className="text-sm text-gray-500">{user.phone || 'No phone'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left">
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(user.status)}`}>
                          {user.status || 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left">
                        <div className="flex items-center">
                          {console.log('Rendering user:', user.id, 'Password:', user.password) || user.password ? (
                            <>
                              <span className="text-sm text-gray-900 font-mono">
                                {showPasswords[user.id] ? user.password : '••••••••'}
                              </span>
                              <button
                                type="button"
                                onClick={() => togglePasswordVisibility(user.id)}
                                className="ml-2 text-gray-400 hover:text-blue-600 transition-colors"
                                title={showPasswords[user.id] ? 'Hide password' : 'Show password'}
                              >
                                {showPasswords[user.id] ? (
                                  <FiEyeOff className="h-4 w-4" />
                                ) : (
                                  <FiEye className="h-4 w-4" />
                                )}
                              </button>
                            </>
                          ) : (
                            <span className="text-sm text-gray-400">Not set</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {user.createdAt?.toDate ? (
                          <>
                            <div className="text-gray-900">{user.createdAt.toDate().toLocaleDateString()}</div>
                            <div className="text-gray-400 text-xs">{user.createdAt.toDate().toLocaleTimeString()}</div>
                          </>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left">
                        <span className="px-2.5 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                          {user.role || 'editor'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                        <div className="flex items-center justify-end space-x-3">
                          <button
                            onClick={() => onEdit(user)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Edit user"
                          >
                            <FiEdit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => onDelete(user.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Delete user"
                          >
                            <FiTrash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-4 whitespace-nowrap text-center">
                      <p className="text-xs text-gray-400 mt-1">
                        {searchTerm ? 'Try a different search term' : 'Add a new user to get started'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserList;
