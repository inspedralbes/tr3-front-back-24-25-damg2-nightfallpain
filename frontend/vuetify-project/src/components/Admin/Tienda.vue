<template>
  <div class="cyber-background">
    <v-container>
      <v-card class="cyber-card">
        <v-row align="center" class="header-row">
          <v-col>
            <v-card-title class="neon-text">Botiga Cyberpunk</v-card-title>
          </v-col>
          <v-col class="text-right">
            <v-btn 
              :class="mantenimiento ? 'neon-button-maintenance-active' : 'neon-button-maintenance'" 
              class="mr-2"
              @click="toggleMantenimiento"
            >
              {{ mantenimiento ? 'Finalitzar Manteniment' : 'Activar Manteniment' }}
            </v-btn>
            <v-btn class="neon-button" @click="abrirDialogo(null)">Nou Producte</v-btn>
          </v-col>
        </v-row>
      </v-card>

      <!-- Maintenance Banner -->
      <v-alert v-if="mantenimiento" type="warning" class="maintenance-alert mb-4">
        <strong>⚠️ Botiga en manteniment ⚠️</strong>
      </v-alert>


      <!-- Loading Spinner -->
      <div v-if="loading" class="text-center my-4">
        <v-progress-circular indeterminate color="#9C27B0" size="50"></v-progress-circular>
      </div>

      <!-- Error Message -->
      <v-alert v-if="error" type="error" class="mb-4">
        {{ error }}
      </v-alert>

      <v-row>
        <v-col v-for="(producto, index) in productos" :key="producto.id" cols="12" sm="6" md="4">
          <v-card class="product-card">
            <v-img v-if="producto.image" :src="producto.image" height="200px" contain></v-img>
            <v-card-title>{{ producto.name }}</v-card-title>
            <v-card-text>
              <p class="descripcion">{{ producto.type }}</p>
              <p class="precio">Preu: ${{ producto.price }}</p>
            </v-card-text>
            <v-card-actions>
              <v-btn class="neon-button-edit" small @click="abrirDialogo(index)">Editar</v-btn>
              <v-btn class="neon-button-delete" small @click="eliminarProducto(producto.id)">Eliminar</v-btn>
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
            <v-text-field v-model="nuevoProducto.name" label="Nom" class="cyber-input" dark></v-text-field>
            <v-text-field v-model="nuevoProducto.type" label="Tipus" class="cyber-input" dark></v-text-field>
            <v-text-field v-model.number="nuevoProducto.price" label="Preu" type="number" class="cyber-input" dark></v-text-field>
            <v-text-field v-model="nuevoProducto.image" label="URL d'Imatge" class="cyber-input" dark></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn class="neon-button-cancel" text @click="cerrarDialogo">Cancelar</v-btn>
            <v-btn class="neon-button" @click="guardarProducto" :disabled="loading">
              <v-progress-circular v-if="loading" indeterminate size="20" width="2" color="white" class="mr-2"></v-progress-circular>
              Guardar
            </v-btn>
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
    productos: [],
    dialogoAbierto: false,
    editandoIndex: null,
    nuevoProducto: { name: "", type: "", price: 0, image: "" },
    loading: false,
    error: null,
    mantenimiento: false,
    adminSecret: localStorage.getItem("adminSecret") || ""  // Guardar clave secreta
  };
},

  created() {
    this.verificarEstadoMantenimiento();
    this.cargarProductos();
  },
  methods: {
    async verificarEstadoMantenimiento() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/shops/mantenimiento`);
        if (response.ok) {
          const data = await response.json();
          this.mantenimiento = data.mantenimiento;
        }
      } catch (error) {
        console.error('Error al verificar estado de mantenimiento:', error);
      }
    },
    async toggleMantenimiento() {
      this.loading = true;
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/shops/mantenimiento`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ activo: !this.mantenimiento })
        });
        
        if (response.ok) {
          const data = await response.json();
          this.mantenimiento = data.mantenimiento;
          this.error = null;
          
          // Mostrar mensaje temporal
          this.$nextTick(() => {
            this.error = `La tienda ahora está ${this.mantenimiento ? 'en mantenimiento' : 'activa'}.`;
            setTimeout(() => {
              if (this.error === `La tienda ahora está ${this.mantenimiento ? 'en mantenimiento' : 'activa'}.`) {
                this.error = null;
              }
            }, 3000);
          });
          
          // Recargar productos si se desactiva el mantenimiento
          if (!this.mantenimiento) {
            await this.cargarProductos();
          }
        } else {
          throw new Error('No se pudo cambiar el modo de mantenimiento');
        }
      } catch (error) {
        console.error('Error al cambiar modo mantenimiento:', error);
        this.error = 'Error al cambiar el modo de mantenimiento';
      } finally {
        this.loading = false;
      }
    },
    async cargarProductos() {
    this.loading = true;
    this.error = null;
    try {
        const token = localStorage.getItem("token"); // Obtener el token del localStorage
        const headers = {};

        if (token) {
            headers["Authorization"] = `Bearer ${token}`; // Incluir el token en el encabezado
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}api/shops/shop`, {
            method: 'GET',
            headers: headers
        });

        if (!response.ok) {
            if (response.status === 503) {
                const data = await response.json();
                this.mantenimiento = data.mantenimiento;
                return;
            }
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        this.productos = await response.json();
    } catch (error) {
        console.error('Error al cargar productos:', error);
        this.error = 'No s\'han pogut carregar els productes. Si us plau, torneu-ho a provar més tard.';
    } finally {
        this.loading = false;
    }
},
    abrirDialogo(index) {
      this.editandoIndex = index;
      if (index !== null) {
        // Solo copiamos los campos exactos que necesitamos
        this.nuevoProducto = {
          id: this.productos[index].id,
          name: this.productos[index].name,
          type: this.productos[index].type,
          price: this.productos[index].price,
          image: this.productos[index].image
        };
      } else {
        this.nuevoProducto = { 
          name: "", 
          type: "", 
          price: 0, 
          image: "" 
        };
      }
      this.dialogoAbierto = true;
    },
    cerrarDialogo() {
      this.dialogoAbierto = false;
      this.error = null;
    },
    async guardarProducto() {
      if (!this.nuevoProducto.name || !this.nuevoProducto.price || !this.nuevoProducto.type) {
        this.error = 'Si us plau, omple tots els camps obligatoris.';
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        // Creamos un objeto exactamente con los campos que espera la API
        const productoData = {
          name: this.nuevoProducto.name,
          price: this.nuevoProducto.price,
          type: this.nuevoProducto.type,
          image: this.nuevoProducto.image
        };

        let response;
        if (this.editandoIndex !== null) {
          // Actualizar producto existente
          response = await fetch(`${import.meta.env.VITE_API_URL}api/shops/update/${this.nuevoProducto.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(productoData)
          });
        } else {
          // Crear nuevo producto
          response = await fetch(`${import.meta.env.VITE_API_URL}api/shops/new`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(productoData)
          });
        }

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }
        
        await this.cargarProductos(); // Recargar la lista después de guardar
        this.cerrarDialogo();
      } catch (error) {
        console.error('Error al guardar el producto:', error);
        this.error = error.message || 'No s\'ha pogut guardar el producte. Si us plau, torneu-ho a provar més tard.';
      } finally {
        this.loading = false;
      }
    },
    async eliminarProducto(id) {
      if (!confirm('Estàs segur que vols eliminar aquest producte?')) {
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/shops/delete/${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }

        await this.cargarProductos(); // Recargar la lista después de eliminar
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        this.error = error.message || 'No s\'ha pogut eliminar el producte. Si us plau, torneu-ho a provar més tard.';
      } finally {
        this.loading = false;
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

.neon-button-maintenance {
  background: #ff9800;
  color: white;
  box-shadow: 0 0 10px #ff9800;
}

.neon-button-maintenance-active {
  background: #ff5722;
  color: white;
  box-shadow: 0 0 10px #ff5722;
}

.maintenance-alert {
  background-color: rgba(255, 152, 0, 0.2) !important;
  border: 1px solid #ff9800;
  color: #ff9800;
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
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 15px rgba(156, 39, 176, 0.8);
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