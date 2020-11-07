const path = require('path')
const pathResolve = p => path.resolve(__dirname, p)

const builds = [{
  file: pathResolve('./dist/datav.js'),
  format: 'umd',
  name: 'datav',
  globals: {
    vue: 'Vue'
  },
  env: 'development'
}, {
  file: pathResolve('./dist/datav.es.js'),
  format: 'es',
  name: 'datav',
  env: 'development'
}, {
  file: pathResolve('./dist/datav.min.js'),
  format: 'umd',
  name: 'datav',
  globals: {
    vue: 'Vue'
  },
  env: 'production'
}, {
  file: pathResolve('./dist/datav.es.min.js'),
  format: 'es',
  name: 'datav',
  env: 'production'
}]
let output = builds.filter(item => {
  return item.env == process.env.NODE_ENV
})
module.exports = output