<template>
  <div class="base-scroll-list" :id="id">
    <div
      class="base-scroll-list-header"
      :style="{
        backgroundColor: actualConfig.headerBg,
        height: `${actualConfig.headerHeight}px`,
        fontSize: `${actualConfig.headerFontSize}px`,
        color: actualConfig.headerColor,
      }"
    >
      <div
        class="header-item base-scroll-list-text"
        v-for="(headerItem, i) in headerData"
        :key="headerItem + i"
        :style="{
          width: `${columnWidths[i]}px`,
          ...headerStyle[i],
        }"
        v-html="headerItem"
        :align="aligns[i]"
      />
    </div>
    <div
      class="base-scroll-list-rows-wrapper"
      :style="{
        height: `${height - actualConfig.headerHeight}px`,
      }"
    >
      <div
        class="base-scroll-list-rows"
        v-for="(rowData, index) in currentRowsData"
        :key="rowData.rowIndex"
        :style="{
          height: `${rowHeights[index]}px`,
          lineHeight: `${rowHeights[index]}px`,
          backgroundColor: rowData.rowIndex % 2 === 0 ? rowBg[1] : rowBg[0],
          fontSize: `${actualConfig.rowFontSize}px`,
          color: actualConfig.rowColor,
        }"
      >
        <div
          class="base-scroll-list-columns base-scroll-list-text"
          v-for="(colData, colIndex) in rowData.data"
          :key="colData + colIndex"
          :style="{
            width: `${columnWidths[colIndex]}px`,
            ...rowStyle[colIndex],
          }"
          v-html="colData"
          :align="aligns[colIndex]"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { onMounted, ref, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import useScreen from '@/hooks/userSceen'
import cloneDeep from 'lodash/cloneDeep'
import assign from 'lodash/assign'
const defaultConfig = {
  // 标题数据，格式：['a','b','c']
  headerData: [],
  // 标题样式，格式：[{},{},{}]
  headerStyle: [],
  // 行样式
  rowStyle: [],
  // 行背景色
  rowBg: [],
  // 标题的背景色
  headerBg: 'rgb(90,90,90)',
  // 标题的高度
  headerHeight: 35,
  // 标题是否展示序号
  headerIndex: false,
  // 序号列标题的内容
  headerIndexContent: '#',
  // 序号列标题的样式
  headerIndexStyle: {
    width: '50px',
  },
  // 序号列的内容
  headerIndexData: [],
  // 序号列内容的样式
  rowIndexStyle: {
    width: '50px',
  },
  // 数据项，二维数组
  data: [],
  // 每页显示数据量
  rowNum: 10,
  // 居中方式
  aligns: [],
  headerFontSize: 28,
  rowFontSize: 28,
  headerColor: '#fff',
  rowColor: '#000',
  moveNum: 1, // 移动的位置
  duration: 2000, // 动画间隔
}
export default {
  name: 'AutoScrollTable',
  props: {
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const id = `base-scroll-list-${uuidv4()}`
    const { width, height } = useScreen(id)
    const actualConfig = ref([])
    const headerData = ref([])
    const headerStyle = ref([])
    const rowStyle = ref([])
    const columnWidths = ref([])
    const rowBg = ref([])
    const rowHeights = ref([])
    const rowsData = ref([])
    const currentRowsData = ref([]) //
    const currentIndex = ref(0) // 动画指针
    const rowNum = ref(defaultConfig.rowNum)
    const aligns = ref([])
    const isAnimationStop = ref(false)
    let avgHeight // 行高
    const handleHeader = (config) => {
      const _headerData = cloneDeep(config.headerData)
      const _headerStyle = cloneDeep(config.headerStyle)
      const _rowStyle = cloneDeep(config.rowStyle)
      const _rowsData = cloneDeep(config.data)
      const _aligns = cloneDeep(config.aligns)
      if (_headerData.length === 0) {
        return
      }
      if (config.headerIndex) {
        _headerData.unshift(config.headerIndexContent)
        _headerStyle.unshift(config.headerIndexStyle)
        _rowStyle.unshift(config.rowIndexStyle)
        _rowsData.forEach((rows, index) => {
          if (config.headerIndexData[index]) {
            rows.unshift(config.headerIndexData[index])
          } else {
            rows.unshift(index + 1)
          }
        })
        _aligns.unshift('center')
      }
      // 动态计算header中每一列的宽度
      let usedWidth = 0
      let usedColumnNum = 0
      // 判断是否自定义width
      _headerStyle.forEach((style) => {
        // 如果自定义width，则按照自定义width进行渲染
        if (style.width) {
          usedWidth += +style.width.replace('px', '')
          usedColumnNum++
        }
      })
      // 动态计算列宽时，使用剩余的宽度除以剩余的列数
      const avgWidth = (width.value - usedWidth) / (_headerData.length - usedColumnNum)
      const _columnWidth = new Array(_headerData.length).fill(avgWidth)
      _headerStyle.forEach((style, index) => {
        // 如果自定义width，则按照自定义width进行渲染
        if (style.width) {
          const headerWidth = +style.width.replace('px', '')
          _columnWidth[index] = headerWidth
        }
      })
      columnWidths.value = _columnWidth
      headerData.value = _headerData
      headerStyle.value = _headerStyle
      rowStyle.value = _rowStyle
      const { rowNum } = config
      if (_rowsData.length >= rowNum && _rowsData.length < rowNum * 2) {
        const newRowData = [..._rowsData, ..._rowsData]
        rowsData.value = newRowData.map((item, index) => ({
          data: item,
          rowIndex: index,
        }))
      } else {
        rowsData.value = _rowsData.map((item, index) => ({
          data: item,
          rowIndex: index,
        }))
      }
      aligns.value = _aligns
      // console.log(_aligns, aligns.value)
    }
    const handleRows = (config) => {
      // 动态计算每行数据的高度
      const { headerHeight } = config
      rowNum.value = config.rowNum
      const unusedHeight = height.value - headerHeight
      // 如果rowNum大于实际数据长度，则以实际数据长度为准
      if (rowNum.value > rowsData.value.length) {
        rowNum.value = rowsData.value.length
      }
      avgHeight = unusedHeight / rowNum.value
      rowHeights.value = new Array(rowNum.value).fill(avgHeight)
      // 获取行背景色
      if (config.rowBg) {
        rowBg.value = config.rowBg
      }
    }
    let a
    const startAnimation = async () => {
      a++
      if (a > 26) return
      const config = actualConfig.value
      const { rowNum, moveNum, duration } = config
      const totalLength = rowsData.value.length
      if (totalLength < rowNum) return
      const index = currentIndex.value
      const _rowsData = cloneDeep(rowsData.value)
      // 将数据重新头尾相连
      const rows = _rowsData.slice(index)
      rows.push(..._rowsData.slice(0, index))
      currentRowsData.value = rows
      console.log(rows[0])
      // 先将所有行的高度还原
      rowHeights.value = new Array(totalLength).fill(avgHeight)
      const waitTime = 300
      if (isAnimationStop.value) {
        return
      }
      await new Promise((resolve) => setTimeout(resolve, waitTime))
      // 将moveNum的行高度设置0
      rowHeights.value.splice(0, moveNum, ...new Array(moveNum).fill(0))
      currentIndex.value += moveNum
      // 是否到达最后一组数据
      const isLast = currentIndex.value - totalLength
      if (isLast >= 0) {
        currentIndex.value = isLast
      }
      if (isAnimationStop.value) {
        return
      }
      await new Promise((resolve) => setTimeout(resolve, duration - waitTime))
      if (isAnimationStop.value) {
        return
      }
      await startAnimation()
    }
    const stopAnimation = () => {
      isAnimationStop.value = true
    }
    const update = () => {
      stopAnimation()
      const _actualConfig = assign(defaultConfig, props.config)
      // 赋值rowsData
      rowsData.value = _actualConfig.data || []
      handleHeader(_actualConfig)
      handleRows(_actualConfig)
      actualConfig.value = _actualConfig
      // 展示动画
      isAnimationStop.value = false
      startAnimation()
    }
    watch(
      () => props.config,
      () => {
        // console.log('watch!', props.config)
        update()
      },
    )
    return {
      id,
      headerData,
      headerStyle,
      rowStyle,
      aligns,
      columnWidths,
      rowHeights,
      rowsData,
      currentRowsData,
      rowBg,
      actualConfig,
      height,
    }
  },
}
</script>
<style lang="scss" scoped>
.base-scroll-list {
  width: 100%;
  height: 100%;
  .base-scroll-list-text {
    /* padding: 0 10px; */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
  }
  .base-scroll-list-header {
    display: flex;
    align-items: center;
    .header-item {
    }
  }
  .base-scroll-list-rows-wrapper {
    overflow: hidden;
    .base-scroll-list-rows {
      display: flex;
      align-items: center;
      transition: all 0.3s linear;
      .base-scroll-list-columns {
        height: 100%;
      }
    }
  }
}
</style>
