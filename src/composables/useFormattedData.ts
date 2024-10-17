import { computed } from "vue";

export function useFormattedData(data: any) {
  const formattedData = computed(() => {
    // null:不适用任何替换函数，2表示每个级别的缩进空格数为2
    return JSON.stringify(data.value, null, 2);
  });

  return {
    formattedData
  };
}
