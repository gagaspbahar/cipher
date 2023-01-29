function cipher(plaintext, m, b){
  // affine cipher
  let ciphertext = "";
  if (math.gcd(m, 26) !== 1) {
    return "m and 26 must be coprime";
  }
  for (let i = 0; i < plaintext.length; i++) {
    let charCode = plaintext.charCodeAt(i);
    if (charCode >= 65 && charCode <= 90) {
      charCode = ((m * (charCode - 65) + b) % 26) + 65;
      ciphertext += String.fromCharCode(charCode);
    } else if (charCode >= 97 && charCode <= 122) {
      charCode = ((m * (charCode - 97) + b) % 26) + 97;
      ciphertext += String.fromCharCode(charCode);
    }
  }
  return ciphertext;
}

function decipher(ciphertext, m, b){
  // affine cipher
  let plaintext = "";
  if (math.gcd(m, 26) !== 1) {
    return "m and 26 must be coprime";
  }

  for (let i = 0; i < ciphertext.length; i++) {
    let charCode = ciphertext.charCodeAt(i);
    if (charCode >= 65 && charCode <= 90) {
      charCode = ((math.invmod(m) * (charCode - 65 - b) + 26) % 26) + 65;
    } else if (charCode >= 97 && charCode <= 122) {
      charCode = ((math.invmod(m) * (charCode - 97 - b) + 26) % 26) + 97;
    }
    plaintext += String.fromCharCode(charCode);
  }
  return plaintext;
}