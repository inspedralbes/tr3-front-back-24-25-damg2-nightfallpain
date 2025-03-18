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
    meta: {
      requiresAuth: true, // Marcar rutas que requieren autenticación de administrador
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard para verificar la autenticación antes de acceder a las rutas protegidas
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  // Verificar si la ruta requiere autenticación y si el usuario no está autenticado
  if (to.meta.requiresAuth) {
    // Si no hay token o el usuario no es admin, redirigir al login
    if (!token || !usuario || usuario.admin !== true) {
      return next("/");
    }
  }
  next(); // Permitir el acceso
});

export default router;
