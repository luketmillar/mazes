export type Fn<T> = (event: T) => void
export default class Subscribable<T = any> {
    private subscriptions: Array<Fn<T>> = []

    public subscribe(fn: Fn<T>) {
        this.subscriptions.push(fn)
        return () => {
            this.subscriptions = this.subscriptions.filter(s => s !== fn)
        }
    }

    public notify(event: T) {
        this.subscriptions.forEach(s => s(event))
    }
}