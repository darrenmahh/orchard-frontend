export default {
  path: "/design_patterns",
  meta: {
    title: "设计模式",
    rank: 1
  },
  children: [
    {
      path: "/design_patterns/index",
      name: "Design_patterns",
      component: () => import("@/views/design_patterns/index.vue"),
      meta: {
        title: "模式选择"
      }
    },
    {
      path: "/design_patterns/flower_season",
      name: "Flower_season",
      component: () => import("@/views/design_patterns/flower_season.vue"),
      meta: {
        title: "花期"
      }
    },
    {
      path: "/design_patterns/pollen_amount",
      name: "Pollen_amount",
      component: () => import("@/views/design_patterns/pollen_amount.vue"),
      meta: {
        title: "花粉量"
      }
    },
    {
      path: "/design_patterns/entire_pattern",
      name: "Entire_pattern",
      component: () => import("@/views/design_patterns/entire_pattern.vue"),
      meta: {
        title: "综合设计"
      }
    }
  ]
} satisfies RouteConfigsTable;
