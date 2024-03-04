// commands/start.mjs
export const startCommand = async (msg, bot, db) => {
  const userId = msg.from.id;
  const userExists = db.data.users.find(user => user.id === userId);
  if (!userExists) {
      const newUser = { id: userId, points: 0, role: 'user', username: msg.from.username || 'N/A' };
      db.data.users.push(newUser);
      await db.write();
      bot.sendMessage(msg.chat.id, "You've been added as a new user. Use /enroll to join the community rewards program!");
  } else {
      if (!userExists.username && msg.from.username) {
          userExists.username = msg.from.username;
          await db.write();
      }
      bot.sendMessage(msg.chat.id, "Hello again! Use /help to see all commands.");
  }
};