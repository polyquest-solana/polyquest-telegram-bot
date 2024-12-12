import { phantomWalletPublicKey } from "../config/config";
import { successTransaction } from "../config/config";

export class ConnectionService {
    private static userConnections = new Map<number, boolean>();

    static isUserConnected(userId: number): boolean {
        return this.userConnections.has(userId);
    }

    static setUserConnected(userId: number) {
        this.userConnections.set(userId, true);
    }

    static async checkConnection(callback: () => void) {
        if (phantomWalletPublicKey) {
            callback();
        } else {
            setTimeout(() => this.checkConnection(callback), 500);
        }
    }

    static async checkTransaction(callback: () => void) {
        if (successTransaction) {
            callback();
        } else {
            setTimeout(() => this.checkTransaction(callback), 500);
        }
    }
}
