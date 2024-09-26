<template>
  <div class="Pso-container">
    <div class="suggestion">
      <el-text class="text" type="primary" size="large">粒子群算法 </el-text>
    </div>
    <div class="algorithm">
      <el-button type="primary" @click="pso_main">计算</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
let designPattern = ref<String>();

onMounted(() => {
  console.log("粒子群算法");
  const queryType = route.query.type;
  if (typeof queryType === "string") {
    designPattern.value = queryType;
  } else {
    designPattern.value = "";
  }
  console.log("设计模式是：", designPattern.value);
});

const pso_main = async () => {
  console.log("执行粒子群算法！");
  const response = await axios.post("/api/Pso_pollen_amount");
  console.log("执行完粒子群算法之后的response", response);
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
