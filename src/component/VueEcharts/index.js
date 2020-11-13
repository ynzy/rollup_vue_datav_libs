import VueEcharts from './VueEcharts.vue';

VueEcharts.install = function (Vue) {
  Vue.component(VueEcharts.name, VueEcharts);
};

export default VueEcharts;
