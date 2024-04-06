// commands/setpointsname.mjs
import { isOwnerOrAdmin } from '../utils/roleChecks.mjs';

export const setPointsNameCommand = (msg, bot, db) => {
  const chatId = msg.chat.id.toString();
  const fromUser = db.data.communities[chatId].users.find(user => user.id === msg.from.id);

  if (!isOwnerOrAdmin(fromUser, db, chatId)) {
    return bot.sendMessage(msg.chat.id, "You're not authorized to perform this action.");
  }

  const [, newPointsName] = msg.text.match(/\/setpointsname (.+)/) || [];
  db.data.communities[chatId].pointsName = newPointsName;
  db.write();
  bot.sendMessage(msg.chat.id, `Points name updated to ${newPointsName} for this community.`);
};
