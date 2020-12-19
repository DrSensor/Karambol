/** TODO: replace `snowpack` with `@web/dev-server`
 * @see https://modern-web.dev/docs/dev-server/writing-plugins/examples/
 */

const { BROWSER, HMR, PORT } = process.env
    , { parse } = JSON
    , asIf = (val, ty) => typeof parse(val ?? null) === ty ? val : null
    , { compilerOptions: tsconfig } = require('./tsconfig.json')

// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/#configuration
/** @type {import("snowpack").SnowpackUserConfig} */
module.exports = {
    exclude: [
        ".scripts/**", "vendor/install.*js", "**/*.d.ts",
        ".vscode/*", "/*.config.js",
        "/tsconfig.json", "/package*.json", "/*lock.*"
    ],
    devOptions: {
        open: asIf(BROWSER, 'string') ?? parse(BROWSER ?? true) ? ".scripts/browser.sh" : "none",
        port: parse(PORT ?? 8080),
        secure: true,
        hmr: Boolean(parse(HMR ?? true)), // WARNING: hot-reloading many times will cause memory leak, make sure to close then reopen the tab
    },
    alias: {
        "~": ".",
        "@declarative-babylonjs": "./vendor/@declarative-babylonjs/packages",
    },
    // install: ["memo", "sinuous/observable"],
    plugins: [
        ["@snowpack/plugin-optimize", {
            target: ["chrome83"], // target WebXR DOM Overlays
            preloadModules: false // TODO: wait until stable, or make PR
        }],
        ["@snowpack/plugin-sass", { native: true }],
        "@snowpack/plugin-dotenv",
        ["./.scripts/snowpack-plugin/jsx-factory.js", {
            jsxFactory: tsconfig.jsxFactory,
            jsxFragment: tsconfig.jsxFragmentFactory
        }],
    ],
    installOptions: {
        installTypes: true,
        polyfillNode: false,
        dest: "build/web_modules", // TODO: HOW TO cache each subsequent build?? (integration with browser-sync)
        env: { NODE_ENV: true },
        rollup: {
            plugins: [
                require("rollup-plugin-node-polyfills")({
                    fs: false // to support importing ammo.js as ES module
                })
            ]
        }
    }
}
