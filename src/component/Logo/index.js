import Logo from './Logo.vue';

Logo.install = function (Vue) {
  Vue.component(Logo.name, Logo);
};

export default Logo;
