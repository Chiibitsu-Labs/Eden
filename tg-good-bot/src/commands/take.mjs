// src/commands/take.mjs
import { adjustUserPoints } from '../utils/userOps.mjs';
import { isOwnerOrAdmin } from '../utils/roleChecks.mjs';

export const takeCommand = async (msg, bot, db) => {
    const match = msg.text.match(/\/take (@\w+) (\d+)/);
    if (!match) {
        return bot.sendMessage(msg.chat.id, "Invalid command format. Use: /take @username points");
    }
    const [, username, pointsStr] = match;
    const points = -parseInt(pointsStr, 10); // Make points negative for subtraction
    const fromUser = db.data.users.find(user => user.id === msg.from.id);

    if (!isOwnerOrAdmin(fromUser, db) || isNaN(points) || points >= 0) {
        return bot.sendMessage(msg.chat.id, "You're not authorized or invalid points value.");
    }

    const success = await adjustUserPoints(username.replace('@', ''), points, db);
    if (success) {
        bot.sendMessage(msg.chat.id, `Successfully took ${Math.abs(points)} points from ${username}.`);
    } else {
        bot.sendMessage(msg.chat.id, `Failed to take points. User ${username} not found.`);
    }
};
