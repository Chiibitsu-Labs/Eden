import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import { initDb } from './db/db.mjs';
import { startCommand } from './commands/start.mjs';
import { helpCommand } from './commands/help.mjs';
import { goodCommand } from './commands/good.mjs';
import { enrollCommand } from './commands/enroll.mjs';
import { giveCommand } from './commands/give.mjs';
import { takeCommand } from './commands/take.mjs';
import { transferCommand } from './commands/transfer.mjs';
import { topCommand } from './commands/top.mjs';
import { roleCommand } from './commands/role.mjs';
import { mydataCommand } from './commands/mydata.mjs';
import { deleteUserCommand } from './commands/deleteUser.mjs';
import { setPointsNameCommand } from './commands/setpointsname.mjs';
import { setWelcomeMessageCommand } from './commands/welcome.mjs';

const token = process.env.TG_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

(async () => {
    const db = await initDb();

    bot.onText(/\/start/, (msg) => startCommand(msg, bot, db));
    bot.onText(/\/help/, (msg) => helpCommand(msg, bot));
    bot.onText(/\/good/, (msg) => goodCommand(msg, bot, db));
    bot.onText(/\/enroll/, (msg) => enrollCommand(msg, bot, db));
    bot.onText(/\/give/, (msg) => giveCommand(msg, bot, db));
    bot.onText(/\/take/, (msg) => takeCommand(msg, bot, db));
    bot.onText(/\/transfer/, (msg) => transferCommand(msg, bot, db));
    bot.onText(/\/top/, (msg) => topCommand(msg, bot, db));
    bot.onText(/\/role/, (msg) => roleCommand(msg, bot, db));
    bot.onText(/\/mydata/, (msg) => mydataCommand(msg, bot, db));
    bot.onText(/\/delete (@\w+)/, (msg) => deleteUserCommand(msg, bot, db));
    bot.onText(/\/setpointsname (.+)/, (msg) => setPointsNameCommand(msg, bot, db));
    bot.onText(/\/welcome (.+)/, (msg) => setWelcomeMessageCommand(msg, bot, db));

    // Set up command listeners
    bot.onText(/\/start/, (msg) => startCommand(msg, bot, db));
    // Add other command listeners here

    // Listen for new chat members
    bot.on('message', (msg) => {
        if (msg.new_chat_members && msg.new_chat_members.length > 0) {
            // Fetch welcome message from database or use a default message
            const welcomeMessage = db.data.welcomeMessage || "Welcome! Type /start to get started and /enroll to join the rewards program.";
            bot.sendMessage(msg.chat.id, welcomeMessage);
        }
    });    
    
})();