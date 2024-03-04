// commands/role.mjs
export const roleCommand = (msg, bot, db) => {
  const match = msg.text.match(/\/role (@\w+)/);
  if (!match) return bot.sendMessage(msg.chat.id, "Invalid command format.");

  const [, username] = match;
  const user = db.data.users.find(user => user.username === username.replace('@', ''));
  if (!user) {
      return bot.sendMessage(msg.chat.id, `User ${username} not found.`);
  }

  bot.sendMessage(msg.chat.id, `Role of ${username}: ${user.role}`);
};
