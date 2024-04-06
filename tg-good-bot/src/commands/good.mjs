// src/commands/good.mjs
export const goodCommand = (msg, bot, db) => {
  const match = msg.text.match(/\/good(?:\s+@(\w+))?/);
  let targetUsername = match && match[1] ? match[1] : msg.from.username;

  const user = db.data.users.find(user => user.username === targetUsername);
  if (user) {
      bot.sendMessage(msg.chat.id, `${targetUsername}'s $GOOD points: ${user.points}`);
  } else {
      bot.sendMessage(msg.chat.id, `${targetUsername} hasn't been added to the system yet.`);
  }
};
