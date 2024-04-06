// src/utils/roleChecks.mjs

// Adjusted to check roles within a community context
export const isOwnerOrAdmin = (userId, db, chatId) => {
  const user = db.data.communities[chatId]?.users.find(user => user.id === userId);
  const userRoleLevel = getRoleLevel(user?.role, db, chatId);
  const adminRoleLevel = getRoleLevel('admin', db, chatId);
  return userRoleLevel >= adminRoleLevel;
};

export const getRoleLevel = (roleName, db, chatId) => {
  // Check for community-specific roles first
  const communityRoles = db.data.communities[chatId]?.roles;
  let role = communityRoles?.find(role => role.name === roleName);
  
  // If no community-specific role found, fall back to global roles
  if (!role) {
    role = db.data.globalRoles?.find(role => role.name === roleName);
  }

  return role ? role.level : null;
};

// Adjusted for community context
export const updateUserRole = async (username, newRole, db, chatId) => {
  const user = db.data.communities[chatId]?.users.find(u => u.username === username);
  if (!user) {
    return { success: false, message: "User not found" };
  }
  user.role = newRole;
  await db.write();
  return { success: true, message: `User ${username}'s role updated to ${newRole}.` };
};

// Check owner role
export const isOwner = (userId, db) => {
  const user = db.data.users.find(user => user.id === userId);
  return user && user.role === 'owner';
};