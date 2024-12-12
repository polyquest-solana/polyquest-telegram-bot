import { Context, Markup } from 'telegraf';
import { InlineKeyboardButton, Update } from '@telegraf/types';
import { LoggerService } from '../../services/loggerService';
import { connect } from '../utils/botUtils';
import { Handler } from '../../lib/actions';
import { phantomWalletPublicKey, successTransaction } from '../../config/config';
import { PhantomService } from '../../services/phantomService';
import { QuestService } from '../../services/QuestService';
import { MessageService } from '../../services/MessageService';
import { ConnectionService } from '../../services/ConnectionService';
const phantomService = new PhantomService();
export async function handleGetQuest(ctx: Context<Update>, userId: number) {
    LoggerService.log(`Processing /getquest command for user: ${userId}`, 'info');

    const data = await Handler();
    if (!data) {
        LoggerService.log('Failed to fetch quest data', 'error');
        return;
    }

    LoggerService.log(`Quest data fetched successfully for quest ID: ${data.id}`, 'info');

    if (!ConnectionService.isUserConnected(userId)) {
        const url = await connect();
        const msg = await MessageService.sendInitialMessage(ctx, url, data);

        if (data) {
            await ConnectionService.checkConnection(async () => {
                const buttons = await QuestService.getQuestButtons(data, phantomService);
                await MessageService.updateMessageWithButtons(ctx, msg, data, buttons);
                ConnectionService.setUserConnected(userId);
            });

            await ConnectionService.checkTransaction(async () => {
                await MessageService.sendSuccessMessage(ctx, msg);
            });
        }
    } else {
        const buttons = await QuestService.getQuestButtons(data, phantomService);
        const msg = await MessageService.sendInitialMessage(ctx, '', data);
        await MessageService.updateMessageWithButtons(ctx, msg, data, buttons);
    }
} 