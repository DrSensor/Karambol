const { BROWSER } = process.env
module.exports = {
    exclude: [".scripts/**", "vendor/install.*js"],
    devOptions: {
        open: BROWSER ? ".scripts/browser.sh" : "none",
        secure: true,
    },
    alias: { "~": "." },
    // install: ["memo", "sinuous/observable"],
    plugins: [
        ["@snowpack/plugin-optimize", {
            target: ["chrome83"], // target WebXR DOM Overlays
            preloadModules: false // TODO: wait until stable, or make PR
        }],
        ["@snowpack/plugin-sass", { native: true }],
        "@snowpack/plugin-dotenv",
        "./.scripts/snowpack-plugin/jsx-factory.js",
    ],
    installOptions: {
        installTypes: true,
        polyfillNode: false,
        rollup: {
            plugins: [
                require("rollup-plugin-node-polyfills")({
                    fs: false // to support importing ammo.js as ES module
                })
            ]
        }
    }
}
