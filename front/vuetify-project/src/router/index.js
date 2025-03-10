import { createRouter, createWebHistory } from "vue-router";
import LoginRegistro from "@/components/LoginRegistro.vue"; // Ajusta la ruta según tu proyecto
import UserDashboard from "@/components/UserDashboard.vue"; // Lo crearemos en el siguiente paso

const routes = [
  {
    path: "/",
    name: "LoginRegistro",
    component: LoginRegistro,
  },
  {
    path: "/dashboard",
    name: "UserDashboard",
    component: UserDashboard,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
