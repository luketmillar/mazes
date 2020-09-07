import BaseCommand from './BaseCommand'
import Controller from '../controller/controller'

class Save extends BaseCommand {
    public matches(controller: Controller, e: KeyboardEvent) {
        return (e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === 's'
    }
    public do(controller: Controller) {
        const canvas = document.createElement("canvas")
        canvas.width = controller.canvasSize.width + 40
        canvas.height = controller.canvasSize.height + 40
        const ctx = canvas.getContext("2d")
        if (ctx == null) {
            return
        }
        ctx.fillStyle = '#222'
        ctx.fillRect(0, 0, controller.canvasSize.width + 40, controller.canvasSize.height + 40)
        ctx.setTransform(1, 0, 0, 1, 20, 20)
        controller.drawMaze(ctx, false)
        controller.drawCharacter(ctx, false)

        const link = document.createElement('a')
        // @ts-ignore
        link.style = 'display: none;'
        link.setAttribute('href', canvas.toDataURL("image/png"))
        link.setAttribute('download', 'maze.png')
        document.body.appendChild(link)
        link.click()
        setTimeout(() => {
            document.body.removeChild(link)
        }, 1000)
    }
}

export default new Save()