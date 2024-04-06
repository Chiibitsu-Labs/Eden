// commands/role.mjs
export const roleCommand = async (msg, bot, db) => {
  const match = msg.text.match(/\/role(?:\s+@(\w+))?(?:\s+(\w+))?/);
  const targetUsername = match && match[1] ? match[1] : msg.from.username;
  const newRole = match && match[2];

  // Fetch sender and target user information
  const fromUser = db.data.users.find(user => user.id === msg.from.id);
  const targetUser = db.data.users.find(user => user.username === targetUsername);

  if (!newRole) {
      // If no new role is specified, simply return the user's current role
      if (targetUser) {
          bot.sendMessage(msg.chat.id, `${targetUsername}'s role: ${targetUser.role}`);
      } else {
          bot.sendMessage(msg.chat.id, "User not found.");
      }
  } else {
      // Attempt to update role if the sender is an admin or owner
      if (fromUser && (fromUser.role === 'admin' || fromUser.role === 'owner')) {
          if (targetUser) {
              // Prevent role elevation above admin for non-owners
              if (fromUser.role !== 'owner' && newRole === 'owner') {
                  bot.sendMessage(msg.chat.id, "Only owners can assign the owner role.");
                  return;
              }
              targetUser.role = newRole;
              await db.write();
              bot.sendMessage(msg.chat.id, `${targetUsername}'s role updated to ${newRole}.`);
          } else {
              bot.sendMessage(msg.chat.id, "User not found.");
          }
      } else {
          bot.sendMessage(msg.chat.id, "You don't have permission to change roles.");
      }
  }
};
