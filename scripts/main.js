let currentBgColor = "";
let alternativeBgColors = [];

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

function colorDemo(i) {
  const stitch = document.querySelector(
    `#stitch-container${i + 1} #stitch-${i + 1}`
  );
  if (stitch) {
    stitch.setAttribute("stroke", colorPicker.color.hexString);
  } else {
    console.error("Stitch element not found");
  }
}

function handleColorChange() {
  updateCurrentColors();
  colorizeSampleChip();
  colorizeColorWheel();
  renderColorInfo();
}

function removeSample(event) {
  const sampleBlock = event.target.closest(".sample__block");
  if (sampleBlock) {
    sampleBlock.remove();
    updateCurrentColors();
    colorizeColorWheel();
    updateButtonState();
  }
}

function getInputColor() {
  const inputElement = document.getElementById("color-search");
  const input = inputElement.value.trim();

  if (input === "") {
    renderSearchMessage("enter");
    return;
  }

  inputElement.value = "";
  inputElement.focus();

  return input;
}

function getCellColor(event) {
  const cell = event.target.closest("li");
  console.log(`${cell.dataset.code} ${cell.dataset.name}`);
  return cell.dataset.code;
}

function renderSearchMessage(hint) {
  const message = document.getElementById("search-message");

  if (hint === "enter") {
    message.textContent = `Please enter a color code`;
  } else if (hint === "notfound") {
    message.textContent = `Oops! We didn’t find that color`;
  } else if (hint === "clear") {
    message.textContent = "";
  }
}

function findColor(colorCode) {
  if (colorCode) {
    const lowerColorCode = colorCode.toLowerCase();
    const foundColor = dmc.find(
      (color) =>
        color.code.toLowerCase() === lowerColorCode ||
        (color.previousCode &&
          color.previousCode.toLowerCase() === lowerColorCode)
    );

    if (foundColor) {
      return foundColor;
    } else {
      renderSearchMessage("notfound");
      return;
    }
  }
}

function focusNewColor(code) {
  const listItems = Array.from(
    document.querySelectorAll("#color-chart__container li")
  );
  listItems.forEach((item) => {
    item.classList.remove("focused");
  });
  const cell = listItems.find((li) => li.getAttribute("data-code") === code);
  cell.classList.add("focused");
}

function handleNewColor(colorCode) {
  const color = findColor(colorCode);
  if (color) {
    const codeOnCard = document.getElementById("color-card-code");
    const nameOnCard = document.getElementById("color-card-name");
    const colorChip = document.getElementById("color-card-chip");
    const stitches = document.querySelectorAll(
      '[id^="color-card-sample"] [id^="stitch-"]'
    );

    const { code, dmcName, hex, previousCode } = color;

    codeOnCard.textContent = `${code}`;
    nameOnCard.textContent = previousCode
      ? `${dmcName} (was ${previousCode})`
      : `${dmcName}`;

    renderSearchMessage("clear");
    colorChip.style.backgroundColor = hex;
    stitches.forEach((stitch) => {
      if (stitch) {
        stitch.setAttribute("stroke", hex);
      }
    });

    focusNewColor(code);
  }
  return;
}

function getStartColor() {
  const total = dmc.length;
  const randomIndex = Math.floor(Math.random() * total);
  const randomColor = dmc[randomIndex];
  return randomColor.code;
}

/* BACKGROUND BUTTONS */

function createBgButtons(array) {
  const fragment = document.createDocumentFragment();
  const container = document.getElementById("bg-button-container");
  const total = array.length;
  for (let i = 0; i < total; i++) {
    const button = document.createElement("button");
    button.id = `bg-button${i + 1}`;
    const bgColor = array[i].hex;
    button.style.backgroundColor = bgColor;
    button.title = array[i].name;
    button.addEventListener("click", (e) => {
      changeBgColor(e.target);
    });
    fragment.appendChild(button);
  }
  container.appendChild(fragment);
}
/*
function colorizeBgButtons() {
  const bgButtons = document.querySelectorAll("button[id^=bg-button]");
  bgButtons.forEach((button, index) => {
    console.log(alternativeBgColors[index].hex);
    button.style.backgroundColor = alternativeBgColors[index].hex;
  });
}*/

/*  SET and CHANGE BACKGROUND COLOR */

function findLightest(array) {
  const lightnessBgs = array.map((bgColor) => {
    const hsl = hexToHSL(bgColor.hex);
    const { lightness } = hsl;
    return lightness;
  });
  const lightest = Math.max(...lightnessBgs);
  const index = lightnessBgs.findIndex((bg) => bg === lightest);
  const lightestBg = bgColors[index];
  return lightestBg.hex;
}

