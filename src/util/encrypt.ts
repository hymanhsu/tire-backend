import crypto from "crypto"

/**
 * encrypt string with md5
 * @param text 
 * @returns  hex string
 */
export function md5_string(text: string): string {
    return crypto.createHash("md5").update(text).digest("hex");
}

const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);

export type Encryped = {
    iv: string;
    encrypted: string;
};

/**
 * encrypt string with AES
 * @param text 
 * @returns 
 */
export function aes_encrypt(text: string): Encryped {
    const iv = crypto.randomBytes(16);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encrypted: encrypted.toString('hex') };
}

/**
 * decrypt string with AES
 * @param text 
 * @returns 
 */
export function aes_decrypt(text: Encryped): string {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encrypted, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

