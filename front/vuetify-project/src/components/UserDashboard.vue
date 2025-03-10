<template>
    <div>
      <!-- Botón para abrir/cerrar el menú lateral -->
      <v-btn
        icon
        @click="toggleDrawer"
        class="menu-button"
      >
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    
      <!-- Barra lateral de navegación -->
      <v-navigation-drawer
        app
        color="primary"
        dark
        v-model="drawer"
        mini-variant-width="80"
      >
        <v-list>
          <!-- Opción Estadísticas -->
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-chart-line</v-icon> <!-- Icono de estadísticas -->
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Estadísticas</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
    
          <!-- Opción Tienda -->
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-cart</v-icon> <!-- Icono de tienda -->
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Tienda</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    
      <!-- Contenido principal -->
      <div class="content">
        <h1>Hola User</h1>
      </div>
    </div>
  </template>
    
  <script>
  export default {
    name: "UserDashboard",
    data() {
      return {
        drawer: false, // Estado del menú lateral
      };
    },
    methods: {
      toggleDrawer() {
        this.drawer = !this.drawer; // Cambia el estado de apertura/cierre del menú
      },
    },
  };
  </script>
    
  <style scoped>
  /* Estilo para posicionar el botón del menú */
  .menu-button {
    position: absolute;
    top: 16px;
    left: 16px;
    z-index: 10; /* Asegura que el botón esté encima del contenido */
  }
  
  /* Alinea el texto y el icono de las opciones del menú */
  .v-list-item-content {
    display: flex;
    align-items: center; /* Centra el texto y el icono verticalmente */
  }
  
  .v-list-item-icon {
    margin-right: 8px; /* Agrega espacio entre el icono y el texto */
  }
  
  /* Ajusta el contenido principal */
  .content {
    text-align: center;
    margin-top: 50px; /* Espacio para evitar que el botón cubra contenido */
  }
  </style>
  