<template>
  <v-container>
    <!-- Botón para abrir el modal -->
    <v-btn color="primary" @click="openMaintenanceModal">Modo Mantenimiento</v-btn>

    <!-- Modal de Mantenimiento -->
    <v-dialog v-model="maintenanceModalVisible" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Modo Mantenimiento</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item v-for="(service, index) in services" :key="index">
              <v-list-item-content>
                <v-list-item-title>{{ service.name }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-switch v-model="service.maintenance" @change="toggleMaintenance(service)"></v-switch>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="closeMaintenanceModal">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
  <v-snackbar v-model="snackbar.visible" :timeout="3000" color="error" multi-line>
    {{ snackbar.message }}
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      maintenanceModalVisible: false,
      services: [
        { name: 'Usuarios', endpoint: 'usuarios', maintenance: false },
        
      ],
      snackbar: {
        visible: false,
        message: ''
      }
    };
  },
  methods: {
    openSnackbar(message) {
      this.snackbar.message = message;
      this.snackbar.visible = true;
    },
    openMaintenanceModal() {
      this.maintenanceModalVisible = true;
      this.checkMaintenanceStatus();
    },
    closeMaintenanceModal() {
      this.maintenanceModalVisible = false;
    },
    async checkMaintenanceStatus() {
      try {
        const promises = this.services.map(async (service) => {
          const response = await fetch(`${import.meta.env.VITE_API_URL}api/${service.endpoint}/maintenance/status`);
          const data = await response.json();
          service.maintenance = data.maintenance;
        });
        await Promise.all(promises);
      } catch (error) {
        console.error('Error verificando estado de mantenimiento:', error);
      }
    },
    async toggleMaintenance(service) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/${service.endpoint}/maintenance/toggle`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        service.maintenance = data.maintenance;
      } catch (error) {
        console.error(`Error cambiando mantenimiento de ${service.name}:`, error);
      }
    }
  }
};
</script>
