import echarts from "@/plugins/echarts";
import { max, min } from "@pureadmin/utils";

export function useShowRatioAlteration() {
  function showRatioAlteration(fitnessElement: any, response: any) {
    console.log("在适应度柱状图上添加比率变化折线图");

    // 获取现有图表实例
    let myChart = echarts.getInstanceByDom(fitnessElement);
    if (!myChart) {
      myChart = echarts.init(fitnessElement);
    }

    // 折线图数据
    const mutationRatioData = response.data["Mutation_ratio_alteration"];
    const crossoverRatioData = response.data["Crossover_ratio_alteration"];

    // 获取现有的 option
    let option = (myChart.getOption() as echarts.EChartsCoreOption) || {};

    // 如果 option 不存在，初始化 option 配置（仅用于首次加载）
    if (!option) {
      const fitnessData = response.data["Fitness_alteration"];
      option = {
        title: { text: "适应度变化和比率变化" },
        tooltip: { trigger: "axis", axisPointer: { type: "cross" } },
        legend: { data: ["适应度", "突变率", "交叉率"] },
        xAxis: {
          type: "category",
          data: fitnessData.map((_, index) => `Generation ${index + 1}`),
          axisLabel: { interval: 0, rotate: 45 }
        },
        yAxis: [
          {
            type: "value",
            name: "适应度",
            min: min(fitnessData),
            max: max(fitnessData)
          },
          { type: "value", name: "比率", min: 0, max: 1, position: "right" }
        ],
        series: [
          {
            name: "适应度",
            type: "bar",
            data: fitnessData,
            itemStyle: { color: "#0e3995" }
          }
        ]
      };
    }

    // 追加折线图系列到现有的 series 中
    option.series = [
      ...(Array.isArray(option.series) ? option.series : []), // 强制 option.series 为数组
      {
        name: "突变率",
        type: "line",
        yAxisIndex: 1, // 使用右侧Y轴
        data: mutationRatioData,
        itemStyle: { color: "#ff7f50" }
      },
      {
        name: "交叉率",
        type: "line",
        yAxisIndex: 1, // 使用右侧Y轴
        data: crossoverRatioData,
        itemStyle: { color: "#87cefa" }
      }
    ];

    // 更新图表，不覆盖已有柱状图
    myChart.setOption(option, { notMerge: true });
  }

  return {
    showRatioAlteration
  };
}
