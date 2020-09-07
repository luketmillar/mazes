import Tool from "./BaseTool"
import Subscribable from "../utils/Subscribable"
import Controller from "../controller/controller"

export default class ToolStack extends Subscribable<void> {
    private unsubscribe: (() => void) | undefined
    private _tool: Tool | undefined
    private get tool(): Tool | undefined {
        return this._tool
    }
    private set tool(tool: Tool | undefined) {
        this.unsubscribe?.()
        this._tool = tool
        this.unsubscribe = tool?.subscribe(this.notify)
    }

    private readonly controller: Controller
    constructor(controller: Controller) {
        super()
        this.controller = controller
    }

    public replace = (tool: Tool) => {
        this.tool = tool
        tool.initialize(this.controller)
        this.notify()
    }

    public get currentTool() {
        return this.tool
    }
}

// export const useCurrentTool = () => {
//     const [tool, setTool] = React.useState({ tool: toolStack.currentTool })
//     React.useEffect(() => {
//         const unsubscribe = toolStack.subscribe(() => setTool({ tool: toolStack.currentTool }))
//         setTool({ tool: toolStack.currentTool })
//         return unsubscribe
//     }, [])
//     return tool.tool
// }
