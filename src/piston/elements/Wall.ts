import * as THREE from 'three'
import Element from './base'

type Position = { x: number, y: number }

export class Wall extends Element {
    private readonly mesh: THREE.Mesh
    constructor(start: Position, end: Position, texture: THREE.Texture) {
        super()
        const isHorizontal = start.y === end.y
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.set(2, 1)
        const shape = new THREE.BoxGeometry(isHorizontal ? 1.01 : .01, 0.5, isHorizontal ? .01 : 1.01)
        // const material = new THREE.MeshLambertMaterial({ color: '#ffffff', side: THREE.DoubleSide })
        shape.computeVertexNormals()
        // const material = new THREE.MeshLambertMaterial({ map: texture, side: THREE.FrontSide })
        const material = new THREE.MeshPhongMaterial({ map: texture })
        material.lightMap = texture
        this.mesh = new THREE.Mesh(shape, material)
        this.mesh.castShadow = false
        this.mesh.receiveShadow = true
        this.mesh.position.y = 0
        this.mesh.position.x = isHorizontal ? start.x - 0.005 : start.x - 0.505
        this.mesh.position.z = isHorizontal ? start.y - 0.505 : start.y - 0.005
    }

    public getMesh() {
        return this.mesh
    }
}