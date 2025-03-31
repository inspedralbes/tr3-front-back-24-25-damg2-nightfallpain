<template>
  <v-app>
    <!-- Barra superior estilo cyberpunk -->
    <v-app-bar app color="#0F1923" dark elevation="3">
      <v-app-bar-nav-icon color="#9C27B0" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="cyberpunk-title">PANELL ADMINISTRATIU</v-toolbar-title>
      <v-spacer></v-spacer>

      <!-- Botón para abrir el modo mantenimiento -->
      <v-btn color="#FF1744" @click="openMaintenanceModal">
        <v-icon left>mdi-wrench</v-icon> MANTENIMENT
      </v-btn>

      <!-- Botón de logout -->
      <v-btn color="#9C27B0" @click="logout" class="logout-btn mr-2" elevation="2">
        <v-icon left>mdi-logout</v-icon> LOGOUT
      </v-btn>
    </v-app-bar>

    <!-- Menú lateral estilo cyberpunk -->
    <v-navigation-drawer app v-model="drawer" color="#0F1923" dark>
      <v-list nav>
        <v-list-item to="/admin/usuarios" link class="cyber-item mb-2">
          <v-list-item-icon><v-icon color="#9C27B0">mdi-account-group</v-icon></v-list-item-icon>
          <v-list-item-title class="cyber-text">USUARIS</v-list-item-title>
        </v-list-item>

        <v-list-item to="/admin/enemigos" link class="cyber-item mb-2">
          <v-list-item-icon><v-icon color="#9C27B0">mdi-skull</v-icon></v-list-item-icon>
          <v-list-item-title class="cyber-text">ENEMICS</v-list-item-title>
        </v-list-item>

        <v-list-item to="/admin/armas" link class="cyber-item mb-2">
          <v-list-item-icon><v-icon color="#9C27B0">mdi-pistol</v-icon></v-list-item-icon>
          <v-list-item-title class="cyber-text">ARMES</v-list-item-title>
        </v-list-item>

        <v-list-item to="/admin/partida" link class="cyber-item mb-2">
          <v-list-item-icon><v-icon color="#9C27B0">mdi-gamepad-variant</v-icon></v-list-item-icon>
          <v-list-item-title class="cyber-text">PARTIDES</v-list-item-title>
        </v-list-item>

        <v-list-item to="/admin/estadistica" link class="cyber-item mb-2">
          <v-list-item-icon><v-icon color="#9C27B0">mdi-chart-bar</v-icon></v-list-item-icon>
          <v-list-item-title class="cyber-text">ESTADÍSTIQUES</v-list-item-title>
        </v-list-item>

        <v-list-item to="/admin/tienda" link class="cyber-item mb-2">
          <v-list-item-icon><v-icon color="#9C27B0">mdi-store</v-icon></v-list-item-icon>
          <v-list-item-title class="cyber-text">BOTIGA</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Contenido principal -->
    <v-main class="cyber-background">
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>

    <!-- Modal de Mantenimiento -->
    <!-- Modal de Mantenimiento -->
  <v-dialog v-model="maintenanceModalVisible" max-width="600px">
    <v-card class="cyber-maintenance-modal">
      <v-card-title class="modal-title d-flex align-center">
        <v-icon left color="#b700ff" class="mr-3">mdi-wrench-cog</v-icon>
        <span class="cyberpunk-glitch">Mode Mantenimient</span>
      </v-card-title>
      <v-divider class="cyber-divider"></v-divider>
      <v-card-text class="px-0">
        <v-list class="cyber-list" color="transparent">
          <v-list-item 
            v-for="(service, index) in services" 
            :key="index" 
            class="cyber-list-item"
          >
            <v-list-item-content>
              <v-list-item-title class="cyber-service-name">
                {{ service.name }}
              </v-list-item-title>
            </v-list-item-content>
            <v-list-item-action>
              <v-switch 
                v-model="service.maintenance" 
                @change="toggleMaintenance(service)"
                color="#b700ff"
                class="cyber-switch"
              ></v-switch>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn 
          color="#9C27B0" 
          text 
          @click="closeMaintenanceModal" 
          class="cyber-close-btn"
        >
          Tancar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>


  </v-app>
</template>

