export type Quest = {
    id: number;
    title: string;
    description: string;
    relevantLink: string;
    creatorFeePercent: number;
    serviceFeePercent: number;
    startDate: string;
    endDate: string;
    creatorAddress: string;
    tokenId: number;
    categoryId: number | null;
    adjournDate: string | null;
    adjournTx: string | null;
    adjournReason: string | null;
    approveDate: string;
    approveTx: string;
    finishDate: string;
    finishTx: string;
    answerTx: string;
    draftTime: string;
    draftTx: string;
    imageUrl: string;
    finalAnswerId: number | null;
    totalAmount: number;
    voteCount: number;
    minBetAmount: number;
    successTx: string | null;
    successTime: string | null;
    hot: boolean;
    hidden: boolean;
    active: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
    answers: Array<{ title: string; percent: number; totalAmount: number; id: number }>;
    category: any | null;
    token: {
        id: number;
        address: string;
        symbol: string;
        name: string;
        decimals: number;
        imageUrl: string;
        isActive: boolean;
        createdAt: string;
        updatedAt: string;
    };
};

export interface FormattedQuestData {
    caption: string;
    imageUrl: string;
    tokenSymbol: string;
}