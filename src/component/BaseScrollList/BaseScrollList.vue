<!-- BaseScrollList组件
 -->
<template>
  <div class="base-scroll-list" :id="id">
    <div
      class="base-scroll-list-header"
      :style="{
        height: `${actualConfig.headerHeight}px`,
        fontSize: `${actualConfig.headerFontSize}px`,
        color: actualConfig.headerColor,
        backgroundColor: actualConfig.headerBg,
      }"
    >
      <!--  :align="aligns[headerIndex]" -->
      <div
        class="header-item base-scroll-list-text"
        v-for="(headerItem, headerIndex) in headerData"
        :key="headerIndex"
        :style="{
          justifyContent: aligns[headerIndex],
          width: `${columnWidths[headerIndex]}px`,
          ...headerStyle[headerIndex],
        }"
        v-html="headerItem"
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
          fontSize: `${actualConfig.rowFontSize}px`,
          color: actualConfig.rowColor,
          backgroundColor: rowData.rowIndex % 2 === 0 ? rowBg[1] : rowBg[0],
        }"
      >
        <div
          class="base-scroll-list-columns base-scroll-list-text"
          v-for="(colData, colIndex) in rowData.data"
          :key="colData + colIndex"
          :style="{
            justifyContent: aligns[colIndex],
            width: `${columnWidths[colIndex]}px`,
            ...rowStyle[colIndex],
          }"
          v-html="colData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import useScreen from '@/hooks/userSceen'
import cloneDeep from 'lodash/cloneDeep' // 按需加载，只使用cloneDeep
import assign from 'lodash/assign'

