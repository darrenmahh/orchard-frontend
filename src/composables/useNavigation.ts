// src/composables/useNavigation.ts
import { ref } from "vue";
import { useRouter } from "vue-router";

export function useNavigation() {
  const router = useRouter();
  const isNavigateTo = ref(false);

  const navigateTo = (routeName: string, design_pattern: string) => {
    isNavigateTo.value = true;
    router.push({ name: routeName, query: { type: design_pattern } });
  };

  return {
    isNavigateTo,
    navigateTo
  };
}
