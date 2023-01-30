let math = require('mathjs');

function cipher(plaintext, key){
    let ciphertext = "";
    if (key.length === 2){
        if(plaintext.length % 2 !== 0){
            plaintext += 'X';
        }
        for(let i=0; i<plaintext.length; i+=2){
            let firstChar = plaintext.charCodeAt(i) - 65;
            let secondChar = plaintext.charCodeAt(i+1) - 65;
            const charMatrix = [[firstChar], [secondChar]];
            const result = math.multiply(key, charMatrix);
            ciphertext += String.fromCharCode((result[0][0] % 26) + 65);
            ciphertext += String.fromCharCode((result[1][0] % 26) + 65);
        }
    }
    if (key.length === 3){
        if(plaintext.length % 3 !== 0){
            plaintext += 'X';
            if(plaintext.length % 3 !== 0){
                plaintext += 'X';
            }
        }
        for(let i=0; i<plaintext.length; i+=3){
            let firstChar = plaintext.charCodeAt(i) - 65;
            let secondChar = plaintext.charCodeAt(i+1) - 65;
            let thirdChar = plaintext.charCodeAt(i+2) - 65;
            const charMatrix = [[firstChar], [secondChar], [thirdChar]];
            const result = math.multiply(key, charMatrix);
            ciphertext += String.fromCharCode((result[0][0] % 26) + 65);
            ciphertext += String.fromCharCode((result[1][0] % 26) + 65);
            ciphertext += String.fromCharCode((result[2][0] % 26) + 65);
        }
    }
    return ciphertext;
}

function decipher(ciphertext, key){
    let plaintext = "";
    let invKey = [];
    if (key.length === 2){
        if(ciphertext.length % 2 !== 0){
            return "Invalid ciphertext, must be divisible by 2";
        }
        invKey = [[key[1][1], -key[0][1]],[-key[1][0], key[0][0]]];
        invKey = math.multiply(math.invmod(math.det(key), 26), invKey);
        for (let i=0; i<2; i++){
            for (let j=0; j<2; j++){
                invKey[i][j] = invKey[i][j] % 26;
                if (invKey[i][j] < 0){
                    invKey[i][j] += 26;
                }
            }
        }
        for(let i=0; i<ciphertext.length; i+=2){
            let firstChar = ciphertext.charCodeAt(i) - 65;
            let secondChar = ciphertext.charCodeAt(i+1) - 65;
            const charMatrix = [[firstChar], [secondChar]];
            const result = math.multiply(invKey, charMatrix);
            plaintext += String.fromCharCode((result[0][0] % 26) + 65);
            plaintext += String.fromCharCode((result[1][0] % 26) + 65);
        }
    }
    if (key.length === 3){
        if(ciphertext.length % 3 !== 0){
            return "Invalid ciphertext, must be divisible by 3";
        }
        let a = key[1][1]*key[2][2] - key[1][2]*key[2][1];
        let b = -(key[1][0]*key[2][2] - key[1][2]*key[2][0]);
        let c = key[1][0]*key[2][1] - key[1][1]*key[2][0];
        let d = -(key[0][1]*key[2][2] - key[0][2]*key[2][1]);
        let e = key[0][0]*key[2][2] - key[0][2]*key[2][0];
        let f = -(key[0][0]*key[2][1] - key[0][1]*key[2][0]);
        let g = key[0][1]*key[1][2] - key[0][2]*key[1][1];
        let h = -(key[0][0]*key[1][2] - key[0][2]*key[1][0]);
        let i = key[0][0]*key[1][1] - key[0][1]*key[1][0];
        invKey = [[a,d,g],[b,e,h],[c,f,i]];
        invKey = math.multiply(math.invmod(math.det(key), 26), invKey);
        for (let i=0; i<3; i++){
            for (let j=0; j<3; j++){
                invKey[i][j] = invKey[i][j] % 26;
                if (invKey[i][j] < 0){
                    invKey[i][j] += 26;
                }
            }
        }
        for(let i=0; i<ciphertext.length; i+=3){
            let firstChar = ciphertext.charCodeAt(i) - 65;
            let secondChar = ciphertext.charCodeAt(i+1) - 65;
            let thirdChar = ciphertext.charCodeAt(i+2) - 65;
            const charMatrix = [[firstChar], [secondChar], [thirdChar]];
            
            let result = math.multiply(invKey, charMatrix);
            plaintext += String.fromCharCode((result[0][0] % 26) + 65);
            plaintext += String.fromCharCode((result[1][0] % 26) + 65);
            plaintext += String.fromCharCode((result[2][0] % 26) + 65);
        }
    }
    return plaintext;
}

export { cipher, decipher };