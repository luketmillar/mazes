export type Position = { row: number, column: number }
export type Size = { width: number, height: number }
export type PositionCallback = (position: Position) => void
export type Callbacks = {
    onStart: PositionCallback,
    onMove: PositionCallback,
    onEnd: PositionCallback
}

export const positionsAreEqual = (a: Position | undefined, b: Position | undefined) => {
    return a?.row === b?.row && a?.column === b?.column
}

export type Pixel = {
    x: number
    y: number
}
