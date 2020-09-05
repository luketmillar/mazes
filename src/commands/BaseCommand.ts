import Controller from "../controller/controller"

export default abstract class BaseCommand {
    public abstract matches(controller: Controller, e: KeyboardEvent): boolean
    public abstract do(controller: Controller, e: KeyboardEvent): void
}