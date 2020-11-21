import type { World, System, ComponentType } from '@javelin/ecs'
import type { Scene } from './utils'

import canvas from './index'
import { createWorld } from '@javelin/ecs'

import { Engine } from '@babylonjs/core/Engines/engine'
import { Color4, Color3 } from '@babylonjs/core/Maths/math'
import { Scene as Stage } from '@babylonjs/core/scene'
import '@babylonjs/core/Helpers/sceneHelpers'

type Options<T extends Scene.Collection> = Partial<Readonly<
    & LifeCycleEventHandler<T>
    & LifeCycleArgs
    & WorldOptions<T>
    & { renderLoops: RenderLoop[] }
>>
type Return<T extends Scene.Collection> = Readonly<
    & ThisWorld<T>
    & LifeCycle
    & Pick<SysData, 'state'>
>

type RenderLoop = Parameters<Engine['runRenderLoop']>[0]
type ThisSystem<T extends Scene.Collection> = System<SysData & Data<T>>
type ThisWorld<T extends Scene.Collection> = World<SysData & Data<T>>

interface Data<Scene extends Scene.Collection> {
    readonly scene: Scene
    // reserved for other props
}

interface SysData {
    /** delta time on each world update */
    readonly dt: number
    readonly state: 'start' | 'resume' | 'playing' | 'pause' | 'stop'
}

type LifeCycleEventHandler<T extends Scene.Collection> = Omit<{
    readonly [K in `on${SysData['state']}`]: ({ }: Data<T>) => Void
}, 'onplaying'>

type LifeCycleArgs = Partial<{
    fullscreen: boolean
    cursor: boolean
}>

interface LifeCycle {
    start(_?: LifeCycleArgs): Promise<void>
    pause(_?: Omit<LifeCycleArgs, 'cursor'>): Promise<void>
    stop(): Promise<void>
}

interface WorldOptions<T extends Scene.Collection> {
    systems?: ThisSystem<T>[]
    componentTypes?: ComponentType[]
}

export namespace Default {
    export type Scene = Scene.Required<'main'>
    export type System = ThisSystem<Default.Scene>
    export type Level = WorldOptions<Default.Scene>
}
export type { ThisSystem as System, ThisWorld as World, WorldOptions as Level }

export default <Scene extends Default.Scene>({
    onstart, onpause, onstop, onresume,
    fullscreen: $fullscreen, cursor: $cursor,
    renderLoops, ...worldOpts
}: Options<Scene> = {}): Return<Scene> => {
    let state: SysData['state'] = 'stop',
        wakelock: Partial<WakeLockSentinel> | undefined,
        scene = {} as Scene

    const canNot = (currentState: typeof state) =>
        Error(`game can't "${currentState}" from "${state}" state`)

        , world = createWorld<SysData & Data<Scene>>(worldOpts)
        , engine = Object.assign(new Engine(canvas, true, {
            doNotHandleTouchAction: true,
            preserveDrawingBuffer: true,
            stencil: true,
            antialias: true,
            alpha: true,
            limitDeviceRatio: window.devicePixelRatio,
        }, true), {
            canvasTabIndex: 0, // https://webaim.org/techniques/keyboard/tabindex
        } as Engine)

    window.onresize = () => engine.resize()
    document.onvisibilitychange = async () => {
        switch (document.visibilityState) {
            case 'visible':
                engine.runRenderLoop(frozenScenes)
                wakelock ??= await navigator.wakeLock?.request('screen')
                break
            case 'hidden':
                if (state === 'playing') game.pause()
                break
        }
    }

    const frozenScenes = () => renderScenes(false)
        , renderScenes = (unfreeze = true) => {
            if (unfreeze) world.tick({ // trigger all systems first
                dt: engine.getDeltaTime(), state, scene,
            })
            engine.scenes.forEach(
                scene => scene.render(unfreeze, !unfreeze))
        }
        , disposeScenes = () => {
            engine.scenes.forEach(scene => scene.dispose())
            engine.wipeCaches(true)
        }

    const game: LifeCycle = {
        start: async ({ fullscreen, cursor } = {}) => {
            if (!['pause', 'stop'].includes(state)) throw canNot('start')
            fullscreen ??= $fullscreen ?? true
            cursor ??= $cursor ?? false

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

            switch (state) {
                case 'pause':
                    state = 'resume'
                    if (onresume) onresume({ scene })
                    world.tick({ dt: engine.getDeltaTime(), state, scene })
                    break
                case 'stop':
                    state = 'start'
                    scene = {
                        main: Object.assign(new Stage(engine), {
                            clearColor: Color4.FromColor3(Color3.Random(), Math.random()),
                            ambientColor: Color3.Random(),
                            fogColor: Color3.Random(),
                        } as Stage)
                    } as Scene
                    if (onstart) onstart({ scene })
                    world.tick({ dt: engine.getDeltaTime(), state, scene })
                    Object.values(scene).forEach(stage => stage
                        .createDefaultCameraOrLight(true, false, true))
                    break
            }

            // video?.play()
            engine.runRenderLoop(renderScenes)
            if (renderLoops) for (const renderer of renderLoops)
                engine.runRenderLoop(renderer)
            state = 'playing'
        },
        pause: async ({ fullscreen } = {}) => {
            if (state !== 'playing') throw canNot('pause')
            if (onpause) onpause({ scene })
            fullscreen ??= $fullscreen ?? false

            canvas.removeAttribute('tabindex'); canvas.blur()
            if (document.pointerLockElement) document.exitPointerLock()
            if (document.fullscreenElement && !fullscreen) document.exitFullscreen()
            if (wakelock) {
                engine.stopRenderLoop()
                wakelock = await wakelock?.release?.()
                // video?.pause()
            }
            state = 'pause'
        },
        stop: async () => {
            if (state !== 'pause') throw canNot('stop')
            if (onstop) onstop({ scene })
            document.exitPointerLock();
            wakelock = await wakelock?.release?.()
            engine.stopRenderLoop(); disposeScenes()
            engine.clear(Color4.FromInts(0, 0, 0, 0), true, true, true)
            canvas.removeAttribute('tabindex'); canvas.blur()
            state = 'stop'; world.tick({
                dt: engine.getDeltaTime(), state, scene
            })
        }
    }

    // Object.assign(world, lifecycle) //🤔
    return Object.defineProperties({ ...world, ...game }, {
        state: { get: () => state }
    })
}