<script>
import { io } from "socket.io-client";
export default {
  name: "AdminDashboard",
  data() {
    return {
      drawer: true,
      maintenanceModalVisible: false,
      socket: null, // Guardamos la instancia de Socket.IO
      services: [
        { name: "Usuaris", endpoint: "usuarios", maintenance: false },
        { name: "Enemics", endpoint: "enemics", maintenance: false },
        { name: "Armes", endpoint: "armes", maintenance: false },
        { name: "Partides", endpoint: "partida", maintenance: false },
        { name: "Estadístiques", endpoint: "estadistiques", maintenance: false },
        { name: "Botiga", endpoint: "shops", maintenance: false }
      ]
    };
  },
  created() {
    // Conectar con el servidor de sockets
    this.socket = io(import.meta.env.VITE_API_URL);

    // Escuchar eventos de mantenimiento en tiempo real
    this.socket.on("maintenanceUpdate", (data) => {
      console.log(`Modo mantenimiento actualizado para ${data.service}: ${data.status}`);
      
      const service = this.services.find(s => s.endpoint === data.service);
      if (service) {
        service.maintenance = data.status;
      }
    });

    // Cargar estado inicial de mantenimiento
    this.checkMaintenanceStatus();
  },
  beforeUnmount() {
    // Desconectar socket cuando el componente se desmonte
    if (this.socket) {
      this.socket.disconnect();
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      this.$router.push("/");
    },
    openMaintenanceModal() {
      this.maintenanceModalVisible = true;
      this.checkMaintenanceStatus();
    },
    closeMaintenanceModal() {
      this.maintenanceModalVisible = false;
    },
    async checkMaintenanceStatus() {
      try {
        const promises = this.services.map(async (service) => {
          const response = await fetch(`${import.meta.env.VITE_API_URL}api/${service.endpoint}/maintenance/status`);
          const data = await response.json();
          service.maintenance = data.maintenance;
        });
        await Promise.all(promises);
      } catch (error) {
        console.error("Error verificando estado de mantenimiento:", error);
      }
    },
    async toggleMaintenance(service) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/${service.endpoint}/maintenance/toggle`, {
          method: "POST",
          headers: { "Content-Type": "application/json" }
        });
        const data = await response.json();
        service.maintenance = data.maintenance;
      } catch (error) {
        console.error(`Error cambiando mantenimiento de ${service.name}:`, error);
      }
    }
  }
};
</script>

<style scoped>
.cyber-maintenance-modal {
  background-color: #0F1923 !important;
  border: 2px solid #b700ff;
  box-shadow: 0 0 15px rgba(0, 229, 255, 0.3);
}

.modal-title {
  color: #a205e0 !important;
  font-family: "Orbitron", sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cyberpunk-glitch {
  position: relative;
  text-shadow: 
    0 0 5px #b700ff, 
    0 0 10px #b700ff;
}

.cyber-divider {
  background-color: #9b05d6;
  opacity: 0.3;
}

.cyber-list {
  background-color: rgba(15, 25, 35, 0.8);
}

.cyber-list-item {
  transition: background-color 0.3s ease;
}

.cyber-list-item:hover {
  background-color: rgba(0, 229, 255, 0.1);
}

.cyber-service-name {
  color: #9C27B0;
  font-family: "Orbitron", sans-serif;
}

.cyber-switch {
  --v-track-opacity: 0.3;
}

.cyber-close-btn {
  font-family: "Orbitron", sans-serif;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.cyber-close-btn:hover {
  background-color: rgba(156, 39, 176, 0.2);
  box-shadow: 0 0 10px rgba(156, 39, 176, 0.3);
}
.cyber-background {
  background-color: #151C27;
  background-image: linear-gradient(rgba(15, 25, 35, 0.9), rgba(15, 25, 35, 0.85)),
                     repeating-linear-gradient(90deg, rgba(0, 225, 255, 0.1) 0px, rgba(0, 225, 255, 0.1) 1px, transparent 1px, transparent 7px);
}

.cyberpunk-title {
  font-family: "Orbitron", sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #9C27B0;
  text-shadow: 0 0 5px #9C27B0, 0 0 10px #9C27B0;
}

.logout-btn {
  font-family: "Orbitron", sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: #7B1FA2 !important;
  box-shadow: 0 0 10px rgba(156, 39, 176, 0.7);
}
</style>
