let math = require('mathjs');

function cipher(plaintext, key){
    let ciphertext = "";
    //if there is consecutive lettter in plaintext, add an X between them
    for(let i=0; i<plaintext.length; i++){
        if(plaintext[i] === plaintext[i+1]){
            plaintext = plaintext.slice(0, i+1) + 'X' + plaintext.slice(i+1);
        }
    }
    //if the length of plaintext is odd, add an X at the end
    if(plaintext.length % 2 !== 0){
        plaintext += 'X';
    }

    //if there is a letter J in the plaintext, replace it with I
    for(let i=0; i<plaintext.length; i++){
        if(plaintext[i] === 'J'){
            plaintext[I] === 'I';
        }
    }

    //encrypt the plaintext
    for(let i=0; i<plaintext.length; i+=2){
        let firstChar = "X";
        let secondChar = "X";
        let firstPos = [];
        let secondPos = [];
        for(let j=0; j<5; j++){
            for(let k=0; k<5; k++){
                if(key[j][k] === plaintext[i]){
                    firstPos = [j, k];
                }
                if(key[j][k] === plaintext[i+1]){
                    secondPos = [j, k];
                }
            }
        }
        if(firstPos[0] === secondPos[0]){
            firstChar = key[firstPos[0]][(firstPos[1]+1)%5];
            secondChar = key[secondPos[0]][(secondPos[1]+1)%5];
        }
        else if(firstPos[1] === secondPos[1]){
            firstChar = key[(firstPos[0]+1)%5][firstPos[1]];
            secondChar = key[(secondPos[0]+1)%5][secondPos[1]];
        }
        else{
            firstChar = key[firstPos[0]][secondPos[1]];
            secondChar = key[secondPos[0]][firstPos[1]];
        }
        ciphertext += firstChar;
        ciphertext += secondChar;
    }
    return ciphertext;

}

function decipher(ciphertext, key){
    //if ciphertext length is odd, return error
    if(ciphertext.length % 2 !== 0){
        return "Invalid ciphertext, must be divisible by 2";
    }
    let plaintext = "";
    //decrypt the ciphertext
    for(let i=0; i<ciphertext.length; i+=2){
        let firstChar = "X";
        let secondChar = "X";
        let firstPos = [];
        let secondPos = [];
        for(let j=0; j<5; j++){
            for(let k=0; k<5; k++){
                if(key[j][k] === ciphertext[i]){
                    firstPos = [j, k];
                }
                if(key[j][k] === ciphertext[i+1]){
                    secondPos = [j, k];
                }
            }
        }
        if(firstPos[0] === secondPos[0]){
            firstChar = key[firstPos[0]][(firstPos[1]+4)%5];
            secondChar = key[secondPos[0]][(secondPos[1]+4)%5];
        }
        else if(firstPos[1] === secondPos[1]){
            firstChar = key[(firstPos[0]+4)%5][firstPos[1]];
            secondChar = key[(secondPos[0]+4)%5][secondPos[1]];
        }
        else{
            firstChar = key[firstPos[0]][secondPos[1]];
            secondChar = key[secondPos[0]][firstPos[1]];
        }
        plaintext += firstChar;
        plaintext += secondChar;
    }
    //if there is an X at the end, remove it
    if(plaintext[plaintext.length-1] === 'X'){
        plaintext = plaintext.slice(0, plaintext.length-1);
    }
    return plaintext;
}

export { cipher, decipher };