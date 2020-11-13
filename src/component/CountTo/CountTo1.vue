<template>
  <span>
    {{ displayValue }}
  </span>
</template>

<script>
import { requestAnimationFrame, cancelAnimationFrame } from './requestAnimationFrame.js'
import { reactive, computed, watch, onMounted, onUnmounted, toRefs, ref, toRef } from 'vue'
export default {
  name: 'CountTo',
  props: {
    startVal: {
      type: Number,
      required: false,
      default: 0,
    },
    endVal: {
      type: Number,
      required: false,
      default: 2017,
    },
    duration: {
      type: Number,
      required: false,
      default: 3000,
    },
    autoplay: {
      type: Boolean,
      required: false,
      default: true,
    },
    decimals: {
      type: Number,
      required: false,
      default: 0,
      validator(value) {
        return value >= 0
      },
    },
    decimal: {
      type: String,
      required: false,
      default: '.',
    },
    separator: {
      type: String,
      required: false,
      default: ',',
    },
    prefix: {
      type: String,
      required: false,
      default: '',
    },
    suffix: {
      type: String,
      required: false,
      default: '',
    },
    useEasing: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  setup(props, context) {
    // console.log(props)
    const state = reactive({
      localStartVal: props.startVal,
      displayValue: 0,
      printVal: null,
      paused: false,
      localDuration: props.duration,
      startTime: null,
      timestamp: null,
      remaining: null,
      rAF: null,
    })
    const startVal = ref(props.startVal)
    const endVal = ref(props.endVal)
    const countDown = computed(() => startVal > endVal)

    watch(startVal, () => {
      if (props.autoplay) {
        start()
      }
    })
    watch(endVal, () => {
      if (props.autoplay) {
        start()
      }
    })

    onMounted(() => {
      state.displayValue = formatNumber(props.startVal)
      if (props.autoplay) {
        start()
      }
      /* eslint-disable */
      context.emit('mountedCallback')
    })
    onUnmounted(() => {
      cancelAnimationFrame(state.rAF)
    })
    const start = () => {
      state.localStartVal = props.startVal
      state.startTime = null
      state.localDuration = props.duration
      state.paused = false
      state.rAF = requestAnimationFrame(count)
    }
    const pauseResume = () => {
      if (state.paused) {
        resume()
        state.paused = false
      } else {
        pause()
        state.paused = true
      }
    }

    const pause = () => {
      cancelAnimationFrame(state.rAF)
    }
    const count = (timestamp) => {
      if (!state.startTime) state.startTime = timestamp
      state.timestamp = timestamp
      const progress = timestamp - state.startTime
      state.remaining = state.localDuration - progress

      if (props.useEasing) {
        if (countDown) {
          state.printVal =
            state.localStartVal - easingFn(progress, 0, state.localStartVal - props.endVal, state.localDuration)
        } else {
          state.printVal = easingFn(
            progress,
            state.localStartVal,
            props.endVal - state.localStartVal,
            state.localDuration,
          )
        }
      } else {
        if (countDown) {
          state.printVal = state.localStartVal - (state.localStartVal - props.endVal) * (progress / state.localDuration)
        } else {
          state.printVal = state.localStartVal + (props.endVal - state.localStartVal) * (progress / state.localDuration)
        }
      }
      if (countDown) {
        state.printVal = state.printVal < props.endVal ? props.endVal : state.printVal
      } else {
        state.printVal = state.printVal > props.endVal ? props.endVal : state.printVal
      }

      state.displayValue = formatNumber(state.printVal)
      if (progress < state.localDuration) {
        state.rAF = requestAnimationFrame(count)
      } else {
        context.emit('callback')
      }
    }

    const easingFn = (t, b, c, d) => {
      return (c * (-Math.pow(2, (-10 * t) / d) + 1) * 1024) / 1023 + b
    }

    const isNumber = (val) => {
      return !isNaN(parseFloat(val))
    }

    const formatNumber = (num) => {
      num = num.toFixed(props.decimals)
      num += ''
      const x = num.split('.')
      let x1 = x[0]
      const x2 = x.length > 1 ? props.decimal + x[1] : ''
      const rgx = /(\d+)(\d{3})/
      if (props.separator && !isNumber(props.separator)) {
        while (rgx.test(x1)) {
          x1 = x1.replace(rgx, '$1' + props.separator + '$2')
        }
      }
      return props.prefix + x1 + x2 + props.suffix
    }
    return {
      ...toRefs(state),
    }
  },
}
</script>
