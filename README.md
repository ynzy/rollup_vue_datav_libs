# datav-libs 组件库

## 使用方法

使用
我们发布了包以后就可以进行使用了

```js
npm i ynzy_datav_libs
```

- html 使用

```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>datav libs example</title>
  <script src="https://cdn.jsdelivr.net/npm/vue@3.0.2/dist/vue.global.js"></script>
  <script src="../dist/datav.js"></script>
</head>
<body>
  <div id="app">
    {{massage}}
    <test-component/>
  </div>
  <script>
    Vue.createApp({
      setup() {
        var massage = 'hello world'
        return {
          massage
        }
      }
    }).use(datav).mount('#app')
  </script>
</body>
</html>
```

- vue 项目中使用

```js
import { createApp } from 'vue'
import App from './App.vue'
import datav from 'ynzy_rollup_test'
createApp(App).use(datav).mount('#app')
```

```js
<template>
  <test-component/>
</template>
<script>
</script>
```
