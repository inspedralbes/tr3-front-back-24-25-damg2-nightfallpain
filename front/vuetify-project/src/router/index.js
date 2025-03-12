import { createRouter, createWebHistory } from "vue-router";
import LoginRegistro from "@/components/Auth/LoginRegistro.vue";
import AdminDashboard from "@/components/Admin/AdminDashboard.vue";
import Estadistica from "@/components/Admin/Estadistica.vue";
import Tienda from "@/components/Admin/Tienda.vue";
import Usuarios from "@/components/Admin/Usuarios.vue";
import Enemigos from "@/components/Admin/Enemigos.vue";
import Armas from "@/components/Admin/Armas.vue";
import Partida from "@/components/Admin/Partida.vue";

const routes = [
  {
    path: "/",
    name: "LoginRegistro",
    component: LoginRegistro,
  },

  {
    path: "/admin",
    component: AdminDashboard,
    children: [
      { path: "usuarios", name: "Usuarios", component: Usuarios },
      { path: "enemigos", name: "Enemigos", component: Enemigos },
      { path: "armas", name: "Armas", component: Armas },
      { path: "partida", name: "Partida", component: Partida },
      { path: "estadistica", name: "Estadistica", component: Estadistica },
      { path: "tienda", name: "Tienda", component: Tienda },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
