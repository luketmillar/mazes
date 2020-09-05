import React from 'react'

type Size = { width: number, height: number }
type WindowSizeCallback = (size: Size) => void

const getWindowSize = () => ({ width: window.innerWidth, height: window.innerHeight })

class WindowResizeListener {
    private subscriptions: WindowSizeCallback[] = []
    constructor() {
        window.addEventListener('resize', this.resizeListener, { capture: true, passive: true })
        window.addEventListener('orientationchange', this.resizeListener, { capture: true, passive: true })
    }
    public subscribe(callback: WindowSizeCallback) {
        this.subscriptions.push(callback)
        return () => {
            this.subscriptions = this.subscriptions.filter(s => s !== callback)
        }
    }
    private resizeListener = () => {
        const windowSize = getWindowSize()
        this.subscriptions.forEach(s => s(windowSize))
    }
}

const listener = new WindowResizeListener()

export const useWindowSize = () => {
    const [size, setSize] = React.useState(getWindowSize())
    React.useEffect(() => {
        return listener.subscribe(setSize)
    }, [])
    return size
}

export enum LayoutType {
    Desktop = 'desktop',
    iPad = 'ipad',
    Phone = 'phone'
}
export const useLayoutType = () => {
    const size = useWindowSize()
    if (size.width < 400 || size.height < 400) {
        return LayoutType.Phone
    } else if (size.width <= 1200) {
        return LayoutType.iPad
    } else {
        return LayoutType.Desktop
    }
}