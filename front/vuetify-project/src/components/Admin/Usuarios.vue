<template>
    <v-container>
      <v-card>
        <v-card-title>Gestión de Usuarios</v-card-title>
        <v-data-table :headers="headers" :items="usuarios" class="elevation-1"></v-data-table>
      </v-card>
    </v-container>
  </template>
  
  <script>
  export default {
    name: "Usuarios",
    data() {
      return {
        headers: [
          { text: "ID", value: "id" },
          { text: "Nombre", value: "nombre" },
          { text: "Correo", value: "correo" },
        ],
        usuarios: [
          { id: 1, nombre: "Juan Pérez", correo: "juan@example.com" },
          { id: 2, nombre: "María López", correo: "maria@example.com" },
        ],
      };
    },
  };
  </script>
  