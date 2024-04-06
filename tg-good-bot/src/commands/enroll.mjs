// src/commands/enroll.mjs
import { isOwnerOrAdmin, getRoleLevel } from '../utils/roleChecks.mjs';

export const enrollCommand = async (msg, bot, db) => {
    const fromId = msg.from.id;
    const fromUsername = msg.from.username;
    const fromUser = db.data.users.find(user => user.id === fromId || user.username === fromUsername);

    // Default behavior is to self-enroll or upgrade to 'member'
    const specifiedRole = 'member'; // Default role for self-enrollment

    // If the user is not found in the database, add them as a new user with 'member' role
    if (!fromUser) {
        db.data.users.push({ id: fromId, username: fromUsername, points: 0, role: specifiedRole });
        await db.write();
        bot.sendMessage(msg.chat.id, `Welcome ${fromUsername}! You have been enrolled as ${specifiedRole}.`);
        return;
    }

    // If the user exists but is not a 'member' or higher, upgrade them to 'member'
    const currentRoleLevel = getRoleLevel(fromUser.role, db);
    const newRoleLevel = getRoleLevel(specifiedRole, db);
    
    if (currentRoleLevel < newRoleLevel) {
        fromUser.role = specifiedRole;
        await db.write();
        bot.sendMessage(msg.chat.id, `Congratulations ${fromUsername}! Your role has been upgraded to ${specifiedRole}.`);
    } else {
        // If the user already has 'member' role or higher, inform them without changing their role
        bot.sendMessage(msg.chat.id, `You are already enrolled with a role of ${fromUser.role}. No changes were made.`);
    }
};
