export const randomNumber = (from = Number.MIN_SAFE_INTEGER, to = Number.MAX_SAFE_INTEGER) =>
  Math.floor(Math.random() * (to - from + 1)) + from;
