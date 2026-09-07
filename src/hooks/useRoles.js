import { useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';

export function useRoles() {
  const { user } = useAuth();

  const roles = user?.roles || user?.claims?.roles || [];

  const hasRole = useCallback(
    (role) => {
      if (!roles || roles.length === 0) return false;
      if (Array.isArray(role)) {
        return role.some((r) => roles.includes(r));
      }
      return roles.includes(role);
    },
    [roles]
  );

  const hasAllRoles = useCallback(
    (requiredRoles) => {
      if (!roles || roles.length === 0) return false;
      return requiredRoles.every((r) => roles.includes(r));
    },
    [roles]
  );

  return {
    roles,
    hasRole,
    hasAllRoles,
  };
}
