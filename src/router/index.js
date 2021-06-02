import { createRouter, createWebHistory } from "vue-router";

import DashboardLayout from "@/layout/DashboardLayout";
import AuthLayout from "@/layout/AuthLayout";

import Dashboard from "../views/Pages/Dashboard.vue";
import Icons from "../views/Pages/Icons.vue";
import Maps from "../views/Pages/Maps.vue";
import Profile from "../views/Pages/UserProfile.vue";
import Tables from "../views/Pages/Tables.vue";
import Orders from "../views/Pages/Orders.vue";
import OrderDetail from "../views/Pages/Orders/OrderDetail.vue";
import Records from "../views/Pages/Records.vue";
import Products from "../views/Pages/Products.vue";

import Login from "../views/Auth/Login.vue";
import Register from "../views/Auth/Register.vue";
import ForgetPassword from "../views/Auth/ForgetPassword.vue";

import store from '../store/index';

const routes = [
  {
    path: "/",
    redirect: "/dashboard",
    component: DashboardLayout,
    children: [
      {
        path: "/dashboard",
        name: "dashboard",
        components: { default: Dashboard },
      },
      {
        path: "/icons",
        name: "icons",
        components: { default: Icons },
      },
      {
        path: "/maps",
        name: "maps",
        components: { default: Maps },
      },
      {
        path: "/profile",
        name: "profile",
        components: { default: Profile },
      },
      {
        path: "/tables",
        name: "tables",
        components: { default: Tables },
      },
      {
        path: "/orders",
        name: "orders",
        components: { default: Orders },
        children: [{
          path: ':orderId',
          components: { default: OrderDetail },
          props: { default: true, },
        }],
      },
      {
        path: "/records",
        name: "records",
        components: { default: Records },
      },
      {
        path: "/products",
        name: "products",
        components: { default: Products },
      },
    ],
  },
  {
    path: "/",
    redirect: "login",
    component: AuthLayout,
    children: [
      {
        path: "/login",
        name: "login",
        components: { default: Login },
      },
      {
        path: "/register",
        name: "register",
        components: { default: Register },
      },
      {
        path: "/forgetpassword",
        name: "forgetpassword",
        components: { default: ForgetPassword },
      },
    ],
  },
  { path: '/:notFound(.*)', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  linkActiveClass: "active",
  routes,
});

router.beforeEach(async function (to, from, next) {
  if (to.path !== '/login' &&
    to.path !== '/register' &&
    to.path !== '/forgetpassword') {
    const token = localStorage.getItem("token");
    if (token) {
      await store.dispatch({
        type: "auth/checkLocalToken",
        token,
      });

      if (!store.getters["auth/token"]) {
        next({ name: 'login' });
      } else {

        await store.dispatch("auth/fetchUserData", { token });
        await store.dispatch("carry/login", { token });
        next();
      }
    } else {
      next({ name: 'login' });
    }
  } else {
    next();
  }
});

export default router;
