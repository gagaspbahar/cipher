import { cipher, decipher } from "@/lib/cipher/affine";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  console.log(req.body)
  // const body = req.body
  const body = JSON.parse(req.body);
  const text = body.text;
  const mkey = body.mkey;
  const bkey = body.bkey;
  const decrypt = body.decrypt;
  const affine = decrypt ? decipher : cipher;
  const result = affine(text, mkey, bkey);
  res.status(200).json({ result: result });
}