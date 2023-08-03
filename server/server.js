const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8000
const googleTTS = require('google-tts-api');
const fileUpload = require('express-fileupload');
const pdfjsLib = require('./pdfjs-dist/build/pdf.js');

app.use(fileUpload());
app.use( express.json() );
app.use(cors());
app.listen(
  PORT,
  () => console.log(`Server is running on ${PORT}`)
);


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


app.post('/get-text', (request, response) => {
  if (!request.files && !request.files.pdf) {
    response.status(400).send('No files were uploaded.');
    return;
  }
  const src = request.files.pdf;
  getText(src).then(text => {
    response.send(text);
  });
});

async function getContent(src) {
  const doc = await pdfjsLib.getDocument(src).promise;
  const page = await doc.getPage(1);
  return await page.getTextContent();
}

async function getText(src) {
  const content = await getContent(src);
  const items = content.items.map(item => item.str);
  return items.join(' ');
}
