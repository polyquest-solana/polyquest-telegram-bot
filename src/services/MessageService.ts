import { Context } from "telegraf";
import { Markup } from "telegraf";
import { QuestService } from "./QuestService";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";

export class MessageService {
    static async sendInitialMessage(ctx: Context, url: string, questData: any) {
        const { caption, imageUrl } = await QuestService.formatQuestData(questData);

        return ctx.replyWithPhoto(
            { url: imageUrl },
            {
                caption,
                parse_mode: "Markdown",
                ...Markup.inlineKeyboard([
                    Markup.button.url("Please connect Phantom Wallet", url),
                ])
            }
        );
    }

    static async updateMessageWithButtons(
        ctx: Context,
        msg: any,
        questData: any,
        buttons: InlineKeyboardButton[][]
    ) {
        const { caption } = await QuestService.formatQuestData(questData);

        await ctx.telegram.editMessageCaption(
            msg.chat.id,
            msg.message_id,
            undefined,
            caption,
            {
                parse_mode: "Markdown",
                ...Markup.inlineKeyboard(buttons),
            }
        );
    }

    static async sendSuccessMessage(ctx: Context, msg: any) {
        await ctx.telegram.editMessageCaption(
            msg.chat.id,
            msg.message_id,
            undefined,
            `${ctx.from?.first_name || ctx.from?.username} has placed a bet successfully`,
            {
                parse_mode: "Markdown",
                ...Markup.inlineKeyboard([
                    Markup.button.url("View Result", "https://polyquest.xyz")
                ]),
            }
        );
    }
}
