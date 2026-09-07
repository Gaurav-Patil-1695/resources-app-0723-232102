import React, { useState } from 'react';

/**
 * UserRoleEditor - Role assignment dropdown for a given user
 * Props:
 *   user        {object}    - { id, name, email, role }
 *   availableRoles {string[]} - list of roles to choose from
 *   onSave      {function}  - async (userId, newRole) => void
 */
const DEFAULT_ROLES = ['customer', 'manager', 'admin'];

const UserRoleEditor = ({ user, availableRoles = DEFAULT_ROLES, onSave }) => {
  const [selectedRole, setSelectedRole] = useState(user?.role || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  if (!user) return null;

  const isDirty = selectedRole !== user.role;

  const handleSave = async () => {
    if (!isDirty) return;
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await onSave(user.id, selectedRole);
      setSuccess(true);
    } catch (err) {
      setError(err?.message || 'Failed to update role.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow p-5 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm uppercase">
          {user.name?.charAt(0) || 'U'}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-800">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Role</label>
        <select
          value={selectedRole}
          onChange={(e) => {
            setSelectedRole(e.target.value);
            setSuccess(false);
          }}
          disabled={loading}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {availableRoles.map((role) => (
            <option key={role} value={role}>
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </option>
          ))}
        </select>

        <button
          onClick={handleSave}
          disabled={!isDirty || loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving…' : 'Save'}
        </button>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
      {success && <p className="text-xs text-green-600">Role updated successfully.</p>}
    </div>
  );
};

export default UserRoleEditor;
