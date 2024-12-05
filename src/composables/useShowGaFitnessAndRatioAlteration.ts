import echarts from "@/plugins/echarts";
import { max, min } from "@pureadmin/utils";
import { useShowOrchard } from "./useShowOrchard";

// Ga结果展示，包括适应度、变异率、交叉率，柱状图和折线图
export function useShowGaFitnessAndRatioAlteration() {
  function showGaFitnessAndRatioAlteration(
    alterationElement: any,
    response: any,
    orchardElement: any,
    design_pattern: any
  ) {
    console.log("Ga结果展示，包括适应度、变异率、交叉率，柱状图和折线图");

    const myChart = echarts.init(alterationElement);

    const fitnessData = response.data["Fitness_alteration"];
    const mutationRatioData = response.data["Mutation_ratio_alteration"];
    const crossoverRatioData = response.data["Crossover_ratio_alteration"];

    // 获取 fitnessData 的最大值和最小值
    const fitnessMax = Math.ceil(max(fitnessData));
    const fitnessMin = Math.floor(min(fitnessData));

    // 配置图表选项
    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "cross" }
      },
      xAxis: {
        type: "category",
        data: Array.from({ length: fitnessData.length }, (_, i) => i + 1),
        name: "Generation",
        nameGap: 30
      },
      yAxis: [
        {
          type: "value",
          name: "Fitness",
          min: fitnessMin,
          max: fitnessMax,
          position: "left"
        },
        {
          type: "value",
          name: "Ratio",
          min: 0,
          max: 1,
          position: "right",
          axisLabel: {
            padding: [0, 0, 10, 0]
          }
        }
      ],
      series: [
        {
          name: "Fitness",
          type: "bar", // 修改为柱状图
          data: fitnessData,
          yAxisIndex: 0,
          itemStyle: {
            color: "#5470C6"
          }
        },
        {
          name: "Mutation Ratio",
          type: "line",
          data: mutationRatioData,
          yAxisIndex: 1,
          smooth: true,
          lineStyle: {
            color: "#91CC75"
          }
        },
        {
          name: "Crossover Ratio",
          type: "line",
          data: crossoverRatioData,
          yAxisIndex: 1,
          smooth: true,
          lineStyle: {
            color: "#EE6666"
          }
        }
      ]
    };

    // 设置图表选项并渲染
    myChart.setOption(option);

    // 监听点击事件
    myChart.on("click", function (params) {
      // console.log(
      //   "点击的代的种子园",
      //   response.data["orchard_alteration"][params.dataIndex]
      // );
      // console.log(
      //   "点击的代的适应度",
      //   response.data["Fitness_alteration"][params.dataIndex]
      // );

      const { showOrchard } = useShowOrchard();
      showOrchard(orchardElement, response, design_pattern, params.dataIndex);
    });
  }

  return {
    showGaFitnessAndRatioAlteration
  };
}
