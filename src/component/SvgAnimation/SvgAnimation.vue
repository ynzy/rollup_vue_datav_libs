<!-- SvgAnimation 动画组件


 -->
<template>
  <div class="container">
    <svg width="500" height="200" viewBox="0 0 500 200">
      <!-- 
        [2,-1,50] => 2*_x+(-1)*_y+50 = x
        [1,2,0] => 1*_x+2*_y+0 = y
        顶点坐标
        [0,0]      => [50,0]
        [100,0]    => [250,100]
        [100,50]   => [200,200]
        [0,50]     => [0,100]
       -->
      <rect x="0" y="0" width="100" height="50" fill="red" transform="matrix(2 1 -1 2 50 0)" />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'SvgAnimation',
  props: {},
  setup(ctx) {},
}
</script>
<style lang="scss" scoped>
.container {
  svg {
    border: 1px solid #000;
  }
}
</style>
