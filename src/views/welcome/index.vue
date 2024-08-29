<template>
  <div>
    <h1>Pure-Admin-Thin（非国际化版本）</h1>
    <!-- 使用 v-if 判断 loginData 是否存在 -->
    <!--    <p v-if="loginData">登录成功！数据：{{ loginData.message }}</p>-->
    <!--    <p v-else>正在加载...</p>-->
  </div>
</template>

<script setup lang="ts" name="Welcome">
import { ref, onMounted } from "vue";
import axios from "axios";

// 定义用于存储登录接口返回数据的变量
// const loginData = ref<any>(null);

// 定义一个函数用于获取登录数据
// const fetchLoginData = async () => {
//   try {
//     // 使用 GET 请求访问 /login 接口
//     const response = await axios.get("/api/run/ga_main");
//     loginData.value = response.data; // 存储返回的数据
//   } catch (error) {
//     console.error("Failed to fetch login data:", error);
//   }
// };

// 在组件挂载时调用函数获取数据
// onMounted(() => {
//   fetchLoginData();
// });
</script>
