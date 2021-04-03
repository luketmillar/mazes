import { Position, getDistance } from "./Position"

export default class Character {
    public row: number
    public column: number
    public _angle: number
    public readonly paths: Position[][]
    private get path() {
        return this.paths[this.paths.length - 1]
    }

    private animation: Animation | undefined
    private angleAnimation: ValueAnimation | undefined

    constructor(row: number, column: number) {
        this.row = row
        this.column = column
        this.paths = [[this.position]]
        this._angle = 0
    }

    public moveTo(position: Position, animate = false) {
        if (animate) {
            const currentPositon = this.position
            const distance = getDistance(position, currentPositon)
            this.animation = new Animation(currentPositon, position, distance * 200)
            this.animation.start(performance.now())
        }

        if (this.row === position.row && this.column === position.column) {
            // no change
            return
        }
        this.row = position.row
        this.column = position.column
        this.path.push(position)
    }

    public jumpTo(position: Position) {
        this.row = position.row
        this.column = position.column
        this.paths.push([position])
    }

    public get position() {
        if (this.animation) {
            return this.animation.getPosition()
        }
        return { row: this.row, column: this.column }
    }

    public tickTime(timeStamp: number) {
        if (this.animation) {
            const animationTime = this.animation.calculateTime(timeStamp)
            this.animation.setTime(animationTime)
            if (this.animation.isComplete) {
                this.animation = undefined
            }
        }
        if (this.angleAnimation) {
            const angleAnimationTime = this.angleAnimation.calculateTime(timeStamp)
            this.angleAnimation.setTime(angleAnimationTime)
            if (this.angleAnimation.isComplete) {
                this.angleAnimation = undefined
            }
        }
    }

    public get isAnimating() {
        return this.animation !== undefined
    }

    public isInPath(position: Position) {
        return this.paths.some(path => path.some(p => p.row === position.row && p.column === position.column))
    }

    private setAngle(angle: number) {
        this.angleAnimation = new ValueAnimation(this._angle, angle, 200)
        this.angleAnimation.start(performance.now())
        this._angle = angle
    }

    public rotate(angle: number) {
        const currentAngle = this._angle
        let newAngle = currentAngle + angle
        this.setAngle(newAngle)
    }

    public get angle() {
        let a: number
        if (this.angleAnimation) {
            a = this.angleAnimation.get()
        } else {
            a = this._angle
        }
        if (a >= Math.PI * 2) {
            a = a - (Math.PI * 2)
        }
        if (a < 0) {
            a += Math.PI * 2
        }
        return a
    }
}


class Animation {
    private startPosition: Position
    private endPosition: Position
    private duration: number
    private time: number = 0
    private startTimestamp: number = 0

    constructor(start: Position, end: Position, duration: number) {
        this.startPosition = start
        this.endPosition = end
        this.duration = duration
    }

    public setTime(time: number) {
        this.time = time
    }

    public getPosition() {
        return { row: this.getRow(this.time), column: this.getColumn(this.time) }
    }

    public start(timestamp: number) {
        this.startTimestamp = timestamp
    }

    public calculateTime(timestamp: number) {
        return timestamp - this.startTimestamp
    }

    public get isComplete() {
        return this.time >= this.duration
    }

    private getRow(time: number) {
        const startRow = this.startPosition.row
        const endRow = this.endPosition.row
        const percentage = time / this.duration
        const easedPercentage = this.getEaseValue(percentage)
        return (endRow - startRow) * easedPercentage + startRow
    }

    private getColumn(time: number) {
        const startColumn = this.startPosition.column
        const endColumn = this.endPosition.column
        const percentage = time / this.duration
        const easedPercentage = this.getEaseValue(percentage)
        return (endColumn - startColumn) * easedPercentage + startColumn
    }

    private getEaseValue = (x: number) => {
        return x
    }
}

class ValueAnimation {
    private startValue: number
    private endValue: number
    private duration: number
    private time: number = 0
    private startTimestamp: number = 0

    constructor(start: number, end: number, duration: number) {
        this.startValue = start
        this.endValue = end
        this.duration = duration
    }

    public setTime(time: number) {
        this.time = time
    }

    public get() {
        return this.getValue(this.time)
    }

    public start(timestamp: number) {
        this.startTimestamp = timestamp
    }

    public calculateTime(timestamp: number) {
        return timestamp - this.startTimestamp
    }

    public get isComplete() {
        return this.time >= this.duration
    }

    private getValue(time: number) {
        const percentage = time / this.duration
        const easedPercentage = this.getEaseValue(percentage)
        return (this.endValue - this.startValue) * easedPercentage + this.startValue
    }

    private getEaseValue = (x: number) => {
        return x
    }
}