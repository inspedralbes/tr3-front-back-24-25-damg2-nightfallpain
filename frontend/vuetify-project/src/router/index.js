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
      { path: "usuarios", name: "Usuarios", component: Usuarios, meta: { requiresMaintenance: "usuarios" } },
      { path: "enemigos", name: "Enemigos", component: Enemigos, meta: { requiresMaintenance: "enemics" } },
      { path: "armas", name: "Armas", component: Armas, meta: { requiresMaintenance: "armes" } },
      { path: "partida", name: "Partida", component: Partida, meta: { requiresMaintenance: "partida" } },
      { path: "estadistica", name: "Estadistica", component: Estadistica, meta: { requiresMaintenance: "estadistiques" } },
      { path: "tienda", name: "Tienda", component: Tienda, meta: { requiresMaintenance: "shops" } },
      { path: "manteniment", name: "Manteniment", component: Manteniment },
    ],
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guard para verificar mantenimiento
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresMaintenance) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}api/${to.meta.requiresMaintenance}/maintenance/status`);
      const data = await response.json();

      if (data.maintenance) {
        window.dispatchEvent(new CustomEvent("show-snackbar", { detail: `Servei de ${to.meta.requiresMaintenance} en mantenimient` }));
        return next(false); // Cancela la navegación
      }
    } catch (error) {
      window.dispatchEvent(new CustomEvent("show-snackbar", { detail: "Error al verificar mantenimient" }));
      return next();
    }
  }

  const token = localStorage.getItem("token");
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  if (to.meta.requiresAuth && (!token || !usuario || usuario.admin !== true)) {
    return next("/");
  }

  next();
});

export default router;
