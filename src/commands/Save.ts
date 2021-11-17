import BaseCommand from './BaseCommand'
import Controller from '../controller/controller'
import { getLayoutType, getWindowSize, LayoutType } from '../components/useLayout'

const getFontSize = () => {
    const layoutType = getLayoutType(getWindowSize())
    switch (layoutType) {
        case LayoutType.Desktop:
        case LayoutType.iPad:
            return 50 * window.devicePixelRatio
        case LayoutType.iPadSmall:
            return 40 * window.devicePixelRatio
        case LayoutType.PhonePortrait:
        case LayoutType.PhoneLandscape:
            return 25 * window.devicePixelRatio
    }
}

class Save extends BaseCommand {
    public matches(controller: Controller, e: KeyboardEvent) {
        return (e.metaKey || e.ctrlKey) && !e.shiftKey && e.key === 's'
    }
    public do(controller: Controller) {
        const url = this.getImageUrl(controller)
        if (url === undefined) {
            return
        }

        const link = document.createElement('a')
        // @ts-ignore
        link.style = 'display: none;'
        link.setAttribute('href', url)
        link.setAttribute('download', 'maze.png')
        document.body.appendChild(link)
        link.click()
        setTimeout(() => {
            document.body.removeChild(link)
        }, 1000)
    }
    public getImageUrl(controller: Controller) {
        const canvas = document.createElement("canvas")
        const padding = 20
        const labelHeight = 110
        canvas.width = controller.canvasSize.width + padding * 2
        canvas.height = controller.canvasSize.height + padding * 2 + labelHeight
        const ctx = canvas.getContext("2d")
        if (ctx == null) {
            return undefined
        }
        ctx.fillStyle = '#222'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.setTransform(1, 0, 0, 1, 20, 20)
        controller.drawMaze(ctx, false)
        controller.drawCharacter(ctx, false, true)
        controller.drawEnd(ctx, false)
        ctx.fillStyle = '#fff'
        ctx.font = `bold ${getFontSize()}px "Montserrat"`
        ctx.fillText("amazed.fun", 30, canvas.height - 60)
        ctx.font = `${getFontSize() / 2}px "Montserrat"`
        ctx.textAlign = 'right'
        ctx.fillText("by @ltm", canvas.width - 80, canvas.height - 70)
        return canvas.toDataURL("image/png")
    }
}

export default new Save()