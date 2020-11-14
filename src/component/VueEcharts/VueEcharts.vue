<!-- echarts二次封装 -->
<template>
<div :ref="refName" class="echarts"></div>
</template>

<script>
import Echarts from 'echarts'
import {
  v4 as uuidv4
} from 'uuid'
import {
  onMounted,
  watch,
  watchEffect,
  ref,
  getCurrentInstance
} from 'vue'

export default {
  name: 'VueEcharts',
  props: {
    options: Object,
    theme: [String, Object],
  },
  setup(ctx) {
    const uuid = uuidv4()
    let refName = `echart-${uuid}`
    let dom
    let chart
    let instance
    const initChart = () => {
      if (!chart) {
        dom = instance.ctx.$refs[refName]
        chart = Echarts.init(dom, ctx.theme)
      }
      // console.log(ctx.options)
      if (ctx.options) {
        // onMounted完成echarts初始化之后进行设置，当我们options进行了修改，重新进行初始化
        chart.setOption(ctx.options)
      }
    }
    onMounted(() => {
      instance = getCurrentInstance()
      initChart()
    })
    watch(
      () => ctx.options,
      (v) => {
        initChart()
      },
    )
    return {
      refName,
    }
  },
}
</script>

<style lang="scss" scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
