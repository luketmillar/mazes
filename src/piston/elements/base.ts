import * as THREE from 'three'

export default abstract class Element {
    public abstract getMesh(): THREE.Mesh
}