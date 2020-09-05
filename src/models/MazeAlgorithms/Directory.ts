import BinarySearchTree from "./BinarySearchTree"
import Sidewinder from "./Sidewinder"
import AldousBroder from "./AldousBroder"
import Wilson from "./Wilson"
import HuntAndKill from "./HuntAndKill"
import RecursiveBacktracker from "./RecursiveBacktracker"

export enum Type {
    RecursiveBacktracker,
    HuntAndKill,
    Wilson,
    AldousBroder,
    Sidewinder,
    BinarySearchTree,
}
export const all = [
    {
        type: Type.RecursiveBacktracker,
        name: 'Recursive Backtracker',
        algorithm: new RecursiveBacktracker()
    },
    {
        type: Type.HuntAndKill,
        name: 'Hunt and kill',
        algorithm: new HuntAndKill()
    },
    {
        type: Type.Wilson,
        name: 'Wilson',
        algorithm: new Wilson()
    },
    {
        type: Type.AldousBroder,
        name: 'Aldous-Broder',
        algorithm: new AldousBroder()
    },
    {
        type: Type.Sidewinder,
        name: 'Sidewinder',
        algorithm: new Sidewinder()
    },
    {
        type: Type.BinarySearchTree,
        name: 'BST',
        algorithm: new BinarySearchTree()
    }
]
export const types = all.map(a => a.type)

export const get = (type: Type) => {
    return all.find(a => a.type === type)!.algorithm
}

export const getName = (type: Type) => {
    return all.find(a => a.type === type)!.name
}