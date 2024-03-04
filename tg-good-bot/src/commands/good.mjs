// src/commands/good.mjs
export const goodCommand = (msg, bot, db) => {
  const userId = msg.from.id;
  const user = db.data.users.find(user => user.id === userId);
  if (user) {
      bot.sendMessage(msg.chat.id, `Your $GOOD points: ${user.points}`);
  } else {
      bot.sendMessage(msg.chat.id, "You haven't been added to the system yet.");
  }
};