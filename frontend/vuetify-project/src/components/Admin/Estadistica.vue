<template>
  <div class="cyber-background">
    <v-container class="cyber-container">
      <v-card class="cyber-card">
        <v-card-title class="neon-text">Estadístiques</v-card-title>
        
        <v-card-text>
          <!-- Selector de usuario - Mostrar solo el ID -->
          <v-select
            v-model="usuariSeleccionat"
            :items="usuaris"
            item-text="id" 
            item-value="id"
            label="Selecciona un usuari"
            class="cyber-input"
            dark
          ></v-select>
          <p>Usuario seleccionado: {{ usuariSeleccionat }}</p>

          <!-- Botón para generar gráfico -->
          <v-btn 
            class="neon-button mt-4" 
            block 
            @click="generarGrafico"
            :loading="carregant"
            :disabled="!usuariSeleccionat"
          >
            Generar Gràfic
          </v-btn>
          
          <!-- Mostrar el gráfico generado -->
          <div v-if="imatgeGrafic" class="grafico-container mt-5">
            <img :src="imatgeGrafic" alt="Gràfic d'estadístiques" class="grafico-imagen">
            
            <!-- Aquí puedes añadir la tabla si es necesario -->
          </div>
          
          <!-- Mensaje de error -->
          <v-alert v-if="error" type="error" class="mt-4">
            {{ error }}
          </v-alert>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      usuariSeleccionat: null,  // Ahora solo guardará el ID
      usuaris: [],              
      imatgeGrafic: null,
      carregant: false,
      error: null
    };
  },
  async created() {
    await this.carregarUsuaris();
  },
  methods: {
    async carregarUsuaris() {
  try {
    const resposta = await fetch(`${import.meta.env.VITE_API_URL}api/estadistiques/usuaris-ids`);
    if (!resposta.ok) throw new Error('Error al cargar usuarios');

    const data = await resposta.json();
    // Usamos toString() para convertir los ids en cadenas
    this.usuaris = data.data ? data.data.map(usuario => usuario.id.toString()) : [];
  } catch (err) {
    console.error('Error al cargar usuarios:', err);
    this.error = 'No se pudieron cargar los usuarios';
  }
},

    async generarGrafico() {
      if (!this.usuariSeleccionat) return;

      this.carregant = true;
      this.error = null;
      this.imatgeGrafic = null;

      try {
        const resposta = await fetch(`${import.meta.env.VITE_API_URL}api/estadistiques/grafico/${this.usuariSeleccionat}`);

        if (!resposta.ok) {
          const errorData = await resposta.json().catch(() => ({}));
          throw new Error(errorData.error || 'Error al generar el gráfico');
        }

        const blob = await resposta.blob();
        this.imatgeGrafic = URL.createObjectURL(blob);
      } catch (err) {
        console.error('Error al generar el gráfico:', err);
        this.error = err.message || 'Error al generar el gráfico';
      } finally {
        this.carregant = false;
      }
    }
  },

  beforeUnmount() {
    if (this.imatgeGrafic) {
      URL.revokeObjectURL(this.imatgeGrafic);
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
  transition: all 0.3s ease;
}

.neon-button:hover {
  box-shadow: 0 0 20px #9C27B0;
}

.cyber-input >>> .v-input__control {
  background-color: #252d3d !important;
  border: 1px solid rgba(156, 39, 176, 0.5);
  color: white;
}

.grafico-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(156, 39, 176, 0.1);
  border-radius: 10px;
  border: 1px solid rgba(156, 39, 176, 0.5);
  padding: 20px;
  margin-top: 20px;
}

.grafico-imagen {
  max-width: 100%;
  height: auto;
  border-radius: 5px;
  border: 1px solid #9C27B0;
}

.graph-caption {
  margin-top: 10px;
  color: #b16bc9;
  font-style: italic;
  text-shadow: 0 0 5px #9C27B0;
}

/* Efecto de carga */
.v-btn--loading:before {
  background-color: rgba(156, 39, 176, 0.5);
}
</style>