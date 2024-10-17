<template>
  <div class="flower_season">
    <!--  顶部提示信息  -->
    <div class="notion">
      <transition name="tip">
        <el-text v-if="ssr_data_ok" class="text" type="primary" size="large"
          >请输入您的种子园遗传距离数据以及尺寸数据
        </el-text>
        <el-text
          v-else-if="flower_season_ok"
          class="text"
          type="primary"
          size="large"
          >请选择算法
        </el-text>
        <el-text v-else class="text" type="primary" size="large"
          >请输入您的种子园花期数据
        </el-text>
      </transition>
    </div>

    <div class="data-upload">
      <el-upload
        class="ssr_file_upload"
        action="/api/ssr_file_parse"
        :show-file-list="false"
        :on-change="handleSsrFileUpload"
        :before-upload="beforeSsrUpload"
      >
        <el-button type="primary" class="file">上传遗传距离文件</el-button>
      </el-upload>

      <el-input-number
        v-model="width"
        placeholder="种子园横向树木数"
        label="宽度"
        class="size-input"
        :min="1"
      />
      <el-input-number
        v-model="length"
        placeholder="种子园纵向树木数"
        label="长度"
        class="size-input"
        :min="1"
      />
      <el-button type="primary" @click="confirmSize">确认尺寸</el-button>
    </div>

    <div class="flower_season_upload">
      <el-upload
        class="flower_season_file_upload"
        action="/api/flower_season_file_parse"
        :on-change="handleFlowerSeasonFileUpload"
        :before-upload="beforeFlowerSeasonFileUpload"
        :show-file-list="false"
      >
        <template v-slot:trigger>
          <el-button v-show="!ssr_data_ok" type="primary" class="file"
            >上传花期文件</el-button
          >
        </template>
      </el-upload>

      <el-button
        v-show="flower_season_ok"
        type="primary"
        class="algorithm_choosing"
        @click="navigateTo('Ga', 'flower_season')"
        >遗传算法</el-button
      >
      <el-button
        v-show="flower_season_ok"
        type="primary"
        class="algorithm_choosing"
        @click="navigateTo('Pso', 'flower_season')"
        >粒子群算法</el-button
      >
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios";

// 跟踪文件以及尺寸上传状态
const status = {
  file: false,
  dimension: false
};

const width = ref<number | null>(null);
const length = ref<number | null>(null);

// 判断ssr文件以及尺寸数据上传是否成功
let ssr_data_ok = ref(true);
// 判断花粉量文件上传是否成功
let flower_season_ok = ref(false);
let isHandleSsrFileUpload = ref(false);

// 上传文件之前的验证
const beforeSsrUpload = (file: File) => {
  // 若是正在上传就阻止其再次上传
  if (isHandleSsrFileUpload.value) {
    ElMessage.warning("文件正在上传中，请稍等");
    return false;
  }
  const isSSR = file.name.endsWith(".xlsx") || file.name.endsWith(".csv");
  if (!isSSR) {
    ElMessage.error("上传文件格式不正确，请选择xlsx或csv格式文件");
    return false;
  }
  return true;
};

// 控制上传相同文件时只执行一次函数

const handleSsrFileUpload = async (uploadFile: any) => {
  console.log("调用handleSsrFileUpload");
  if (isHandleSsrFileUpload.value) return;
  isHandleSsrFileUpload.value = true;

  const file = uploadFile.raw;
  if (file) {
    console.log("文件名字是：", file.name);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/ssr_file_parse", {
        method: "POST",
        body: formData
      });

      const result = await response.json(); // 解析 JSON 响应
      console.log("花期handleSsrFileUpload函数返回的result：", result);
      if (response.ok) {
        status.file = true;
        if (status.dimension) {
          await checkUpload();
        }
        ElMessage.success(result.message); // 显示成功信息
      } else {
        ElMessage.error(result.message); // 显示错误信息
      }
    } catch (error) {
      console.error(error);
      ElMessage.error("请求失败，请重试。"); // 处理请求错误
    } finally {
      isHandleSsrFileUpload.value = false; // 在最终处理后重置状态
    }
  } else {
    isHandleSsrFileUpload.value = false;
  }
};

