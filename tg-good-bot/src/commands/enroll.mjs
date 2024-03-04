// src/commands/enroll.mjs
import { isOwnerOrAdmin, getRoleLevel } from '../utils/roleChecks.mjs';
import { updateUserRole } from '../utils/userOps.mjs';

export const enrollCommand = async (msg, bot, db) => {
    const fromId = msg.from.id;
    const fromUsername = msg.from.username;
    let targetUsername = fromUsername; // Default to the sender's username
    let specifiedRole = 'member'; // Default role

    // Check if command includes target username and/or role
    const match = msg.text.match(/\/enroll\s*(@\w+)?\s*(\w+)?/);
    if (match) {
        if (match[1]) targetUsername = match[1].replace('@', ''); // Override if target username provided
        if (match[2]) specifiedRole = match[2]; // Override if role provided
    }

    const fromUser = db.data.users.find(user => user.username === fromUsername);
    const targetUser = db.data.users.find(user => user.username === targetUsername);
    const isAdminOrOwnerIssuing = isOwnerOrAdmin(fromUser, db);

    // Prevent unauthorized role assignment
    if (specifiedRole === 'owner' && !isAdminOrOwnerIssuing) {
        return bot.sendMessage(msg.chat.id, "Only an owner can assign the owner role.");
    }

    // Add or update user role
    if (!targetUser) {
        // If target user doesn't exist, add them
        db.data.users.push({ username: targetUsername, points: 0, role: specifiedRole });
    } else {
        // Prevent role downgrade, only allow role upgrade or same-level role assignment
        const currentRoleLevel = getRoleLevel(targetUser.role, db);
        const newRoleLevel = getRoleLevel(specifiedRole, db);

        if (newRoleLevel > currentRoleLevel && isAdminOrOwnerIssuing) {
            targetUser.role = specifiedRole; // Update role if higher and issued by admin/owner
        } else {
            return bot.sendMessage(msg.chat.id, "You cannot downgrade roles or assign roles higher than your own.");
        }
    }

    await db.write();
    bot.sendMessage(msg.chat.id, `User ${targetUsername} has been enrolled as ${specifiedRole}.`);
};