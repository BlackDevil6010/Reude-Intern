import React from 'react';
import { db } from '../db';

/**
 * Hook to check if current logged in user has a specific permission
 */
export function usePermission(permission) {
  try {
    const userStr = localStorage.getItem('reude_user');
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user || !user.role) return false;
    return db.hasPermission(user.role, permission);
  } catch {
    return false;
  }
}

/**
 * Route / Component guard that only renders children if user possesses required permission
 */
export function RequirePermission({ permission, children, fallback = null }) {
  const allowed = usePermission(permission);
  if (!allowed) return fallback;
  return <>{children}</>;
}
