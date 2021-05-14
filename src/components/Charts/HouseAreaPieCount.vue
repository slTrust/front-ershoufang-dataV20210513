<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart_pie_houseAreaCount'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    data: {
      type: Array,
      defulat: []
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart(this.data)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {

    initChart(datas) {
      this.chart = echarts.init(document.getElementById(this.id))
      const option = {
        title: {
          text: '天津市二手房分布数量',
          subtext: '来自爬虫统计数据',
          left: 'center',
          textStyle: {
            color: '#fff',
            fontWeight: 'normal',
            fontSize: 14
          }
        },
        series: datas.map((areaInfo, idx) => {
          return {
            name: areaInfo.name,
            type: 'pie',
            radius: [0, 60],
            center: [`${25 + idx * 25}%`, '50%'],
            itemStyle: {
              borderRadius: 5
            },
            label: {
              show: true,
              formatter: '{b}\n{c}({d}%)',
              minMargin: 5,
              lineHeight: 15
            },
            emphasis: {
              label: {
                show: true
              }
            },
            data: areaInfo.data
          }
        })
      }
      this.chart.setOption(option)
    }
  }
}
</script>
