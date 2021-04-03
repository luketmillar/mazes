import BaseCommand from './BaseCommand'
import Controller from '../controller/controller'

enum Arrow {
    Left = 37,
    Up = 38,
    Right = 39,
    Down = 40
}

class Character extends BaseCommand {
    public matches(controller: Controller, e: KeyboardEvent) {
        return e.keyCode === Arrow.Left || e.keyCode === Arrow.Right || e.keyCode === Arrow.Up || e.keyCode === Arrow.Down
    }
    public do(controller: Controller, e: KeyboardEvent) {
        switch (e.keyCode) {
            case Arrow.Left:
                return controller.lookLeft()
            case Arrow.Up:
                return controller.forward()
            case Arrow.Right:
                return controller.lookRight()
            case Arrow.Down:
                return controller.backward()
        }
    }
}

export default new Character()