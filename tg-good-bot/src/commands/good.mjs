// src/commands/good.mjs
export const goodCommand = (msg, bot, db) => {
  const chatId = msg.chat.id.toString();
  const match = msg.text.match(/\/good(?:\s+@(\w+))?/);
  let targetUsername = match && match[1] ? match[1] : msg.from.username;

  // Ensure community exists in db
  if (!db.data.communities[chatId]) {
    return bot.sendMessage(msg.chat.id, "This community has no data.");
  }

  const user = db.data.communities[chatId].users.find(user => user.username === targetUsername);
  if (user) {
      bot.sendMessage(msg.chat.id, `${targetUsername}'s points: ${user.points}`);
  } else {
      bot.sendMessage(msg.chat.id, `${targetUsername} hasn't been added to the system yet.`);
  }
};

