<template>
  <v-container>
    <v-card>
      <v-card-title>Gestión de Usuarios</v-card-title>
      <v-data-table
        :headers="headers"
        :items="usuarios"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn
            color="error"
            small
            @click="deleteUser(item.id)"
          >
            Eliminar
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { ref, onMounted } from "vue";

export default {
  setup() {
    const API_URL = "http://localhost:5000/api/usuarios";
    const usuarios = ref([]);
    const headers = ref([
      { text: "Nombre", value: "nom" },
      { text: "Email", value: "email" },
      { text: "Acciones", value: "actions", sortable: false }
    ]);

    // 📌 OBTENER TODOS LOS USUARIOS
    const fetchUsuarios = async () => {
      try {
        const response = await fetch(`${API_URL}/all`);
        if (!response.ok) throw new Error("Error al obtener usuarios");
        usuarios.value = await response.json();
      } catch (error) {
        alert(error.message);
        console.error(error);
      }
    };

    // 📌 ELIMINAR USUARIO
    const deleteUser = async (id) => {
      if (!confirm("¿Estás seguro de eliminar este usuario?")) return;
      
      try {
        const response = await fetch(`${API_URL}/delete/${id}`, {
          method: "DELETE"
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Error al eliminar");
        }

        // Actualizar lista después de eliminar
        usuarios.value = usuarios.value.filter(user => user.id !== id);
        alert("Usuario eliminado correctamente");
      } catch (error) {
        alert(error.message);
        console.error(error);
      }
    };

    // Cargar usuarios al montar el componente
    onMounted(fetchUsuarios);

    return { headers, usuarios, deleteUser };
  }
};
</script>
