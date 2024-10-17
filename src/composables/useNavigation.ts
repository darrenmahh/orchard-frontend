// src/composables/useNavigation.ts
import { ref } from "vue";
import { useRouter } from "vue-router";

export function useNavigation() {
  const router = useRouter();
  const isNavigateTo = ref(false);

  const navigateTo = (routeName: string, design_pattern: string) => {
    isNavigateTo.value = true;
    router
      .push({ name: routeName, query: { type: design_pattern } })
      .then(() => {
        // 在这里添加导航完成后的逻辑
        console.log(
          `Navigated to ${routeName} with design pattern ${design_pattern}`
        );
      })
      .catch(error => {
        console.error("Navigation error:", error);
      });
  };

  return {
    isNavigateTo,
    navigateTo
  };
}