const confirmSize = async () => {
  const data = {
    width: width.value,
    length: length.value,
    sum: width.value * length.value
  };
  if (data.width && data.length) {
    ElMessage.success(
      `您输入的尺寸是：横向${data.width}棵树，纵向${data.length}棵树，共${data.sum}棵树`
    );
    console.log("data是", data);
    try {
      // 传递数据给后端并获取返回值
      const response = await axios.post("/api/dimension_parse", data);
      // 传递成功就将尺寸数据状态修改
      status.dimension = true;
      // 如果文件也已上传
      if (status.file) {
        await checkUpload();
      }
    } catch (e) {
      console.log("尺寸数据上传错误", e);
    }
  } else {
    ElMessage.warning("请正确填写横纵向树木数");
  }
};

const checkUpload = async () => {
  console.log("checkUpload成功");
  try {
    const response = await axios.get("/api/data_judge");
    if (response.data.result === true) {
      console.log("遗传距离及尺寸数据上传成功！");
      ssr_data_ok.value = false;
    } else {
      console.log("未完成遗传距离及尺寸数据上传，错误为：", response.data);
    }
  } catch (e) {
    console.log("上传错误如下", e);
    ssr_data_ok.value = false;
  }
};

const beforeFlowerSeasonFileUpload = (file: File) => {
  // 若是正在上传就阻止再次上传相同文件
  if (isHandleFlowerSeasonFileUpload.value) {
    return false;
  }
  const isFlowerSeason =
    file.name.endsWith(".xlsx") || file.name.endsWith(".csv");
  if (!isFlowerSeason) {
    ElMessage.error("上传的花期数据不正确，请上传正确文件");
    return false;
  }
  return true;
};

// 使用标志位来控制函数执行次数
let isHandleFlowerSeasonFileUpload = ref(false);

const handleFlowerSeasonFileUpload = async (uploadFile: any) => {
  console.log("handleFlowerSeasonFileChange");
  if (isHandleFlowerSeasonFileUpload.value) return;
  isHandleFlowerSeasonFileUpload.value = true;

  const file = uploadFile.raw;
  console.log("file", file);
  if (file) {
    console.log("文件名字是：", file.name);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "/api/flower_season_file_parse",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      // 上传之后将上传成功的标志置true
      flower_season_ok.value = true;
      ElMessage.success("上传花期文件成功！");
    } catch (error) {
      console.log(error);
    }
  } else {
    isHandleFlowerSeasonFileUpload.value = false;
  }
};

// 创建路由实例
// const router = useRouter();
// let isNavigateTo = ref(false);
// const navigateTo = (routeName: string, design_pattern: string) => {
//   isNavigateTo.value = true;
//   router.push({ name: routeName, query: { type: design_pattern } });
//   console.log("design_pattern", design_pattern);
// };

import { useNavigation } from "@/composables/useNavigation";
import { useRouter } from "vue-router";
const { isNavigateTo, navigateTo } = useNavigation();

const router = useRouter();
// 只有用户点击算法选择按钮时才会跳转
router.beforeEach((to, from, next) => {
  if (!isNavigateTo.value && (status.file || status.dimension)) {
    const userConfirmed = confirm("退出此界面数据将全部丢失。是否继续？");
    if (userConfirmed) {
      axios
        .post("/api/reset_algorithms_data")
        .then(() => {
          next();
        })
        .catch(error => {
          console.error("未能重置算法数据", error);
          next(false);
        });
    } else {
      next(false);
    }
  } else {
    next();
  }
});
</script>

<style scoped lang="scss">
.notion {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 20px;
}

.notion .text {
  font-size: 30px;
}

.data-upload {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 20px;
}

.file {
  width: 120px;
  padding: 8px 15px;
}

// 尺寸输入框
.size-input {
  width: 200px;
}

.flower_season_upload {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 20px;
}
</style>
