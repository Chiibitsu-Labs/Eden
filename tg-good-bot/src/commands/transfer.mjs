// src/commands/transfer.mjs
import { adjustUserPoints } from '../utils/userOps.mjs';

export const transferCommand = async (msg, bot, db) => {
    const match = msg.text.match(/\/transfer (@\w+) (\d+)/);
    if (!match) {
        return bot.sendMessage(msg.chat.id, "Invalid command format. Use: /transfer @username points");
    }
    const [, username, pointsStr] = match;
    const points = parseInt(pointsStr, 10);
    const fromUser = db.data.users.find(user => user.id === msg.from.id);

    if (!fromUser || fromUser.points < points || isNaN(points) || points <= 0) {
        return bot.sendMessage(msg.chat.id, "You do not have enough points or invalid points value.");
    }

    const success = await adjustUserPoints(username.replace('@', ''), points, db);
    if (success) {
        fromUser.points -= points; // Deduct points from the sender
        await db.write(); // Ensure the database is updated
        bot.sendMessage(msg.chat.id, `You've successfully transferred ${points} points to ${username}.`);
    } else {
        bot.sendMessage(msg.chat.id, `Failed to transfer points. User ${username} not found.`);
    }
};
