import { FiUser, FiMail, FiPhone, FiLock, FiX, FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";

const UserForm = ({ formData, onInputChange, onSubmit, onClose, isSubmitting, errors = {}, editingUser = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submission started with data:', formData);
    console.log('Form validation status:', Object.keys(errors).length === 0 ? 'Valid' : 'Has errors', errors);
    
    // Log each field for debugging
    console.group('Form Field Values:');
    Object.entries(formData).forEach(([key, value]) => {
      console.log(`${key}:`, value, value ? `(length: ${value.length})` : '(empty)');
    });
    console.groupEnd();
    
    onSubmit(e);
  };
  
  return (
  <form onSubmit={handleSubmit} className="p-6 space-y-5">
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 text-left">Full Name</label>
      <div className="relative mt-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiUser className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          placeholder="John Doe"
          required
          disabled={isSubmitting}
        />
      </div>
    </div>
    
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 text-left">Email Address</label>
      <div className="relative mt-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiMail className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={onInputChange}
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          placeholder="john@example.com"
          required
          disabled={isSubmitting}
        />
      </div>
    </div>
    
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700 text-left">Phone Number</label>
      <div className="relative mt-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FiPhone className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={onInputChange}
          className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
          placeholder="+1 234 567 890"
          required
          disabled={isSubmitting}
        />
      </div>
    </div>
    
    {console.log('Form Data:', formData, 'Editing:', editingUser, 'Show Password:', formData.role === 'admin' && !editingUser)}
    {!editingUser && (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <div className="relative mt-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiLock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password || ''}
            onChange={onInputChange}
            className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
            placeholder="••••••••"
            required={!editingUser}
            disabled={isSubmitting}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 focus:outline-none"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isSubmitting}
          >
            {showPassword ? (
              <FiEyeOff className="h-5 w-5" />
            ) : (
              <FiEye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">
            {Array.isArray(errors.password) ? errors.password.join('. ') : errors.password}
          </p>
        )}
      </div>
    )}
    
    {errors.firebase && (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {errors.firebase}
            </p>
          </div>
        </div>
      </div>
    )}
    
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 text-left">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={onInputChange}
          className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm"
          required
          disabled={isSubmitting}
        >
          <option value="editor">editor</option>
          <option value="admin">admin</option>
          <option value="Manager">Manager</option>
        </select>
      </div>
      
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 text-left">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={onInputChange}
          className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg shadow-sm"
          required
          disabled={isSubmitting}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Away">Away</option>
        </select>
      </div>
    </div>
    
    {formData.lastLogin && (
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 text-left">Created At</label>
        <div className="mt-1">
          <div className="block w-full pl-3 pr-3 py-2.5 bg-gray-50 text-gray-500 rounded-lg border border-gray-200">
            {(() => {
              try {
                // Handle Firestore Timestamp, string, or Date object
                const date = formData.lastLogin.toDate 
                  ? formData.lastLogin.toDate() 
                  : new Date(formData.lastLogin);
                
                if (date instanceof Date && !isNaN(date)) {
                  return date.toLocaleString();
                }
                return 'Never logged in';
              } catch (e) {
                console.error('Error formatting date:', e);
                return 'Never logged in';
              }
            })()}
          </div>
        </div>
      </div>
    )}
    
    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
      <button
        type="button"
        onClick={onClose}
        disabled={isSubmitting}
        className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Save User'}
      </button>
    </div>
  </form>
);
};

export default UserForm;
