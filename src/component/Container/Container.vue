<!--  -->
<template>
  <div id="container" :ref="refName">
    <template v-if="ready">
      <slot></slot>
    </template>
  </div>
</template>

<script>
import { ref, getCurrentInstance, onMounted, onUnmounted, nextTick, watchEffect, reactive, toRefs } from 'vue'
import { debounce } from '@/utils/index.js'
export default {
  name: 'Container',
  props: {
    options: Object, // width height
  },
  setup(ctx) {
    const refName = 'container'
    const width = ref(0) //实际宽度
    const height = ref(0) //实际高度
    const originalWidth = ref(0) // 屏幕宽度
    const originalHeight = ref(0) // 屏幕高度
    const ready = ref(false) // 判断容器组件是否完成渲染
    let context, dom, observer

    // 初始化获取宽高
    const initSize = () => {
      // 加入promise 优化我们initSize之后再执行updateScale
      return new Promise((resolve, reject) => {
        // nextTick 优化渲染
        nextTick(() => {
          dom = context.$refs[refName]
          const { options } = ctx
          // 获取设置的固定宽度。大屏的真实尺寸
          if (options?.width && options?.height) {
            width.value = options.width
            height.value = options.height
          } else {
            width.value = dom.clientWidth
            height.value = dom.clientHeight
          }
          // 获取屏幕宽高,画布的尺寸
          if (!originalWidth.value || !originalHeight.value) {
            originalWidth.value = screen.width
            originalHeight.value = screen.height
          }
          console.log(width.value, height.value, originalWidth.value, originalHeight.value)
          resolve()
        })
      })
    }
    // 更新容器宽高
    const updateSize = () => {
      if (width.value && height.value) {
        dom.style.width = `${width.value}px`
        dom.style.height = `${height.value}px`
      } else {
        dom.style.width = `${originalWidth.value}px`
        dom.style.height = `${originalHeight.value}px`
      }
    }
    // 更新宽高比 压缩比
    const updateScale = () => {
      // 获取实际（真实）视口的尺寸
      const currentWidth = document.body.clientWidth
      const currentHeight = document.body.clientHeight
      console.log(currentWidth, currentHeight)
      // 获取大屏最终的尺寸
      const realWidth = width.value || originalWidth.value
      const realHeight = height.value || originalHeight.value
      // 缩放宽高比
      const widthScale = currentWidth / realWidth
      const heightScale = currentHeight / realHeight
      dom.style.transform = `scale(${widthScale},${heightScale})`
    }
    const onResize = async (e) => {
      // 这里的e可以监听到MutationObserver的回调函数
      console.log('onResize', e)
      await initSize()
      updateScale()
    }
    // 监听dom树所做的更改，
    // 当我们在外部更改了容器的样式，比如height，我们可以通过MutationObserver监听到
    const initMutiationObserver = () => {
      const MutationObserver = window.MutationObserver
      observer = new MutationObserver(onResize)
      observer.observe(dom, {
        attributes: true,
        attributeFilter: ['style'],
        attributeOldValue: true,
      })
    }
    const removeMutationObserver = () => {
      if (observer) {
        observer.disconnect()
        observer.takeRecords()
        observer = null
      }
    }

    onMounted(async () => {
      ready.value = false
      context = getCurrentInstance().ctx
      await initSize()
      updateSize()
      updateScale()
      window.addEventListener('resize', debounce(100, onResize))
      initMutiationObserver()
      ready.value = true
    })
    onUnmounted(() => {
      window.removeEventListener('resize', onResize)
      removeMutationObserver()
    })

    return {
      refName,
      ready,
    }
  },
}
</script>

<style lang="scss" scoped>
#container {
  position: fixed;
  top: 0;
  left: 0;
  /* 将画布锁定左上方 */
  transform-origin: left top;
  overflow: hidden;
  z-index: 999;
}
</style>
