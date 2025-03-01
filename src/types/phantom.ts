import { PublicKey, Transaction, SendOptions } from '@solana/web3.js';

type DisplayEncoding = 'utf8' | 'hex';

type PhantomEvent = 'connect' | 'disconnect' | 'accountChanged';

type PhantomRequestMethod =
    | 'connect'
    | 'disconnect'
    | 'signAndSendTransaction'
    | 'signTransaction'
    | 'signAllTransactions'
    | 'signMessage';

interface ConnectOpts {
    onlyIfTrusted: boolean;
}
export interface PhantomProvider {
    publicKey: PublicKey | null;
    isConnected: boolean | null;
    signAndSendTransaction: (
        transaction: Transaction,
        opts?: SendOptions
    ) => Promise<{ signature: string; publicKey: PublicKey }>;
    signTransaction: (transaction: Transaction) => Promise<Transaction>;
    signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
    signMessage: (message: Uint8Array | string, display?: DisplayEncoding) => Promise<any>;
    connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
    disconnect: () => Promise<void>;
    on: (event: PhantomEvent, handler: (args: any) => void) => void;
    request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
}

export interface CallbackParams {
    phantomPublicKey: string;
    nonce: string;
    data: string;
    dappSecret: string;
}

export interface SuccessParams {
    data: string;
    nonce: string;
    dappSecret: string;
    phantomPublicKeyEncryp: string;
}

export interface CallbackResult {
    sharedSecret: string;
    phantomWalletPublicKey: string;
    session: string;
    dappSecret: string;
    phantomPublicKeyEncryp: string;
}

