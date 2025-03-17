<template>
  <div class="cyber-background">
    <v-container class="mt-n10">
      <v-card class="auth-card mx-auto" max-width="900" rounded="lg" elevation="5">
        <v-card-title class="neon-text">
          Listat de Partides
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            single-line
            hide-details
            class="search-field cyber-input"
          ></v-text-field>
        </v-card-title>

        <v-card-text>
          <!-- Encabezados fijos sobre la tabla -->
          <div class="custom-header d-flex mb-2">
            <div style="width: 10%" class="header-cell">ID</div>
            <div style="width: 20%" class="header-cell">User ID</div>
            <div style="width: 21%" class="header-cell">Type Game</div>
            <div style="width: 12%" class="header-cell">Status</div>
            <div style="width: 17%" class="header-cell">Cooperative</div>
            <div style="width: 20%" class="header-cell">Actions</div>
          </div>
          
          <v-data-table
            :headers="headers"
            :items="partidas"
            :search="search"
            :loading="loading"
            class="elevation-1 neon-table cyber-table"
            dark
            hide-default-header
          >
            <template v-slot:item.tipus_partida="{ item }">
              <v-chip
                :color="item.tipus_partida === 'multiplayer' ? 'purple' : 'blue'"
                dark
                small
                class="neon-chip"
              >
                {{ item.tipus_partida }}
              </v-chip>
            </template>

            <template v-slot:item.estat="{ item }">
              <v-chip
                :color="item.estat === 'enJuego' ? 'green' : 'red'"
                dark
                small
                class="neon-chip"
              >
                {{ item.estat }}
              </v-chip>
            </template>

            <template v-slot:item.actions="{ item }">
              <div class="d-flex">
                <v-btn class="neon-button" small @click="viewPartida(item)">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn 
                  class="neon-button yellow" 
                  small 
                  @click="confirmMantenimiento(item)"
                  :disabled="item.estat === 'Acabado'"
                  :class="{ 'disabled-button': item.estat === 'Acabado' }"
                >
                  <v-icon>mdi-wrench</v-icon>
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- Diálogo de visualización de partida -->
    <v-dialog v-model="viewDialog" max-width="400">
      <v-card class="dark-card" v-if="selectedPartida">
        <v-card-title class="neon-text">Información de Partida</v-card-title>
        <v-card-text>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="neon-text">Game ID: {{ selectedPartida.id }}</v-list-item-title>
              <v-list-item-subtitle class="neon-text">Player: {{ selectedPartida.usuari_id }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider class="my-2"></v-divider>
          <div class="mt-3">
            <p class="neon-text">Type: {{ selectedPartida.tipus_partida }}</p>
            <p class="neon-text">Status: {{ selectedPartida.estat }}</p>
            <p class="neon-text" v-if="selectedPartida.id_coperative">Cooperative: {{ selectedPartida.id_coperative }}</p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="viewDialog = false" class="neon-button">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación de mantenimiento -->
    <v-dialog v-model="mantenimientoDialog" max-width="400">
      <v-card class="dark-card">
        <v-card-title class="neon-text">
          <v-icon left color="warning">mdi-wrench</v-icon>
          Mode Mantenimient
        </v-card-title>
        <v-card-text class="neon-text">
          Estás segur de que vols posar en manteniment la partida ID {{ selectedPartida?.id }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="mantenimientoDialog = false" class="neon-button">Cancelar</v-btn>
          <v-btn class="neon-button yellow" @click="setMantenimiento">Confirmar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar para mensajes -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" dark>
      {{ snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false" class="neon-button">Cerrar</v-btn>
      </template>
    </v-snackbar>

  </div>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  name: "Partidas",
  setup() {
    const partidas = ref([
      { id: 1, usuari_id: "user123", tipus_partida: "singleplayer", estat: "enJuego", id_coperative: null },
      { id: 2, usuari_id: "user456", tipus_partida: "multiplayer", estat: "Acabado", id_coperative: "coop789" },
      { id: 3, usuari_id: "user789", tipus_partida: "multiplayer", estat: "enJuego", id_coperative: "coop123" },
      { id: 4, usuari_id: "user234", tipus_partida: "singleplayer", estat: "Acabado", id_coperative: null },
      { id: 5, usuari_id: "user567", tipus_partida: "multiplayer", estat: "enJuego", id_coperative: "coop456" }
    ]);
    const search = ref("");
    const loading = ref(false);
    const viewDialog = ref(false);
    const mantenimientoDialog = ref(false);
    const selectedPartida = ref(null);
    const snackbar = ref({
      show: false,
      message: "",
      color: "success"
    });

    const headers = ref([
      { text: "ID", value: "id", width: "10%" },
      { text: "Jugador ID", value: "usuari_id", width: "20%" },
      { text: "Tipo de Partida", value: "tipus_partida", width: "20%" },
      { text: "Estado", value: "estat", width: "15%" },
      { text: "ID Cooperativo", value: "id_coperative", width: "15%" },
      { text: "Acciones", value: "actions", sortable: false, align: "center", width: "20%" }
    ]);

    const viewPartida = (partida) => {
      if (!partida) {
        showSnackbar("Error: partida inválida", "error");
        return;
      }
      selectedPartida.value = partida;
      viewDialog.value = true;
    };

    const confirmMantenimiento = (partida) => {
      if (partida.estat === 'Acabado') {
        showSnackbar("No se puede poner en mantenimiento una partida acabada", "error");
        return;
      }
      selectedPartida.value = partida;
      mantenimientoDialog.value = true;
    };

    const setMantenimiento = () => {
      // Simulación de cambio a mantenimiento (sin funcionalidad real como solicitaste)
      showSnackbar("Partida en mantenimiento", "warning");
      mantenimientoDialog.value = false;
    };

    const showSnackbar = (message, color = "success") => {
      snackbar.value = { show: true, message, color };
    };

    return {
      headers, partidas, search, loading, viewDialog, mantenimientoDialog,
      selectedPartida, snackbar, viewPartida, confirmMantenimiento,
      setMantenimiento
    };
  }
};
</script>

<style scoped>
.cyber-background {
  background-color: #151C27;
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 40px;
}

.mt-n10 {
  margin-top: -200px;
}

.auth-card, .dark-card {
  background-color: #1E2633;
  border: 1px solid rgba(156, 39, 176, 0.3);
  color: white;
}

.neon-text {
  color: #9C27B0;
  text-shadow: 0 0 5px #9C27B0, 0 0 10px #9C27B0;
}

.neon-button {
  background: #9C27B0;
  color: white;
  box-shadow: 0 0 10px #9C27B0;
  margin: 0 2px;
}

.neon-button.yellow {
  background: #FFC107;
  box-shadow: 0 0 10px #FFC107;
}

.disabled-button {
  opacity: 0.5;
  cursor: not-allowed;
}

.cyber-table {
  background-color: #151C27 !important;
  color: white;
}

.v-data-table th, .v-data-table td {
  background-color: #1E2633 !important;
  color: white !important;
}

.v-dialog {
  background-color: #1E2633 !important;
}

.v-snackbar {
  background-color: #1E2633 !important;
}

.neon-chip {
  box-shadow: 0 0 5px currentColor;
}

/* Estilos para los encabezados personalizados */
.custom-header {
  background-color: #252d3d;
  border-bottom: 2px solid rgba(156, 39, 176, 0.8);
  margin-bottom: 0 !important;
  padding: 8px 0;
}

.header-cell {
  color: #9C27B0;
  text-shadow: 0 0 5px #9C27B0;
  font-weight: bold;
  font-size: 1.1rem;
  padding: 0 16px;
}
</style>
