import { PropType, System, World, WorldOptions, ComponentSchemaProp } from 'ecsy'
import {
    Engine, Scene, AmmoJSPlugin,
    Vector3, Color4,
} from '@babylonjs/core'

// In case there is 2 implementation (e.g Pixi.js for World2D and Babylon.js for World3D)
export { BabylonWorld as World, BabylonSystem as System, Schema }
export * from 'ecsy'

interface Options {
    fullscreen?: boolean,
    renderLoops?: [() => void]
}

interface EventListener {
    onpause: () => void
    onresume: () => void
}

interface Schema<Type, Value> extends ComponentSchemaProp {
    type: PropType<Type, Value>
    default?: Value
}

abstract class BabylonSystem extends System {
    world: BabylonWorld
}

class BabylonWorld extends World implements EventListener {
    scene: // TODO(babylon-ecs): make this.scene generic
        & RequiredScene<'main'>
        & OptionalScene<'map' | 'some'>

    #engine: Engine
    #opts: Options
    #wakelock: WakeLockSentinel

    constructor({ entityPoolSize, ...options }: WorldOptions & Options) {
        super({ entityPoolSize })
        this.#opts = options
        const canvas = document.getElementById('viewport') as HTMLCanvasElement
        this.#engine = new Engine(canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true,
            antialias: true,
            alpha: true,
            limitDeviceRatio: window.devicePixelRatio,
        }, true)

        // at least create 1 default scene
        this.scene.main = new Scene(this.#engine)
        this.scene.main.clearColor = new Color4(0, 0, 0, 0)
        this.scene.main.enablePhysics(
            new Vector3(0, -9.81, 0), // gravity
            new AmmoJSPlugin())

        window.onresize = () => this.#engine.resize()
        document.onvisibilitychange = async () => {
            switch (document.visibilityState) {
                case 'visible':
                    this.#engine.runRenderLoop(this.#frozenScene)
                    // @ts-expect-error
                    this.#wakelock ??= await navigator.wakeLock?.request('screen')
                    break
                case 'hidden':
                    this.pause()
                    break
            }
        }
    }
    onpause: () => void
    onresume: () => void

    addScene(
        name: keyof InstanceType<typeof BabylonWorld>['scene'],
        CreateScene: typeof Scene,
        opts?:
            | DTO<Scene>
            | ((scene: Scene, name: string) => void)
    ) {
        this.scene[name] = new CreateScene(this.#engine)

        if (opts instanceof Function) opts(this.scene[name], name)
        else Object.assign(this.scene[name], opts)
        return this
    }

    async play() {
        const { fullscreen, renderLoops } = this.#opts
        super.play()
        if (!document.fullscreenElement && fullscreen)
            document.body.requestFullscreen({ navigationUI: 'hide' })

        // video ??= await skybox() // TODO: support WebAR
        const resume = () => {
            // video?.play()
            this.#engine.runRenderLoop(this.#mainScene)
            for (const renderer of renderLoops)
                this.#engine.runRenderLoop(renderer)
            this.onresume()
        }

        if (!this.#wakelock) {
            resume()
            // @ts-expect-error
            this.#wakelock = await navigator.wakeLock?.request('screen')
        } else { // if press play after switch tab
            this.#engine.stopRenderLoop(this.#frozenScene)
            resume()
        }
    }

    async pause({ unfullscreen = true } = {}) {
        if (document.fullscreenElement && unfullscreen)
            document.exitFullscreen()
        if (this.#wakelock) {
            this.#engine.stopRenderLoop()
            this.#wakelock = await this.#wakelock.release()
            // video?.pause()
        }
        this.onpause()
    }

    async stop() {
        super.stop()
        await this.pause()
    }

    #frozenScene = () => this.#mainScene(true)
    #mainScene = (freeze?: boolean) => {
        const { scenes, getDeltaTime } = this.#engine
        if (!freeze) this.execute(getDeltaTime(), performance.now())
        scenes.forEach(scene => scene.render(!freeze, freeze))
    }
}

type WakeLockSentinel = any
type RequiredScene<T extends string> = { [K in T]: Scene }
type OptionalScene<T extends string> = Partial<RequiredScene<T>>
