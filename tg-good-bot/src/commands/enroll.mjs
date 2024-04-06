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

    // If user is already enrolled, don't update their role unless specified by an admin or owner.

    if (!targetUser) {
        // If target user doesn't exist, add them
        db.data.users.push({ id: fromId, username: targetUsername, points: 0, role: specifiedRole });
        await db.write();
        bot.sendMessage(msg.chat.id, `User ${targetUsername} has been enrolled as ${specifiedRole}.`);
    } else if (fromId === targetUser.id || isAdminOrOwnerIssuing) {
        // If user is self-enrolling again or admin/owner is updating the role
        if (specifiedRole !== targetUser.role) {
            const canChangeRole = specifiedRole !== 'owner' || fromUser.role === 'owner'; // Only owner can assign 'owner' role
            if (canChangeRole) {
                targetUser.role = specifiedRole;
                await db.write();
                bot.sendMessage(msg.chat.id, `User ${targetUsername}'s role updated to ${specifiedRole}.`);
            } else {
                bot.sendMessage(msg.chat.id, "You cannot assign 'owner' role.");
            }
        } else {
            bot.sendMessage(msg.chat.id, `User ${targetUsername} is already enrolled as ${specifiedRole}.`);
        }
    } else {
        // Prevent unauthorized role changes
        bot.sendMessage(msg.chat.id, "You cannot change other users' roles.");
    }
    
    await db.write();
    bot.sendMessage(msg.chat.id, `User ${targetUsername} has been enrolled as ${specifiedRole}.`);
};