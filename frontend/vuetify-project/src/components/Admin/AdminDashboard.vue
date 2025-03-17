<template>
  <v-app>
    <!-- Barra superior estilo cyberpunk -->
    <v-app-bar app color="#0F1923" dark elevation="3">
      <v-app-bar-nav-icon color="#9C27B0" @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="cyberpunk-title">PANELL ADMINISTRATIU</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <!-- Menú lateral estilo cyberpunk -->
    <v-navigation-drawer app v-model="drawer" color="#0F1923" dark>
      <v-list nav>
        <v-list-item to="/admin/usuarios" link class="cyber-item mb-2">
          <v-list-item-icon>
            <v-icon color="#9C27B0">mdi-account-group</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="cyber-text">USUARIS</v-list-item-title>
        </v-list-item>

        <v-list-item to="/admin/enemigos" link class="cyber-item mb-2">
          <v-list-item-icon>
            <v-icon color="#9C27B0">mdi-skull</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="cyber-text">ENEMICS</v-list-item-title>
        </v-list-item>

        <v-list-item to="/admin/armas" link class="cyber-item mb-2">
          <v-list-item-icon>
            <v-icon color="#9C27B0">mdi-pistol</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="cyber-text">ARMES</v-list-item-title>
        </v-list-item>

        <v-list-item to="/admin/partida" link class="cyber-item mb-2">
          <v-list-item-icon>
            <v-icon color="#9C27B0">mdi-gamepad-variant</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="cyber-text">PARTIDES</v-list-item-title>
        </v-list-item>

        <v-list-item to="/admin/estadistica" link class="cyber-item mb-2">
          <v-list-item-icon>
            <v-icon color="#9C27B0">mdi-chart-bar</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="cyber-text">ESTADÍSTIQUES</v-list-item-title>
        </v-list-item>

        <v-list-item to="/admin/tienda" link class="cyber-item mb-2">
          <v-list-item-icon>
            <v-icon color="#9C27B0">mdi-store</v-icon>
          </v-list-item-icon>
          <v-list-item-title class="cyber-text">BOTIGA</v-list-item-title>
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
  font-family: 'Orbitron', sans-serif;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #9C27B0;
  text-shadow: 0 0 5px #9C27B0, 0 0 10px #9C27B0;
}

.cyber-text {
  font-family: 'Orbitron', sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: color 0.3s ease-in-out;
}

.cyber-item {
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
  padding: 10px;
  border-radius: 4px;
}

.cyber-item:hover {
  background: linear-gradient(90deg, rgba(0, 225, 255, 0.15), rgba(15, 25, 35, 0));
  border-left: 3px solid #00E1FF;
  box-shadow: 0 0 10px rgba(0, 225, 255, 0.3);
}

.cyber-item:hover .v-list-item__title {
  color: #00E1FF;
  text-shadow: 0 0 5px #00E1FF;
}

.v-list-item__icon {
  margin-right: 16px;
}
</style>
