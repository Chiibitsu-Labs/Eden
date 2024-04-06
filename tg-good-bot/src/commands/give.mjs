// src/commands/give.mjs
import { isOwnerOrAdmin } from '../utils/roleChecks.mjs';
import { adjustUserPoints } from '../utils/userOps.mjs';

export const giveCommand = async (msg, bot, db) => {
    const match = msg.text.match(/\/give (@\w+) (\d+)/);
    if (!match) {
        return bot.sendMessage(msg.chat.id, "Invalid command format. Use: /give @username points");
    }
    const [, username, pointsStr] = match;
    const points = parseInt(pointsStr, 10);
    const fromUser = db.data.users.find(user => user.id === msg.from.id);

    if (!isOwnerOrAdmin(fromUser, db) || isNaN(points) || points <= 0) {
        return bot.sendMessage(msg.chat.id, "You're not authorized or invalid points value.");
    }

    const success = await adjustUserPoints(username.replace('@', ''), points, db);
    if (success) {
        bot.sendMessage(msg.chat.id, `Successfully gave ${points} points to ${username}.`);
    } else {
        bot.sendMessage(msg.chat.id, `Failed to give points. User ${username} not found.`);
    }
};
