<template>
  <v-container>
    <v-card>
      <v-card-title class="primary white--text">
        Gestión de Enemigos
        <v-spacer></v-spacer>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar"
          single-line
          hide-details
          dark
          dense
        ></v-text-field>
      </v-card-title>
      
      <v-data-table
        :headers="headers"
        :items="enemigos"
        :search="search"
        class="elevation-1"
        :items-per-page="10"
        @click:row="seleccionarEnemigo"
      >
        <template v-slot:item.estado="{ item }">
          <v-chip
            :color="getEstadoColor(item.vida)"
            dark
            small
          >
            {{ getEstadoTexto(item.vida) }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>

    <!-- Diálogo para editar estadísticas -->
    <v-dialog v-model="dialogoAbierto" max-width="500px">
      <v-card v-if="enemigoSeleccionado">
        <v-card-title class="headline primary white--text">
          Editar {{ enemigoSeleccionado.nombre }}
        </v-card-title>
        
        <v-card-text class="pt-4">
          <v-row>
            <!-- Vida -->
            <v-col cols="12">
              <v-sheet rounded elevation="1" class="pa-3">
                <div class="d-flex align-center mb-2">
                  <v-icon color="red" class="mr-2">mdi-heart</v-icon>
                  <span class="font-weight-bold">Vida</span>
                  <v-spacer></v-spacer>
                  <span class="text-h6">{{ enemigoSeleccionado.vida }}</span>
                </div>
                <v-slider
                  v-model="enemigoSeleccionado.vida"
                  color="red"
                  min="0"
                  max="100"
                  hide-details
                ></v-slider>
              </v-sheet>
            </v-col>
            
            <!-- Daño -->
            <v-col cols="12">
              <v-sheet rounded elevation="1" class="pa-3">
                <div class="d-flex align-center mb-2">
                  <v-icon color="orange darken-2" class="mr-2">mdi-sword</v-icon>
                  <span class="font-weight-bold">Daño</span>
                  <v-spacer></v-spacer>
                  <span class="text-h6">{{ enemigoSeleccionado.daño }}</span>
                </div>
                <v-slider
                  v-model="enemigoSeleccionado.daño"
                  color="orange darken-2"
                  min="0"
                  max="50"
                  hide-details
                ></v-slider>
              </v-sheet>
            </v-col>
            
            <!-- Velocidad -->
            <v-col cols="12">
              <v-sheet rounded elevation="1" class="pa-3">
                <div class="d-flex align-center mb-2">
                  <v-icon color="blue" class="mr-2">mdi-lightning-bolt</v-icon>
                  <span class="font-weight-bold">Velocidad</span>
                  <v-spacer></v-spacer>
                  <span class="text-h6">{{ enemigoSeleccionado.velocidad }}</span>
                </div>
                <v-slider
                  v-model="enemigoSeleccionado.velocidad"
                  color="blue"
                  min="0"
                  max="20"
                  hide-details
                ></v-slider>
              </v-sheet>
            </v-col>
          </v-row>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" text @click="cerrarDialogo">
            Cancelar
          </v-btn>
          <v-btn color="primary" @click="guardarCambios">
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- Snackbar para notificaciones -->
    <v-snackbar
      v-model="snackbar.mostrar"
      :color="snackbar.color"
      :timeout="3000"
    >
      {{ snackbar.texto }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="snackbar.mostrar = false"
        >
          Cerrar
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  name: "Enemigos",
  data() {
    return {
      search: '',
      dialogoAbierto: false,
      headers: [
        { text: "ID", value: "id", align: "start", width: "10%" },
        { text: "Nombre", value: "nombre", width: "25%" },
        { text: "Tipo", value: "tipo", width: "20%" },
        { text: "Estado", value: "estado", width: "15%" },
        { text: "Vida", value: "vida", width: "10%" },
        { text: "Daño", value: "daño", width: "10%" },
        { text: "Velocidad", value: "velocidad", width: "10%" },
      ],
      enemigos: [
        { id: 1, nombre: "Goblin", tipo: "Humanoide", vida: 30, daño: 10, velocidad: 8 },
        { id: 2, nombre: "Orco", tipo: "Humanoide", vida: 70, daño: 25, velocidad: 5 },
        { id: 3, nombre: "Dragón", tipo: "Bestia", vida: 100, daño: 50, velocidad: 12 },
        { id: 4, nombre: "Esqueleto", tipo: "No-muerto", vida: 25, daño: 15, velocidad: 6 },
        { id: 5, nombre: "Troll", tipo: "Gigante", vida: 85, daño: 30, velocidad: 4 }
      ],
      enemigoSeleccionado: null,
      enemigoOriginal: null,
      snackbar: {
        mostrar: false,
        texto: '',
        color: 'success'
      }
    };
  },
  methods: {
    seleccionarEnemigo(enemigo) {
      this.enemigoOriginal = { ...enemigo };
      this.enemigoSeleccionado = { ...enemigo };
      this.dialogoAbierto = true;
    },
    cerrarDialogo() {
      this.dialogoAbierto = false;
      this.enemigoSeleccionado = null;
    },
    guardarCambios() {
      // Aquí es donde conectarías con tu base de datos en el futuro
      // Por ahora, solo actualizamos el array local
      const index = this.enemigos.findIndex(e => e.id === this.enemigoSeleccionado.id);
      if (index !== -1) {
        this.enemigos.splice(index, 1, { ...this.enemigoSeleccionado });
      }
      
      this.snackbar.texto = `${this.enemigoSeleccionado.nombre} actualizado correctamente`;
      this.snackbar.color = 'success';
      this.snackbar.mostrar = true;
      
      this.cerrarDialogo();
    },
    getEstadoColor(vida) {
      if (vida > 70) return 'green';
      if (vida > 30) return 'orange';
      return 'red';
    },
    getEstadoTexto(vida) {
      if (vida > 70) return 'Fuerte';
      if (vida > 30) return 'Normal';
      return 'Débil';
    }
  }
};
</script>

<style scoped>
.v-data-table >>> tbody tr {
  cursor: pointer;
}
</style>