// 默认配置
const defaultConfig = {
  // 标题数据，格式[a,b,c]
  headerData: [],
  // 标题高度
  headerHeight: 28,
  // 标题样式,格式[{},{},{}]
  headerStyle: [],
  // 标题背景颜色
  headerBg: '#5a5a5a',
  // 标题字号
  headerFontSize: 28,
  // 标题字体颜色
  headerColor: '#fff',
  // 行样式
  rowStyle: [],
  // 行背景样式，格式['',''],奇偶列
  rowBg: [],
  // 行字号
  rowFontSize: 20,
  // 行字体颜色
  rowColor: '#000',
  // 标题是否展示序号
  headerIndex: false,
  // 序号列标题的内容
  headerIndexContent: '#',
  // 序号列标题的样式
  headerIndexStyle: {
    width: '50px',
  },
  // 序号列内容的样式
  rowIndexStyle: {
    width: '50px',
  },
  // 数据项，二维数组
  data: [],
  // 每页显示数据量
  rowNum: 10,
  // 居中方式 center flex-start flex-end
  aligns: [],
  // 移动的位置
  moveNum: 1,
  // 动画间隔时间
  duration: 2000,
}
export default {
  name: 'BaseScrollList',
  props: {
    config: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const { config } = props

    const uuid = uuidv4()
    const state = reactive({
      id: `base-scroll-list-${uuid}`,
      actualConfig: {}, // 合并后要配置的config
      headerData: [], // 头部数据
      headerStyle: [], // 头部样式
      rowStyle: [], // 行样式
      rowBg: [], // 行背景
      columnWidths: [], // 每一列的宽度
      rowsData: [], // 行 总数据
      currentRowsData: [], // 当前展示的数据
      currentIndex: 0, // 动画指针
      rowHeights: [],
      rowNum: defaultConfig.rowNum,
      aligns: [],
    })

    let avgHeight // 行高
    // 容器的宽高
    const { width, height } = useScreen(state.id)
    // 动态计算header
    const handleHeader = (config) => {
      const _headerData = cloneDeep(config.headerData)
      const _headerStyle = cloneDeep(config.headerStyle)
      const _rowStyle = cloneDeep(config.rowStyle)
      const _rowsData = cloneDeep(config.data)
      const _aligns = cloneDeep(config.aligns)
      if (_headerData.length === 0) {
        return
      }
      //! 如果需要展示序号，将内容和样式分别做添加
      if (config.headerIndex) {
        _headerData.unshift(config.headerIndexContent)
        _headerStyle.unshift(config.headerIndexStyle)
        _rowStyle.unshift(config.rowIndexStyle)
        _rowsData.forEach((rows, index) => {
          rows.unshift(index + 1)
        })
        _aligns.unshift('center')
      }
      //! 动态计算header中每一列的宽度
      let usedWidth = 0 // 已经使用了的宽度
      let usedColumnNum = 0 // 定义了宽度的数据长度
      // 判断是否自定义width
      _headerStyle.forEach((style) => {
        // 如果自定义width，则按照自定义width进行渲染
        if (style.width) {
          usedWidth += +style.width.replace('px', '')
          usedColumnNum++
        }
      })
      // 动态计算列宽时，使用剩余的宽度除以剩余的列数
      // (总宽度 - 使用的宽度) / (数据总长度-定义了数据的长度)
      const avgWidth = (width.value - usedWidth) / (_headerData.length - usedColumnNum)
      // 将每一列的宽度设置成一样的
      // fill() 方法用一个固定值填充一个数组中从起始索引到终止索引内的全部元素
      const _columnWidth = new Array(_headerData.length).fill(avgWidth)

      //! 对 columnWidth进行一次更新，使行数据宽度和头部标题宽度保持一致
      _headerStyle.forEach((style, index) => {
        // 如果自定义width，则按照自定义width进行渲染
        if (style.width) {
          const headerWidth = +style.width.replace('px', '')
          _columnWidth[index] = headerWidth
        }
      })

      state.columnWidths = _columnWidth
      // 每次对state.headerData操作unshift都会出发一次渲染
      // 建议使用深拷贝对象进行变更，然后再赋值
      state.headerData = _headerData
      state.headerStyle = _headerStyle
      const { rowNum } = config
      // 加入两倍数据
      if (_rowsData.length * 2 > rowNum && _rowsData.length < rowNum * 2) {
        const newRowData = [..._rowsData, ..._rowsData]
        state.rowsData = newRowData.map((item, index) => ({
          data: item,
          rowIndex: index,
        }))
      } else {
        state.rowsData = _rowsData.map((item, index) => ({
          data: item,
          rowIndex: index,
        }))
      }

      state.rowStyle = _rowStyle
      state.aligns = _aligns
    }

    // 动态计算行数据
    const handleRows = (config) => {
      // 动态计算每行数据的高度
      const { headerHeight, rowNum } = config
      state.rowNum = rowNum
      const unUsedHeight = height.value - headerHeight
      // 如果rowNum大于实际数据长度，则以实际数据长度为准
      if (state.rowNum > state.rowsData.length) {
        state.rowNum = state.rowsData.length
      }
      avgHeight = unUsedHeight / state.rowNum
      const _rowHeights = new Array(state.rowNum).fill(avgHeight)
      state.rowHeights = _rowHeights

      // 获取行背景色
      if (config.rowBg) {
        state.rowBg = config.rowBg
      }
    }

    const startAnimation = async () => {
      const { actualConfig, currentIndex, rowsData } = state
      const { rowNum, moveNum, duration } = actualConfig
      const totalLength = rowsData.length
      if (totalLength < rowNum) return
      const index = currentIndex
      const _rowsData = cloneDeep(rowsData)
      // 将数据重新头尾连接
      // 初始数据 [a,b,c,d,e,f,g]  index=1
      // 改变后数据 [b,c,d,e,f,g,a]
      const rows = _rowsData.slice(index) // [b,c,d,e,f,g]
      rows.push(..._rowsData.slice(0, index))
      state.currentRowsData = rows
      //! 动画
      // 先将所有行的高度还原
      state.rowHeights = new Array(totalLength).fill(avgHeight)
      // 设置间隔时间
      const waitTime = 300
      await new Promise((resolve) => setTimeout(resolve, waitTime))

      // 将moveNum的行高设置0
      // [1,2,3,4,5].splice(0,2,..[0,0])
      state.rowHeights.splice(0, moveNum, ...new Array(moveNum).fill(0))
      state.currentIndex += moveNum
      // 是否到达最后一组数据
      const isLast = currentIndex - totalLength
      // 到达最后一组数据，重置指针为剩余的index，因为moveNum可能是1,2,3...
      if (isLast >= 0) {
        state.currentIndex = isLast
      }
      // sleep
      await new Promise((resolve) => setTimeout(resolve, duration - waitTime))
      // 延迟操作
      await startAnimation()
    }
    onMounted(() => {
      // 合并配置项
      const _actualConfig = assign(defaultConfig, props.config)
      //行数据赋值
      state.rowsData = _actualConfig.data || []
      handleHeader(_actualConfig)
      handleRows(_actualConfig)
      state.actualConfig = _actualConfig
      // 展示动画
      startAnimation()
    })
    return {
      ...toRefs(state),
      width,
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
    padding: 0 10px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    box-sizing: border-box;
  }
  .base-scroll-list-header {
    display: flex;
    font-size: 15px;
    .header-item {
      display: flex;
      align-items: center;
    }
  }
  .base-scroll-list-rows-wrapper {
    overflow: hidden;
    .base-scroll-list-rows {
      display: flex;
      font-size: 28px;
      transition: all 0.3s linear;
      .base-scroll-list-columns {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
