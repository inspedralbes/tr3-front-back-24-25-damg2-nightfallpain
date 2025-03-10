<template>
    <v-container>
      <v-row justify="center">
        <v-col v-for="(producto, index) in productos" :key="index" cols="12" sm="6" md="4">
          <v-card>
            <v-card-title>{{ producto.titulo }}</v-card-title>
            <v-card-text>
              <v-icon x-large>mdi-package-variant-closed</v-icon>
              <p>{{ producto.descripcion }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    name: "Tienda",
    data() {
      return {
        productos: Array.from({ length: 30 }, (_, i) => ({
          titulo: `Producto ${i + 1}`,
          descripcion: `Descripción del producto ${i + 1}`,
        })),
      };
    },
  };
  </script>
  
  <style scoped>
  /* Asegurar que el contenedor pueda hacer scroll si es necesario */
  .v-container {
    max-height: 80vh; /* Ajusta según sea necesario */
    overflow-y: auto;
  }
  </style>
  