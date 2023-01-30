function cipher(plaintext, key, autokey = false, extended = false) {
  let ciphertext = "";
  if (autokey) {
    if (key.length < plaintext.length) {
      key += plaintext.slice(0, plaintext.length - key.length);
    }
  }
  for (let i = 0; i < plaintext.length; i++) {
    let charCode = plaintext.charCodeAt(i);
    if (extended) {
      charCode = charCode + (key.charCodeAt(i % key.length) % 256);
      ciphertext += String.fromCharCode(charCode);
    } else {
      if (charCode >= 65 && charCode <= 90) {
        charCode =
          ((charCode - 65 + key.charCodeAt(i % key.length) - 65) % 26) + 65;
        ciphertext += String.fromCharCode(charCode);
      } else if (charCode >= 97 && charCode <= 122) {
        charCode =
          ((charCode - 97 + key.charCodeAt(i % key.length) - 97) % 26) + 97;
        ciphertext += String.fromCharCode(charCode);
      }
    }
  }
  return ciphertext;
}

function decipher(ciphertext, key, autokey = false, extended = false) {
  let plaintext = "";
  if (autokey) {
    if (key.length < ciphertext.length) {
      key += ciphertext.slice(0, ciphertext.length - key.length);
    }
  }
  for (let i = 0; i < ciphertext.length; i++) {
    let charCode = ciphertext.charCodeAt(i);
    if (extended) {
      charCode = charCode - (key.charCodeAt(i % key.length) % 256);
      plaintext += String.fromCharCode(charCode);
    }
    if (charCode >= 65 && charCode <= 90) {
      charCode =
        ((charCode - 65 - key.charCodeAt(i % key.length) + 65 + 26) % 26) + 65;
      plaintext += String.fromCharCode(charCode);
    } else if (charCode >= 97 && charCode <= 122) {
      charCode =
        ((charCode - 97 - key.charCodeAt(i % key.length) + 97 + 26) % 26) + 97;
      plaintext += String.fromCharCode(charCode);
    }
  }
  return plaintext;
}

export { cipher, decipher };
