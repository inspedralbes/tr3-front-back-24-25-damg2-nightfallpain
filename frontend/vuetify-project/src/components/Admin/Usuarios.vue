<template>
  <div class="cyber-background">
    <v-container class="mt-n10">
      <v-card class="auth-card mx-auto" max-width="900" rounded="lg" elevation="5">
        <v-card-title class="neon-text">
          Llistat d'usuaris
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
            <div style="width: 32%" class="header-cell">Name</div>
            <div style="width: 48%" class="header-cell">Email</div>
            <div style="width: 15%" class="header-cell">Actions</div>
          </div>
          
          <v-data-table
            :headers="headers"
            :items="usuarios"
            :search="search"
            :loading="loading"
            class="elevation-1 neon-table cyber-table"
            dark
            hide-default-header
          >
            <template v-slot:item.name="{ item }">
              <div class="d-flex align-center">
                {{ item.name }}
              </div>
            </template>

            <template v-slot:item.actions="{ item }">
              <div class="d-flex">
                <v-btn class="neon-button" small @click="viewUser(item)">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn class="neon-button red" small @click="confirmDelete(item)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- Diálogo de visualización de usuario -->
    <v-dialog v-model="viewDialog" max-width="400">
      <v-card class="dark-card" v-if="selectedUser">
        <v-card-title class="neon-text">Informació de l'usuari</v-card-title>
        <v-card-text>
          <v-list dense>
            <v-list-item v-for="(value, key) in filteredUserInfo" :key="key">
              <v-list-item-content>
                <v-list-item-title>
                  <strong class="neon-text">{{ key }}:</strong> {{ value }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="viewDialog = false" class="neon-button">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación de eliminación -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card class="dark-card">
        <v-card-title class="neon-text">
          <v-icon left color="error">mdi-alert</v-icon>
          Confirmar eliminación
        </v-card-title>
        <v-card-text class="neon-text">
          ¿Estás seguro de que deseas eliminar a {{ selectedUser?.name }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteDialog = false" class="neon-button">Cancelar</v-btn>
          <v-btn class="neon-button red" @click="deleteUser(selectedUser.id)">Eliminar</v-btn>
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
import { ref, onMounted, computed } from "vue";

export default {
  setup() {
    const usuarios = ref([]);
    const search = ref("");
    const loading = ref(false);
    const viewDialog = ref(false);
    const deleteDialog = ref(false);
    const selectedUser = ref(null);
    const snackbar = ref({
      show: false,
      message: "",
      color: "success"
    });

    const headers = ref([
      { text: "Nombre", value: "name", width: "30%" },
      { text: "Email", value: "email", width: "45%" },
      { text: "Acciones", value: "actions", sortable: false, align: "center", width: "15%" }
    ]);

    const filteredUserInfo = computed(() => {
      if (!selectedUser.value) return {};
      const { name, email, ...rest } = selectedUser.value;
      return rest;
    });

    const fetchUsuarios = async () => {
      loading.value = true;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/usuarios/all`);
        if (!response.ok) throw new Error("Error al obtener usuarios");
        usuarios.value = await response.json();
      } catch (error) {
        showSnackbar(error.message, "error");
        console.error(error);
      } finally {
        loading.value = false;
      }
    };

    const deleteUser = async (id) => {
      loading.value = true;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/usuarios/delete/${id}`, { method: "DELETE" });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al eliminar");
        }
        usuarios.value = usuarios.value.filter(user => user.id !== id);
        showSnackbar("Usuari eliminat correctament", "success");
      } catch (error) {
        showSnackbar(error.message, "error");
        console.error(error);
      } finally {
        loading.value = false;
        deleteDialog.value = false;
      }
    };

    const viewUser = (user) => {
      if (!user) {
        showSnackbar("Error: usuari invàlid", "error");
        return;
      }
      selectedUser.value = user;
      viewDialog.value = true;
    };

    const confirmDelete = (user) => {
      selectedUser.value = user;
      deleteDialog.value = true;
    };

    const showSnackbar = (message, color = "success") => {
      snackbar.value = { show: true, message, color };
    };

    onMounted(fetchUsuarios);

    return {
      headers, usuarios, search, loading, viewDialog, deleteDialog,
      selectedUser, snackbar, deleteUser, viewUser, confirmDelete,
      filteredUserInfo
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
}

.neon-button.red {
  background: #ff2c2c;
  box-shadow: 0 0 10px #ff2c2c;
}

.cyber-table {
  background-color: #151C27 !important;
  color: white;
}

.v-data-table th, .v-data-table td {
  background-color: #1E2633 !important;
  color: white !important;
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
