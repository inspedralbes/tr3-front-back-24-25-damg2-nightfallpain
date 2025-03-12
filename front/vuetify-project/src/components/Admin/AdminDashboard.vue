<template>
  <v-app>
    <!-- Barra superior estilo cyberpunk -->
    <v-app-bar app color="#0F1923" dark elevation="3">
      <v-app-bar-nav-icon color="#9C27B0" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="cyberpunk-title">PANEL DE CONTROL</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <!-- Menú lateral estilo cyberpunk -->
    <v-navigation-drawer app v-model="drawer" color="#0F1923" dark>
      <v-list nav>
        <v-list-item to="/admin/usuarios" link class="cyber-item mb-2">
          <v-list-item-icon>
            <v-icon color="#9C27B0">mdi-account-group</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="cyber-text">USUARIOS</v-list-item-title>
        </v-list-item>

        <v-list-item to="/admin/enemigos" link class="cyber-item mb-2">
          <v-list-item-icon>
            <v-icon color="#9C27B0">mdi-skull</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="cyber-text">ENEMIGOS</v-list-item-title>
        </v-list-item>

        <v-list-item to="/admin/armas" link class="cyber-item mb-2">
          <v-list-item-icon>
            <v-icon color="#9C27B0">mdi-pistol</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="cyber-text">ARMAS</v-list-item-title>
        </v-list-item>

        <v-list-item to="/admin/partida" link class="cyber-item mb-2">
          <v-list-item-icon>
            <v-icon color="#9C27B0">mdi-game-crew</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="cyber-text">PARTIDA</v-list-item-title>
        </v-list-item>

        <v-list-item to="/admin/estadistica" link class="cyber-item mb-2">
          <v-list-item-icon>
            <v-icon color="#9C27B0">mdi-chart-bar</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="cyber-text">ESTADÍSTICAS</v-list-item-title>
        </v-list-item>

        <v-list-item to="/admin/tienda" link class="cyber-item mb-2">
          <v-list-item-icon>
            <v-icon color="#9C27B0">mdi-store</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="cyber-text">TIENDA</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Contenido principal con fondo cyberpunk -->
    <v-main class="cyber-background">
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "AdminDashboard",
  data() {
    return {
      drawer: true
    };
  }
};
</script>

<style scoped>
.cyber-background {
  background-color: #151C27;
  background-image: linear-gradient(rgba(15, 25, 35, 0.9), rgba(15, 25, 35, 0.85)), 
                    repeating-linear-gradient(90deg, rgba(0, 225, 255, 0.1) 0px, rgba(0, 225, 255, 0.1) 1px, transparent 1px, transparent 7px);
}

.cyberpunk-title {
  font-family: 'Arial', sans-serif;
  font-weight: 800;
  letter-spacing: 1px;
  color: #9C27B0;
}

.cyber-text {
  font-family: 'Arial', sans-serif;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.cyber-item {
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
}

.cyber-item:hover {
  background: linear-gradient(90deg, rgba(0, 225, 255, 0.15), rgba(15, 25, 35, 0));
  border-left: 3px solid #00E1FF;
}

.cyber-item:hover .v-list-item__title {
  color: #00E1FF;
}

.cyber-border {
  border: 2px solid #9C27B0;
  background-color: #0F1923;
}

.v-list-item__icon {
  margin-right: 16px;
}
</style>