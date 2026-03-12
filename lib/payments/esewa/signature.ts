import CryptoJS from "crypto-js";

export function generateEsewaSignature(message: string) {
  const hash = CryptoJS.HmacSHA256(
    message,
    process.env.ESEWA_SECRET_KEY!
  );

  return CryptoJS.enc.Base64.stringify(hash);
}