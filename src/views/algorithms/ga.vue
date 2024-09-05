<template>
  <div class="Ga-container">
    <div class="suggestion">
      <el-text class="text" type="primary" size="large"
        >欢迎使用遗传算法
      </el-text>
    </div>
    <div class="algorithm">
      <el-button type="primary" @click="ga_main">计算</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";

const ga_main = async () => {
  const response = await axios.get("/api/Ga_pollen_amount");
  console.log(response);
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
