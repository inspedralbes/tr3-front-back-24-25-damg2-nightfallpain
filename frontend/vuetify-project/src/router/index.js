import { createRouter, createWebHistory } from "vue-router";
import LoginRegistro from "@/components/Auth/LoginRegistro.vue";
import AdminDashboard from "@/components/Admin/AdminDashboard.vue";
import Estadistica from "@/components/Admin/Estadistica.vue";
import Tienda from "@/components/Admin/Tienda.vue";
import Usuarios from "@/components/Admin/Usuarios.vue";
import Enemigos from "@/components/Admin/Enemigos.vue";
import Armas from "@/components/Admin/Armas.vue";
import Partida from "@/components/Admin/Partida.vue";
import Manteniment from "@/components/Admin/Manteniment.vue";

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
      { 
        path: "usuarios", 
        name: "Usuarios", 
        component: Usuarios,
        meta: {
          requiresMaintenance: true // Añadimos meta para control de mantenimiento
        }
      },
      { path: "enemigos", name: "Enemigos", component: Enemigos },
      { path: "armas", name: "Armas", component: Armas },
      { path: "partida", name: "Partida", component: Partida },
      { path: "estadistica", name: "Estadistica", component: Estadistica },
      { path: "tienda", name: "Tienda", component: Tienda },
      { path: "manteniment", name: "Manteniment", component: Manteniment },
    ],
    meta: {
      requiresAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard para verificar mantenimiento
router.beforeEach(async (to, from, next) => {
  // Verificar si la ruta requiere check de mantenimiento
  if (to.meta.requiresMaintenance) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/usuarios/maintenance/status`);
      const data = await response.json();

      if (data.maintenance) {
        
         return next(new Error('Servicio de usuarios en mantenimiento'));
      }
    } catch (error) {
      console.error("Error al verificar estado de mantenimiento:", error);
      // En caso de error, permitir acceso para evitar bloqueo total
      return next();
    }
  }

  // Verificar autenticación (mantenemos la lógica anterior)
  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (to.meta.requiresAuth) {
    if (!token || !usuario || usuario.admin !== true) {
      return next("/");
    }
  }

  next();
});

export default router;