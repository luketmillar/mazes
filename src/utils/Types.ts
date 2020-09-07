import Direction from "../models/Direction"

export type Position = { row: number, column: number }
export type Size = { width: number, height: number }
export type PositionCallback = (position: Position) => void
export type Callbacks = {
    onStart: PositionCallback,
    onMove: PositionCallback,
    onEnd: PositionCallback,
    onSwipe: (direction: Direction) => void
}

export const positionsAreEqual = (a: Position | undefined, b: Position | undefined) => {
    return a?.row === b?.row && a?.column === b?.column
}

export type Pixel = {
    x: number
    y: number
}

export const getPixelDiff = (a: Pixel, b: Pixel) => {
    return { x: a.x - b.x, y: a.y - b.y }
}

export const getPixelDistance = (a: Pixel, b: Pixel) => {
    const diff = getPixelDiff(a, b)
    return Math.sqrt(diff.x * diff.x + diff.y * diff.y)
}