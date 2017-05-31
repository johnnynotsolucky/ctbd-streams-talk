export const doNothing = {
  next() {},
  error() {},
  complete() {}
}

export interface Range {
  min: number
  max: number
}

export const reverseRange = (range: Range) =>
  (x: number): [number, number] =>
    x % 2 === 0
    ? [range.min, range.max]
    : [range.max, range.min]
