<!-- SvgAnimation 动画组件


 -->
<template>
  <div>
    <div class="container">
      <svg width="500" height="200" viewBox="0 0 500 200">
        <!-- 
          transform="matrix(2 1 -1 2 50 0)"
        [2,-1,50] => 2*_x+(-1)*_y+50 = x
        [1,2,0] => 1*_x+2*_y+0 = y
        顶点坐标
        [0,0]      => [50,0]
        [100,0]    => [250,100]
        [100,50]   => [200,200]
        [0,50]     => [0,100]
       -->
        <rect class="rect" x="5" y="5" width="100" height="50" fill="none" stroke="blue" stroke-width="5" />
      </svg>
    </div>
    <div class="container">
      <svg width="440" height="440" viewBox="0 0 440 440">
        <circle cx="220" cy="220" r="170" stroke-width="20" stroke="#d1d3d7" fill="none" />
        <!-- 2*3.1415926*170 = 1069 -->
        <circle
          class="circle"
          cx="220"
          cy="220"
          r="170"
          stroke-width="20"
          stroke="#00a5e0"
          fill="transparent"
          transform="matrix(0 -1 1 0 0 440)"
        />
      </svg>
    </div>
    <div class="container">
      <svg width="200" height="200" viewBox="0 0 200 200">
        <rect x="0" y="0" width="200" height="200" fill="none" stroke="grey" stroke-width="8"></rect>
        <rect
          x="0"
          y="0"
          width="200"
          height="200"
          fill="none"
          stroke="blue"
          stroke-width="8"
          class="rect-process"
          transform="matrix(0,1,-1,0,200,0)"
        ></rect>
      </svg>
    </div>
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
.rect {
  stroke-dasharray: 10 20;
}
.circle {
  // stroke-dasharray: 10 1069;
  animation: circle 5s linear infinite;
}
@keyframes circle {
  from {
    stroke-dasharray: 0 1069;
  }
  to {
    stroke-dasharray: 1069 0;
  }
}
.rect-process {
  animation: rect-process 5s linear infinite;
}
@keyframes rect-process {
  from {
    stroke-dasharray: 0 800;
  }
  to {
    stroke-dasharray: 800 0;
  }
}
</style>
