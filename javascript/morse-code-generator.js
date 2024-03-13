function getMorse(message) {
    message = message.toUpperCase();
    morse = [];
    for (var i = 0; i < message.length; i++) {
      morse.push( MORSE_CODE[message[i]] );
    }
    console.log(morse);
    return morse;
  }
  
  // All times in seconds
  var dot_time = 0.050;
  var dash_time = dot_time*3;
  var inter_elem_time = dot_time;
  var space_time = dot_time*7;
  
  // Initial delay before starting morse code sequence
  var initial_delay = 0.1;
  
  // Track whether morse code is running
  var running = false;
  
  var addMorseText = function(morse_text) {
    document.querySelector('#outputText').innerHTML += morse_text;
  }
  var clearMorseText = function() {
    document.querySelector('#outputText').textContent = "";
  }
  
  var addMsgText = function(msg_text) {
    document.querySelector('#inputText').innerHTML += msg_text;
  }
  var clearMsgText = function() {
    document.querySelector('#inputText').textContent = "";
  }
  
  var stop_morse = function() {
    Tone.Transport.cancel();
    tone_fin();
    clearMsgText();
    clearMorseText();
    document.querySelector('#p1').MaterialProgress.setProgress(0);
    console.log("stopped morse...")
  }
  
  // The Morse Code tone to use, 800Hz sine wave
  var osc = new Tone.Oscillator({
    "frequency": 550,
    "volume" : 0
  }).toMaster();
  
  var tone_dit = function(time, char) {
    osc.start(time);
    osc.stop(time+dot_time);
    addMorseText('• ', char);
    console.log('•');
}
var tone_dah = function(time, char) {
    osc.start(time);
    osc.stop(time+dash_time);
    addMorseText('▬ ', char);
    console.log('▬');
}
  
  var tone_word_space = function(time) {
    addMorseText('<br />');
  }
  
  var tone_letter_space = function(time) {
    addMorseText(' ');
  }
  
  var tone_fin = function(time) {
    running = false;
    document.querySelector('#playMorseButton').disabled = false;
  }
  
  var tone_addMsgText = function(time, char) {
    addMsgText(char);
  }
  
  // Move msg/code to global for easy access from console
  var msg;
  var code;
  
  function play_morse_sequence() {
    if (running) {
      return;
    }
  
    // clear previous
    stop_morse();
  
    document.querySelector('#playMorseButton').disabled = true;
  
    running = true;
  
    msg = document.querySelector('#outputText').value.toUpperCase();
    document.querySelector('#outputText').value = msg;
    code = getMorse(msg);
    console.log("Message:", msg, ", Code: ", code.join(' '));
  
  
    var total_length = morse.join('').length-1;
  
    var tone_updateProgress = function(time, pos) {
      var ratio = 100 * pos / total_length;
      document.querySelector('#p1').MaterialProgress.setProgress(ratio);
    }
  
    // Generate sequence
    var seq = [];
    var t = initial_delay; // Our current time in the morse code sequence
    var pos = 0;
  
    for (var i=0; i < code.length; i++) {
      var word = code[i]; // morse code word
  
      // If the word is just a space, handle differently
      if (word === ' ') {
        // Push word space
        seq.push({"time":t, "func":tone_word_space});
        t += space_time;
      } else {
        // We have a morse code word
        if (typeof word == 'undefined') {
          console.log("Skip", msg[i]);
          continue;
        }
        for (var j=0; j < word.length; j++) {
          var char = word[j]; // morse code character
          if (char === '.') {
            // Push a tone_dit
            seq.push({"time":t, "func":tone_dit});
            t += dot_time;
          } else if (char === '-') {
            // Push tone_dah
            seq.push({"time":t, "func":tone_dah});
            t += dash_time;
          } else {
            console.log('Unexpected character in morse code message:', char);
          }
          // Add inter element pause between characters
          t += inter_elem_time;
          pos += 1;
          // Add update to progress bar
          seq.push({"time":t, "func":tone_updateProgress, "msg_char":pos});
        }
        // Add inter-letter space
        if (i < code.length - 1 && code[i+1] !== ' ') {
          seq.push({"time":t, "func":tone_letter_space});
          t += space_time;
        }
      }
      // Add message text to screen
      seq.push({"time":t, "func":tone_addMsgText, "msg_char":msg[i]});
      
    }
    seq.push({"time":t, "func":tone_fin});
  
    var part = new Tone.Part(function(time, obj) {
      if (typeof obj.msg_char != 'undefined') {
        obj.func(time, obj.msg_char);
        // console.log(time.toFixed(3), obj.func.name, obj.msg_char);
      } else {
        obj.func(time);
        // console.log(time.toFixed(3), obj.func.name);
      }
    }, seq).start();
    
    // Start sequence
    Tone.Transport.start();
  }

  function playMorse() {
    console.log("Playing morse...")
    running = true;
    play_morse_sequence();
}
  

var MORSE_CODE = {
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