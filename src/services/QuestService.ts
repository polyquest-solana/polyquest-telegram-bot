import { Markup } from "telegraf";
import { PhantomService } from "./phantomService";
import { InlineKeyboardButton } from "telegraf/typings/core/types/typegram";

export class QuestService {
    static async formatQuestData(data: any) {
        const {
            title,
            description,
            imageUrl,
            answers,
            totalAmount: totalAmountQuest,
            token
        } = data;

        const { symbol: tokenSymbol, decimals: tokenDecimals } = token;

        const totalAmount = answers.reduce((sum: number, answer: any) =>
            sum + answer.totalAmount, 0) / (10 ** tokenDecimals);

        const answersDescription = answers.map((answer: any) =>
            `${answer.title} : ${(answer.percent * 100).toFixed(1)}% (${answer.totalAmount} ${tokenSymbol})`
        ).join('\n');

        return {
            caption: `${title}\n\nPredicted so far: ${totalAmountQuest} ${tokenSymbol}\n\n${answersDescription}`,
            imageUrl,
            tokenSymbol
        };
    }

    static async getQuestButtons(data: any, phantomService: PhantomService): Promise<InlineKeyboardButton[][]> {
        const buttons: InlineKeyboardButton[][] = [];

        for (const answer of data.answers) {
            const url = await phantomService.signTransaction(1);
            if (url) {
                buttons.push([Markup.button.url(answer.title, url)]);
            }
        }

        return buttons;
    }
}
