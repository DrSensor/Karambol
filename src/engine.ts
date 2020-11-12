import { createWorld, World, System, ComponentType } from '@javelin/ecs'
import {
    Engine, Scene, AmmoJSPlugin,
    Vector3, Color4, Color3,
} from '@babylonjs/core'

interface Data {
    readonly scene:
    & RequiredScene<'main'>
    // & OptionalScene<'map' | 'zoom'>
    // & OptionalScene<'nogravity'>

    /** delta time on each world update */
    readonly dt: number
    readonly state: 'start' | 'pause' | 'stop'
}

type LifeCycleArgs = Partial<{ fullscreen: boolean }>
interface LifeCycle {
    start(args?: LifeCycleArgs): Promise<void>
    pause(args?: LifeCycleArgs): Promise<void>
    stop(): void
}

interface LifeCycleEventHandler {
    onstart(): Void
    onpause(): Void
    onstop(): Void
}

interface WorldOptions {
    systems?: System<Data>[]
    componentTypes?: ComponentType[]
}

type Options = Partial<Readonly<
    & LifeCycleEventHandler
    & { renderLoops: [() => void] }
    & WorldOptions
>>
type Return = Readonly<
    & World<Data>
    & LifeCycle
>

export default ({
    onstart, onpause, onstop,
    renderLoops, ...worldOpts
}: Options): Return => {
    let state: Data['state'],
        wakelock: Partial<WakeLockSentinel>

    const
        world = createWorld<Data>(worldOpts),
        canvas = document.getElementById('viewport') as HTMLCanvasElement,
        engine = new Engine(canvas, true, {
            preserveDrawingBuffer: true,
            stencil: true,
            antialias: true,
            alpha: true,
            limitDeviceRatio: window.devicePixelRatio,
        }, true),
        main = Object.assign(new Scene(engine), {
            clearColor: new Color4(0, 0, 0, 0),
            ambientColor: new Color3(0, 0, 0),
            fogColor: new Color3(0, 0, 0),
        } as Scene)

    main.enablePhysics(
        new Vector3(0, -9.81, 0), // gravity
        new AmmoJSPlugin())

    window.onresize = () => engine.resize()
    document.onvisibilitychange = async () => {
        switch (document.visibilityState) {
            case 'visible':
                engine.runRenderLoop(frozenScenes)
                wakelock ??= await navigator.wakeLock?.request('screen')
                break
            case 'hidden':
                game.pause()
                break
        }
    }

    const
        renderScenes = (unfreeze = true) => {
            const { scenes, getDeltaTime } = engine
            scenes.forEach(scene => scene.render(unfreeze, !unfreeze))
            if (unfreeze) world.tick({
                dt: getDeltaTime(),
                scene: { main },
                state,
            })
        },
        frozenScenes = () => renderScenes(false)

    const game: LifeCycle = {
        start: async ({ fullscreen = true } = {}) => {
            if (!document.pointerLockElement)
                document.body.requestPointerLock()
            if (!document.fullscreenElement && fullscreen)
                document.body.requestFullscreen({ navigationUI: 'hide' })

            // video ??= await skybox() // TODO: when supporting pseudo WebAR

            if (!wakelock)
                wakelock = await navigator.wakeLock?.request('screen') ?? {}
            else // if press play after switch tab
                engine.stopRenderLoop(frozenScenes)

            // video?.play()
            engine.runRenderLoop(renderScenes)
            for (const renderer of renderLoops)
                engine.runRenderLoop(renderer)
            state = 'start'
            onstart()
        },
        pause: async ({ fullscreen = false } = {}) => {
            if (document.pointerLockElement)
                document.exitPointerLock()
            if (document.fullscreenElement && !fullscreen)
                document.exitFullscreen()
            if (wakelock) {
                engine.stopRenderLoop()
                wakelock = await wakelock?.release()
                // video?.pause()
            }
            state = 'pause'
            onpause()
        },
        stop: () => {
            engine.stopRenderLoop()
            wakelock?.release()
            document.exitPointerLock()
            state = 'stop'
            onstop()
        }
    }

    // return Object.assign(world, lifecycle) // cuz there is no setter
    return { ...world, ...game } // no polyfill cuz it target chrome83
}

type RequiredScene<T extends string> = { [K in T]: Scene }
type OptionalScene<T extends string> = Partial<RequiredScene<T>>
type Void = void | Promise<void>
