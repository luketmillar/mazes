export type Position = {
    row: number
    column: number
}

export const getDiff = (a: Position, b: Position): Position => {
    return { row: Math.abs(a.row - b.row), column: Math.abs(a.column - b.column) }
}

export const getDistance = (a: Position, b: Position) => {
    const diff = getDiff(a, b)
    return Math.sqrt(diff.row * diff.row + diff.column * diff.column)
}