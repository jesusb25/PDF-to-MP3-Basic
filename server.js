const express = require('express');
const cors = require('cors');
const app = express();
const gtts = require('node-gtts')('en');
var path = require('path');
const PORT = 8000
const googleTTS = require('google-tts-api');

app.use( express.json() );
app.use(cors());

app.get('/base64data', (request, response) => {
  const text = request.query.text;
  
  googleTTS.getAllAudioBase64(text, {
    lang: 'en',
    slow: false,
    host: 'https://translate.google.com'
  })
  .then((base64Array) => {
    var data = '';
    base64Array.forEach((url) => {
      data += url.base64;
    });
    
    response.send(data);
  })
  .catch((err) => {
    console.error(err.stack);
  });
});


app.get('/textToSpeech', (request, response) => {
  const url = googleTTS.getAllAudioUrls(request.query.text, {
    lang: 'en',
    slow: false,
    host: 'https://translate.google.com'
  });
  console.log(url);

  const buffer = Buffer.from(url, 'utf8');
  fs.writeFileSync('new.mp3', buffer);

});

const fs = require('fs');

app.get('/speech', (request, response) => {
  gtts.save("new.mp3", request.query.text, function () {
    console.log("Text to speech converted!");
    response.satus = 200;
    response.send("Audio file generated!"); // You can send a response back to the client if needed.
  });
});

app.listen(
  PORT,
  () => console.log(`it's alive on http://localhost:${PORT}`)
);