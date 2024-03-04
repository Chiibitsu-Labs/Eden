// src/utils/roleChecks.mjs

export const isOwnerOrAdmin = (user, db) => {
  if (!user) {
    console.error('User not found.');
    return false;
  }

  const userRoleLevel = db.data.roles.find(role => role.name === user.role)?.level;
  const adminRoleLevel = db.data.roles.find(role => role.name === 'admin')?.level;

  return userRoleLevel >= adminRoleLevel;
};

export const getRoleLevel = (roleName, db) => {
  const role = db.data.roles.find(role => role.name === roleName);
  return role ? role.level : null;
};

export const updateUserRole = async (username, newRole, db) => {
  const user = db.data.users.find(user => user.username === username);
  if (!user) return false; // User not found

  // Update user's role
  user.role = newRole;

  await db.write(); // Save changes to the database
  return true; // Successfully updated
};

// Check owner role
export const isOwner = (userId, db) => {
  const user = db.data.users.find(user => user.id === userId);
  return user && user.role === 'owner';
};