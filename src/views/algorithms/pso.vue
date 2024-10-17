<template>
  <div class="Pso-container">
    <div class="suggestion">
      <el-text class="text" type="primary" size="large"
        >输入最大迭代次数</el-text
      >
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
      <!--      <div class="data_test">-->
      <!--        <el-button type="primary" @click="test">测试</el-button>-->
      <!--        <el-text v-for="(value, key) in data_test" :key="key">-->
      <!--          {{ key }}: {{ value }}-->
      <!--        </el-text>-->
      <!--      </div>-->
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

// 算法所得数据
const algorithmsData = ref({});

const pso_main = async () => {
  if (
    designPattern.value === "pollen_amount" ||
    designPattern.value === "entire_pattern"
  ) {
    const response = await axios.post("/api/Pso_pollen_amount");
    // algorithmsData.value = response.data;

    console.log("执行完花粉量设计模式粒子群算法", response.data);
  } else if (designPattern.value === "flower_season") {
    const response = await axios.post("/api/Pso_flower_season");
    algorithmsData.value = response.data;

    console.log("执行完花期设计模式粒子群算法", response.data);
  } else {
    console.log("设计模式错误");
  }
};

// let data_test = ref();
// const test = async () => {
//   const response = await axios.get("/api/test_data");
//   data_test.value = response.data;
//   console.log("测试数据", response.data);
// };
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
