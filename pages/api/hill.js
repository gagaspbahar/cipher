import { cipher, decipher } from "@/lib/cipher/hill";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  console.log(req.body)
  // const body = req.body
  const body = JSON.parse(req.body);
  const text = body.text;
  const key = body.key;
  const decrypt = body.decrypt;
  const hill = decrypt ? decipher : cipher;
  const result = hill(text, key);
  res.status(200).json({ result: result });
}