import BinarySearchTree from "./BinarySearchTree"
import Sidewinder from "./Sidewinder"
import AldousBroder from "./AldousBroder"
import Wilson from "./Wilson"
import HuntAndKill from "./HuntAndKill"

export enum Type {
    HuntAndKill,
    Wilson,
    AldousBroder,
    Sidewinder,
    BinarySearchTree,
}
export const types = [Type.HuntAndKill, Type.Wilson, Type.AldousBroder, Type.Sidewinder, Type.BinarySearchTree]

export const algorithms = [
    new BinarySearchTree(),
    new Sidewinder(),
    new AldousBroder(),
    new Wilson(),
    new HuntAndKill(),
]

export const get = (type: Type) => {
    switch (type) {
        case Type.BinarySearchTree:
            return algorithms[0]
        case Type.Sidewinder:
            return algorithms[1]
        case Type.AldousBroder:
            return algorithms[2]
        case Type.Wilson:
            return algorithms[3]
        case Type.HuntAndKill:
            return algorithms[4]
    }
}


export const getName = (type: Type) => {
    switch (type) {
        case Type.BinarySearchTree:
            return 'BST'
        case Type.AldousBroder:
            return 'Aldous-Broder'
        case Type.Sidewinder:
            return 'Sidewinder'
        case Type.Wilson:
            return 'Wilson'
        case Type.HuntAndKill:
            return 'Hunt and Kill'
    }
}