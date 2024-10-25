// 使用 HSL 生成随机颜色
export function useGetRandomColor() {
  return () => {
    const hue = Math.floor(Math.random() * 360); // 色相 (0-360)
    const saturation = Math.floor(Math.random() * 60) + 50; // 饱和度 (50%-100%)
    const lightness = Math.floor(Math.random() * 30) + 60; // 亮度 (40%-70%)
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };
}
