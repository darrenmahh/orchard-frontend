<template>
  <div class="Design_pattern_container">
    <div class="suggestion">
      <el-text class="text" type="primary" size="large"
        >请选择您要使用的设计模式</el-text
      >
    </div>
    <div class="pattern">
      <el-button
        type="primary"
        @click="navigateTo('Pollen_amount', 'pollen_amount')"
        >花粉量</el-button
      >
      <el-button
        type="primary"
        @click="navigateTo('Flower_season', 'flower_season')"
        >花期</el-button
      >
      <el-button
        type="primary"
        @click="navigateTo('Entire_pattern', 'entire_pattern')"
        >综合设计</el-button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
//占位
import { useNavigation } from "@/composables/useNavigation";

const { navigateTo } = useNavigation();
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

.pattern {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 20px;
}
</style>
