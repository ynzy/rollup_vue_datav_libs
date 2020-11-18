import Icon from './component/Icon/index'
import SvgAnimation from './component/SvgAnimation/index'
import Loading from './component/Loading/index'
import FlyBox from './component/FlyBox/index'
import Container from './component/Container/index'
import CountTo from './component/CountTo/index'
import VueEcharts from './component/VueEcharts/index'
import Logo from './component/Logo/index'
import BaseScrollList from './component/BaseScrollList/index'
import AutoScrollTable from './component/AutoScrollTable/index'

const components = [
  Icon,
  SvgAnimation,
  Loading,
  FlyBox,
  Container,
  CountTo,
  VueEcharts,
  Logo,
  BaseScrollList,
  AutoScrollTable
]

// will install the plugin only once
const install = function (Vue) {
  components.forEach((component) => {
    Vue.component(component.name, component)
  })
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

// To allow use as module (npm/webpack/etc.) export component
export default {
  install,
  ...components,
}
