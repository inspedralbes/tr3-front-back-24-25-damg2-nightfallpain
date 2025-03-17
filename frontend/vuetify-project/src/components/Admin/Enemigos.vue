<template>
  <div class="cyber-background">
    <v-container>
      <v-card class="auth-card mx-auto" max-width="900" rounded="lg" elevation="5">
        <v-card-title class="neon-text">
          Gestió d'enemics
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
          <!-- Tabla de enemigos con método de selección corregido -->
          <v-data-table
            :headers="headers"
            :items="enemigos"
            :search="search"
            class="elevation-1 neon-table cyber-table"
            :items-per-page="10"
            item-key="id"
            dark
          >
            <!-- Usando slot personalizado para cada fila -->
            <template v-slot:item="{ item }">
              <tr @click="seleccionarEnemigo(item)">
                <td>{{ item.id }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.health }}</td>
                <td>{{ item.damage }}</td>
                <td>{{ item.speed }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>

      <!-- Diálogo de edición simplificado -->
      <v-dialog v-model="dialogoAbierto" max-width="500px">
        <v-card v-if="enemigoSeleccionado" class="dark-card">
          <v-card-title class="headline neon-text">
            Editant Enemic
          </v-card-title>
          
          <v-card-text class="pt-4">
            <!-- Información básica del enemigo -->
            <v-row class="mb-3">
              <v-col cols="6">
                <div class="caption">ID:</div>
                <div class="font-weight-bold">{{ enemigoSeleccionado.id }}</div>
              </v-col>
              <v-col cols="6">
                <div class="caption">Nom:</div>
                <div class="font-weight-bold">{{ enemigoSeleccionado.name }}</div>
              </v-col>
            </v-row>
            
            <!-- Controles de edición -->
            <v-row>
              <v-col cols="12">
                <v-sheet rounded class="pa-3 dark-sheet">
                  <div class="d-flex align-center mb-2">
                    <v-icon color="#ff2c2c" class="mr-2">mdi-heart</v-icon>
                    <span class="font-weight-bold neon-text-alt">Health</span>
                    <v-spacer></v-spacer>
                    <span class="text-h6 neon-value">{{ Math.round(enemigoSeleccionado.health) }}</span>
                  </div>
                  <v-slider
                    v-model.number="enemigoSeleccionado.health"
                    color="#ff2c2c"
                    min="0"
                    max="100"
                    hide-details
                    class="neon-slider"
                  ></v-slider>
                </v-sheet>
              </v-col>
              
              <v-col cols="12">
                <v-sheet rounded class="pa-3 dark-sheet">
                  <div class="d-flex align-center mb-2">
                    <v-icon color="#ff9800" class="mr-2">mdi-sword</v-icon>
                    <span class="font-weight-bold neon-text-alt">Damage</span>
                    <v-spacer></v-spacer>
                    <span class="text-h6 neon-value">{{ Math.round(enemigoSeleccionado.damage) }}</span>
                  </div>
                  <v-slider
                    v-model.number="enemigoSeleccionado.damage"
                    color="#ff9800"
                    min="0"
                    max="50"
                    hide-details
                    class="neon-slider"
                  ></v-slider>
                </v-sheet>
              </v-col>
              
              <v-col cols="12">
                <v-sheet rounded class="pa-3 dark-sheet">
                  <div class="d-flex align-center mb-2">
                    <v-icon color="#2196f3" class="mr-2">mdi-lightning-bolt</v-icon>
                    <span class="font-weight-bold neon-text-alt">Speed</span>
                    <v-spacer></v-spacer>
                    <span class="text-h6 neon-value">{{ Math.round(enemigoSeleccionado.speed) }}</span>
                  </div>
                  <v-slider
                    v-model.number="enemigoSeleccionado.speed"
                    color="#2196f3"
                    min="0"
                    max="20"
                    hide-details
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
  name: "Enemigos",
  data() {
    return {
      search: '',
      dialogoAbierto: false,
      headers: [
        { text: "ID", value: "id", align: "start" },
        { text: "Nom", value: "name" },
        { text: "Health", value: "health" },
        { text: "Damage", value: "damage" },
        { text: "Speed", value: "speed" },
      ],
      enemigos: [],
      enemigoSeleccionado: null,
    };
  },
  mounted() {
    this.cargarEnemigos();
  },
  methods: {
    cargarEnemigos() {
      fetch(`${import.meta.env.VITE_API_URL}api/enemics/all`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Error en la petición: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log("Datos recibidos:", data);
          
          // Normalizar los datos para asegurar que tengan un ID consistente
          this.enemigos = data.map(enemigo => {
            const id = enemigo.id || enemigo._id || enemigo.ID || enemigo.enemicId;
            return {
              id: id, // Aseguramos que siempre haya una propiedad id
              name: enemigo.name,
              health: parseFloat(enemigo.health) || 0,
              damage: parseFloat(enemigo.damage) || 0,
              speed: parseFloat(enemigo.speed) || 0,
              // Mantener el ID original por si es necesario
              _originalId: {
                id: enemigo.id,
                _id: enemigo._id,
                ID: enemigo.ID,
                enemicId: enemigo.enemicId
              }
            };
          });
          
          console.log("Enemigos normalizados:", this.enemigos);
        })
        .catch(error => {
          console.error('Error al cargar los enemigos:', error);
        });
    },
    seleccionarEnemigo(item) {
      // Ahora este método solo se llamará con el objeto enemigo
      console.log('Enemigo seleccionado:', item);
      
      if (!item || typeof item !== 'object' || item instanceof Event) {
        console.error("Objeto enemigo no válido o evento recibido:", item);
        return;
      }
      
      // Crear una copia profunda para evitar modificar el objeto original
      this.enemigoSeleccionado = JSON.parse(JSON.stringify(item));
      
      // Verificar que tengamos un ID válido
      if (!this.enemigoSeleccionado.id) {
        console.error("Enemigo sin ID válido:", this.enemigoSeleccionado);
        return;
      }
      
      this.dialogoAbierto = true;
    },
    cerrarDialogo() {
      this.dialogoAbierto = false;
      this.enemigoSeleccionado = null;
    },
    guardarCambios() {
      if (!this.enemigoSeleccionado || !this.enemigoSeleccionado.id) {
        console.error("No se puede guardar: ID del enemigo no disponible", this.enemigoSeleccionado);
        return;
      }
      
      // Redondear valores para enviar enteros limpios
      const enemyData = {
        health: Math.round(this.enemigoSeleccionado.health),
        damage: Math.round(this.enemigoSeleccionado.damage),
        speed: Math.round(this.enemigoSeleccionado.speed)
      };
      
      console.log('Guardando cambios para el enemigo ID:', this.enemigoSeleccionado.id);
      console.log('Datos a enviar:', enemyData);

      fetch(`${import.meta.env.VITE_API_URL}api/enemics/update/${this.enemigoSeleccionado.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(enemyData),
      })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error en la respuesta: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Respuesta del servidor:', data);
        
        // Actualizar el enemigo en la lista local
        const index = this.enemigos.findIndex(e => e.id === this.enemigoSeleccionado.id);
        if (index !== -1) {
          this.enemigos[index] = {
            ...this.enemigos[index],
            ...enemyData
          };
        }
        
        // Mostrar notificación de éxito (puedes implementar un sistema de notificaciones)
        alert('Enemigo actualizado correctamente');
        
        this.cerrarDialogo();
        
        // Opcional: recargar todos los enemigos para asegurar datos actualizados
        this.cargarEnemigos();
      })
      .catch(error => {
        console.error('Error al guardar cambios:', error);
        alert('Error al guardar los cambios: ' + error.message);
      });
    }
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

.neon-slider .v-slider__track-fill {
  box-shadow: 0 0 10px currentColor;
}

.cyber-table {
  background-color: #151C27 !important;
  color: white;
}

.v-data-table ::v-deep tbody tr {
  cursor: pointer;
}

.v-data-table ::v-deep tbody tr:hover {
  background-color: rgba(156, 39, 176, 0.1) !important;
}
</style>