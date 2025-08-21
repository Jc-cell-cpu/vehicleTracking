// CrudService.ts
import CryptoJS from "crypto-js";
import RNSimpleCrypto from 'react-native-simple-crypto';

const { AES, PBKDF2, utils } = RNSimpleCrypto;

const BASE_URL = 'https://staging.parivahan.nic.in/';
const defaultHeaders = { 'Content-Type': 'application/json' };

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || 'API Error');
  }
  return response.json();
};

export const CrudService = {
  postData: async (endpoint: string, payload: any) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: defaultHeaders,
        body: JSON.stringify(payload),
      });
      return await handleResponse(response);
    } catch (error: any) {
      console.error('❌ POST error:', error);
      throw error;
    }
  }
};

// --- encryption.ts (separate helper file or export from same file) ---

// export const encrypt = async (text: string, password: string): Promise<string> => {
//   const salt = await utils.randomBytes(16);
//   const iv = await utils.randomBytes(12); // 12 bytes IV for AES-GCM

//   const key = await PBKDF2.hash(password, salt, 65536, 256, 'SHA256');
//   const plaintextBytes = utils.convertUtf8ToArrayBuffer(text);
//   const encryptedBytes = await AES.encrypt(plaintextBytes, key, iv);

//   const result =
//     utils.convertArrayBufferToHex(iv) +
//     utils.convertArrayBufferToHex(salt) +
//     utils.convertArrayBufferToHex(encryptedBytes);

//   return result;
// };



export const encrypt = (plainText: string, secretKey: string) => {
  const key = CryptoJS.enc.Utf8.parse(secretKey);
  const iv = CryptoJS.enc.Utf8.parse("1234567890123456"); // must match backend
  const encrypted = CryptoJS.AES.encrypt(plainText, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
};


export const decrypt = async (encryptedHex: string, password: string): Promise<string> => {
  const ivHex = encryptedHex.slice(0, 24);      // 12 bytes IV
  const saltHex = encryptedHex.slice(24, 56);   // 16 bytes Salt
  const dataHex = encryptedHex.slice(56);       // Rest is ciphertext

  const iv = utils.convertHexToArrayBuffer(ivHex);
  const salt = utils.convertHexToArrayBuffer(saltHex);
  const ciphertext = utils.convertHexToArrayBuffer(dataHex);

  const key = await PBKDF2.hash(password, salt, 65536, 256, 'SHA256');
  const decryptedBytes = await AES.decrypt(ciphertext, key, iv);

  return utils.convertArrayBufferToUtf8(decryptedBytes);
};
