export = (a: Array<number>) => {
  let currentNumber = 0;
  for (let arrayIndex = 0; arrayIndex < a.length; arrayIndex++) {
    if (a[arrayIndex] === a[arrayIndex + 1]) {
      continue;
    }
    if (a[arrayIndex] !== currentNumber + 1) {
      return currentNumber;
    }
    currentNumber++;
  }
  return currentNumber;
};
