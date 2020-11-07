import Test from './component/Test/index';
import Test2 from './component/Test2/index';

// import Test from './Test.vue';
const components = [Test, Test2];

// will install the plugin only once
const install = function (Vue) {
  components.forEach((component) => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

// To allow use as module (npm/webpack/etc.) export component
export default { install, Test, Test2 };
