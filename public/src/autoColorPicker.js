import { graphColors } from './environment';

export function autoColor(shiftsArray) {
  let result = { backgroundColor: 'FFF', textColor: '000' };

  // Define the background color
  for (const color of graphColors) {
    if (
      shiftsArray.filter((shift) => shift.colors.backgroundColor === color)
        .length === 0
    ) {
      result.backgroundColor = color;
      break;
    }
  }

  result.textColor = autoTextColor(result.backgroundColor);

  return result;
}

export function autoTextColor(backgroundColor) {
  if (backgroundColor.length === 3) {
    backgroundColor =
      backgroundColor[0] +
      backgroundColor[0] +
      backgroundColor[1] +
      backgroundColor[1] +
      backgroundColor[2] +
      backgroundColor[2];
  }
  const hexColorLength = 2;

  let cN = {
    red: parseInt(backgroundColor.slice(0, hexColorLength), 16),
    green: parseInt(
      backgroundColor.slice(hexColorLength, hexColorLength * 2),
      16
    ),
    blue: parseInt(backgroundColor.slice(-hexColorLength), 16),
  };

  // Simplified formula for choosing black or white
  // if (cN.red * 0.299 + cN.green * 0.587 + cN.blue * 0.114 <= 150) {
  //   result.textColor = "FFF";
  // }

  // Bit more complex formula which first computes the luminance
  for (const color in cN) {
    cN[`${color}.L`] = cN[color] / 255;
    if (cN[`${color}.L`] <= 0.03928) {
      cN[`${color}.L`] = cN[`${color}.L`] / 12.92;
    } else {
      cN[`${color}.L`] = Math.pow((cN[`${color}.L`] + 0.055) / 1.055, 2.4);
    }
  }
  cN['L.tot'] =
    0.2126 * cN[`red.L`] + 0.7152 * cN[`green.L`] + 0.0722 * cN[`blue.L`];

  if (cN['L.tot'] > 0.179) {
    return '000';
  } else {
    return 'FFF';
  }
}
