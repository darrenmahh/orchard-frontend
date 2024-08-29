<template>
  <div class="pollen_amount">
    <div class="notion">
      <transition name="tip">
        <el-text
          v-if="ssr_data_success"
          class="text"
          type="primary"
          size="large"
          >请输入您的种子园遗传距离数据以及尺寸数据
        </el-text>
        <el-text
          v-else-if="pollen_amount_success"
          class="text"
          type="primary"
          size="large"
          >请选择算法
        </el-text>
        <el-text v-else class="text" type="primary" size="large"
          >请输入您的种子园花粉量数据
        </el-text>
      </transition>
    </div>
    <!--    遗传距离文件上传-->
    <div class="data-upload">
      <!--  上传的是包含文件信息的对象  -->
      <el-upload
        class="ssr_file_upload"
        action="/api/ssr_file_parse"
        :on-change="handleSsrFileChange"
        :before-upload="beforeSsrUpload"
        :show-file-list="false"
      >
        <el-button type="primary" class="file">上传遗传距离文件</el-button>
      </el-upload>

      <el-input-number
        v-model="width"
        :min="1"
        placeholder="种子园横向树木数"
        label="宽度"
        class="size-input"
      />

      <el-input-number
        v-model="height"
        :min="1"
        placeholder="种子园纵向树木数"
        label="高度"
        class="size-input"
      />

      <el-button type="primary" @click="confirmSize">确认尺寸</el-button>
    </div>

    <!--花粉量文件上传-->
    <div class="pollen-amount-upload">
      <el-upload
        class="pollen_amount_file_upload"
        action="/api/pollen_amount_file_parse"
        :on-change="handlePollenAmountFileChange"
        :before-upload="beforePollenAmountUpload"
        :show-file-list="false"
      >
        <template v-slot:trigger>
          <el-button v-show="!ssr_data_success" type="primary" class="file"
            >上传花粉量文件</el-button
          >
        </template>
      </el-upload>
      <el-button
        v-show="pollen_amount_success"
        type="primary"
        class="algorithm_choosing"
        >遗传算法</el-button
      >
      <el-button
        v-show="pollen_amount_success"
        type="primary"
        class="algorithm_choosing"
        >粒子群算法</el-button
      >
    </div>
  </div>
</template>

<script lang="ts" name="Pollen_amount" setup>
import { onBeforeUnmount, ref } from "vue";
import { ElMessage, UploadFile } from "element-plus";
import axios from "axios";
// 跟踪遗传距离文件、尺寸数据、花粉量文件上传状态
const status = {
  file: false,
  dimension: false
};

// 判断ssr文件以及尺寸数据上传是否成功
let ssr_data_success = ref(true);
// 判断花粉量文件上传是否成功
let pollen_amount_success = ref(false);

// 种子园的横向及纵向树木数
const width = ref<number | null>(null);
const height = ref<number | null>(null);

// 控制handleSsrFileChange执行一次
let isHandleSsrFileChange = ref(false);

// ssr文件验证正确并上传之后输出文件名字
const handleSsrFileChange = async (uploadFile: any) => {
  if (isHandleSsrFileChange.value) return;
  isHandleSsrFileChange.value = true;

  const file = uploadFile.raw; // 直接获取 File 对象
  if (file) {
    console.log("文件名字是：", file.name);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/ssr_file_parse", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      ElMessage.success("遗传距离文件上传成功");
      status.file = true;
      checkUpload();
      console.log(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      isHandleSsrFileChange.value = false;
    }
  } else {
    isHandleSsrFileChange.value = false;
  }
};

// 在这里添加ssr文件格式验证
const beforeSsrUpload = (file: File) => {
  if (isHandleSsrFileChange.value) {
    // ElMessage.warning("文件上传正在进行中，请稍等");
    return false; // 阻止上传
  }
  const isSSR = file.name.endsWith(".xlsx") || file.name.endsWith(".csv");
  if (!isSSR) {
    ElMessage.error("上传文件格式不正确，请选择SSR文件");
  }
  return isSSR;
};

// 验证width以及height数据的正确以及传到后端
const confirmSize = async () => {
  const data = {
    width: width.value,
    height: height.value
  };
  if (width.value && height.value) {
    // 弹窗提示成功
    ElMessage.success(
      `您输入的尺寸是: 宽度 ${width.value}, 高度 ${height.value}`
    );
    console.log(data);
    try {
      // 将数据传给后端
      const response = await axios.post("/api/dimension_parse", data);
      // 将尺寸的状态修改
      status.dimension = true;
      // 执行函数判断遗传距离文件以及尺寸数据能否对上
      checkUpload();
      // 在控制台输出后端返回的信息
      console.log(response.data);
      //   抓取错误信息
    } catch (error) {
      console.log("尺寸数据上传错误", error);
    }
  } else {
    // 弹窗提示问题
    ElMessage.warning("请填写完整的宽度和高度");
  }
};

// 完成上传遗传距离文件以及尺寸数据之后进行判断
const checkUpload = async () => {
  if (status.file && status.dimension) {
    try {
      const response = await axios.get("/api/data_judge");
      if (response.data.result === true) {
        console.log("Data is valid:", response.data);
        ssr_data_success.value = false;
      } else {
        console.log("Data is not valid:", response.data);
      }
    } catch (error) {
      console.error("Error while checking data:", error);
      ssr_data_success.value = false; // 请求失败时，设置为 false
    }
  }
};

// 控制handlePollenAmountFileChange执行一次
let isHandlePollenAmountFileChange = ref(false);
// 上传花粉量文件之前的验证
const beforePollenAmountUpload = (file: File) => {
  if (isHandlePollenAmountFileChange.value) {
    // 文件上传时阻止相同数据再次上传
    return false;
  }
  const isPollenAmount =
    file.name.endsWith(".xlsx") || file.name.endsWith(".csv");
  if (!isPollenAmount) {
    ElMessage.error("上传的花粉量文件数据不正确，请上传正确文件");
  }
  return isPollenAmount;
};

// 花粉量文件验证之后
const handlePollenAmountFileChange = async (uploadFile: any) => {
  if (isHandlePollenAmountFileChange.value) return;
  isHandlePollenAmountFileChange.value = true;

  const file = uploadFile.raw;
  if (file) {
    console.log("文件名字是：", file.name);

    // 借用formData传递数据，创建键值对
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "/api/pollen_amount_file_parse",
        // 上传的formData，并指定上传格式
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );
      // 上传之后将上传成功的标志置true
      pollen_amount_success.value = true;
      ElMessage.success("上传花粉量文件成功");
      console.log(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      isHandlePollenAmountFileChange.value = false;
    }
  } else {
    isHandlePollenAmountFileChange.value = false;
  }
};

onBeforeUnmount(() => {
  alert("退出此界面数据将全部丢失");
});
</script>

<style scoped>
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

.size-input {
  width: 200px;
}

.pollen-amount-upload {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 20px;
}

.algorithm_choosing {
  margin-left: 20px;
}

.transition-container {
  position: relative; /* 确保子元素绝对定位相对于此 */
  height: 100px; /* 根据内容调整高度 */
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter,
.fade-leave-to {
  position: absolute; /* 绝对定位以保持重叠 */
  top: 0;
  left: 0;
  opacity: 0; /* 进入和离开时透明度为 0 */
}
</style>
