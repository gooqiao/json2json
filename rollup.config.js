
import typescript from "rollup-plugin-typescript2";
import sourceMaps from "rollup-plugin-sourcemaps";

export default {
    // input: "./src/index.js",
    input: "./src/index.ts",
    plugins: [
        typescript({
            exclude: "node_modules/**",
            typescript: require("typescript"),
            declaration: true
        }),
        sourceMaps()
    ],
    output: [
        {
            format: "cjs",
            file: "lib/bundle.cjs.js",
            sourcemap: true
        },
        {
            format: "es",
            file: "lib/bundle.esm.js",
            sourcemap: true
        }
    ]
};