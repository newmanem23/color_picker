// Function to convert hex to RGB
function hexToRgb(hex) {
  hex = hex.replace("#", "");
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  return { r, g, b };
}

// Function to convert RGB back to hex
function rgbToHex(r, g, b) {
  let hexR = r.toString(16).padStart(2, "0");
  let hexG = g.toString(16).padStart(2, "0");
  let hexB = b.toString(16).padStart(2, "0");
  return `#${hexR}${hexG}${hexB}`;
}

// Function to tint a gray color based on the primary color
function tintGrayWithPrimary(grayHex, primaryHex) {
  let gray = hexToRgb(grayHex);
  let primary = hexToRgb(primaryHex);

  // Normalize the primary color to a ratio of 0-1 by dividing each RGB component by 255
  let redRatio = primary.r / 255;
  let greenRatio = primary.g / 255;
  let blueRatio = primary.b / 255;

  // Calculate the adjustment for each gray value, capped at a maximum of 5
  let maxAdjustment = 7;
  let redAdjustment = Math.round(maxAdjustment * redRatio);
  let greenAdjustment = Math.round(maxAdjustment * greenRatio);
  let blueAdjustment = Math.round(maxAdjustment * blueRatio);

  // Apply the adjustments, ensuring we don't go below 0 or above 255
  let newRed = Math.min(255, Math.max(0, gray.r + redAdjustment));
  let newGreen = Math.min(255, Math.max(0, gray.g + greenAdjustment));
  let newBlue = Math.min(255, Math.max(0, gray.b + blueAdjustment));

  return rgbToHex(newRed, newGreen, newBlue);
}

// Function to validate hex code input
function isValidHex(hex) {
  return /^#[0-9A-F]{6}$/i.test(hex);
}

// Function to update the colors using CSS variables
function updateColors() {
  const primaryColor = document.getElementById("colorInput").value;
  const messageDiv = document.getElementById("message");

  // Validate the hex code input
  if (!isValidHex(primaryColor)) {
    messageDiv.textContent = "Please enter a valid 6-digit hex color code.";
    return;
  } else {
    messageDiv.textContent = "";
  }

  // Get the root element to update CSS variables
  const root = document.documentElement;

  // Update the primary color
  root.style.setProperty("--color-primary-texp", primaryColor);

  // Grays and almost white color
  const darkGray = tintGrayWithPrimary("#333333", primaryColor);
  const mediumGray = tintGrayWithPrimary("#666666", primaryColor);
  const lightGray = tintGrayWithPrimary("#999999", primaryColor);
  const lightestGray = tintGrayWithPrimary("#dddddd", primaryColor);
  const almostWhite = tintGrayWithPrimary("#f9f9f9", primaryColor); // Inverse tinting

  // Update the CSS variables with the new color values
  root.style.setProperty("--color-primary-texp", primaryColor);
  root.style.setProperty("--text-color", darkGray);
  root.style.setProperty("--medium-gray-color", mediumGray);
  root.style.setProperty("--light-gray-color", lightGray);
  root.style.setProperty("--lightest-gray-color", lightestGray);
  root.style.setProperty("--background-color", almostWhite);
}

// Add event listener to the button
document
  .getElementById("generateButton")
  .addEventListener("click", updateColors);

// Initialize with the default color
updateColors();
