import Crypto from 'crypto-js';

export default {
  encrypt(secret: string, word: string) {
    const key = Crypto.enc.Utf8.parse(secret);
    const parsed = Crypto.enc.Utf8.parse(word);
    const encrypted = Crypto.AES.encrypt(parsed, key, {
      mode: Crypto.mode.ECB,
      padding: Crypto.pad.Pkcs7,
    });
    return encrypted.toString();
  },
  decrypt(password: string, word: string) {
    const key = Crypto.enc.Utf8.parse(password);
    const decrypt = Crypto.AES.decrypt(word, key, {
      mode: Crypto.mode.ECB,
      padding: Crypto.pad.Pkcs7,
    });
    return Crypto.enc.Utf8.stringify(decrypt).toString();
  },
};
