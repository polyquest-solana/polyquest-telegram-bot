import { Telegraf, Markup, Context } from 'telegraf';
import { message } from 'telegraf/filters';
import { LoggerService } from '../services/loggerService';
import { handleGetQuest } from './handlers/messageHandler';
import { Update } from '@telegraf/types';
import dotenv from 'dotenv';

dotenv.config();
const bot: Telegraf<Context<Update>> = new Telegraf(
    process.env.BOT_TOKEN as string,
    {
        telegram: {
            apiRoot: process.env.TELEGRAM_API as string,
            agent: undefined,
            webhookReply: true,
        },
    }
);

setTimeout(() => {
    bot.telegram.callApi("getMe", {});
}, 30000);


bot.on(message('text'), async (ctx) => {
    LoggerService.log(`Received message: ${ctx.message.text}`, 'info');
    const messageText = ctx.message.text;

    if (messageText.startsWith("/getquest")) {
        const userId = ctx.from.id;
        await handleGetQuest(ctx, userId);
    }
});

export const launchBot = () => {
    bot.launch();
    LoggerService.log(`Bot has been launched!`, 'info');

    process.once("SIGINT", () => bot.stop("SIGINT"));
    process.once("SIGTERM", () => bot.stop("SIGTERM"));
};