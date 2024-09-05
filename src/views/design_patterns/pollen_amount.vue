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

    <!--  遗传距离文件上传  -->
    <div class="data-upload">
      <!--  上传的是包含文件信息的对象  -->
      <el-upload
        class="ssr_file_upload"
        action="/api/ssr_file_parse"
        :before-upload="beforeSsrUpload"
        :on-change="handleSsrFileUpload"
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
        v-model="length"
        :min="1"
        placeholder="种子园纵向树木数"
        label="长度"
        class="size-input"
      />

      <el-button type="primary" @click="confirmSize">确认尺寸</el-button>
    </div>

    <!--花粉量文件上传-->
    <div class="pollen-amount-upload">
      <el-upload
        class="pollen_amount_file_upload"
        action="/api/pollen_amount_file_parse"
        :on-sucess="handlePollenAmountFileUpload"
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
        @click="navigateTo('Ga')"
        >遗传算法</el-button
      >
      <el-button
        v-show="pollen_amount_success"
        type="primary"
        class="algorithm_choosing"
        @click="navigateTo('Pso')"
        >粒子群算法</el-button
      >
    </div>
  </div>
</template>

<script lang="ts" name="Pollen_amount" setup>
import { onBeforeUnmount, ref } from "vue";
import { ElMessage, UploadFile } from "element-plus";
import axios from "axios";
import { useRouter, onBeforeRouteLeave } from "vue-router";
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
const length = ref<number | null>(null);

// 控制handleSsrFileChange执行一次
let isHandleSsrFileUpload = ref(false);

// 在这里添加ssr文件格式验证
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

// ssr文件验证正确并上传之后输出文件名字
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

// 验证width以及height数据的正确以及传到后端
const confirmSize = async () => {
  const data = {
    width: width.value,
    length: length.value,
    sum: width.value * length.value
  };
  if (data.width && data.length) {
    // 弹窗提示成功
    ElMessage.success(
      `您输入的尺寸是：横向${data.width}棵树，纵向${data.length}棵树，共${data.sum}棵树`
    );
    console.log("data是", data);
    try {
      // 将数据传给后端
      const response = await axios.post("/api/dimension_parse", data);
      // 将尺寸的状态修改
      status.dimension = true;
      // 执行函数判断遗传距离文件以及尺寸数据能否对上
      if (status.file) {
        await checkUpload();
      }
      // 在控制台输出后端返回的信息
      console.log(response.data);
      //   抓取错误信息
    } catch (error) {
      console.log("尺寸数据上传错误", error);
    }
  } else {
    // 弹窗提示问题
    ElMessage.warning("请正确填写横纵向树木数");
  }
};

// 完成上传遗传距离文件以及尺寸数据之后进行判断
const checkUpload = async () => {
  try {
    const response = await axios.get("/api/data_judge");
    if (response.data.result === true) {
      console.log("遗传距离及尺寸数据上传成功！");
      ssr_data_success.value = false;
    } else {
      console.log("未完成遗传距离及尺寸数据上传，错误为：", response.data);
    }
  } catch (error) {
    console.error("上传错误如下", error);
    ssr_data_success.value = false; // 请求失败时，设置为 false
  }
};

// 控制handlePollenAmountFileUpload执行一次
let isHandlePollenAmountFileUpload = ref(false);
// 上传花粉量文件之前的验证
const beforePollenAmountUpload = (file: File) => {
  if (isHandlePollenAmountFileUpload.value) {
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
const handlePollenAmountFileUpload = async (uploadFile: any) => {
  if (isHandlePollenAmountFileUpload.value) return;
  isHandlePollenAmountFileUpload.value = true;

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
      isHandlePollenAmountFileUpload.value = false;
    }
  } else {
    isHandlePollenAmountFileUpload.value = false;
  }
};

// 路由实例
const router = useRouter();
let isNavigateTo = ref(false);
// 创建跳转路由实例
const navigateTo = (routeName: string) => {
  isNavigateTo.value = true;
  router.push({ name: routeName });
};

onBeforeUnmount(() => {
  alert("退出此界面数据将全部丢失");
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

.pollen-amount-upload {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 20px;
}

.algorithm_choosing {
  margin-left: 20px;
}
</style>
