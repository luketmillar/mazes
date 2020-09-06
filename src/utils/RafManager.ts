export class RafError extends Error {
    public readonly errors: Error[]
    constructor(errors: Error[]) {
        super(`raf error ${errors.length}\n` + errors.map(e => e.message + '\n' + e.stack?.toString()).join('\n\n'))
        this.errors = errors
    }
}

class RafManager {
    private rafListeners: Array<(timestamp: number) => void> = []
    private nextFrameListeners: Array<(timestamp: number) => void> = []
    private running = false
    private cancelRaf = 0

    public start() {
        if (!this.running) {
            this.running = true
            this.cancelRaf = window.requestAnimationFrame(this.onRAF)
        }
    }

    public stop() {
        this.running = false
        window.cancelAnimationFrame(this.cancelRaf)
    }

    public addListener(listener: (timestamp: number) => void) {
        this.rafListeners.push(listener)
        return () => {
            const listenerIndex = this.rafListeners.indexOf(listener)
            if (listenerIndex >= 0) {
                this.rafListeners.splice(listenerIndex, 1)
            }
        }
    }

    public onNextFrame = (listener: (timestamp: number) => void) => {
        this.nextFrameListeners.push(listener)
        return () => {
            const index = this.nextFrameListeners.indexOf(listener)
            if (index >= 0) {
                this.nextFrameListeners.splice(index, 1)
            }
        }
    }

    private onRAF = (timestamp: DOMHighResTimeStamp) => {
        const errors: Error[] = []
        this.rafListeners.forEach(listener => {
            try {
                listener(timestamp)
            } catch (err) {
                errors.push(err)
            }
        })
        this.nextFrameListeners.forEach(listener => {
            try {
                listener(timestamp)
            } catch (err) {
                errors.push(err)
            }
        })
        this.nextFrameListeners = []
        if (this.running) {
            this.cancelRaf = window.requestAnimationFrame(this.onRAF)
        }
        if (errors.length > 0) {
            throw new RafError(errors)
        }
    }
}

const rafManager = new RafManager()

rafManager.start()

export default rafManager
