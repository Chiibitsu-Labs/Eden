// commands/role.mjs
export const roleCommand = (msg, bot, db) => {
  const user = db.data.users.find(user => user.id === msg.from.id);
  if (!user) {
      return bot.sendMessage(msg.chat.id, "You're not registered.");
  }

  bot.sendMessage(msg.chat.id, `Your role: ${user.role}`);
};
