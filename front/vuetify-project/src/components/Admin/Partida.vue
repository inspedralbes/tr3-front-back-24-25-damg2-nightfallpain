<template>
  <v-container>
    <v-card>
      <v-card-title>Lista de Partidas</v-card-title>
      <v-data-table :headers="headers" :items="partidas" class="elevation-1"></v-data-table>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "Partidas",
  data() {
    return {
      headers: [
        { text: "ID", value: "id" },
        { text: "Usuario ID", value: "usuari_id" },
        { text: "Tipo de Partida", value: "tipus_partida" },
        { text: "Estado", value: "estat" },
        { text: "ID Cooperativo", value: "id_coperative" },
      ],
      partidas: [
        { id: 1, usuari_id: "user123", tipus_partida: "singleplayer", estat: "enJuego", id_coperative: null },
        { id: 2, usuari_id: "user456", tipus_partida: "multiplayer", estat: "Acabado", id_coperative: "coop789" },
      ],
    };
  },
};
</script>
