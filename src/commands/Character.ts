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
                return controller.left()
            case Arrow.Up:
                return controller.up()
            case Arrow.Right:
                return controller.right()
            case Arrow.Down:
                return controller.down()
        }
    }
}

export default new Character()