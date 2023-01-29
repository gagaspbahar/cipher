import { cipher, decipher } from "@/lib/cipher/vigenere";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const text = req.body.text;
  const key = req.body.key;
  const decrypt = req.body.decrypt;
  const autokey = req.body.autokey;
  const vigenere = decrypt ? decipher : cipher;
  const result = vigenere(text, key, autokey);
  res.status(200).json({ result: result });
}
