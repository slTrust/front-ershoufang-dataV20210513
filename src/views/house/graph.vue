<template>
  <div class="chart-container">
    <chart height="100%" width="100%" :data="graphData" v-if="graphData!=null"/>
  </div>
</template>

<script>
import Chart from "@/components/Charts/HouseGraph";
import { getGraphHouse } from "@/api/house/house";
export default {
  name: "LineChart",
  components: { Chart },
  data(){
    return {
      graphData:null
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      getGraphHouse()
        .then((response) => {
          this.graphData = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
};
</script>

<style scoped>
.chart-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 84px);
  background: #121340;
}
</style>

