<template>
  <v-app>
    <!-- Barra superior -->
    <v-app-bar app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>Panel de Usuario</v-toolbar-title>
    </v-app-bar>

    <!-- Menú lateral -->
    <v-navigation-drawer app v-model="drawer">
      <v-list>
        <v-list-item to="/dashboard/estadistica" link>
          <v-list-item-icon>
            <v-icon>mdi-chart-bar</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Estadística</v-list-item-title>
        </v-list-item>

        <v-list-item to="/dashboard/tienda" link>
          <v-list-item-icon>
            <v-icon>mdi-store</v-icon>
          </v-list-item-icon>
          <v-list-item-title>Tienda</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Contenido principal -->
    <v-main>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "UserDashboard",
  data() {
    return {
      drawer: false,
    };
  },
};
</script>
