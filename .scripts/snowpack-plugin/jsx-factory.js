const { readFile } = require('fs').promises
const { transform } = require('esbuild')
const { compilerOptions } = (() => {
    try { return require(process.cwd() + '/tsconfig.json') }
    catch { return {} }
})()

module.exports = (snowpackConfig, { jsxFactory = 'h', jsxFragment = 'null' }) => {
    jsxFactory = compilerOptions?.jsxFactory ?? jsxFactory
    jsxFragment = compilerOptions?.jsxFragmentFactory ?? compilerOptions?.jsxFragment ?? jsxFragment

    return {
        name: 'jsx-factory',
        resolve: {
            input: ['.tsx', '.jsx'],
            output: ['.js'],
        },
        async load({ filePath, fileExt }) {
            const
                content = await readFile(filePath, 'utf-8'),
                loader = fileExt.slice(fileExt.lastIndexOf('.') + 1),
                { code, map } = await transform(content,
                    { loader, jsxFactory, jsxFragment })

            return { '.js': { code, map } }
        },
    }
}
