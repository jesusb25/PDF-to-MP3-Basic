/**
 * Event listener function for button click that converts text to base64 data and downloads it as an MP3 file.
 */
document.querySelector("button").addEventListener("click", handleButtonClick);

/**
 * Event handler for the button click.
 * @param {Event} event - The click event object.
 * @returns {Promise<void>} A promise that resolves when the process is complete.
 */
async function handleButtonClick(event) {
  console.log("Button clicked!");
  try {
    const text = document.querySelector("textarea").value;
    const base64Data = await getBase64Data(text);
    await downloadMP3(base64Data);
  } catch (error) {
    console.log("Error:", error);
  }
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
  a.style.display = "none"; // Hide the element from the DOM.
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}