import Grid from "../Grid"

export default abstract class MazeAlgorithm {
    public abstract create(grid: Grid): void
}