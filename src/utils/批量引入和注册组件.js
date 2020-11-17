const fs = require('fs')
const path = require('path')

function createImportTemplateString(importTemplate, files, comment, prefix) {
  return files.map(fileName => {
    const componentName = getComponentName(fileName)
    const filePath = prefix + fileName
    return importTemplate.replace(/<%\s*(\w+)\s*%>/g, (...args) => {
      const [, placeholder] =  args
      switch (placeholder) {
        case 'componentName':
          return componentName;
        case 'path':
          return filePath
        case 'comment': 
          return comment ? ` /* webpackChunkName: ${componentName} */ `: ` `
      }
    })
  }).join('\n')
}

function getComponentName(fileName) {
  return path.basename(fileName, path.extname(fileName))
}

function createInstallTemplateStirng(version, files) {
  let app = version === 2 ? 'Vue' : 'app'
  let str = ''
  str = files.map(fileName => {
    const componentName = getComponentName(fileName)
    return `.use(${componentName})`
  }).join(`\n\t\t\t`)
  str = 
`
export default {
  install(${app}) {
    ${app}${str}
  }
}
`
  return str
}

function createRouterTemplateStirng(version, files) {
  let str = ''
  str = files.map(fileName => {
    const componentName = getComponentName(fileName)
    return componentName
  }).join(`,\n\t`)
  str = 
`
import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";

const components = [
  ${str}
]
`
str =  str + 
`
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  ...Object.keys(components).map(component => {
    return {
      path: ${'\`/${component}\`'},
      name: component,
      component: components[component]
    }
  }),
  {
    path: "/:pathMatch(.*)*",
    redirect: {
      name: 'Home'
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
`
return str
}


function createTemplate({
  dir, // 组件文件的目录
  importTemplate = '', // import 模板
  prefix = './', // 路径前缀
  ingoreFiles = [], // 可以填写正则或者字符串,排除引入的文件
  comment = true, // 是否添加 webpackChunkName 注释
  targetDir = './indexTemplate.js', // 目标文件的生成路径
  version = 2, // vue install 版本
  vueRouterVersion = 3, // 生成的路由版本
  isVueRouter = false // 是否在路由中注册
}) {
  let targetTemplateString = ''
  let files = fs.readdirSync(dir)
  files = files.filter(fileName => {
    return ingoreFiles.every((reg) => {
      return fileName.search(reg) === -1
    })
  })

  let importTemplateString = createImportTemplateString(importTemplate, files, comment, prefix)


  targetTemplateString = importTemplateString + '\n' + (isVueRouter ? createRouterTemplateStirng(vueRouterVersion, files): createInstallTemplateStirng(version, files)) 


  fs.writeFileSync(targetDir, targetTemplateString, 'utf-8')
}

createTemplate({
  comment: true,
  prefix: './',
  ingoreFiles: [/^\.\w+/, 'Debounce'],
  importTemplate: `const <% componentName %> = () => import(<% comment %>"<% path %>")`,
  dir: './components/help',
  version: 3,
  vueRouterVersion: 3,
  // isVueRouter: true
}) 

