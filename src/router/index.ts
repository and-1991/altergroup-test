import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Rooms from "@/views/Rooms.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Rooms",
    component: Rooms
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
