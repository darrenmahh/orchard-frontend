<template>
  <div class="Ga-container">
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

    <div class="algorithm">
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
          <el-button type="primary" @click="confirmMaxIteration">
            确认
          </el-button>
          <el-button type="primary" @click="ga_main">计算</el-button>
          <el-button type="primary" @click="exhibition">展示</el-button>
        </div>
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
import axios from "axios";
import { onMounted, ref, nextTick } from "vue";
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

const max_iteration = ref<number>(100);
const isTreeNumber = ref(true);

const confirmMaxIteration = async () => {
  try {
    const response = await axios.post("/api/set_max_iteration", {
      max_iteration: max_iteration.value
    });
    if (response.status === 200) {
      ElMessage.success("最大迭代次数已设置为" + max_iteration.value);
    } else {
      ElMessage.error("设置最大迭代次数时出错");
    }
  } catch (error) {
    ElMessage.error("设置最大迭代次数时出错", error);
  }
};

// 导入切换前端界面路由的函数
import { useNavigation } from "@/composables/useNavigation";
// 导入提示信息数据逻辑
import { ElMessage } from "element-plus";
import { useShowOrchard } from "@/composables/useShowOrchard";
import { useShowGaFitnessAndRatioAlteration } from "@/composables/useShowGaFitnessAndRatioAlteration";
// navigateTo代表切换前端界面路由的函数
const { navigateTo } = useNavigation();

// 接收后端返回的算法数据
const algorithmsData = ref({}); // 初始化为空对象

// 遗传算法计算
const ga_main = async () => {
  if (
    designPattern.value === "pollen_amount" ||
    designPattern.value === "entire_pattern"
  ) {
    // 执行花粉量设计模式遗传算法
    const response = await axios.post("/api/Ga_pollen_amount");
    // 将后端返回的数据接收到algorithmsData
    algorithmsData.value = response.data;

    // 根据tree_name修改参数
    axios.post("/api/update_orchard_name").then(resp => {
      console.log(resp.data);
      ElMessage.success("花粉量设计模式遗传算法执行完毕");
    });

    console.log(
      "执行完花粉量设计模式遗传算法之后的algorithmsData",
      algorithmsData
    );
  } else if (designPattern.value === "flower_season") {
    // 执行花期设计模式遗传算法
    const response = await axios.post("/api/Ga_flower_season");
    // 将前端获取的数据赋值给algorithmsData
    algorithmsData.value = response.data;
    await axios.post("/api/update_orchard_name").then(resp => {
      console.log(resp.data);
      ElMessage.success("花期设计模式遗传算法执行完毕");
    });

    console.log(
      "执行完花期设计模式遗传算法之后的algorithmsData"
      // algorithmsData
    );
    // isTreeNumber.value = false;
  } else {
    console.log("designPattern为空！");
    alert("请前往选择设计模式输入算法数据");
    if (confirm("是否跳转到设计模式选择页面?")) {
      navigateTo("Design_patterns", "");
    }
  }
};

const { calculate_success, showOrchard } = useShowOrchard();
const { showGaFitnessAndRatioAlteration } =
  useShowGaFitnessAndRatioAlteration();

// ga算法展示
const exhibition = () => {
  console.log(designPattern.value);
  axios.post("/api/exhibition").then(async response => {
    await nextTick();
    calculate_success.value = true;

    // 获得相应元素
    const orchardElement = document.getElementById("orchard");
    const alterationElement = document.getElementById("alteration");

    // 绘图
    if (
      designPattern.value == "pollen_amount" ||
      designPattern.value == "entire_pattern"
    ) {
      // 绘制矩阵图
      if (orchardElement) {
        // 重设画布大小
        orchardElement.style.width = `${response.data["length"] * 100}px`;
        orchardElement.style.height = `${response.data["width"] * 100}px`;

        showOrchard(orchardElement, response, designPattern.value);
      } else {
        console.log("找不到 orchard 元素");
      }

      // 绘制柱状图
      if (alterationElement) {
        showGaFitnessAndRatioAlteration(
          alterationElement,
          response,
          orchardElement,
          designPattern.value
        );
      } else {
        console.log("找不到 alteration 元素");
      }
    } else if (designPattern.value == "flower_season") {
      isTreeNumber.value = false;
      // 绘制矩阵图
      if (orchardElement) {
        // 重设画布大小
        orchardElement.style.width = `${response.data["length"] * 100}px`;
        orchardElement.style.height = `${response.data["width"] * 100}px`;

        showOrchard(orchardElement, response, designPattern.value);
      } else {
        console.log("找不到 orchard 元素");
      }

      // 绘制柱状图
      if (alterationElement) {
        showGaFitnessAndRatioAlteration(
          alterationElement,
          response,
          orchardElement,
          designPattern.value
        );
      } else {
        console.log("找不到 alteration 元素");
      }
    } else {
      console.log("设计模式错误");
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
