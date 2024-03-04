// src/commands/give.mjs
import { isOwnerOrAdmin } from '../utils/roleChecks.mjs';
import { adjustUserPoints } from '../utils/userOps.mjs';

export const giveCommand = async (msg, bot, db) => {
    const fromId = msg.from.id;
    const fromUser = db.data.users.find(user => user.id === fromId);

    // Extract username and points from the message text
    const match = msg.text.match(/\/give (@\w+) (\d+)/);
    if (!match) return bot.sendMessage(msg.chat.id, "Invalid command format.");
    const [, username, pointsStr] = match;
    const points = parseInt(pointsStr, 10);

    if (!isOwnerOrAdmin(fromUser, db) || isNaN(points)) {
        return bot.sendMessage(msg.chat.id, "You're not authorized or invalid points.");
    }

    const success = await adjustUserPoints(username.replace('@', ''), points, db, 'give');
    if (success) {
        bot.sendMessage(msg.chat.id, `Successfully gave ${points} GOOD points to ${username}.`);
    } else {
        bot.sendMessage(msg.chat.id, `Failed to give points. User ${username} not found.`);
    }
};