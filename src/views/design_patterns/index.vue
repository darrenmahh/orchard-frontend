<template>
  <div>
    <h2>请选择您的设计模式</h2>
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
</template>

<script setup lang="ts">
//占位
import { useNavigation } from "@/composables/useNavigation";

const { navigateTo } = useNavigation();
</script>

<style scoped lang="scss">
//占位
</style>
