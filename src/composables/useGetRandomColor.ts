// 使用 HSL 生成随机颜色
export function useGetRandomColor(
  max_tree_number,
  index_tree_number,
  max_flower_season,
  index_flower_season
) {
  if (max_tree_number && index_tree_number) {
    console.log("花粉量控制颜色");
    console.log(max_tree_number, index_tree_number);
    return () => {
      const hue = 120 + index_tree_number * 5; // 色相 (0-360)
      const saturation =
        Math.floor((index_tree_number / max_tree_number) * 80) + 20; // 饱和度 (50%-100%)
      const lightness =
        Math.floor((index_tree_number / max_tree_number) * 50) + 30; // 亮度 (40%-70%)
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };
  } else {
    console.log("花期控制颜色");
    console.log(max_flower_season, index_flower_season);
    return () => {
      const hue = 120 + index_flower_season * 5; // 色相 (0-360)
      const saturation =
        Math.floor((index_flower_season / max_flower_season) * 80) + 20; // 饱和度 (50%-100%)
      const lightness =
        Math.floor((index_flower_season / max_flower_season) * 50) + 30; // 亮度 (40%-70%)
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };
  }
}
