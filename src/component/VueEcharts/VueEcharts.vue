<!-- echarts二次封装 -->
<template>
  <div class="echarts">234234</div>
</template>

<script>
import Echarts from 'echarts'
import { onMounted, watch, watchEffect, ref } from 'vue'

export default {
  name: 'VueEcharts',
  props: {
    options: Object,
  },
  setup(ctx) {
    let dom
    let chart
    const initChart = () => {
      if (!chart) {
        dom = document.querySelector('.echarts')
        chart = Echarts.init(dom)
      }
      // onMounted完成echarts初始化之后进行设置，当我们options进行了修改，重新进行初始化
      chart.setOption(ctx.options)
    }
    onMounted(() => {
      initChart()
    })
    watch(
      () => ctx.options,
      (v) => {
        initChart()
      },
    )
  },
}
</script>

<style lang="scss" scoped>
.echarts {
  width: 100%;
  height: 100%;
}
</style>
