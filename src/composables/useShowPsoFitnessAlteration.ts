import echarts from "@/plugins/echarts";
import { max, min } from "@pureadmin/utils";

export function useShowFitnessAlteration() {
  function showFitnessAlteration(fitnessElement: any, response: any) {
    console.log("展示适应度变化柱状图");

    const myChart = echarts.init(fitnessElement);
    const data = response.data["Fitness_alteration"];
    const option = {
      title: {
        text: "适应度变化"
      },
      tooltip: {
        // 鼠标悬停的时候显示的内容，当前为axis
        trigger: "axis",
        axisPointer: {
          type: "shadow"
        }
      },
      xAxis: {
        type: "category",
        // 用索引代表 generation
        data: data.map((_, index) => `Generation ${index + 1}`),
        axisLabel: {
          interval: 0,
          rotate: 45
        }
      },
      yAxis: {
        type: "value",
        name: "适应度",
        min: min(data),
        max: max(data)
      },
      series: [
        {
          name: "适应度",
          type: "bar",
          data: data,
          itemStyle: {
            color: "#0e3995"
          }
        }
      ]
    };
    myChart.setOption(option); // 更新图表
  }

  return {
    showFitnessAlteration
  };
}
