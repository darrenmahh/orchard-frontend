<template>
  <div class="Pso-container">
    <div class="suggestion">
      <el-text class="text" type="primary" size="large">粒子群算法 </el-text>
    </div>
    <div class="algorithm">
      <div class="pso_calculate">
        <div class="termination-condition">
          <el-input-number
            v-model="max_iteration"
            placeholder="最大迭代次数"
            label="最大迭代次数"
            class="max_iteration"
            :min="10"
            :step="10"
          />
          <el-button type="primary" @click="confirmMaxIteration"
            >确认</el-button
          >
        </div>
        <el-button type="primary" @click="pso_main">计算</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

const route = useRoute();
let designPattern = ref("");

onMounted(() => {
  nextTick(() => {
    console.log("页面渲染完成，开始执行算法");
    const queryType = route.query.type;
    if (typeof queryType === "string") {
      designPattern.value = queryType;
    } else {
      designPattern.value = "";
    }
    console.log("设计模式是：", designPattern.value);
  });
});

const confirmMaxIteration = async () => {
  try {
    const response = await axios.post("/api/set_max_iteration", {
      max_iteration: max_iteration.value
    });
    if (response.status === 200) {
      console.log("最大迭代次数已设置为", max_iteration.value);
    } else {
      console.error("设置最大迭代次数时出错", response.data);
    }
  } catch (error) {
    console.error("设置最大迭代次数时出错", error);
  }
};

// 向后端传递最大迭代次数
const max_iteration = ref(10);

const pso_main = async () => {
  try {
    console.log("执行粒子群算法！");
    const response = await axios.post("/api/Pso_pollen_amount");
    console.log("执行完粒子群算法之后的response", response);
  } catch (error) {
    console.error("执行粒子群算法时出错", error);
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

.max_iteration {
  display: flex;
  gap: 16px;
  align-items: center;
  width: 200px;
  //margin: auto;
}

.pso_calculate {
  display: flex;
  gap: 16px;
  align-items: center;
}

.termination-condition {
  display: flex;
  gap: 16px;
  align-items: center;
}
</style>
