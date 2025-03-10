<template>
    <v-container>
      <v-card>
        <v-card-title>Lista de Enemigos</v-card-title>
        <v-data-table :headers="headers" :items="enemigos" class="elevation-1"></v-data-table>
      </v-card>
    </v-container>
  </template>
  
  <script>
  export default {
    name: "Enemigos",
    data() {
      return {
        headers: [
          { text: "ID", value: "id" },
          { text: "Nombre", value: "nombre" },
          { text: "Poder", value: "poder" },
        ],
        enemigos: [
          { id: 1, nombre: "Goblin", poder: "Débil" },
          { id: 2, nombre: "Orco", poder: "Fuerte" },
        ],
      };
    },
  };
  </script>
  