function encodeText() {
    var inputText = document.getElementById('inputText').value;
    var encodingType = document.getElementById('encodingType').value;
    var outputText = '';
    
    switch (encodingType) {
        case 'base32':
            outputText = base32Encode(inputText);
            break;
        case 'base64':
            outputText = btoa(inputText);
            break;
        case 'url':
            outputText = encodeURIComponent(inputText);
            break;
        case 'hex':
            outputText = stringToHex(inputText);
            break;
        case 'rot13':
            outputText = rot13(inputText);
            break;
        case 'caesar':
            outputText = caesarCipher(inputText, 3); // Example: Shift by 3
            break;
        case 'morse':
            outputText = textToMorse(inputText);
            break;
    }
    
    document.getElementById('outputText').value = outputText;
}

function decodeText() {
    var inputText = document.getElementById('inputText').value;
    var encodingType = document.getElementById('encodingType').value;
    var outputText = '';
    
    switch (encodingType) {
        case 'base32':
            outputText = base32Decode(inputText);
            break;
        case 'base64':
            outputText = atob(inputText);
            break;
        case 'url':
            outputText = decodeURIComponent(inputText);
            break;
        case 'hex':
            outputText = hexToString(inputText);
            break;
        case 'rot13':
            outputText = rot13(inputText);
            break;
        case 'caesar':
            outputText = caesarCipher(inputText, -3); // Example: Shift back by 3
            break;
        case 'morse':
            outputText = morseToText(inputText);
            break;
    }
    
    document.getElementById('outputText').value = outputText;
}

function stringToHex(str) {
    var hex = '';
    for(var i=0; i<str.length; i++) {
        hex += '' + str.charCodeAt(i).toString(16);
    }
    return hex;
}

function base32Encode(input) {
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    var output = '';
    var bits = 0;
    var value = 0;
    for (var i = 0; i < input.length; ++i) {
        value = (value << 8) | input.charCodeAt(i);
        bits += 8;
        while (bits >= 5) {
            output += alphabet[value >>> (bits - 5)];
            bits -= 5;
            value &= ((1 << bits) - 1);
        }
    }
    if (bits > 0) {
        value <<= (5 - bits);
        output += alphabet[value];
    }
    while ((output.length % 8) != 0) {
        output += '=';
    }
    return output;
}

function base32Decode(input) {
    var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    var output = '';
    var buffer = 0;
    var bitsLeft = 0;
    for (var i = 0; i < input.length; ++i) {
        var value = alphabet.indexOf(input.charAt(i));
        if (value == -1) continue;
        buffer = (buffer << 5) | value;
        bitsLeft += 5;
        if (bitsLeft >= 8) {
            output += String.fromCharCode((buffer >>> (bitsLeft - 8)) & 255);
            bitsLeft -= 8;
        }
    }
    return output;
}

function hexToString(hex) {
    var str = '';
    for(var i=0; i<hex.length; i+=2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
}

function rot13(str) {
    return str.replace(/[a-zA-Z]/g, function(c) {
        var base = c <= 'Z' ? 65 : 97;
        return String.fromCharCode(base + (c.charCodeAt(0) - base + 13) % 26);
    });
}

function caesarCipher(str, shift) {
    return str.replace(/[a-zA-Z]/g, function(c) {
        var base = c <= 'Z' ? 65 : 97;
        return String.fromCharCode(base + (c.charCodeAt(0) - base + shift + 26) % 26);
    });
}

function textToMorse(text) {
    var morseCode = '';
    for (var i = 0; i < text.length; i++) {
        var char = text[i].toLowerCase();
        if (char === ' ') {
            morseCode += ' ';
        } else if (MORSE_CODE[char]) {
            morseCode += MORSE_CODE[char] + ' ';
        }
    }
    return morseCode.trim();
}

function morseToText(morse) {
    var words = morse.split('   ');
    var text = '';
    for (var i = 0; i < words.length; i++) {
        var letters = words[i].split(' ');
        for (var j = 0; j < letters.length; j++) {
            if (MORSE_CODE_REVERSE[letters[j]]) {
                text += MORSE_CODE_REVERSE[letters[j]];
            }
        }
        text += ' ';
    }
    return text.trim();
}

cMORSE_CODE = {
    'a': '.-',
    'b': '-...', 
    'c': '-.-.', 
    'd': '-..', 
    'e': '.', 
    'f': '..-.', 
    'g': '--.', 
    'h': '....', 
    'i': '..', 
    'j': '.---',
    'k': '-.-', 
    'l': '.-..', 
    'm': '--', 
    'n': '-.', 
    'o': '---', 
    'p': '.--.', 
    'q': '--.-', 
    'r': '.-.', 
    's': '...', 
    't': '-',
    'u': '..-', 
    'v': '...-', 
    'w': '.--', 
    'x': '-..-', 
    'y': '-.--', 
    'z': '--..', 
    '0': '-----', 
    '1': '.----', 
    '2': '..---',
    '3': '...--', 
    '4': '....-', 
    '5': '.....', 
    '6': '-....', 
    '7': '--...', 
    '8': '---..', 
    '9': '----.',
    ' ': '/', 
    '!': '-.-.--', 
    '@': '.--.-.', 
    '#': '#', 
    '?': '..--..', 
    '&': '.-...', 
    '+': '.-.-.', 
    '-': '-....-', 
    '/': '-..-.',
    '.': '.-.-.-', 
    ',': '--..--', 
    ':': '---...', 
    ';': '-.-.-.', 
    '=': '-...-', 
    "'": '.----.', 
    '"': '.-..-.', 
    '$': '...-..-',
    '*': '-..-', 
    '_': '..--.-', 
    '<': '-.-..-', 
    '>': '.-..-.', 
    '|': '-...-', 
    '`': '.-.-..', 
    '~': '.-...', 
    '^': '.--.',
    '%': '-..-.', 
    '(': '-.--.', 
    ')': '-.--.-', 
    '[': '-.--.', 
    ']': '-.--.-', 
    '{': '-.--.', 
    '}': '-.--.-', 
    ' ': ' ',
}

const MORSE_CODE_REVERSE = {};
for (let char in MORSE_CODE) {
    MORSE_CODE_REVERSE[MORSE_CODE[char]] = char;
}
