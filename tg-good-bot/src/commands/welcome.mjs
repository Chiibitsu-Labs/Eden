// commands/welcome.mjs
import { isOwnerOrAdmin } from '../utils/roleChecks.mjs';

export const setWelcomeMessageCommand = async (msg, bot, db) => {
  const chatId = msg.chat.id.toString();
  if (!isOwnerOrAdmin(msg.from.id, db, chatId)) {
      bot.sendMessage(msg.chat.id, "You're not authorized to set the welcome message.");
      return;
  }

  const welcomeMessage = msg.text.split(' ').slice(1).join(' ');
  db.data.communities[chatId].welcomeMessage = welcomeMessage;
  await db.write();
  bot.sendMessage(msg.chat.id, "Welcome message updated successfully for this community.");
};
