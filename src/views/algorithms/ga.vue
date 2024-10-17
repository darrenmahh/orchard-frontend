<template>
  <div class="Ga-container">
    <div class="suggestion">
      <el-text class="text" type="primary" size="large">
        输入最大迭代次数
      </el-text>
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
          <el-button type="primary" @click="confirmMaxIteration">
            确认
          </el-button>
        </div>
        <el-button type="primary" @click="ga_main">计算</el-button>
      </div>
    </div>
    <pre>{{ algorithmsData["best_fitness"] }}</pre>
    <pre>{{ formattedAlgorithmsData }}</pre>
  </div>
</template>

<script setup lang="ts">
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useFormattedData } from "@/composables/useFormattedData"; // 引入格式化数据的逻辑

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

const max_iteration = ref<number>(10);
const confirmMaxIteration = async () => {
  try {
    const response = await axios.post("/api/set_max_iteration", {
      max_iteration: max_iteration.value
    });
    if (response.status === 200) {
      ElMessage.success("最大迭代次数已设置为" + max_iteration.value);
      console.log("最大迭代次数已设置为", max_iteration.value);
    } else {
      ElMessage.error("设置最大迭代次数时出错");
      console.error("设置最大迭代次数时出错", response.data);
    }
  } catch (error) {
    console.error("设置最大迭代次数时出错", error);
  }
};

// 导入切换前端界面路由的函数
import { useNavigation } from "@/composables/useNavigation";
// 导入提示信息数据逻辑
import { ElMessage } from "element-plus";
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
    algorithmsData.value = response.data;
    console.log(
      "执行完花粉量设计模式遗传算法之后的algorithmsData",
      algorithmsData
    );
  } else if (designPattern.value === "flower_season") {
    // 执行花期设计模式遗传算法
    const response = await axios.post("/api/Ga_flower_season");
    // 将前端获取的数据赋值给algorithmsData
    algorithmsData.value = response.data;
    console.log(
      "执行完花期设计模式遗传算法之后的algorithmsData"
      // algorithmsData
    );
  } else {
    console.log("designPattern为空！");
    alert("请前往选择设计模式输入算法数据");
    if (confirm("是否跳转到设计模式选择页面?")) {
      navigateTo("Design_patterns", "");
    }
  }
};

// 使用 useFormattedData 来格式化 algorithmsData
const formattedAlgorithmsData = useFormattedData(algorithmsData);
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
