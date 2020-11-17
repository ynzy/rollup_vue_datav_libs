const fs = require('fs')
const path = require('path')

const pathReslove = path.resolve(__dirname, '../component')

const files = fs.readdirSync(pathReslove)
console.log(files)
const prefix = './'

let comment = true

const template = `const <% componentName %> = () => import( /* webpackChunkName: "<% componentName %>" */ "<% path %>")`

let str = files
  .map((fileName) => {
    return template
      .replace(/<%\s*(componentName)\s*%>/g, path.basename(fileName, '.vue'))
      .replace(/<%\s*(path)\s*%>/g, prefix + fileName)
  })
  .join('\n')

console.log(str)

const componentInit = (function () {})()

module.exports = componentInit
