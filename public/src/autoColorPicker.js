import { graphColors } from "./environment";

export function autoColor(shiftsArray) {
  for (const color of graphColors) {
    console.log(color);
    console.log(shiftsArray.filter((shift) => shift.color === color));
    if (shiftsArray.filter((shift) => shift.color === color).length === 0) {
      return color;
    }
  }
  return "FFF";
}
