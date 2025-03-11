<template>
  <div class="cyber-background">
    <v-container class="mt-n10">
      <v-card class="auth-card mx-auto" max-width="900" rounded="lg" elevation="5">
        <v-card-title class="neon-text">
          Listado de Usuarios
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
          <v-data-table
            :headers="headers"
            :items="usuarios"
            :search="search"
            :loading="loading"
            class="elevation-1 neon-table cyber-table"
            dark
          >
            <template v-slot:item.nom="{ item }">
              <div class="d-flex align-center">
                <v-avatar size="32" class="neon-avatar">
                  <span class="neon-text">{{ item.nom.charAt(0) }}</span>
                </v-avatar>
                {{ item.nom }}
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
        <v-card-title class="neon-text">Información de Usuario</v-card-title>
        <v-card-text>
          <v-list-item>
            <v-list-item-avatar color="primary">
              <span class="white--text">{{ selectedUser.nom?.charAt(0) }}</span>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title class="neon-text">{{ selectedUser.nom }}</v-list-item-title>
              <v-list-item-subtitle class="neon-text">{{ selectedUser.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
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
          ¿Estás seguro de que deseas eliminar a {{ selectedUser?.nom }}?
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
import { ref, onMounted } from "vue";

export default {
  setup() {
    const API_URL = "http://localhost:5000/api/usuarios";
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
      { text: "Nombre", value: "nom", width: "30%" },
      { text: "Email", value: "email", width: "50%" },
      { text: "Acciones", value: "actions", sortable: false, align: "center" }
    ]);

    const fetchUsuarios = async () => {
      loading.value = true;
      try {
        const response = await fetch(`${API_URL}/all`);
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
        const response = await fetch(`${API_URL}/delete/${id}`, { method: "DELETE" });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al eliminar");
        }
        usuarios.value = usuarios.value.filter(user => user.id !== id);
        showSnackbar("Usuario eliminado correctamente", "success");
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
        showSnackbar("Error: usuario inválido", "error");
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
      selectedUser, snackbar, deleteUser, viewUser, confirmDelete
    };
  }
};
</script>

<style scoped>
.cyber-background {
  background-color: #151C27;
  min-height: 100vh;
  display: flex;
  align-items: flex-start; /* Esto sube el contenido */
  justify-content: center;
  padding-top: 40px; /* Puedes ajustar este valor */
}


.mt-n10 {
  margin-top: -200px; /* Eleva el recuadro */
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

.v-dialog {
  background-color: #1E2633 !important;
}

.v-snackbar {
  background-color: #1E2633 !important;
}
</style>
