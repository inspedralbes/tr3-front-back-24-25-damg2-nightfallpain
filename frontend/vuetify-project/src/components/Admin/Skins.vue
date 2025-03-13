<template>
    <v-container>
      <v-card>
        <v-card-title>Lista de Skins</v-card-title>
        <v-data-table :headers="headers" :items="skins" class="elevation-1"></v-data-table>
      </v-card>
    </v-container>
  </template>
  
  <script>
  export default {
    name: "Skins",
    data() {
      return {
        headers: [
          { text: "ID", value: "id" },
          { text: "Nombre", value: "nombre" },
          { text: "Rareza", value: "rareza" },
        ],
        skins: [
          { id: 1, nombre: "Skin de Fuego", rareza: "Legendaria" },
          { id: 2, nombre: "Skin de Hielo", rareza: "Épica" },
        ],
      };
    },
  };
  </script>
  