function setBgColor(array) {
  currentBgColor = findLightest(array); // needs to be global or scoped?
  const container = document.getElementById("color-card-container");
  container.style.backgroundColor = currentBgColor;
}
/*
function getAlternativeBgColors(array) {
  alternativeBgColors = array.filter((bg) => bg.hex !== currentBgColor);
}*/

function changeBgColor(element) {
  const container = document.getElementById("color-card-container");
  container.style.backgroundColor = element.style.backgroundColor;

  const bgButtons = document.querySelectorAll("button[id^=bg-button]");
  bgButtons.forEach((button) => {
    button.classList.remove("focused");
  });

  element.classList.add("focused");
}

function handleBtnsBgColor(array) {
  setBgColor(array);
  createBgButtons(array);
}

function customizeBgColor() {
  const input = document.getElementById("");
}

/* COLOR CHART */

function getMaxColLength(array) {
  let columns = Object.values(array);

  const colLengths = columns.map((column) => column.length);
  const max = Math.max(...colLengths);
  return max;
}

function createColumnData(array) {
  const columnData = array.map((number) => {
    let newItem = dmc.find((item) => item.code === number);
    return newItem;
  });
  return columnData;
}

function createUList(index) {
  const ul = document.createElement("ul");
  ul.classList.add("color-chart__column");
  ul.id = `color-chart__col${index}`;

  const columnHeader = document.createElement("li");
  columnHeader.classList.add("color-chart__col-header");
  columnHeader.innerText = index < 10 ? `0${index}` : `${index}`;
  ul.appendChild(columnHeader);

  return ul;
}

function createChartColumns(columnData) {
  const chartContainer = document.getElementById("color-chart__container");

  for (let i = 1; i <= Object.keys(allColumnData).length; i++) {
    let columnName = `col${i}`;
    let currentColumnData = columnData[columnName];

    let ulElement = createUList(i);
    let chips = createChartChips(currentColumnData);
    ulElement.append(chips);
    chartContainer.appendChild(ulElement);
  }
}

function createListItems(array) {
  const fragment = document.createDocumentFragment();
  const totalCells = getMaxColLength(allColumnData); // added
  let count = 0; // added

  array.forEach((arrayItem) => {
    if (arrayItem) {
      const listItem = document.createElement("li");
      listItem.dataset.code = arrayItem.code;
      listItem.dataset.name = arrayItem.dmcName;
      listItem.style.backgroundColor = arrayItem.hex;
      listItem.addEventListener("click", (e) => {
        const newColor = getCellColor(e);
        handleNewColor(newColor);
      });
      fragment.appendChild(listItem);
      count++;
    }
  });
  const delta = totalCells - count; // added
  for (let i = 0; i < delta; i++) {
    const listItem = document.createElement("li");
    listItem.style.backgroundColor = "#f4f4f1";
    fragment.appendChild(listItem);
  }

  return fragment;
}

function createChartChips(columnData) {
  let column = createColumnData(columnData);
  let listItems = createListItems(column);
  return listItems;
}

/* Event Listeners*/

document.addEventListener("DOMContentLoaded", function () {
  loadColorWheel();
  loadSVGStitches();
  updateCurrentColors();
  colorizeSampleChip();
  renderColorInfo();
  handleBtnsBgColor(bgColors);
  createChartColumns(allColumnData);
});

const addSampleButton = document.getElementById("add-sample");
addSampleButton.addEventListener("click", () => {
  addNewSample();
  updateCurrentColors();
  colorizeSampleChip();
  renderColorInfo();
  createTint();
  updateButtonState();
});

currentSamples.forEach((sample) => {
  sample.addEventListener("change", handleColorChange);
});

const searchColorButton = document.getElementById("color-search-btn");
searchColorButton.addEventListener("click", () => {
  const newColor = getInputColor();
  handleNewColor(newColor);
});

document
  .getElementById("color-search")
  .addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
      const newColor = getInputColor();
      handleNewColor(newColor);
    }
  });

colorPicker.on("color:change", function (color) {
  const stitches = document.querySelectorAll(
    '[id^="stitch-container"] [id^="stitch-"]'
  );

  if (color.index === 0) {
    console.log(color.hexString);
    stitches.forEach((stitch) => {
      if (stitch) {
        stitch.setAttribute("stroke", color.hexString);
      }
    });
  }
});

getMaxColLength(allColumnData);
