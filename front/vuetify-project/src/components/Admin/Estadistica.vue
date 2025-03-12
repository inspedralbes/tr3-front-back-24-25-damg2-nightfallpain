<template>
  <div class="cyber-background">
    <v-container class="cyber-container">
      <v-card class="cyber-card">
        <v-card-title class="neon-text">Gráfico de Estadísticas</v-card-title>
        
        <v-card-text>
          <!-- Selector de correo -->
          <v-select
            v-model="correoSeleccionado"
            :items="correos"
            label="Seleccionar usuario"
            class="cyber-input"
            dark
          ></v-select>
          
          <!-- Botón para generar estadísticas -->
          <v-btn class="neon-button mt-4" block @click="generarEstadisticas">
            Generar Estadísticas
          </v-btn>
          
          <!-- Contenedor del gráfico (Placeholder) -->
          <div class="placeholder-grafico mt-5">
            <v-icon x-large>mdi-chart-areaspline</v-icon>
            <p>Gráfico de partidas del usuario (No funcional aún)</p>
          </div>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      correoSeleccionado: null,
      correos: ["usuario1@example.com", "jugador2@example.com", "gamer3@example.com"],
    };
  },
  methods: {
    generarEstadisticas() {
      console.log("Generando estadísticas para:", this.correoSeleccionado);
    }
  }
};
</script>

<style scoped>
.cyber-background {
  background-color: #151C27;
  min-height: 100vh;
}

.cyber-container {
  max-width: 930px;
  margin: 0 auto;
}

.cyber-card {
  background-color: #1E2633;
  border: 1px solid rgba(156, 39, 176, 0.3);
  color: white;
  padding: 20px;
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

.cyber-input >>> .v-input__control {
  background-color: #252d3d !important;
  border: 1px solid rgba(156, 39, 176, 0.5);
  color: white;
}

.placeholder-grafico {
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(156, 39, 176, 0.2);
  border-radius: 10px;
  color: #b16bc9;
  text-shadow: 0 0 5px #9C27B0;
  border: 1px solid rgba(156, 39, 176, 0.5);
}
</style>
