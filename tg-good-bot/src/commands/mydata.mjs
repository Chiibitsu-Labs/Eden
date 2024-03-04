// src/commands/mydata.mjs
export const mydataCommand = (msg, bot, db) => {
  const user = db.data.users.find(user => user.id === msg.from.id);
  if (!user) {
      return bot.sendMessage(msg.chat.id, "You're not registered.");
  }

  const userData = `
      Username: ${user.username || 'N/A'}
      Role: ${user.role}
      Points: ${user.points}
  `;
  bot.sendMessage(msg.chat.id, userData.trim());
};