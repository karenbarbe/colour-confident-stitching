// Source: https://css-tricks.com/converting-color-spaces-in-javascript/#aa-hex-to-hsl
function hexToHSL(hex) {
  // Convert hex to RGB
  let r = 0,
    g = 0,
    b = 0;
  //0x prefix indicates the number is in hexadecimal (base-16) notation
  if (hex.length == 4) {
    r = "0x" + hex[1] + hex[1];
    g = "0x" + hex[2] + hex[2];
    b = "0x" + hex[3] + hex[3];
  } else if (hex.length == 7) {
    r = "0x" + hex[1] + hex[2];
    g = "0x" + hex[3] + hex[4];
    b = "0x" + hex[5] + hex[6];
  }
  // Then to HSL
  r /= 255;
  g /= 255;
  b /= 255;

  let cmin = Math.min(r, g, b),
    cmax = Math.max(r, g, b),
    delta = cmax - cmin,
    hue = 0,
    saturation = 0,
    lightness = 0;

  if (delta == 0) hue = 0;
  else if (cmax == r) hue = ((g - b) / delta) % 6;
  else if (cmax == g) hue = (b - r) / delta + 2;
  else hue = (r - g) / delta + 4;

  hue = Math.round(hue * 60);

  if (hue < 0) hue += 360;

  lightness = (cmax + cmin) / 2;

  if (delta == 0) {
    saturation = 0;
  } else {
    saturation = delta / (1 - Math.abs(2 * lightness - 1));
  }

  saturation = +(saturation * 100).toFixed(1);
  lightness = +(lightness * 100).toFixed(1);

  return {
    hex,
    hue,
    saturation,
    lightness,
  };
}

// Source: https://css-tricks.com/converting-color-spaces-in-javascript/#aa-hsl-to-hex
function HSLToHex(h, s, l) {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  // Having obtained RGB, convert channels to hex
  r = Math.round((r + m) * 255).toString(16);
  g = Math.round((g + m) * 255).toString(16);
  b = Math.round((b + m) * 255).toString(16);

  // Prepend 0s, if necessary
  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;

  return "#" + r + g + b;
}

var colorPicker = new iro.ColorPicker("#picker", {
  width: 320,
  color: "#f00",
  layout: [
    {
      component: iro.ui.Box,
      options: {},
    },
    {
      component: iro.ui.Slider,
      options: {
        sliderType: "hue",
      },
    },
  ],
});
