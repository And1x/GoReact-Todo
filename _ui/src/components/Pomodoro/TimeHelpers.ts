export const SECONDS = 1000; // 1s == 1000ms
export const MINUTES = SECONDS * 60;
export const HOURS = MINUTES * 60;

export function displayTime(num: number) {
  return num.toString().padStart(2, "0");
}
