import BinarySearchTree from "./BinarySearchTree"
import Sidewinder from "./Sidewinder"
import AldousBroder from "./AldousBroder"

export enum Type {
    BinarySearchTree,
    Sidewinder,
    AldousBroder
}
export const types = [Type.BinarySearchTree, Type.Sidewinder, Type.AldousBroder]

export const algorithms = [
    new BinarySearchTree(),
    new Sidewinder(),
    new AldousBroder()
]

export const get = (type: Type) => {
    switch (type) {
        case Type.BinarySearchTree:
            return algorithms[0]
        case Type.Sidewinder:
            return algorithms[1]
        case Type.AldousBroder:
            return algorithms[2]
    }
}


export const getName = (type: Type) => {
    switch (type) {
        case Type.BinarySearchTree:
            return 'BST'
        case Type.AldousBroder:
            return 'Aldous-Broder'
        case Type.Sidewinder:
        default:
            return 'Sidewinder'
    }
}