import echarts from "@/plugins/echarts";
import { useGetRandomColor } from "@/composables/useGetRandomColor";
import { ref } from "vue";

const calculate_success = ref(false);

export function useShowOrchard() {
  function showOrchard(orchardElement: any, response: any) {
    console.log("展示最佳适应度、最佳种子园");

    const myChart = echarts.init(orchardElement); // 初始化图表

    const length = response.data["length"]; // 获取种子园尺寸
    const width = response.data["width"];

    const widthInPx = orchardElement.offsetWidth; // 获取图像容器宽度
    const gap = 2; //正方形之间的间隔

    const squareSize = (widthInPx - (length - 1) * gap) / length; // 自适应宽度

    console.log("length", length, "width", width); // 打印种子园尺寸

    let graphics = [];

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < length; j++) {
        const x = j * (squareSize + gap);
        const y = i * (squareSize + gap);
        const getRandomColor = useGetRandomColor();
        const color = getRandomColor();

        graphics.push({
          type: "rect",
          shape: {
            x: x,
            y: y,
            width: squareSize,
            height: squareSize
          },
          style: {
            fill: color
          }
        });

        const numberIndex = i * length + j;
        const number = response.data["best_orchard"][numberIndex] || 0;
        graphics.push({
          type: "text",
          style: {
            text: number,
            x: x + squareSize / 2,
            y: y + squareSize / 2,
            textAlign: "center",
            textVerticalAlign: "middle",
            fontSize: 20,
            fill: "#0e3995"
            // fontWeight: "bold"
          }
        });
      }
    }
    const option = {
      graphic: graphics
    };
    myChart.resize(); // 重置图表尺寸
    myChart.setOption(option); // 更新图表
  }

  return {
    calculate_success,
    showOrchard
  };
}
