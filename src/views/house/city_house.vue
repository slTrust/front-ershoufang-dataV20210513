<template>
  <div class="chart-container">
    <chart-pie
      v-if="pieData!=null"
      height="50%"
      width="100%"
      :data="pieData"
    />
    <chart-column-line
      v-if="columnLineData!=null"
      height="50%"
      width="100%"
      :data="columnLineData"
    />
  </div>
</template>

<script>
import ChartPie from '@/components/Charts/HouseAreaPieCount'
import ChartColumnLine from '@/components/Charts/HouseMaxMinAvgPriceColumnAndLineChart'
import { getPieAreaHouseInfo } from '@/api/house/house'

export default {
  name: 'CityHouse',
  components: { ChartPie, ChartColumnLine },
  data() {
    return {
      chartData: null,
      areaTypeMap: {
        '市内六区': ['heping', 'nankai', 'hexi', 'hebei', 'hedong', 'hongqiao'],
        '环城四区': ['xiqing', 'beichen', 'dongli', 'jinnan'],
        '其他区': ['tanggu', 'kaifaqutj', 'wuqing', 'binhaixinqu', 'baodi', 'jizhou', 'haihejiaoyuyuanqu', 'jinghai']
      },
      pieData: null,
      columnLineData: null
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    execColumnLineData: function(data) {
      const res = {
        categories: [],
        maxLines: [],
        minLines: [],
        avgColumns: []
      }
      data.forEach(item => {
        res.categories.push(item.name)
        res.maxLines.push(item.max_price)
        res.minLines.push(item.min_price)
        res.avgColumns.push(parseInt(item.avg_price))
      })
      return res
    },
    execData: function(data) {
      const res = [
        { name: '市内六区', data: [] },
        { name: '环城四区', data: [] },
        { name: '其他区', data: [] }
      ]
      const mapRes = {}
      data.forEach((info) => {
        const item = {
          name: info.name,
          value: info.count
        }
        for (const area_type in this.areaTypeMap) {
          const code = info.code
          const currentTypeAreaCodes = this.areaTypeMap[area_type]
          if (currentTypeAreaCodes.includes(code)) {
            if (!mapRes[area_type]) {
              mapRes[area_type] = []
            }
            mapRes[area_type].push(item)
          }
        }
      })
      res.forEach(row => {
        row.data = mapRes[row.name]
      })
      return res
    },
    getData() {
      getPieAreaHouseInfo().then(response => {
        this.chartData = response.data
        this.pieData = this.execData(this.chartData)
        this.columnLineData = this.execColumnLineData(this.chartData)
      }).catch(e => {
        console.log(e)
      })
    }
  }
}
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
  background: #121340;
}
</style>

