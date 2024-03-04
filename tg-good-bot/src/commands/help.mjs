// src/commands/help.mjs
export const helpCommand = (msg, bot) => {
  const helpText = `
  Here are the commands you can use:
  /start - Start interacting with the bot
  /good - Check your $GOOD points balance
  /give @username points - Admins can give points to users
  /take @username points - Admins can take points from users
  /transfer @username points - Transfer points to another member
  /top - View the leaderboard
  /role - Check your role
  /mydata - Check your user data
  /enroll - Upgrade your role from user to member
  /help - Display this help message

  More features coming soon!
  `;
  bot.sendMessage(msg.chat.id, helpText);
};