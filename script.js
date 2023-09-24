// load the speech recognition webkit
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition

// speech grammar list
var SpeechGrammarList = SpeechGrammarList || window.webkitSpeechGrammarList

// declare speech recog event
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

// colour db
var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];

// start recognition
var recognition = new SpeechRecognition();

// do detection
if (SpeechGrammarList) {
  var speechRecognitionList = new SpeechGrammarList();
  var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
  speechRecognitionList.addFromString(grammar, 1);
  recognition.grammars = speechRecognitionList;
}

// recognition details
recognition.continuous = false;
recognition.lang = 'en-US'; // feel free to change this
recognition.interimResults = false;
recognition.maxAlternatives = 1;

// html bits
var diagnostic = document.querySelector('.output');
var bg = document.querySelector('html');
var hints = document.querySelector('.hints');

// part to change
var colorHTML= '';
colors.forEach(function(v, i, a){
  console.log(v, i);
  colorHTML += '<span style="background-color:' + v + ';"> ' + v + ' </span>';
});
hints.innerHTML = 'Created by Dark25';

// main start
document.body.onclick = function() {
  recognition.start();
  console.log('Ready to receive a color command.');
}

// receive transcript and processes
recognition.onresult = function(event) {
  var transcript = event.results[0][0].transcript.trim().toLowerCase();
  diagnostic.textContent = 'Result received: ' + transcript + '.';

  var foundColor = null;

  for (var i = 0; i < colors.length; i++) {
    if (transcript.includes(colors[i].toLowerCase())) {
      foundColor = colors[i];
      break;
    }
  }

  if (foundColor) {
    bg.style.backgroundColor = foundColor;
    console.log('Confidence: ' + event.results[0][0].confidence);
  } else {
    diagnostic.textContent = "I didn't recognise that color.";
  }
}


// stop recording
recognition.onspeechend = function() {
  recognition.stop();
}

// fail handling
recognition.onnomatch = function(event) {
  diagnostic.textContent = "I didn't recognise that color.";
}

// error handling
recognition.onerror = function(event) {
  diagnostic.textContent = 'Error occurred in recognition: ' + event.error;
}