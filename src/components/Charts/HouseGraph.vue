<template>
  <div :id="id" :class="className" :style="{ height: height, width: width }" />
</template>
<script>
import echarts from "echarts";
import resize from "./mixins/resize";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart",
    },
    id: {
      type: String,
      default: "chart",
    },
    width: {
      type: String,
      default: "200px",
    },
    height: {
      type: String,
      default: "200px",
    },
    data: {
      type: Object,
      defulat: {},
    },
  },
  data() {
    return {
      chart: null,
      graphData: null,
      dataArr: [],
      dots: [],
      lines: [],
    };
  },
  mounted() {
    this.graphData = this.data;
    console.log(this.graphData);
    this.initChart();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    getData() {},
    initChart() {
      let { dots, lines } = this.setGraphData();
      console.log(dots);
      console.log(lines);
      this.setGraph(dots, lines);
    },
    setGraphCategoryColor() {
      let mapCategory = {};
      let mapColor = {
        root: "#b9353f",

        和平: "#cb592d",
        南开: "#e4ae3e",
        河西: "#f0ca45",
        河北: "#fce54d",
        河东: "#dbe04c",

        红桥: "#acc345",
        西青: "#54a834",
        北辰: "#409056",
        东丽: "#459cbc",
        津南: "#3885a6",

        塘沽: "#3179b2",
        开发区: "#5d649a",
        武清: "#6c4594",
        滨海新区: "#873171",
        宝坻: "#3c62a6",
        蓟州: "#983071",
        海河教育园区: "#a82f70",

        静海: "#b03157",
      };
      let rootNode = JSON.parse(JSON.stringify(this.graphData));
      mapCategory[rootNode.name] = mapColor["root"];
      let currentNode = this.graphData;
      currentNode.children.forEach((e) => {
        let color = mapColor[e.name] || "black";
        mapCategory[e.name] = color;
      });
      return mapCategory;
    },
    setGraphData() {
      let mapCategory = {};
      let dots = [];
      let lines = [];

      let rootNode = JSON.parse(JSON.stringify(this.graphData));
      mapCategory[rootNode.name] = 1;
      delete rootNode.children;
      let currentNode = this.graphData;
      currentNode.children.forEach((e) => {
        mapCategory[e.name] = 1;
      });
      dots.push({
        name: rootNode.code,
        pname: rootNode.pcode,
        direction: rootNode.direction,
        _name: rootNode.name,
        descr: rootNode.descr,
        symbolSize: 120,
      });
      function forEachDeepNode(node) {
        node.forEach((item) => {
          dots.push({
            name: item.code,
            pname: item.pcode,
            _name: item.name,
            direction: item.direction,
            descr: item.descr,
            symbolSize: 70,
          });
          lines.push({
            source: item.code,
            target: item.pcode,
            label: {
              show: true,
              formatter: function () {
                return item.descr || "";
              },
            },
          });
          if (item.children != null) {
            forEachDeepNode(item.children);
          }
        });
      }
      forEachDeepNode(currentNode.children);
      return {
        dots,
        lines,
      };
    },
    setGraph(dot, lines) {
      let _this = this;
      let option = {
        title: {
          text: "",
          left: "10",
          top: 10,
          textStyle: {
            color: "#fff",
            fontSize: 32,
          },
        },
        tooltip: {
          show: false,
        },
        toolbox: {
          show: false,
        },
        series: [
          {
            type: "graph", // 类型:关系图
            layout: "force", //图的布局，类型为力导图
            symbolSize: 100, // 调整节点的大小
            roam: true,
            edgeSymbol: ["arrow", ""],
            // edgeSymbol: ['circle', 'arrow'],
            // edgeSymbolSize: [2, 10],
            label: {
              normal: {
                show: true,
                textStyle: {
                  fontSize: 12,
                  color: "#fff",
                },
                formatter: (data, b, c) => {
                  let params = data.data._name;
                  let newParamsName = ""; // 最终拼接成的字符串
                  let paramsNameNumber = params.length; // 实际标签的个数
                  let provideNumber = 10; // 每行能显示的字的个数
                  let rowNumber = Math.ceil(paramsNameNumber / provideNumber); // 换行的话，需要显示几行，向上取整
                  /**
                   * 判断标签的个数是否大于规定的个数， 如果大于，则进行换行处理 如果不大于，即等于或小于，就返回原标签
                   */
                  // 条件等同于rowNumber>1
                  if (paramsNameNumber > provideNumber) {
                    /** 循环每一行,p表示行 */
                    for (let p = 0; p < rowNumber; p++) {
                      let tempStr = ""; // 表示每一次截取的字符串
                      let start = p * provideNumber; // 开始截取的位置
                      let end = start + provideNumber; // 结束截取的位置
                      // 此处特殊处理最后一行的索引值
                      if (p === rowNumber - 1) {
                        // 最后一次不换行
                        tempStr = params.substring(start, paramsNameNumber);
                      } else {
                        // 每一次拼接字符串并换行
                        tempStr = params.substring(start, end) + "\n";
                      }
                      newParamsName += tempStr; // 最终拼成的字符串
                    }
                  } else {
                    // 将旧标签的值赋给新标签
                    newParamsName = params;
                  }
                  //将最终的字符串返回
                  return newParamsName;
                },
              },
            },
            force: {
              edgeLength: [300, 400],
              // edgeLength: 80, //默认距离
              repulsion: 700, //斥力
            },
            draggable: true,
            lineStyle: {
              normal: {
                width: 2,
                color: "#f9f9f9",
              },
            },
            edgeLabel: {
              normal: {
                show: false,
              },
            },
            data: dot,
            links: lines,
            itemStyle: {
              normal: {
                color: function (params) {
                  // return 'red'
                  return _this.findInCategoryColor(params, dot);
                },
              },
            },
            // categories: categories,
          },
        ],
      };
      this.chart = echarts.init(document.getElementById(this.id));
      this.chart.setOption(option);
    },
    findInCategoryColor(params, allNode) {
      let map = this.setGraphCategoryColor();
      let data = params.data;
      let res = "black";
      let levelRelation = [];
      function findUp(start, allNode) {
        allNode.forEach((item) => {
          if (item.name === start) {
            levelRelation.push(item.name);
            if (item.pname && levelRelation.includes(item.pname) === false) {
              findUp(item.pname, allNode);
            }
          }
        });
      }
      findUp(data.name, allNode);
      // 逐级向上查找
      // console.log('-------------逐级向上查找')
      let levelRelationNames = levelRelation.map((code) => {
        let item = allNode.find((e) => e.name === code);
        return item._name;
      });
      levelRelationNames.forEach((item) => {});
      for (let i = 0; i < levelRelationNames.length; i++) {
        let item = levelRelationNames[i];
        if (item in map) {
          res = map[item];
          break;
        }
      }
      return res;
    },
  },
};
</script>
