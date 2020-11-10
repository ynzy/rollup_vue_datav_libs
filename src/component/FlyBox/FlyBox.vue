<!--  -->
<template>
  <div class="fly_box">
    <svg width="400" height="400">
      <defs>
        <path id="fly_box_path" d="M5 5 L395 5 L395 395 L5 395 Z" fill="none" />
        <mask id="fly_box_mask">
          <circle r="150" cx="0" cy="0" fill="white">
            <animateMotion
              dur="3s"
              path="M5 5 L395 5 L395 395 L5 395 Z"
              rotate="auto"
              repeatCount="indefinite"
            />
          </circle>
        </mask>
      </defs>
      <use href="#fly_box_path" stroke-width="1" stroke="#235fa7" />
      <use href="#fly_box_path" stroke-width="3" stroke="#4fd2dd" mask="url(#fly_box_mask)" />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'FlyBox',
  data() {
    return {}
  },
  methods: {},
  mounted() {},
  components: {},
}
</script>

<style lang="scss" scoped>
/* @import url(); 引入css类 */
</style>
