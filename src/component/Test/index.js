import Test from './Test.vue';

Test.install = function (Vue) {
  Vue.component(Test.name, Test);
};

export default Test;
