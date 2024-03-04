// commands/transfer.mjs
import { adjustUserPoints } from '../utils/userOps.mjs';

export const transferCommand = async (msg, bot, db) => {
    const match = msg.text.match(/\/transfer (@\w+) (\d+)/);
    if (!match) return bot.sendMessage(msg.chat.id, "Invalid command format.");
    const [, username, pointsStr] = match;
    const points = parseInt(pointsStr, 10);

    const fromUser = db.data.users.find(user => user.id === msg.from.id);
    if (!fromUser) return bot.sendMessage(msg.chat.id, "Sender not found.");

    if (fromUser.points < points) {
        return bot.sendMessage(msg.chat.id, "You do not have enough points.");
    }

    const success = await adjustUserPoints(username.replace('@', ''), points, db, 'transfer', fromUser.username);
    if (success) {
        // Deduct points from the sender only if the transfer was successful
        fromUser.points -= points;
        bot.sendMessage(msg.chat.id, `You've successfully transferred ${points} GOOD points to ${username}.`);
    } else {
        bot.sendMessage(msg.chat.id, `Failed to transfer points. User ${username} not found.`);
    }
};
