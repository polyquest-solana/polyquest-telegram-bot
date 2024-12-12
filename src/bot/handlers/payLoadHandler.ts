import bs58 from 'bs58';
import nacl from 'tweetnacl';
import { Buffer } from "buffer";

let sharedSecret: Uint8Array | undefined;
const encryptPayload = (payload: any) => {

    if (sharedSecret === undefined)
        throw new Error("missing or invalid shared secret");

    const nonce = nacl.randomBytes(24);

    const encryptedPayload = nacl.box.after(
        Buffer.from(JSON.stringify(payload)),
        nonce,
        sharedSecret
    );

    return [nonce, encryptedPayload];
};

const decryptPayload = (data: string, nonce: string, sharedSecret: Uint8Array) => {
    if (!sharedSecret) throw new Error("Missing shared secret");

    try {
        // Decode data and nonce from base58 strings
        const decodedData = bs58.decode(data);
        const decodedNonce = bs58.decode(nonce);

        console.log('sharedSecret:', sharedSecret);
        console.log('decoded data:', decodedData);
        console.log('decoded nonce:', decodedNonce);

        // Attempt to decrypt the data
        const decryptedData = nacl.box.open.after(decodedData, decodedNonce, sharedSecret);

        if (!decryptedData) {
            console.error("Decryption failed. Data or nonce might be incorrect.");
            throw new Error("Unable to decrypt data");
        }

        return JSON.parse(Buffer.from(decryptedData).toString("utf8"));
    } catch (error) {
        console.error("An error occurred during decryption:", error);
        throw new Error("Failed to decrypt payload");
    }
};

export { encryptPayload, decryptPayload };