// commands/top.mjs
export const topCommand = (msg, bot, db) => {
  const leaderboard = db.data.users
      .filter(user => user.points > 0)
      .sort((a, b) => b.points - a.points)
      .slice(0, 10) // Show top 10 users
      .map((user, index) => `${index + 1}. ${user.username || 'Anonymous'}: ${user.points} points`)
      .join('\n');

  bot.sendMessage(msg.chat.id, leaderboard || "Leaderboard is empty.");
};