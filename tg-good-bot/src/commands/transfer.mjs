// src/commands/transfer.mjs
import { adjustUserPoints } from '../utils/userOps.mjs';

export const transferCommand = async (msg, bot, db) => {
    const chatId = msg.chat.id.toString(); // Community-specific identifier
    const [, username, pointsStr] = msg.text.match(/\/transfer (@\w+) (\d+)/) || [];
    const points = parseInt(pointsStr, 10);

    if (!username || isNaN(points)) {
        return bot.sendMessage(msg.chat.id, "Correct format: /transfer @username points");
    }

    const fromUser = db.data.communities[chatId].users.find(user => user.id === msg.from.id);

    if (fromUser.points < points) {
        return bot.sendMessage(msg.chat.id, "You do not have enough points.");
    }

    const success = await adjustUserPoints(username.replace('@', ''), points, db, chatId);
    if (success) {
        await adjustUserPoints(fromUser.username, -points, db, chatId); // Deduct points from the sender
        bot.sendMessage(msg.chat.id, `You've successfully transferred ${points} points to ${username}.`);
    } else {
        bot.sendMessage(msg.chat.id, "Failed to transfer points. User not found.");
    }
};
