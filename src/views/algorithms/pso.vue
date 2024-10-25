<template>
  <div class="Pso-container">
    <div class="suggestion">
      <el-text class="text" type="primary" size="large"
        >输入最大迭代次数</el-text
      >
    </div>

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
        <el-button type="primary" @click="confirmMaxIteration">确认</el-button>
        <el-button type="primary" @click="pso_main">计算</el-button>
        <el-button type="primary" @click="pso_test">测试</el-button>
      </div>
    </div>
    <div class="algorithm_show">
      <div id="orchard" />
    </div>
    <div class="fitness_show">
      <div id="fitness" style="width: 100%; height: 800px" />
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
    console.log("路由查询参数", route.query);
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

// 让后台进行算法计算，并将数据返回
const pso_main = async () => {
  // 根据不同组件跳转执行不同的算法
  if (
    designPattern.value === "pollen_amount" ||
    designPattern.value === "entire_pattern"
  ) {
    axios.post("/api/Pso_pollen_amount").then(response => {
      // algorithm_show(response, "pso", "pollen_amount");
    });
  } else if (designPattern.value === "flower_season") {
    axios.post("/api/Pso_flower_season").then(response => {
      // algorithm_show(response, "pso", "flower_season");
    });
  } else {
    console.log("设计模式错误");
  }
};

import { useShowOrchard } from "@/composables/useShowOrchard";
import { useShowFitnessAlteration } from "@/composables/useShowFitnessAlteration";
const { calculate_success, showOrchard } = useShowOrchard();
const { showFitnessAlteration } = useShowFitnessAlteration();

// 测试函数
const pso_test = async () => {
  axios.post("/api/Pso_test").then(async response => {
    await nextTick();
    console.log("测试数据", response.data);
    calculate_success.value = true;
    // 获得 orchard 元素
    const orchardElement = document.getElementById("orchard");
    const fitnessElement = document.getElementById("fitness");

    if (orchardElement) {
      orchardElement.style.width = `${response.data["length"] * 50}px`;
      orchardElement.style.height = `${response.data["width"] * 50}px`;
      showOrchard(orchardElement, response);
    } else {
      console.error("找不到 orchard 元素");
    }

    if (fitnessElement) {
      showFitnessAlteration(fitnessElement, response);
    } else {
      console.error("找不到alteration元素");
    }
  });
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
  margin-right: 20px;
}

.pso_calculate {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.termination-condition {
  display: flex;
  gap: 16px;
  align-items: center;
}

.algorithm_show {
  display: block;
  margin-top: 30px;
}
</style>
