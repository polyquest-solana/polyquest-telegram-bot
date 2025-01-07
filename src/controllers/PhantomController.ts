import { Request, Response } from 'express';
import { PhantomService } from '../services/phantomService';
import { handleSuccessTransaction } from '../bot/handlers/transactionHandler';
import { LoggerService } from '../services/loggerService';
import { PhantomStateService } from '../services/PhantomStateService';

export class PhantomController {
    private static phantomService = new PhantomService();
    private static stateService = PhantomStateService.getInstance();

    static async handleCallback(req: Request, res: Response) {
        try {
            const { phantom_encryption_public_key, nonce, data, dapp_encryption_secret_key } = req.query;
            console.log(phantom_encryption_public_key, nonce, data, dapp_encryption_secret_key);
            // Validation
            if (!this.validateCallbackParams(phantom_encryption_public_key, nonce, data, dapp_encryption_secret_key)) {
                LoggerService.log('Invalid callback parameters', 'error');
                return res.status(400).json({ error: 'Invalid parameters' });
            }

            // Delegate business logic to service
            const result = await this.phantomService.processCallback({
                phantomPublicKey: phantom_encryption_public_key as string,
                nonce: nonce as string,
                data: data as string,
                dappSecret: dapp_encryption_secret_key as string
            });

            // Store state
            this.stateService.setCallbackData(result);

            LoggerService.log(`Callback processed for wallet: ${result.phantomWalletPublicKey}`, 'info');
            //http://t.me/migrateT3stingbot
            res.redirect("tg://resolve?domain=migrateT3stingbot");
        } catch (error) {
            LoggerService.log(`Callback error: ${error}`, 'error');
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    static async handleSuccess(req: Request, res: Response) {
        try {
            const { data, nonce } = req.query;
            const stateData = this.stateService.getTransactionData();

            if (!this.validateSuccessParams(data, nonce, stateData)) {
                LoggerService.log('Invalid success parameters', 'error');
                return res.status(400).json({ error: 'Invalid parameters' });
            }

            await this.phantomService.processSuccessTransaction({
                data: data as string,
                nonce: nonce as string,
                dappSecret: stateData.dappSecret as string,
                phantomPublicKeyEncryp: stateData.phantomPublicKeyEncryp as string
            });

            res.redirect("tg://resolve?domain=migrateT3stingbot");
        } catch (error) {
            LoggerService.log(`Success handling error: ${error}`, 'error');
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    private static validateCallbackParams(
        phantom_encryption_public_key: any,
        nonce: any,
        data: any,
        dapp_encryption_secret_key: any
    ): boolean {
        console.log(typeof dapp_encryption_secret_key, typeof phantom_encryption_public_key, typeof nonce, typeof data);
        return typeof dapp_encryption_secret_key === 'string' &&
            typeof phantom_encryption_public_key === 'string' &&
            typeof nonce === 'string' &&
            typeof data === 'string';
    }

    private static validateSuccessParams(
        data: any,
        nonce: any,
        stateData: any
    ): boolean {
        return typeof data === 'string' &&
            typeof nonce === 'string' &&
            stateData.dappSecret &&
            stateData.phantomPublicKeyEncryp;
    }
} 