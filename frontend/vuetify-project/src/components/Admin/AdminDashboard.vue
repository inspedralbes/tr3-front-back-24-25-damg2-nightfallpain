<template>
    <v-app>
      <!-- Barra superior -->
      <v-app-bar app color="red darken-4" dark>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Panel de Administrador</v-toolbar-title>
      </v-app-bar>
  
      <!-- Menú lateral -->
      <v-navigation-drawer app v-model="drawer">
        <v-list>
          <v-list-item to="/admin/usuarios" link>
            <v-list-item-icon>
              <v-icon>mdi-account-group</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Usuarios</v-list-item-title>
          </v-list-item>
  
          <v-list-item to="/admin/enemigos" link>
            <v-list-item-icon>
              <v-icon>mdi-skull</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Enemigos</v-list-item-title>
          </v-list-item>
  
          <v-list-item to="/admin/armas" link>
            <v-list-item-icon>
              <v-icon>mdi-pistol</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Armas</v-list-item-title>
          </v-list-item>
  
          <v-list-item to="/admin/skins" link>
            <v-list-item-icon>
              <v-icon>mdi-tshirt-crew</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Skins</v-list-item-title>
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
    name: "AdminDashboard",
    data() {
      return {
        drawer: false,
      };
    },
  };
  </script>
  
  <style scoped></style>
  