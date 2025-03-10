import { createRouter, createWebHistory } from "vue-router";
import LoginRegistro from "@/components/Auth/LoginRegistro.vue";
import UserDashboard from "@/components/User/UserDashboard.vue";
import AdminDashboard from "@/components/Admin/AdminDashboard.vue";
import Estadistica from "@/components/User/Estadistica.vue";
import Tienda from "@/components/User/Tienda.vue";
import Usuarios from "@/components/Admin/Usuarios.vue";
import Enemigos from "@/components/Admin/Enemigos.vue";
import Armas from "@/components/Admin/Armas.vue";
import Skins from "@/components/Admin/Skins.vue";

const routes = [
  {
    path: "/",
    name: "LoginRegistro",
    component: LoginRegistro,
  },
  {
    path: "/dashboard",
    component: UserDashboard,
    children: [
      { path: "estadistica", name: "Estadistica", component: Estadistica },
      { path: "tienda", name: "Tienda", component: Tienda },
    ],
  },
  {
    path: "/admin",
    component: AdminDashboard,
    children: [
      { path: "usuarios", name: "Usuarios", component: Usuarios },
      { path: "enemigos", name: "Enemigos", component: Enemigos },
      { path: "armas", name: "Armas", component: Armas },
      { path: "skins", name: "Skins", component: Skins },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
