export function shuffleArray(array: any[]) {
    let i = array.length;
    while (i > 0) {
      const ri = Math.floor(Math.random() * i);
      i--;
      [array[i], array[ri]] = [array[ri], array[i]];
    }
    return array;
  }