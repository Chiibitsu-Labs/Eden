// commands/top.mjs
export const topCommand = (msg, bot, db) => {
  const leaderboard = db.data.users
      .sort((a, b) => b.points - a.points)
      .map((user, index) => `${index + 1}. ${user.username || 'Anonymous'}: ${user.points} points`)
      .join('\n');

  bot.sendMessage(msg.chat.id, leaderboard || "Leaderboard is empty.");
};
