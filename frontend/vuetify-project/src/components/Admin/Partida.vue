<template>
  <div class="cyber-background">
    <v-container>
      <v-card class="auth-card mx-auto" max-width="900" rounded="lg" elevation="5">
        <v-card-title class="neon-text">
          Listado de Partidas
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Buscar"
            single-line
            hide-details
            class="search-field cyber-input"
            dark
          ></v-text-field>
        </v-card-title>

        <v-card-text>
          <!-- Encabezados fijos sobre la tabla -->
          <div class="custom-header d-flex mb-2">
            <div style="width: 68%" class="header-cell">ID</div>
            <div style="width: 26%" class="header-cell">User</div>
            <div style="width: 45%" class="header-cell">Type Game</div>
            <div style="width: 40%" class="header-cell">Created</div>
          </div>

          <!-- Tabla de datos -->
          <v-data-table
            :headers="headers"
            :items="partidas"
            :search="search"
            :loading="loading"
            class="elevation-1 neon-table cyber-table"
            dark
            hide-default-header
          >
            <!-- Formatear tipo de partida -->
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

            <!-- Formatear fecha de creación -->
            <template v-slot:item.createdAt="{ item }">
              {{ new Date(item.createdAt).toLocaleString() }}
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>

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
    const partidas = ref([]);
    const search = ref("");
    const loading = ref(false);
    const snackbar = ref({ show: false, message: "", color: "success" });

    const fetchPartidas = async () => {
      loading.value = true;
      try {
        const response = await fetch("http://localhost:3000/api/partida/all");
        if (!response.ok) throw new Error("Error al obtener las partidas");
        partidas.value = await response.json();
      } catch (error) {
        showSnackbar("Error al cargar las partidas", "error");
        console.error(error);
      }
      loading.value = false;
    };

    onMounted(fetchPartidas);

    const showSnackbar = (message, color = "success") => {
      snackbar.value = { show: true, message, color };
    };

    return { partidas, search, loading, snackbar };
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

.auth-card {
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
}

.cyber-table {
  background-color: #151C27 !important;
}

.v-data-table th,
.v-data-table td {
  background-color: #1E2633 !important;
  color: white !important;
}

.v-data-table >>> tbody tr {
  cursor: pointer;
}

.v-data-table >>> tbody tr:hover {
  background-color: rgba(156, 39, 176, 0.1) !important;
}

/* Encabezados personalizados */
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

.neon-chip {
  box-shadow: 0 0 5px currentColor;
}

.v-snackbar {
  background-color: #1E2633 !important;
}
</style>
