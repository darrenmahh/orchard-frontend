import echarts from "@/plugins/echarts";
import { useGetRandomColor } from "@/composables/useGetRandomColor";
import { ref } from "vue";

const calculate_success = ref(false);

// 展示最佳适应度、最佳种子园，矩阵图
export function useShowOrchard() {
  function showOrchard(
    orchardElement: any,
    response: any,
    design_pattern: any,
    index: number | null = null
  ) {
    const myChart = echarts.init(orchardElement); // 初始化图表

    const length = response.data["length"]; // 获取种子园尺寸
    const width = response.data["width"];

    const widthInPx = orchardElement.offsetWidth; // 获取图像容器宽度
    const gap = 2; // 正方形之间的间隔

    const squareSize = (widthInPx - (length - 1) * gap) / length; // 自适应宽度

    function generateGraphics(numbers: any[]) {
      // 获取树木数量最大值
      const max_tree_number = Math.max(...response.data["tree_number_matrix"]);

      // 获取树木花期最大值
      const max_flower_season = Math.max(...response.data["florescence_arr"]);
      // console.log("max_flower_season", max_flower_season);
      // console.log("lllllllllllll", response.data["florescence_minus"]);

      // console.log(
      //   "------------hhhhhh-------",
      //   response.data["florescence_minus"]
      // );
      // 图像配置项
      const graphics = [];

      // 循环设置每个正方形的内容和颜色
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < length; j++) {
          const x = j * (squareSize + gap);
          const y = i * (squareSize + gap);

          const numberIndex = i * length + j;

          // 获取当前树木数量
          const index_tree_number =
            response.data["tree_number_matrix"][numberIndex];

          // 获取当前索引树木花期
          const index_flower_season =
            response.data["florescence_arr"][numberIndex];
          // console.log("index_flower_season", index_flower_season);

          // console.log(max_tree_number, index_tree_number);
          const getRandomColor = useGetRandomColor(
            max_tree_number,
            index_tree_number,
            max_flower_season,
            index_flower_season
          );
          const color = getRandomColor();
          // console.log(color);

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

          const number = numbers[numberIndex];
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
            }
          });
        }
      }
      return graphics;
    }
    let numbers: any[];
    if (
      design_pattern == "pollen_amount" ||
      design_pattern == "entire_pattern"
    ) {
      numbers =
        index === null
          ? response.data["best_orchard"].map(
              (item: any, idx: number) =>
                `${item}(${response.data["tree_number_matrix"][idx]})`
            )
          : response.data["orchard_alteration"][index].map(
              (item: any, idx: number) =>
                `${item}(${response.data["tree_number_matrix"][idx]})`
            );
      // console.log(numbers);
    } else {
      numbers =
        index === null
          ? response.data["best_orchard"]
          : response.data["orchard_alteration"][index];
    }

    const graphics = generateGraphics(numbers);

    const option = {
      graphic: graphics
    };

    // console.log(graphics);

    myChart.resize({ width: "auto", height: "auto" }); // 重置图表尺寸
    myChart.setOption(option); // 更新图表
  }

  return {
    calculate_success,
    showOrchard
  };
}
