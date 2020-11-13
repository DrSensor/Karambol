import {
    createWorld, World,
    System, ComponentType,
} from '@javelin/ecs'
import {
    Engine, Scene,
    Color4, Color3,
} from '@babylonjs/core'

type Options = Partial<Readonly<
    & LifeCycleEventHandler
    & { renderLoops: [() => void] }
    & WorldOptions
>>
type Return = Readonly<
    & World<SystemData>
    & LifeCycle
>

interface Data {
    readonly scene:
    & RequiredScene<'main'>
    // & OptionalScene<'map' | 'zoom'>
    // & OptionalScene<'nogravity'>
}

interface SystemData extends Data {
    /** delta time on each world update */
    readonly dt: number
    readonly state: 'start' | 'pause' | 'stop'
}

type LifeCycleArgs = Partial<{
    fullscreen: boolean
    cursor: boolean
}>
interface LifeCycle {
    start({ }?: LifeCycleArgs): Promise<void>
    pause({ }?: LifeCycleArgs): Promise<void>
    stop(): void
}

interface LifeCycleEventHandler {
    onstart({ }: Data): Void
    onpause({ }: Data): Void
    onstop({ }: Data): Void
}

interface WorldOptions {
    systems?: System<SystemData>[]
    componentTypes?: ComponentType[]
}

export const canvas =
    document.getElementById('viewport') as HTMLCanvasElement

export default ({
    onstart, onpause, onstop,
    renderLoops, ...worldOpts
}: Options = {}): Return => {
    let state: SystemData['state'],
        wakelock: Partial<WakeLockSentinel>

    const
        world = createWorld<SystemData>(worldOpts),
        engine = Object.assign(new Engine(canvas, true, {
            doNotHandleTouchAction: true,
            preserveDrawingBuffer: true,
            stencil: true,
            antialias: true,
            alpha: true,
            limitDeviceRatio: window.devicePixelRatio,
        }, true), {
            canvasTabIndex: 0, // https://webaim.org/techniques/keyboard/tabindex
        } as Engine),
        scene = {
            main: Object.assign(new Scene(engine), {
                clearColor: Color4.FromColor3(Color3.Random(), Math.random()),
                ambientColor: Color3.Random(),
                fogColor: Color3.Random(),
            } as Scene)
        }

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
            if (unfreeze) world.tick({ // trigger all systems first
                dt: engine.getDeltaTime(), state, scene,
            })
            engine.scenes.forEach(
                scene => scene.render(unfreeze, !unfreeze))
        },
        frozenScenes = () => renderScenes(false)

    const game: LifeCycle = {
        start: async ({ fullscreen = true, cursor = false } = {}) => {
            if (onstart) onstart({ scene })

            canvas.tabIndex = engine.canvasTabIndex; canvas.focus()
            if (!document.pointerLockElement && !cursor)
                document.body.requestPointerLock()
            if (!document.fullscreenElement && fullscreen)
                document.body.requestFullscreen({ navigationUI: 'hide' })

            // video ??= await skybox() // TODO: when supporting pseudo WebAR

            if (!wakelock)
                wakelock = await navigator.wakeLock?.request('screen') ?? {}
            else // if press play after switch tab
                engine.stopRenderLoop(frozenScenes)

            // video?.play()
            Object.values(scene).forEach(stage => stage
                .createDefaultCameraOrLight(true, false, true))

            engine.runRenderLoop(renderScenes)
            if (renderLoops) for (const renderer of renderLoops)
                engine.runRenderLoop(renderer)
            state = 'start'
        },
        pause: async ({ fullscreen = false, cursor = true } = {}) => {
            if (onpause) onpause({ scene })

            canvas.removeAttribute('tabindex'); canvas.blur()
            if (document.pointerLockElement && cursor) document.exitPointerLock()
            if (document.fullscreenElement && !fullscreen) document.exitFullscreen()
            if (wakelock) {
                engine.stopRenderLoop()
                wakelock = await wakelock?.release()
                // video?.pause()
            }
            state = 'pause'
        },
        stop: () => {
            if (onstop) onstop({ scene }); document.exitPointerLock()
            engine.stopRenderLoop(); wakelock?.release()
            canvas.removeAttribute('tabindex'); canvas.blur()
            state = 'stop'; world.tick({
                dt: engine.getDeltaTime(), state, scene
            })
        }
    }

    // return Object.assign(world, lifecycle) // cuz there is no setter
    return { ...world, ...game } // no polyfill cuz it target chrome83
}

type RequiredScene<T extends string> = { [K in T]: Scene }
type OptionalScene<T extends string> = Partial<RequiredScene<T>>
type Void = void | Promise<void>
