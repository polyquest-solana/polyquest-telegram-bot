import base58 from 'bs58';
import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { Transaction } from '@solana/web3.js';
import { LoggerService } from './loggerService';
import { dappKeyPair } from '../bot/utils/botUtils';
import { buildUrl } from '../bot/utils/botUtils';
import { decryptPayload, encryptPayload } from '../bot/handlers/payLoadHandler';
import { phantomWalletPublicKey, session } from '../config/config';
import { handleSuccessTransaction } from '../bot/handlers/transactionHandler';

export class PhantomService {
    async signTransaction(amount: number) {
        LoggerService.log(`Initiating transaction signing for amount: ${amount}`, 'info');

        try {
            const transactionData = await this.fetchTransactionData(amount);
            const serializedTransaction = this.prepareTransaction(transactionData);
            return this.buildTransactionUrl(serializedTransaction);
        } catch (error) {
            LoggerService.log(`Transaction signing failed: ${error}`, 'error');
            throw error;
        }
    }

    async processCallback(params: {
        phantomPublicKey: string,
        nonce: string,
        data: string,
        dappSecret: string
    }) {
        const { phantomPublicKey, nonce, data, dappSecret } = params;

        const dappSecretKey = bs58.decode(dappSecret);
        const dappKeyPair = nacl.box.keyPair.fromSecretKey(dappSecretKey);
        const sharedSecretDapp = nacl.box.before(
            bs58.decode(phantomPublicKey),
            dappKeyPair.secretKey
        );

        const connectData = await decryptPayload(data, nonce, sharedSecretDapp);

        return {
            sharedSecret: Buffer.from(sharedSecretDapp).toString('base64'),
            phantomWalletPublicKey: connectData.public_key.toString(),
            session: connectData.session,
            dappSecret,
            phantomPublicKeyEncryp: phantomPublicKey
        };
    }

    async processSuccessTransaction(params: {
        data: string,
        nonce: string,
        dappSecret: string,
        phantomPublicKeyEncryp: string
    }) {
        return handleSuccessTransaction(
            params.data,
            params.nonce,
            params.dappSecret,
            params.phantomPublicKeyEncryp
        );
    }

    private async fetchTransactionData(amount: number) {
        const url = 'https://polyquest.xyz/api/actions/bettings/sol';
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                account: phantomWalletPublicKey,
                data: { questId: 100, answerId: 201, amount }
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        return await response.json();
    }

    private prepareTransaction(data: any) {
        const transactionBuffer = Buffer.from(data.encodedTx, "base64");
        return bs58.encode(transactionBuffer);
    }

    private buildTransactionUrl(serializedTransaction: string) {
        if (!session) throw new Error("missing or invalid session");

        const payload = { session, transaction: serializedTransaction };
        const redirectLink = encodeURI(`https://subtly-native-skylark.ngrok-free.app/success`);
        const [nonce, encryptedPayload] = encryptPayload(payload);

        const params = new URLSearchParams({
            dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
            nonce: bs58.encode(nonce),
            redirect_link: redirectLink,
            payload: bs58.encode(encryptedPayload),
        });

        return buildUrl("signAndSendTransaction", params);
    }
} 