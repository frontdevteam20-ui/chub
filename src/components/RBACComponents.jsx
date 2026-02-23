import React from 'react';
import { useRBAC } from '../contexts/RBACContext';

// Component that only renders if user has the required role
export const RoleBasedComponent = ({ requiredRole, children, fallback = null }) => {
  const { hasRole } = useRBAC();
  
  if (hasRole(requiredRole)) {
    return <>{children}</>;
  }
  
  return fallback;
};

// Component that only renders if user has the required permission level
export const PermissionBasedComponent = ({ requiredPermission, children, fallback = null }) => {
  const { hasPermission } = useRBAC();
  
  if (hasPermission(requiredPermission)) {
    return <>{children}</>;
  }
  
  return fallback;
};

// Higher-order component for role-based access
export const withRole = (WrappedComponent, requiredRole) => {
  return function WithRoleComponent(props) {
    const { hasRole } = useRBAC();
    
    if (!hasRole(requiredRole)) {
      return null;
    }
    
    return <WrappedComponent {...props} />;
  };
};

// Higher-order component for permission-based access
export const withPermission = (WrappedComponent, requiredPermission) => {
  return function WithPermissionComponent(props) {
    const { hasPermission } = useRBAC();
    
    if (!hasPermission(requiredPermission)) {
      return null;
    }
    
    return <WrappedComponent {...props} />;
  };
};

// Dropdown component that shows different options based on role
export const RoleBasedDropdown = ({ options, className = "" }) => {
  const { userRole, hasPermission } = useRBAC();
  
  const getVisibleOptions = () => {
    return options.filter(option => {
      // If no role requirement, show to all
      if (!option.requiredRole && !option.requiredPermission) {
        return true;
      }
      
      // Check role requirement
      if (option.requiredRole) {
        return hasRole(option.requiredRole);
      }
      
      // Check permission requirement
      if (option.requiredPermission) {
        return hasPermission(option.requiredPermission);
      }
      
      return false;
    });
  };
  
  const visibleOptions = getVisibleOptions();
  
  if (visibleOptions.length === 0) {
    return null;
  }
  
  return (
    <div className={className}>
      {visibleOptions.map((option, index) => (
        <div key={index} className="dropdown-item">
          {option.label}
        </div>
      ))}
    </div>
  );
}; 