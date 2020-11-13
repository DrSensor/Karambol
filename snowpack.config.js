const { BROWSER } = process.env
module.exports = {
    exclude: [".scripts/**", "vendor/install.*js", "**/*.d.ts"],
    devOptions: {
        open: BROWSER ? ".scripts/browser.sh" : "none",
        secure: true,
    },
    alias: { "~": "." },
    // install: ["memo", "sinuous/observable"],
    plugins: [
        ["@snowpack/plugin-optimize", {
            target: ["chrome83"], // target WebXR DOM Overlays
            preloadModules: false // can cause duplicated <script>
        }],
        ["snowpack-plugin-rollup-bundle", {
            entrypoints: [
                "build/src/main.js", "build/res/main.css",
                "build/vendor/ammojs/index.js",
                "build/vendor/ARCore/arcore_devicelist.csv",
                "build/web_modules/device-detector-js.js", "build/web_modules/@babylonjs/core.js"
            ],
            preserveSourceFiles: true,
            emitHtmlFiles: true
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
