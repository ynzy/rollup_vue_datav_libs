const path = require('path')
const resolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')
const babel = require('rollup-plugin-babel')
const { terser } = require('rollup-plugin-terser')
const vue = require('rollup-plugin-vue')
const postcss = require('rollup-plugin-postcss')
const { eslint } = require('rollup-plugin-eslint')
const pathResolve = (p) => path.resolve(__dirname, p)

const outputOptions = require('./rollup-output-options')

const isProd = process.env.NODE_ENV == 'production'

// 通用的插件
const basePlugins = [
  resolve(),
  json(),
  vue(),
  babel({
    exclude: 'node_modules/**',
    runtimeHelpers: true, // 使plugin-transform-runtime生效
  }),
  commonjs(),
  postcss(),
  // eslint({
  //   throwOnError: false,
  //   throwOnWarning: true,
  //   include: ['src/**'],
  //   exclude: ['node_modules/**'],
  // }),
]
// 开发环境需要使用的插件
const devPlugins = []
// 生产环境需要使用的插件
const prodPlugins = [
  terser({
    output: {
      ascii_only: true, // 仅输出ascii字符
    },
    compress: {
      pure_funcs: ['console.log'], // 去掉console.log函数
    },
  }),
]
let plugins = [...basePlugins].concat(isProd ? prodPlugins : devPlugins)

let config = {
  input: pathResolve('./src/index.js'),
  output: outputOptions,
  //! 注意插件加载顺序
  plugins: plugins,
}

module.exports = config
