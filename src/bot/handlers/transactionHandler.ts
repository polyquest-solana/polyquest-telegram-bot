import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { Transaction } from '@solana/web3.js';
import { LoggerService } from '../../services/loggerService';
import { decryptPayload } from './payLoadHandler';

export async function handleSuccessTransaction(data: string, nonce: string, dapp_serecet: string, phantomPubicKeyEncryp: string) {

    // const fetch = (await import('node-fetch')).default;
    const dappSecretKey = bs58.decode(dapp_serecet);
    const dappKeyPair = nacl.box.keyPair.fromSecretKey(dappSecretKey);

    const sharedSecretDapp = nacl.box.before(
        bs58.decode(phantomPubicKeyEncryp),
        dappKeyPair.secretKey
    );

    const connectData = await decryptPayload(data, nonce, sharedSecretDapp);
    const transaction: Transaction = Transaction.from(bs58.decode(connectData.transaction));

    const dataVoting = {
        data: {
            bettingId: 219,
            signedTx: transaction.serialize().toString('base64'),
        },
    };

    LoggerService.log(`dataVoting: ${JSON.stringify(dataVoting)}`, 'info');

    return fetch("https://devnet.polyquest.xyz/api/actions/bettings/sol/confirm", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataVoting),
    });
}
