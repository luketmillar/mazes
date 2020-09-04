import BinarySearchTree from "./BinarySearchTree"
import Sidewinder from "./Sidewinder"

export enum Type {
    BinarySearchTree,
    Sidewinder
}
export const types = [Type.BinarySearchTree, Type.Sidewinder]

export const algorithms = [
    new BinarySearchTree(),
    new Sidewinder()
]

export const get = (type: Type) => {
    switch (type) {
        case Type.BinarySearchTree:
            return algorithms[0]
        case Type.Sidewinder:
        default:
            return algorithms[1]
    }
}


export const getName = (type: Type) => {
    switch (type) {
        case Type.BinarySearchTree:
            return 'Binary Search Tree'
        case Type.Sidewinder:
        default:
            return 'Sidewinder'
    }
}