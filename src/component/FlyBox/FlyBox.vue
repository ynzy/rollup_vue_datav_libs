<!--  -->
<template>
  <!-- :ref="refName" -->
  <div class="fly_box" :id="refName">
    <svg :width="width" :height="height">
      <defs>
        <path :id="pathId" :d="path" fill="none" />
        <radialGradient :id="radialGradientId" cx="50%" cy="50%" fx="100%" fy="50%" r="50%">
          <stop offset="0%" stop-color="#fff" stop-opacity="1"></stop>
          <stop offset="100%" stop-color="#fff" stop-opacity="0"></stop>
        </radialGradient>
        <mask :id="maskId">
          <circle :r="startLength" cx="0" cy="0" :fill="`url(#${radialGradientId})`">
            <animateMotion :dur="`${duration}s`" :path="path" rotate="auto" repeatCount="indefinite" />
          </circle>
        </mask>
      </defs>
      <use :href="`#${pathId}`" stroke-width="1" :stroke="lineColor" />
      <use :href="`#${pathId}`" stroke-width="3" :stroke="startColor" :mask="`url(#${maskId})`" />
    </svg>
    <div class="fly_box_content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import { v4 as uuidv4 } from 'uuid'
export default {
  name: 'FlyBox',
  props: {
    // 边框颜色
    lineColor: {
      type: String,
      default: '#235fa7',
    },
    //流星颜色
    startColor: {
      type: String,
      default: '#4fd2dd',
    },
    //流星的长度
    startLength: {
      type: String,
      default: '50',
    },
    duration: {
      type: [Number, String],
      default: 3,
    },
  },
  setup(ctx) {
    const uuid = uuidv4()
    console.log(uuid)
    // 动态设置宽高
    const width = ref(0)
    const height = ref(0)
    const refName = 'flyBox'
    const pathId = `${refName}-path-${uuid}`
    const radialGradientId = `${refName}-gradient-${uuid}`
    const maskId = `${refName}-maskId-${uuid}`
    const path = computed(
      () => `M5 5 L${width.value - 5} 5 L${width.value - 5} ${height.value - 5} L5 ${height.value - 5} Z`,
    )
    const init = () => {
      // 由于setup是在create之前执行的，无法获取到组件的实例，通过getCurrentInstance获取组件的实例
      const instance = getCurrentInstance()
      // const dom = instance.ctx.$refs[refName]
      const dom = document.getElementById(refName)
      width.value = dom.clientWidth
      height.value = dom.clientHeight
    }
    onMounted(() => {
      init()
    })
    return {
      width,
      height,
      refName,
      path,
      pathId,
      radialGradientId,
      maskId,
    }
  },
}
</script>

<style lang="scss" scoped>
.fly_box {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 2px;
  box-sizing: border-box;

  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .fly_box_content {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
  }
}
</style>
