export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function rollChance(chance: number = 0.5): boolean {
  return Math.random() <= chance;
}

export function getRandomItem<T>(arr: T[]): T | undefined {
  return arr[getRandomInt(0, arr.length - 1)];
}

export function getNRandomItems<T>(arr: T[], n = 1): T[] {
  if (!arr.length) return [];

  const newArr: T[] = [];

  for (let i = 0; i < n; i++) {
    const item = getRandomItem(arr)!;
    newArr.push(item);
  }

  return newArr;
}

export function getNRandomUniqueItems<T>(arr: T[], n = 1): T[] {
  if (!arr.length) return [];

  const items: T[] = [];
  const copy = [...arr];

  if (n > arr.length) n = arr.length;

  for (let i = 0; i < n; i++) {
    const randomIndex = getRandomInt(0, copy.length - 1);
    items.push(copy[randomIndex]);
    copy.splice(randomIndex, 1);
  }

  return items;
}
