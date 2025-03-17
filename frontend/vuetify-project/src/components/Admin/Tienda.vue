<template>
  <div class="cyber-background">
    <v-container>
      <v-card class="cyber-card">
        <v-row align="center" class="header-row">
          <v-col>
            <v-card-title class="neon-text">Botiga Cyberpunk</v-card-title>
          </v-col>
          <v-col class="text-right">
            <v-btn class="neon-button" @click="abrirDialogo(null)">Nou Producte</v-btn>
          </v-col>
        </v-row>
      </v-card>

      <v-row>
        <v-col v-for="(producto, index) in productos" :key="index" cols="12" sm="6" md="4">
          <v-card class="product-card">
            <v-img v-if="producto.imatge" :src="producto.imatge" height="200px" contain></v-img>
            <v-card-title>{{ producto.títol }}</v-card-title>
            <v-card-text>
              <p class="descripcion">{{ producto.descripció }}</p>
              <p class="precio">Preu: ${{ producto.preu }}</p>
            </v-card-text>
            <v-card-actions>
              <v-btn class="neon-button-edit" small @click="abrirDialogo(index)">Editar</v-btn>
              <v-btn class="neon-button-delete" small @click="eliminarProducto(index)">Eliminar</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>

      <!-- Diálogo para añadir/editar producto -->
      <v-dialog v-model="dialogoAbierto" max-width="500px">
        <v-card class="cyber-card">
          <v-card-title class="neon-text">
            {{ editandoIndex !== null ? 'Editar Producte' : 'Nou Producte' }}
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="nuevoProducto.títol" label="Títol" class="cyber-input" dark></v-text-field>
            <v-textarea v-model="nuevoProducto.descripció" label="Descripció" class="cyber-input" dark></v-textarea>
            <v-text-field v-model.number="nuevoProducto.preu" label="Preu" type="number" class="cyber-input" dark></v-text-field>
            <v-file-input v-model="nuevoProducto.imagenArchivo" label="Pujar Imatge" accept="image/*" class="cyber-input" dark @change="cargarImagen"></v-file-input>
          </v-card-text>
          <v-card-actions>
            <v-btn class="neon-button-cancel" text @click="cerrarDialogo">Cancelar</v-btn>
            <v-btn class="neon-button" @click="guardarProducto">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "Tienda",
  data() {
    return {
      productos: [
        {
          títol: "Cyber Sword X99",
          descripció: "Espada de plasma con filo de nanocarbono.",
          preu: 2500,
          imatge: "https://i1.sndcdn.com/artworks-WubUsyqnNUX5OzzX-WmyBMA-t1080x1080.jpg"
        }
      ],
      dialogoAbierto: false,
      editandoIndex: null,
      nuevoProducto: { títol: "", descripció: "", preu: 0, imatge: null, imagenArchivo: null }
    };
  },
  methods: {
    abrirDialogo(index) {
      this.editandoIndex = index;
      if (index !== null) {
        this.nuevoProducto = { ...this.productos[index] };
      } else {
        this.nuevoProducto = { títol: "", descripció: "", preu: 0, imatge: null, imagenArchivo: null };
      }
      this.dialogoAbierto = true;
    },
    cerrarDialogo() {
      this.dialogoAbierto = false;
    },
    guardarProducto() {
      if (this.editandoIndex !== null) {
        this.productos.splice(this.editandoIndex, 1, { ...this.nuevoProducto });
      } else {
        this.productos.push({ ...this.nuevoProducto });
      }
      this.cerrarDialogo();
    },
    eliminarProducto(index) {
      this.productos.splice(index, 1);
    },
    cargarImagen(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.nuevoProducto.imatge = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  }
};
</script>

<style scoped>
.cyber-background {
  background-color: #151C27;
  min-height: 100vh;
}

.cyber-card {
  background-color: #1E2633;
  border: 1px solid rgba(156, 39, 176, 0.3);
  color: white;
  padding: 20px;
  margin-bottom: 20px;
}

.neon-text {
  color: #9C27B0;
  text-shadow: 0 0 5px #9C27B0, 0 0 10px #9C27B0;
}

.header-row {
  display: flex;
  align-items: center;
}

.text-right {
  display: flex;
  justify-content: flex-end;
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

.neon-button-edit {
  background: #ff9800;
  color: white;
  box-shadow: 0 0 10px #ff9800;
}

.neon-button-delete {
  background: #ff2c2c;
  color: white;
  box-shadow: 0 0 10px #ff2c2c;
}

.cyber-input >>> .v-input__control {
  background-color: #252d3d !important;
  border: 1px solid rgba(156, 39, 176, 0.5);
  color: white;
}

.product-card {
  background-color: #1E2633 !important;
  color: white !important;
  border: 1px solid rgba(156, 39, 176, 0.3);
  box-shadow: 0 0 10px rgba(156, 39, 176, 0.5);
}

.descripcion {
  color: #b16bc9;
  font-size: 0.9em;
}

.precio {
  color: #d5a6e6;
  font-size: 1.1em;
  font-weight: bold;
}
</style>
