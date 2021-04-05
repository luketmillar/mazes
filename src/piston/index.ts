import * as THREE from 'three'
import Controller from '../controller/controller'
import Direction from '../models/Direction'
import { Wall } from './elements/Wall'

export default class Piston {
    public readonly scene: THREE.Scene
    public readonly renderer: THREE.WebGLRenderer
    public readonly camera: THREE.PerspectiveCamera
    public readonly flashlight: THREE.SpotLight
    public readonly light: THREE.AmbientLight
    public readonly controller: Controller

    constructor(canvas: HTMLCanvasElement, controller: Controller) {
        this.controller = controller
        this.scene = new THREE.Scene()

        this.renderer = new THREE.WebGLRenderer({ canvas })
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.shadowMap.enabled = true

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
        this.scene.add(this.camera)

        this.flashlight = new THREE.SpotLight(0xffffff)
        this.flashlight.castShadow = true
        // this.flashlight.shadow.mapSize.width = 1024
        // this.flashlight.shadow.mapSize.height = 1024
        this.flashlight.penumbra = 1
        this.flashlight.angle = 0.3
        this.flashlight.distance = 5
        this.flashlight.intensity = 0.5
        this.flashlight.shadow.mapSize.width = 512 // default
        this.flashlight.shadow.mapSize.height = 512 // default
        this.flashlight.shadow.camera.near = 0.5 // default
        this.flashlight.shadow.camera.far = 500 // default
        this.light = new THREE.AmbientLight(0xffffff, 0.01)
        // this.camera.add(this.light)
        // this.light.position.set(0, 0, 1)
    }

    public testScene() {
        this.scene.clear()
        const textureLoader = new THREE.TextureLoader()
        const wood = textureLoader.load('/brick.jpeg')

        const start = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.5), new THREE.MeshLambertMaterial())
        const end = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.7), new THREE.MeshLambertMaterial({ color: '#E1219B' }))
        end.position.y = 0
        end.position.x = this.controller.maze.end.position.column
        end.position.z = this.controller.maze.end.position.row
        this.scene.add(end)
        this.scene.add(start)


        const walls: Wall[] = []
        this.controller.maze.grid.columns.forEach((column, c) => {
            const xLeft = c
            const xRight = (c + 1)
            walls.push(new Wall({ x: xLeft, y: 0 }, { x: xRight, y: 0 }, wood))
        })
        this.controller.maze.grid.rows.forEach((row, r) => {
            const yTop = r
            const yBottom = (r + 1)
            walls.push(new Wall({ x: 0, y: yTop }, { x: 0, y: yBottom }, wood))
            row.forEach((cell, j) => {
                const xLeft = j
                const xRight = (j + 1)
                if (!cell.isLinked(Direction.East)) {
                    walls.push(new Wall({ x: xRight, y: yTop }, { x: xRight, y: yBottom }, wood))
                }
                if (!cell.isLinked(Direction.South)) {
                    walls.push(new Wall({ x: xLeft, y: yBottom }, { x: xRight, y: yBottom }, wood))
                }
            })
        })
        walls.forEach(wall => this.scene.add(wall.getMesh()))

        // this.camera.position.y = 25
        // this.camera.position.x = 10
        // this.camera.position.z = 20
        // this.camera.rotation.x = -1

        start.position.x = this.controller.character.position.column
        start.position.y = 0
        start.position.z = this.controller.character.position.row

        this.camera.position.x = this.controller.character.position.column
        this.camera.position.y = 0
        this.camera.position.z = this.controller.character.position.row
        this.camera.rotation.y = this.controller.character.angle

        // this.flashlight.position.set(start.position.x, start.position.y, start.position.z)
        this.flashlight.position.set(0, 0, 0)
        const lightTarget = new THREE.Object3D()
        lightTarget.position.set(0, 0, -0.1)
        start.add(this.flashlight)
        this.flashlight.target = lightTarget
        start.add(lightTarget)

        // this.scene.add(this.flashlight)
        const spotLightHelper = new THREE.SpotLightHelper(this.flashlight)
        // this.scene.add(spotLightHelper)
        this.light.position.set(5, 15, 5)
        this.scene.add(this.light)

        this.onUpdate((time) => {
            this.controller.tickTime(time)

            start.position.y = 0
            start.position.x = this.controller.character.position.column
            start.position.z = this.controller.character.position.row
            start.rotation.y = this.controller.character.angle
            start.rotation.x = 0
            start.rotation.z = 0

            // this.camera.position.y = 15
            // this.camera.position.x = 5
            // this.camera.position.z = 15
            // this.camera.rotation.x = -1
            // this.camera.rotation.y = 0

            this.camera.position.x = this.controller.character.position.column
            this.camera.position.z = this.controller.character.position.row
            this.camera.rotation.y = this.controller.character.angle

            this.flashlight.target.updateMatrixWorld()
            spotLightHelper.update()
        })
    }

    public start() {
        this.renderer.setAnimationLoop((time) => {
            this.updaters.forEach(fn => fn(time))
            this.renderer.render(this.scene, this.camera)
        })
    }

    private readonly updaters: Array<(time: number) => void> = []
    private onUpdate(fn: (time: number) => void) {
        this.updaters.push(fn)
    }
}