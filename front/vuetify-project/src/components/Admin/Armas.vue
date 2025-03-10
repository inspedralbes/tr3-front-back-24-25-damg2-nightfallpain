<template>
    <v-container>
      <v-card>
        <v-card-title>Inventario de Armas</v-card-title>
        <v-data-table :headers="headers" :items="armas" class="elevation-1"></v-data-table>
      </v-card>
    </v-container>
  </template>
  
  <script>
  export default {
    name: "Armas",
    data() {
      return {
        headers: [
          { text: "ID", value: "id" },
          { text: "Nombre", value: "nombre" },
          { text: "Daño", value: "daño" },
        ],
        armas: [
          { id: 1, nombre: "Espada", daño: "50" },
          { id: 2, nombre: "Arco", daño: "35" },
        ],
      };
    },
  };
  </script>
  