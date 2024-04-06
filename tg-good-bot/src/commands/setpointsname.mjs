// commands/setpointsname.mjs
import { isOwnerOrAdmin } from '../utils/roleChecks.mjs';

export const setPointsNameCommand = (msg, bot, db) => {
  const fromId = msg.from.id;
  const fromUser = db.data.users.find(user => user.id === fromId);

  if (!isOwnerOrAdmin(fromUser, db)) {
      return bot.sendMessage(msg.chat.id, "You're not authorized to perform this action.");
  }

  const match = msg.text.match(/\/setpointsname (.+)/);
  if (!match) return bot.sendMessage(msg.chat.id, "Invalid command format.");

  const [, newPointsName] = match;

  // Update points name in the database
  db.data.pointsName = newPointsName;
  db.write();

  bot.sendMessage(msg.chat.id, `Points name updated to ${newPointsName}`);
};