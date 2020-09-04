export function pickRandom<T>(arr: T[]) {
    return arr[randomNumber(arr.length)]
}

export const randomNumber = (max: number) => {
    return Math.floor(Math.random() * max)
}