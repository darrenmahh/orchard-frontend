<template>
  <div class="Pso-container">
    <div class="suggestion">
      <el-text
        v-if="!calculate_success"
        class="text"
        type="primary"
        size="large"
        >输入最大迭代次数</el-text
      >
      <el-text v-else class="text" type="primary" size="large"
        >下面图中正方形内的数字代表树木种类，括号内是根据花粉量得出的该树木种植数量。<br /><el-text
          v-if="isTreeNumber"
          class="text"
          type="primary"
          size="large"
          >颜色代表树木种植数量多少</el-text
        >
        <el-text v-else class="text" type="primary" size="large"
          >颜色代表树木种植的花期长短</el-text
        ></el-text
      >
    </div>

    <div class="ga_calculate">
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
        <el-button type="primary" @click="exhibition">展示</el-button>
      </div>
    </div>
    <div class="algorithm_show">
      <div id="orchard" />
    </div>
    <div class="alteration_show">
      <div
        id="alteration"
        style="width: 100%; height: 800px; overflow-x: auto"
      />
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
    // console.log("页面渲染完成，开始执行算法");
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
      ElMessage.success("最大迭代次数已设置为" + max_iteration.value);
    } else {
      ElMessage.error("设置最大迭代次数时出错");
    }
  } catch (error) {
    ElMessage.error("设置最大迭代次数时出错", error);
  }
};

// 向后端传递最大迭代次数
const max_iteration = ref(100);
const isTreeNumber = ref(true);

// 让后台进行算法计算，并将数据返回
const pso_main = async () => {
  // 根据不同组件跳转执行不同的算法
  if (
    designPattern.value === "pollen_amount" ||
    designPattern.value === "entire_pattern"
  ) {
    axios.post("/api/Pso_pollen_amount").then(response => {
      // algorithm_show(response, "pso", "pollen_amount");
      axios.post("/api/update_orchard_name").then(resp => {
        console.log(resp.data);
        ElMessage.success(response.data);
      });
    });
  } else if (designPattern.value === "flower_season") {
    isTreeNumber.value = false;
    axios.post("/api/Pso_flower_season").then(response => {
      // algorithm_show(response, "pso", "flower_season");
      axios.post("/api/update_orchard_name").then(resp => {
        console.log(resp.data);
        ElMessage.success(response.data);
      });
      // isTreeNumber.value = false;
    });
  } else {
    console.log("设计模式错误");
  }
};

import { useShowOrchard } from "@/composables/useShowOrchard";
import { ElMessage } from "element-plus";
import { useShowPsoFitnessAlteration } from "@/composables/useShowPsoFitnessAlteration";
const { calculate_success, showOrchard } = useShowOrchard();
const { showPsoFitnessAlteration } = useShowPsoFitnessAlteration();

// 测试函数
const exhibition = async () => {
  axios.post("/api/exhibition").then(async response => {
    await nextTick();
    calculate_success.value = true;
    // 获得相应元素
    const orchardElement = document.getElementById("orchard");
    const alterationElement = document.getElementById("alteration");

    // 矩阵图
    if (orchardElement) {
      // 重设 orchard 元素的宽高
      orchardElement.style.width = `${response.data["length"] * 100}px`;
      orchardElement.style.height = `${response.data["width"] * 100}px`;

      // 调用函数展示orchard
      showOrchard(orchardElement, response, designPattern.value);
    } else {
      console.error("找不到 orchard 元素");
    }

    // 柱状图
    if (alterationElement) {
      showPsoFitnessAlteration(
        alterationElement,
        response,
        orchardElement,
        designPattern.value
      );
    } else {
      console.error("找不到result元素");
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

.ga_calculate {
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

.alteration_show {
  display: block;
  margin-top: 30px;
}

#orchard {
  inset: 0 0 20px;
  width: 600px; /* 容器宽度 */
  height: 400px; /* 容器高度 */
  margin: auto;
}
</style>
