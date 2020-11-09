<!-- svg Icon组件
  可以使用style和class修改icon样式
  <Icon name="more" :style="{width:'50px'}" class="common_icon" />
 -->
<template>
  <svg :style="{ ...style }">
    <use :href="iconName"></use>
  </svg>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    name: String, // svg名字
    style: Object, // 样式
  },
  setup(ctx) {
    const iconName = `#${ctx.name}`
    return {
      iconName,
    }
  },
}
</script>
<style lang="scss" scoped></style>
