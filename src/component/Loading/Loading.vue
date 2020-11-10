<!--  -->
<template>
  <div class="loading">
    <svg :width="width" :height="height" viewBox="0 0 50 50" preserveAspectRatio="xMidYMid meet">
      <!--  stroke-dasharray=2pir/4=2*3.1415926/4=34  -->
      <circle
        cx="25"
        cy="25"
        r="22"
        fill="none"
        stroke-width="3"
        :stroke="outsideColor"
        stroke-dasharray="34"
        stroke-linecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 25 25;360 25 25"
          :dur="`${duration}s`"
          repeatCount="indefinite"
        />
        <animate
          attributeName="stroke"
          :values="outsideColorAnimation"
          :dur="`${duration}s`"
          repeatCount="indefinite"
        />
      </circle>
      <circle
        cx="25"
        cy="25"
        r="12"
        fill="none"
        stroke-width="3"
        :stroke="insideColor"
        stroke-dasharray="19"
        stroke-linecap="round"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="360 25 25"
          to="0 25 25"
          :dur="`${duration}s`"
          repeatCount="indefinite"
        />
        <animate attributeName="stroke" :values="insideColorAnimation" :dur="`${duration}s`" repeatCount="indefinite" />
      </circle>
    </svg>
    <div class="loading-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
export default {
  name: 'Loading',
  props: {
    width: {
      type: [Number, String],
      default: 50,
    },
    height: {
      type: [Number, String],
      default: 50,
    },
    outsideColor: {
      type: String,
      default: '#3be6cb',
    },
    insideColor: {
      type: String,
      default: '#20bcfe',
    },
    duration: {
      type: Number,
      default: 2,
    },
  },
  setup(ctx) {
    const { outsideColor, insideColor } = ctx
    const outsideColorAnimation = computed(() => `${outsideColor};${insideColor};${outsideColor}`)
    const insideColorAnimation = computed(() => `${insideColor};${outsideColor};${insideColor}`)
    return {
      outsideColorAnimation,
      insideColorAnimation,
    }
  },
}
</script>

<style lang="scss" scoped></style>
