// 设置优化算法路由目录结构
export default {
  path: "/algorithms",
  meta: {
    icon: "icon-park-solid:arithmetic-buttons",
    title: "优化算法",
    rank: 2
  },
  children: [
    {
      path: "/algorithms/index",
      name: "Algorithms",
      component: () => import("@/views/algorithms/index.vue"),
      meta: {
        title: "首页",
        showLink: false
      }
    },
    {
      path: "/algorithms/ga",
      name: "Ga",
      component: () => import("@/views/algorithms/ga.vue"),
      meta: {
        icon: "material-symbols-light:genetics-rounded",
        title: "遗传算法"
      }
    },
    {
      path: "/algorithms/pso",
      name: "Pso",
      component: () => import("@/views/algorithms/pso.vue"),
      meta: {
        icon: "hugeicons:swarm",
        title: "粒子群算法"
      }
    }
  ]
} satisfies RouteConfigsTable;
