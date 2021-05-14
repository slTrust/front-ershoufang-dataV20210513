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
      default: 'chartColumnLine'
    },
    id: {
      type: String,
      default: 'chart_pie_housechartColumnLine'
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
      type: Object,
      defulat: {}
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
    initChart(res) {
      this.chart = echarts.init(document.getElementById(this.id))
      const option = {
        backgroundColor: '#0f375f',
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['line', 'bar'],
          textStyle: {
            color: '#ccc'
          }
        },
        xAxis: {
          data: res.categories,
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          axisLabel: {
            show: true,
            interval: 0,
            textStyle: {
              color: '#fff'
            }
          }
        },

        yAxis: {
          splitLine: { show: false },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        series: [
          // {
          //   name: '最高价',
          //   type: 'line',
          //   smooth: true,
          //   showAllSymbol: true,
          //   symbol: 'emptyCircle',
          //   symbolSize: 15,
          //   data: res.maxLines
          // },
          // {
          //   name: '最低价',
          //   type: 'line',
          //   smooth: true,
          //   showAllSymbol: true,
          //   symbol: 'emptyCircle',
          //   symbolSize: 15,
          //   data: res.minLines
          // },
          {
            name: '均价',
            type: 'bar',
            barWidth: 10,
            itemStyle: {
              barBorderRadius: 5,
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#14c8d4' },
                  { offset: 1, color: '#43eec6' }
                ]
              )
            },
            data: res.avgColumns
          }]
      }
      this.chart.setOption(option)
    }
  }
}
</script>
