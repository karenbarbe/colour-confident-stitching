const svgStitches = [
  "./images/assets/stitch-1.svg",
  "./images/assets/stitch-2.svg",
  "./images/assets/stitch-3.svg",
];
/*
function loadSVGStitches() {
  svgStitches.forEach((file, index) => {
    const container = document.getElementById(`stitch-container${index + 1}`);

    fetch(file)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((svgContent) => {
        container.innerHTML = svgContent;
        colorDemo(index);
      })
      .catch((error) => {
        console.error(`Error loading SVG file ${file}:`, error);
        container.innerHTML =
          '<div class="placeholder">Graphic could not be loaded</div>';
      });
    
          .finally(() => {
              const loader = container.querySelector('.loading-indicator');
              if (loader) {
                  loader.remove();
              }
          });
  });
}*/

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

function loadSVGStitches() {
  svgStitches.forEach((file, index) => {
    const container = document.getElementById(`color-card-sample${index + 1}`);

    fetch(file)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((svgContent) => {
        container.innerHTML = svgContent;
        handleNewColor(getStartColor());
      })
      .catch((error) => {
        console.error(`Error loading SVG file ${file}:`, error);
        container.innerHTML =
          '<div class="placeholder">Graphic could not be loaded</div>';
      });
  });
}
