const menu = document.getElementById('menu') as HTMLDivElement
export default menu

export { default as MainMenu } from './main'
export { default as PauseMenu } from './pause'

// TODO: export namespace Menu when top-level await is landed
// https://www.chromestatus.com/feature/5767881411264512
// export namespace Menu {
//     export const Main = (await import('./main')).default
// }
