import { Position } from "../models/Position"
import Subscribable from "../utils/Subscribable"
import Controller from "../controller/controller"
import Direction from "../models/Direction"

export default abstract class Tool extends Subscribable<void> {
    public static type: string
    public get type(): string {
        return Tool.type
    }
    private _controller: Controller | undefined
    protected get controller(): Controller {
        return this._controller!
    }
    public initialize(controller: Controller) {
        this._controller = controller
    }
    public abstract onStart(position: Position): void
    public abstract onMove(position: Position): void
    public abstract onEnd(position: Position): void
    public abstract onSwipe(direction: Direction): void
}