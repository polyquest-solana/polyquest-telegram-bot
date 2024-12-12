export class PhantomStateService {
    private static instance: PhantomStateService;
    
    private sharedSecret?: Uint8Array;
    private session?: string;
    private phantomWalletPublicKey?: string;
    private successTransaction?: string;
    private dappSecret?: string;
    private phantomPublicKeyEncryp?: string;

    private constructor() {}

    static getInstance(): PhantomStateService {
        if (!PhantomStateService.instance) {
            PhantomStateService.instance = new PhantomStateService();
        }
        return PhantomStateService.instance;
    }

    // Getters and setters
    setCallbackData(data: {
        sharedSecret: string,
        session: string,
        phantomWalletPublicKey: string,
        dappSecret: string,
        phantomPublicKeyEncryp: string
    }) {
        this.sharedSecret = Uint8Array.from(atob(data.sharedSecret), c => c.charCodeAt(0));
        this.session = data.session;
        this.phantomWalletPublicKey = data.phantomWalletPublicKey;
        this.dappSecret = data.dappSecret;
        this.phantomPublicKeyEncryp = data.phantomPublicKeyEncryp;
    }

    getTransactionData() {
        return {
            dappSecret: this.dappSecret,
            phantomPublicKeyEncryp: this.phantomPublicKeyEncryp
        };
    }
} 