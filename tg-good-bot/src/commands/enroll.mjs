// src/commands/enroll.mjs
import { isOwnerOrAdmin, getRoleLevel, updateUserRole } from '../utils/roleChecks.mjs';

export const enrollCommand = async (msg, bot, db) => {
    const fromId = msg.from.id;
    const chatId = msg.chat.id.toString();
    // Ensure community initialization here, if not already done elsewhere
    if (!db.data.communities[chatId]) {
        db.data.communities[chatId] = { users: [], transactions: [], roles: db.data.globalRoles, settings: {} };
    }
    const community = db.data.communities[chatId];
    // Use username or first name as a fallback
    const fromUsername = msg.from.username || msg.from.first_name;
    let fromUser = community.users.find(user => user.id === fromId);

    // Default behavior is to self-enroll or upgrade to 'member'
    const specifiedRole = 'member'; // Default role for self-enrollment

    // If the user is not found in the community database, add them as a new user with 'member' role
    if (!fromUser) {
        community.users.push({ id: fromId, username: fromUsername, points: 0, role: specifiedRole });
        await db.write();
        bot.sendMessage(msg.chat.id, `Welcome ${fromUsername}! You have been enrolled as ${specifiedRole}.`);
        return;
    }

    // Existing users: check and update role if necessary
    const currentRoleLevel = getRoleLevel(fromUser.role, db, chatId);
    const newRoleLevel = getRoleLevel(specifiedRole, db, chatId);

    if (currentRoleLevel < newRoleLevel) {
        await updateUserRole(fromUsername, specifiedRole, db, chatId);
        bot.sendMessage(msg.chat.id, `Congratulations ${fromUsername}! Your role has been upgraded to ${specifiedRole}.`);
    } else {
        // If the user already has 'member' role or higher, inform them without changing their role
        bot.sendMessage(msg.chat.id, `You are already enrolled with a role of ${fromUser.role}. No changes were made.`);
    }
};
