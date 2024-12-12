import nacl from 'tweetnacl';
import bs58 from 'bs58';
import { LoggerService } from '../../services/loggerService';
import { CLUSTER, useUniversalLinks } from './constants';
import dotenv from 'dotenv';

dotenv.config();
export const dappKeyPair = nacl.box.keyPair();

export const buildUrl = (path: string, params: URLSearchParams) =>
    `${useUniversalLinks ? "https://phantom.app/ul/" : "phantom://"
    }v1/${path}?${params.toString()}`;

export const connect = async (): Promise<string> => {
    LoggerService.log(`Generating connect URL`, 'info');
    const dappEncryptionSecretKey = bs58.encode(dappKeyPair.secretKey);
    const redirectLink = `https://polyquest.xyz/bot/callback?dapp_encryption_secret_key=${dappEncryptionSecretKey}`;

    const params = new URLSearchParams({
        dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
        cluster: CLUSTER,
        app_url: process.env.APP_URL as string,
        redirect_link: redirectLink,
    });

    const url = buildUrl("connect", params);
    LoggerService.log(`Generated params: ${params}`, 'info');
    LoggerService.log(`Generated URL: ${url}`, 'info');
    return url;
};