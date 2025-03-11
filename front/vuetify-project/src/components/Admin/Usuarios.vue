<template>
  <v-container>
    <v-card>
      <v-card-title class="primary white--text">
        <v-icon left>mdi-account-group</v-icon>
        Gestión de Usuarios
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
          dark
          dense
          class="search-field"
        ></v-text-field>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="usuarios"
        :search="search"
        :loading="loading"
        class="elevation-1"
      >
        <!-- Avatar e información de usuario -->
        <template v-slot:item.nom="{ item }">
          <div class="d-flex align-center">
            <v-avatar size="32" color="primary" class="mr-2">
              <span class="white--text">{{ item.nom.charAt(0) }}</span>
            </v-avatar>
            {{ item.nom }}
          </div>
        </template>

        <!-- Acciones -->
        <template v-slot:item.actions="{ item }">
          <div class="d-flex">
            <v-btn
              color="info"
              small
              class="mr-2"
              fab
              x-small
              @click="viewUser(item)"
            >
              <v-icon>mdi-eye</v-icon>
            </v-btn>
            <v-btn
              color="error"
              small
              fab
              x-small
              @click="confirmDelete(item)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Diálogo de visualización -->
    <v-dialog v-model="viewDialog" max-width="400">
      <v-card v-if="selectedUser">
        <v-card-title>Información de Usuario</v-card-title>
        <v-card-text>
          <v-list-item>
            <v-list-item-avatar color="primary">
              <span class="white--text">{{ selectedUser.nom?.charAt(0) }}</span>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{ selectedUser.nom }}</v-list-item-title>
              <v-list-item-subtitle>{{ selectedUser.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="viewDialog = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo de confirmación -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="error--text">
          <v-icon left color="error">mdi-alert</v-icon>
          Confirmar eliminación
        </v-card-title>
        <v-card-text>
          ¿Estás seguro de que deseas eliminar a {{ selectedUser?.nom }}?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteDialog = false">Cancelar</v-btn>
          <v-btn color="error" @click="deleteUser(selectedUser.id)">Eliminar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false">Cerrar</v-btn>
      </template>
    </v-snackbar>
  </v-container>
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

    // Obtener todos los usuarios
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

    // Eliminar usuario
    const deleteUser = async (id) => {
      loading.value = true;
      try {
        const response = await fetch(`${API_URL}/delete/${id}`, {
          method: "DELETE"
        });
        
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

    // Ver detalles del usuario
    const viewUser = (user) => {
      selectedUser.value = user;
      viewDialog.value = true;
    };

    // Confirmar eliminación
    const confirmDelete = (user) => {
      selectedUser.value = user;
      deleteDialog.value = true;
    };

    // Mostrar notificación
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
.search-field {
  max-width: 250px;
}
</style>