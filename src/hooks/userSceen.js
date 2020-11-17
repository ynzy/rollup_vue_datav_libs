import { ref, onMounted, nextTick } from "vue";



export default function useScreen(id) {
  const width = ref(0) //实际宽度
  const height = ref(0) //实际高度
  let dom
  onMounted(() => {
    dom = document.getElementById(id)
    width.value = dom.clientWidth
    height.value = dom.clientHeight
  })
  return {
    width,
    height
  }
}