const inputPDF = document.querySelector("#inputFile");
const resultText = document.querySelector("#pdfText");

function isPDF(filename) {
  const extension = filename.split('.').pop().toLowerCase();
  return extension === 'pdf';
}

inputPDF.addEventListener("change", () => {
  if (!inputPDF.files[0] || !isPDF(inputPDF.files[0].name)) {
    window.alert("Error: Input file must be PDF");
    return;
  }
  uploadPDF();
});

function uploadPDF() {
  const formData = new FormData();
  console.log(inputPDF.files[0]);
  formData.append("pdf", inputPDF.files[0]);

  fetch("http://localhost:8000/get-text", {
    method: "POST",
    body: formData
  }).then(response => {
    return response.text();
  }).then(extractedText => {
    extractedText = extractedText.trim();
    resultText.value = extractedText;
  });
}

/**
 * Fetches the base64-encoded audio data from the server.
 * @param {string} text - The text to be converted to base64 data.
 * @returns {Promise<string>} A promise that resolves with the base64-encoded audio data.
 */
async function getBase64Data(text) {
  const apiUrl = `http://localhost:8000/base64data?text=${encodeURIComponent(text)}`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error("Network response was not ok.");
  }
  return response.text();
}

/**
 * Downloads an MP3 audio file from base64 data.
 * @param {string} base64Data - The base64-encoded audio data.
 */
function downloadMP3(base64Data) {
  console.log("Downloading MP3...");

  const mp3Data = 'data:audio/mpeg;base64,' + base64Data;

  const a = document.createElement("a");
  a.href = mp3Data;
  a.download = "audio.mp3";
  document.body.appendChild(a);
  a.click();
}


/**
 * Event listener function for button click that converts text to base64 data and downloads it as an MP3 file.
 */
const buttonConvert = document.querySelector("#mp3Convert");
buttonConvert.addEventListener("click", convertTextToMp3);

/**
 * Event handler for the button click.
 * @param {Event} event - The click event object.
 * @returns {Promise<void>} A promise that resolves when the process is complete.
 */
async function convertTextToMp3(event) {
  console.log("Button clicked!");
  try {
    const text = document.querySelector("#pdfText").value;
    if (!text) {
      window.alert("Error: PDF text cannot be empty.");
      throw new Error("No text to convert.");
    }
    const base64Data = await getBase64Data(text);
    downloadMP3(base64Data);
  } catch (error) {
    console.log("Error:", error);
  }
  resultText.textContent = "";
}

