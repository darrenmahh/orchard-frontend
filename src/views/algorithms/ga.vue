<template>
  <div class="Ga-container">
    <div class="suggestion">
      <el-text class="text" type="primary" size="large">遗传算法 </el-text>
    </div>
    <div class="algorithm">
      <el-button type="primary" @click="ga_main">计算</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
let designPattern = ref<string>("");
// 页面装载的时候获取算法类型
onMounted(() => {
  const queryType = route.query.type;
  if (typeof queryType === "string") {
    designPattern.value = queryType;
  } else {
    designPattern.value = "";
  }
  console.log("设计模式是：", designPattern.value);
});
const ga_main = async () => {
  if (designPattern.value === "pollen_amount") {
    console.log("执行花粉量设计模式遗传算法！");
    const response = await axios.post("/api/Ga_pollen_amount");
    console.log("执行完花粉量设计模式遗传算法之后的response", response);
  } else if (designPattern.value === "flower_season") {
    console.log("执行花期设计模式遗传算法！");
    const response = await axios.post("/api/Ga_flower_season");
    console.log("执行完花期设计模式遗传算法之后的response", response);
  } else {
    console.log("designPattern为空！");
  }
};
</script>

<style scoped lang="scss">
.suggestion {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 20px;
}

.suggestion .text {
  font-size: 30px;
}
</style>
