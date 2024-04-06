// commands/top.mjs
export const topCommand = (msg, bot, db) => {
  const chatId = msg.chat.id.toString();
  if (!db.data.communities[chatId]) {
    return bot.sendMessage(msg.chat.id, "This community has no leaderboard data.");
  }

  const leaderboard = db.data.communities[chatId].users
      .sort((a, b) => b.points - a.points)
      .map((user, index) => `${index + 1}. ${user.username || 'Anonymous'}: ${user.points} points`)
      .join('\n');

  bot.sendMessage(msg.chat.id, leaderboard || "Leaderboard is empty.");
};
