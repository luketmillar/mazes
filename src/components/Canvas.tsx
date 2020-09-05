import React from 'react'
import Grid from '../models/Grid'
import GridDrawer from '../views/GridDrawer'
import Solver, { Solution } from '../models/Solver'
import * as Algorithms from '../models/MazeAlgorithms/Directory'
import { LayoutType } from './useLayout'

const createGrid = (layoutType: LayoutType) => {
    switch (layoutType) {
        case LayoutType.Phone:
            return new Grid(30, 15)
        case LayoutType.iPad:
            return new Grid(30, 30)
        case LayoutType.Desktop:
            return new Grid(30, 50)
    }
}
const createGridDrawer = (grid: Grid, layoutType: LayoutType) => {
    switch (layoutType) {
        case LayoutType.Phone:
            return new GridDrawer(grid, 15)
        case LayoutType.iPad:
            return new GridDrawer(grid, 20)
        case LayoutType.Desktop:
            return new GridDrawer(grid, 25)
    }
}

interface IProps {
    algorithmType: Algorithms.Type
    layoutType: LayoutType
}
interface IState {
    showSolution: boolean
}
class Canvas extends React.Component<IProps, IState> {
    private gridCanvasRef = React.createRef<HTMLCanvasElement>()
    private pathCanvasRef = React.createRef<HTMLCanvasElement>()
    private grid: Grid
    private drawer: GridDrawer
    private solver: Solver = new Solver()
    private solution: Solution
    constructor(props: IProps) {
        super(props)
        this.grid = createGrid(props.layoutType)
        this.drawer = createGridDrawer(this.grid, props.layoutType)
        this.algorithm.create(this.grid)
        this.solution = this.solver.solve(this.grid)
        this.state = { showSolution: false }
    }
    public componentDidUpdate(previousProps: IProps) {
        if (previousProps.algorithmType !== this.props.algorithmType || previousProps.layoutType !== this.props.layoutType) {
            this.setState({ showSolution: false })
            this.newGrid()
        }
        this.drawGrid()
        this.draw()

    }
    public componentDidMount() {
        this.drawGrid()
        this.draw()
    }
    private get algorithm() {
        return Algorithms.get(this.props.algorithmType)
    }
    private newGrid() {
        this.grid = createGrid(this.props.layoutType)
        this.drawer = createGridDrawer(this.grid, this.props.layoutType)
        this.algorithm.create(this.grid)
        this.solution = this.solver.solve(this.grid)
        this.drawGrid()
        this.forceUpdate()
    }
    private drawGrid() {
        const ctx = this.gridCanvasRef.current!.getContext('2d')!
        this.drawer.clear(ctx)
        this.drawer.draw(ctx)
    }
    private draw() {
        const ctx = this.pathCanvasRef.current!.getContext('2d')!
        this.drawer.clear(ctx)
        if (this.state.showSolution) {
            this.drawer.drawSolution(ctx, this.solution)
        } else {
            this.drawer.drawStartEnd(ctx, this.solution)
        }
    }
    public render() {
        return <div onClick={() => this.setState({ showSolution: !this.state.showSolution })} style={{ width: this.drawer.width, height: this.drawer.height, position: 'relative' }}>
            <Stacked>
                <canvas ref={this.gridCanvasRef} width={this.drawer.width} height={this.drawer.height} />
            </Stacked>
            <Stacked>
                <canvas ref={this.pathCanvasRef} width={this.drawer.width} height={this.drawer.height} />
            </Stacked>
        </div>
    }
}
// const Canvas = ({ algorithmType }: IProps) => {
//     const algorithm = Algorithms.get(algorithmType)
//     const grid = React.useMemo(() => { new Grid(20, 20), [algorithm])
//     const [drawer, setGridDrawer] = React.useState(() => new GridDrawer(grid))
//     const [solution, setSolution] = React.useState<Solution | undefined>()
//     React.useEffect(() => {
//         const newGrid = new Grid(20, 20)
//         setGrid(newGrid)
//         setGridDrawer(new GridDrawer(newGrid))
//         algorithm.create(newGrid)
//         setSolution(solver.solve(newGrid))
//     }, [algorithm])
//     const [showSolution, setShowSolution] = React.useState(false)
//     const gridCanvasRef = React.useRef<HTMLCanvasElement>(null)
//     const pathCanvasRef = React.useRef<HTMLCanvasElement>(null)
//     React.useEffect(() => {
//         const ctx = gridCanvasRef.current!.getContext('2d')!
//         drawer.clear(ctx)
//         drawer.draw(ctx)
//     }, [solution, drawer, gridCanvasRef])
//     React.useEffect(() => {
//         if (solution === undefined) {
//             return
//         }
//         const ctx = pathCanvasRef.current!.getContext('2d')!
//         drawer.clear(ctx)
//         if (showSolution) {
//             drawer.drawSolution(ctx, solution)
//         } else {
//             drawer.drawStartEnd(ctx, solution)
//         }
//     }, [drawer, pathCanvasRef, showSolution, solution])
//     const toggleSolution = React.useCallback(() => {
//         setShowSolution(value => !value)
//     }, [])
//     return <div onClick={toggleSolution} style={{ width: drawer.width, height: drawer.height, position: 'relative' }}>
//         <Stacked>
//             <canvas ref={gridCanvasRef} width={drawer.width} height={drawer.height} />
//         </Stacked>
//         <Stacked>
//             <canvas ref={pathCanvasRef} width={drawer.width} height={drawer.height} />
//         </Stacked>
//     </div>
// }

const Stacked = ({ children }: { children: React.ReactNode }) => <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>{children}</div>

export default Canvas