<template>
  <div class="cyber-background">
    <v-container>
      <v-card class="auth-card mx-auto" max-width="900" rounded="lg" elevation="5">
        <v-card-title class="neon-text">
          Inventari d'armes
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
        
        <!-- Encabezados fijos sobre la tabla -->
        <v-card-text>
          <div class="custom-header d-flex mb-2">
            <div style="width: 10%" class="header-cell">ID</div>
            <div style="width: 50%" class="header-cell">Name</div>
            <div style="width: 20%" class="header-cell">Damage</div>
            <div style="width: 20%" class="header-cell">Bullet Speed</div>
          </div>
          
          <v-data-table
            :headers="headers"
            :items="armas"
            :search="search"
            class="elevation-1 neon-table cyber-table"
            :items-per-page="10"
            @click:row="seleccionarArma"
            dark
            hide-default-header
          ></v-data-table>
        </v-card-text>
      </v-card>

      <v-dialog v-model="dialogoAbierto" max-width="500px">
        <v-card v-if="armaSeleccionada" class="dark-card">
          <v-card-title class="headline neon-text">
            Editant {{ armaSeleccionada.nombre }}
          </v-card-title>
          
          <v-card-text class="pt-4">
            <v-row>
              <v-col cols="12">
                <v-sheet rounded class="pa-3 dark-sheet">
                  <div class="d-flex align-center mb-2">
                    <v-icon color="#ff9800" class="mr-2">mdi-sword</v-icon>
                    <span class="font-weight-bold neon-text-alt">Damage</span>
                    <v-spacer></v-spacer>
                    <span class="text-h6 neon-value">{{ armaSeleccionada.daño }}</span>
                  </div>
                  <v-slider
                    v-model.number="armaSeleccionada.daño"
                    color="#ff9800"
                    min="0"
                    max="100"
                    hide-details
                    step="0.1" 
                    class="neon-slider"
                  ></v-slider>
                </v-sheet>
              </v-col>
              
              <v-col cols="12">
                <v-sheet rounded class="pa-3 dark-sheet">
                  <div class="d-flex align-center mb-2">
                    <v-icon color="#2196f3" class="mr-2">mdi-lightning-bolt</v-icon>
                    <span class="font-weight-bold neon-text-alt">Bullet Speed</span>
                    <v-spacer></v-spacer>
                    <span class="text-h6 neon-value">{{ armaSeleccionada.velocidadBala }}</span>
                  </div>
                  <v-slider
                    v-model.number="armaSeleccionada.velocidadBala"
                    color="#2196f3"
                    min="0"
                    max="50"
                    hide-details
                    step="0.1" 
                    class="neon-slider"
                  ></v-slider>
                </v-sheet>
              </v-col>
            </v-row>
          </v-card-text>
          
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn class="neon-button-cancel" text @click="cerrarDialogo">Cancelar</v-btn>
            <v-btn class="neon-button" @click="guardarCambios">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Armas",
  data() {
    return {
      search: '',
      dialogoAbierto: false,
      headers: [
        { text: "ID", value: "id", align: "start", width: "10%" },
        { text: "Nombre", value: "nombre", width: "50%" },
        { text: "Daño", value: "daño", width: "20%" },
        { text: "Velocidad Bala", value: "velocidadBala", width: "20%" }
      ],
      armas: [
        { id: 1, nombre: "Nivel 1", daño: 25, velocidadBala: 30 },
      ],
      armaSeleccionada: null,
    };
  },
  methods: {
    seleccionarArma(arma) {
      this.armaSeleccionada = { ...arma };
      this.dialogoAbierto = true;
    },
    cerrarDialogo() {
      this.dialogoAbierto = false;
      this.armaSeleccionada = null;
    },
    guardarCambios() {
      this.armaSeleccionada.daño = Math.round(this.armaSeleccionada.daño);
      this.armaSeleccionada.velocidadBala = Math.round(this.armaSeleccionada.velocidadBala);
      
      const index = this.armas.findIndex(a => a.id === this.armaSeleccionada.id);
      if (index !== -1) {
        this.armas.splice(index, 1, { ...this.armaSeleccionada });
      }
      this.cerrarDialogo();
    },
  }
};
</script>

<style scoped>
.cyber-background {
  background-color: #151C27;
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
}

.auth-card, .dark-card {
  background-color: #1E2633;
  border: 1px solid rgba(156, 39, 176, 0.3);
  color: white;
}

.dark-sheet {
  background-color: #252d3d !important;
  border: 1px solid rgba(156, 39, 176, 0.2);
}

.neon-text {
  color: #9C27B0;
  text-shadow: 0 0 5px #9C27B0, 0 0 10px #9C27B0;
}

.neon-text-alt {
  color: #b16bc9;
  text-shadow: 0 0 3px #9C27B0;
}

.neon-value {
  color: #d5a6e6;
  text-shadow: 0 0 5px #9C27B0;
}

.neon-button {
  background: #9C27B0;
  color: white;
  box-shadow: 0 0 10px #9C27B0;
}

.neon-button-cancel {
  color: #9C27B0;
  text-shadow: 0 0 5px #9C27B0;
}

.neon-chip {
  box-shadow: 0 0 5px currentColor;
}

.cyber-table {
  background-color: #151C27 !important;
  color: white;
}

.v-data-table th, .v-data-table td {
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

.neon-slider .v-slider__track-fill {
  box-shadow: 0 0 10px currentColor;
}
</style>