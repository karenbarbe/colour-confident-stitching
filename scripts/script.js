let currentColors = [];

let currentSamples = document.querySelectorAll(
  'input[type="color"][id^="sample"]'
);

const hueNames = [
  { name: "red", range: [0, 10] },
  { name: "red-orange", range: [10, 30] },
  { name: "orange", range: [30, 45] },
  { name: "yellow-orange", range: [45, 55] },
  { name: "yellow", range: [55, 68] },
  { name: "yellow-green", range: [68, 140] },
  { name: "green", range: [140, 170] },
  { name: "blue-green", range: [170, 195] },
  { name: "blue", range: [195, 240] },
  { name: "blue-violet", range: [240, 280] },
  { name: "violet", range: [280, 320] },
  { name: "red-violet", range: [320, 355] },
  { name: "red", range: [355, 360] },
];

function colorizeSampleChip() {
  const sampleChips = document.querySelectorAll('div[id^="sample-chip"]');

  sampleChips.forEach((chip, i) => {
    let hexValue = currentColors[i].hex;
    chip.style.backgroundColor = hexValue;
  });
}

function resetColorWheel() {
  const paths = document.querySelectorAll(
    "#color-wheel-blank path:not(.cls-wheel-border)"
  );
  paths.forEach((path) => {
    path.classList.add("cls-gray");
  });
}

function getInputHex() {
  const inputs = document.querySelectorAll('input[type="color"][id^="sample"]');
  const hexValues = [];

  inputs.forEach((sample) => {
    let hex = sample.value;
    hexValues.push(hex);
  });

  return hexValues;
}

function getHSLvalues() {
  const hexValues = getInputHex();
  const hslValues = [];

  hexValues.forEach((hex) => {
    let hslValue = hexToHSL(hex);
    hslValues.push(hslValue);
  });
  console.log(hslValues);
  return hslValues;
}

function createColors() {
  const hslValues = getHSLvalues();
  const colors = [];

  hslValues.forEach((hslValue) => {
    const { hue } = hslValue;
    let hueName = getHueName(hue);
    hslValue.name = hueName;
    colors.push(hslValue);
  });

  return colors;
}

function colorizeColorWheel() {
  resetColorWheel();

  const circles = document.querySelectorAll("path:not(.cls-wheel-border)");

  currentColors.forEach((color) => {
    const { name } = color;

    circles.forEach((circle) => {
      if (circle.id === name) {
        circle.classList.remove("cls-gray");
      }
    });
  });
}

function renderColorInfo() {
  const colorTexts = document.querySelectorAll('p[id^="sample-info"]');

  colorTexts.forEach((text, i) => {
    text.textContent = `The color is ${currentColors[i].name}. The saturation is ${currentColors[i].saturation}% and its lightness is ${currentColors[i].lightness}%`;
  });
}

function getHueName(hue) {
  for (const hueName of hueNames) {
    if (hue >= hueName.range[0] && hue < hueName.range[1]) {
      return hueName.name;
    }
  }
}

function updateCurrentColors() {
  currentColors = createColors();
}

function createNewSample() {
  const number = currentColors.length + 1;

  const fragment = document.createDocumentFragment();

  const sampleBlock = document.createElement("div");
  sampleBlock.classList.add("sample__block");

  const sampleInfoContainer = document.createElement("div");
  sampleInfoContainer.classList.add("sample__info-container");

  const sampleInfo = document.createElement("p");
  sampleInfo.id = `sample-info${number}`;
  sampleInfo.textContent = renderColorInfo();

  const sampleContainer = document.createElement("div");
  sampleContainer.classList.add("sample__chip-container");

  const sampleChip = document.createElement("div");
  sampleChip.id = `sample-chip${number}`;
  sampleChip.classList.add("sample__chip");

  const sampleInput = document.createElement("input");
  sampleInput.id = `sample${number}`;
  sampleInput.classList.add("sample__input");
  sampleInput.type = "color";
  sampleInput.name = `sample${number}`;
  sampleInput.value = createTint();
  sampleInput.addEventListener("change", handleColorChange);

  const sampleButton = document.createElement("button");
  sampleButton.id = `sample-btn${number}`;
  sampleButton.classList.add("sample__btn-close");
  sampleButton.textContent = "X";
  sampleButton.addEventListener("click", removeSample);

  sampleInfoContainer.appendChild(sampleInfo);
  sampleContainer.append(sampleChip, sampleInput, sampleButton);
  sampleBlock.append(sampleInfoContainer, sampleContainer);
  fragment.appendChild(sampleBlock);

  return fragment;
}

function addNewSample() {
  const samplesContainer = document.getElementById("samples__container");
  samplesContainer.append(createNewSample());
}

function getLastColor() {
  const lastColor = currentColors[currentColors.length - 1];

  return lastColor.hex;
}

function createTint() {
  const hex = getLastColor();

  const hsl = hexToHSL(hex);
  let lightness = hsl.lightness;

  if (100 - lightness > 10) {
    lightness += 10;
  } else {
    lightness -= 10;
  }
  console.log(lightness);

  const hexTint = HSLToHex(hsl.hue, hsl.saturation, lightness);
  console.log(`hexTint is ${hexTint}`);
  return hexTint;
}

function updateButtonState() {
  const maxSamples = 5;
  const currentSamples = document.querySelectorAll(".sample__block").length;
  addSampleButton.disabled = currentSamples >= maxSamples;
}

const addSampleButton = document.getElementById("add-sample");
addSampleButton.addEventListener("click", () => {
  addNewSample();
  updateCurrentColors();
  colorizeSampleChip();
  renderColorInfo();
  createTint();
  updateButtonState();
});

function loadColorWheel() {
  fetch("./images/assets/color-wheel.svg")
    .then((response) => response.text())
    .then((svgContent) => {
      document.getElementById("color-wheel-blank").innerHTML = svgContent;
      resetColorWheel();
      colorizeColorWheel();
    })
    .catch((error) => console.error("Error loading SVG file:", error));
}

function handleColorChange() {
  updateCurrentColors();
  colorizeSampleChip();
  colorizeColorWheel();
  renderColorInfo();
}

document.addEventListener("DOMContentLoaded", function () {
  loadColorWheel();
  updateCurrentColors();
  colorizeSampleChip();
  renderColorInfo();
});

currentSamples.forEach((sample) => {
  sample.addEventListener("change", handleColorChange);
});

function removeSample(event) {
  const sampleBlock = event.target.closest(".sample__block");
  if (sampleBlock) {
    sampleBlock.remove();
    updateCurrentColors();
    colorizeColorWheel();
    updateButtonState();
  }
}

// TODO: update change color wheel after removing sample
