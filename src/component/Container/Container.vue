<!--  -->
<template>
  <div id="container" :ref="refName">
    <slot></slot>
  </div>
</template>

<script>
import { ref, getCurrentInstance, onMounted, onUnmounted, nextTick } from 'vue'
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

    let context = null
    let dom = null
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
          // 获取屏幕宽度,画布的尺寸
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
    const onResize = async () => {
      console.log('onResize')
      await initSize()
      updateScale()
    }
    onMounted(async () => {
      context = getCurrentInstance().ctx
      await initSize()
      updateSize()
      updateScale()
      window.addEventListener('resize', debounce(100, onResize))
    })
    onUnmounted(() => {
      window.removeEventListener('resize', onResize)
    })

    return {
      refName,
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
