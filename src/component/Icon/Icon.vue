<!-- svg Icon组件
  可以使用style和class修改icon样式
  <Icon name="more" :style="{width:'50px'}" class="common_icon" />
  使用第三方图标
  <Icon prefix="icon" name="all" class="common_icon" />
 -->
<template>
  <div class="icon-wrapper" :style="{ ...style }">
    <svg class="icon">
      <use :href="iconName"></use>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    name: String, // svg名字
    prefix: {
      //前缀 外部图标库前缀
      type: String,
      default: '',
    },
    style: Object, // 样式
  },
  setup(ctx) {
    const iconName = `#${ctx.prefix}${ctx.name}`
    return {
      iconName,
    }
  },
}
</script>
<style lang="scss" scoped>
.icon-wrapper {
  display: inline-block;
}
.icon {
  width: 100%;
  height: 100%;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
