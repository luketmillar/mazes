import Grid from "./Grid"
import * as Algorithms from './MazeAlgorithms/Directory'
import Cell from "./Cell"
import Solver, { Solution } from "./Solver"

export default class Maze {
    public grid: Grid
    public algorithmType: Algorithms.Type = Algorithms.Type.RecursiveBacktracker
    private solution: Solution

    constructor(rows: number, columns: number) {
        this.grid = this.createGrid(rows, columns)
        this.solution = Solver.solve(this.grid)
    }

    public get start(): Cell {
        return this.solution.start
    }

    public get end(): Cell {
        return this.solution.end
    }

    public get rows() {
        return this.grid.rowCount
    }

    public get columns() {
        return this.grid.columnCount
    }

    private createGrid(rows: number, columns: number) {
        const grid = new Grid(rows, columns)
        this.algorithm.create(grid)
        return grid
    }

    private get algorithm() {
        return Algorithms.get(this.algorithmType)
    }
}