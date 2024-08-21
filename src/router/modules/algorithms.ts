// 设置优化算法路由目录结构
export default {
  path: "/algorithms",
  meta: {
    title: "优化算法"
  },
  children: [
    {
      path: "/algorithms/index",
      name: "Algorithms",
      component: () => import("@/views/algorithms/index.vue"),
      meta: {
        title: "首页"
      }
    },
    {
      path: "/algorithms/ga",
      name: "Ga",
      component: () => import("@/views/algorithms/ga.vue"),
      meta: {
        title: "遗传算法"
      }
    },
    {
      path: "/algorithms/pso",
      name: "Pso",
      component: () => import("@/views/algorithms/pso.vue"),
      meta: {
        title: "粒子群算法"
      }
    }
  ]
} satisfies RouteConfigsTable;
