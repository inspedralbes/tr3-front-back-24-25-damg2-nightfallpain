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

      <v-row>
        <v-col v-for="(producto, index) in productos" :key="producto.id" cols="12" sm="6" md="4">
          <v-card class="product-card">
            <v-img 
              v-if="producto.image" 
              :src="getImageUrl(producto.image)" 
              height="200px" 
              contain
              @error="handleImageError"
            />

            <v-card-title>{{ producto.name }}</v-card-title>
            <v-card-text>
              <p class="descripcion">{{ producto.type }}</p>
              <p class="precio">Preu: ${{ producto.price }}</p>
            </v-card-text>
            <v-card-actions>
              <v-btn class="neon-button-edit" small @click="abrirDialogo(index)">Editar</v-btn>
              <v-btn class="neon-button-delete" small @click.native="mostrarDialogoEliminacion(producto)">Eliminar</v-btn>
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
            <v-select v-model="nuevoProducto.type" :items="['skin', 'weapon']" label="Tipus" class="cyber-input" dark></v-select>
            <v-text-field v-model.number="nuevoProducto.price" label="Preu" type="number" class="cyber-input" dark></v-text-field>
            
            <!-- Nuevo input para carga de imagen -->
            <v-file-input
              v-model="imagenFile"
              label="Seleccionar imatge"
              accept="image/jpeg, image/png, image/jpg"
              prepend-icon="mdi-camera"
              show-size
              truncate-length="15"
              class="cyber-input"
              dark
              @change="handleImageChange"
            ></v-file-input>
            
            <!-- Previsualización de la imagen -->
            <div v-if="previewImage" class="text-center my-3">
              <img :src="previewImage" height="150" class="preview-image" />
              <div class="mt-2">
                <v-btn small text color="error" @click="removeImage">Eliminar imatge</v-btn>
              </div>
            </div>
            
            <!-- Campo oculto para URL de imagen actual -->
            <v-text-field v-if="!imagenFile" v-model="nuevoProducto.image" label="URL d'Imatge actual" class="cyber-input" dark disabled></v-text-field>
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

      <!-- Diálogo de confirmación de eliminación -->
      <v-dialog v-model="deleteDialog" max-width="400">
        <v-card class="cyber-card">
          <v-card-title class="neon-text">
            <v-icon left color="error">mdi-alert</v-icon>
            Confirmar eliminació
          </v-card-title>
          <v-card-text class="neon-text">
            ¿Estàs segur que vols eliminar a {{ productoSeleccionado?.name }}?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="deleteDialog = false" class="neon-button-cancel">Cancelar</v-btn>
            <v-btn class="neon-button-delete" @click="confirmarEliminacion">Eliminar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Snackbar para mensajes de estado -->
      <v-snackbar
        v-model="snackbar.show"
        :color="snackbar.color"
        timeout="3000"
        bottom
      >
        {{ snackbar.text }}
        <template v-slot:action="{ attrs }">
          <v-btn
            text
            v-bind="attrs"
            @click="snackbar.show = false"
          >
            Tancar
          </v-btn>
        </template>
      </v-snackbar>
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
      imagenFile: null,
      previewImage: null,
      loading: false,
      snackbar: {
        show: false,
        text: "",
        color: "info"
      },
      mantenimiento: false,
      adminSecret: localStorage.getItem("adminSecret") || "",  // Guardar clave secreta
      deleteDialog: false,
      productoSeleccionado: null
    };
  },

  created() {
    this.verificarEstadoMantenimiento();
    this.cargarProductos();
  },
  methods: {
    handleImageChange(event) {
    const file = event.target.files[0];

    // ✅ Verificar si el archivo existe antes de llamar a createObjectURL
    if (!file) {
      console.error("No se seleccionó ningún archivo.");
      return;
    }

    // Liberar memoria si ya hay una URL previa
    if (this.imagePreview) {
      URL.revokeObjectURL(this.imagePreview);
    }

    this.imagePreview = URL.createObjectURL(file);
  },
    getImageUrl(image) {
    if (!image) return '/src/assets/logo.png'; // Imagen por defecto si no hay imagen

    // Si la imagen ya tiene una URL completa (por ejemplo, una externa), devolverla tal cual
    if (image.startsWith('http')) return image;

    // Si la imagen es un archivo local del servidor, construir la URL completa
    return `${import.meta.env.VITE_API_URL}uploads/shop/${image}`;
  },
    removeImage() {
      this.imagenFile = null;
      this.previewImage = null;
      // Si estamos editando, mantener la URL existente
      if (this.editandoIndex !== null) {
        this.nuevoProducto.image = this.productos[this.editandoIndex].image;
      } else {
        this.nuevoProducto.image = "";
      }
    },
    
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
          
          // Mostrar mensaje con snackbar
          this.mostrarSnackbar(
            `La botiga ara està ${this.mantenimiento ? 'en manteniment' : 'activa'}.`,
            this.mantenimiento ? 'warning' : 'success'
          );
          
          // Recargar productos si se desactiva el mantenimiento
          if (!this.mantenimiento) {
            await this.cargarProductos();
          }
        } else {
          throw new Error('No es va poder canviar el mode de manteniment');
        }
      } catch (error) {
        console.error('Error al cambiar modo mantenimiento:', error);
        this.mostrarSnackbar('Error al canviar el mode de manteniment', 'error');
      } finally {
        this.loading = false;
      }
    },
    async cargarProductos() {
      this.loading = true;
      try {
        const token = localStorage.getItem("token"); // Obtener el token del localStorage
        const headers = {
          'Content-Type': 'application/json'
        };

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
        this.mostrarSnackbar('No s\'han pogut carregar els productes. Si us plau, torneu-ho a provar més tard.', 'error');
      } finally {
        this.loading = false;
      }
    },
    abrirDialogo(index) {
      this.editandoIndex = index;
      this.imagenFile = null;
      this.previewImage = null;
      
      if (index !== null) {
        // Solo copiamos los campos exactos que necesitamos
        this.nuevoProducto = {
          id: this.productos[index].id,
          name: this.productos[index].name,
          type: this.productos[index].type,
          price: this.productos[index].price,
          image: this.productos[index].image
        };
        
        // Si hay una imagen existente, mostrarla en la previsualización
        if (this.nuevoProducto.image) {
          this.previewImage = this.nuevoProducto.image;
        }
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
      this.previewImage = null;
      this.imagenFile = null;
    },
    mostrarSnackbar(texto, color = 'info') {
      this.snackbar.text = texto;
      this.snackbar.color = color;
      this.snackbar.show = true;
    },
    async guardarProducto() {
      if (!this.nuevoProducto.name || !this.nuevoProducto.price || !this.nuevoProducto.type) {
        this.mostrarSnackbar('Si us plau, omple tots els camps obligatoris.', 'warning');
        return;
      }

      this.loading = true;

      try {
        const token = localStorage.getItem("token");
        const headers = {};

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        let response;
        let url;
        let method;
        
        // Utilizamos FormData para enviar datos multipart (imágenes + texto)
        const formData = new FormData();
        formData.append('name', this.nuevoProducto.name);
        formData.append('price', this.nuevoProducto.price);
        formData.append('type', this.nuevoProducto.type);
        
        // Si se seleccionó una nueva imagen, la agregamos al FormData
        if (this.imagenFile) {
          formData.append('image', this.imagenFile);
        } else if (this.nuevoProducto.image) {
          // Si no hay nueva imagen pero hay una URL de imagen existente
          formData.append('imageUrl', this.nuevoProducto.image);
        }
        
        if (this.editandoIndex !== null) {
          // Actualizar producto existente
          url = `${import.meta.env.VITE_API_URL}api/shops/update/${this.nuevoProducto.id}`;
          method = 'PUT';
        } else {
          // Crear nuevo producto
          url = `${import.meta.env.VITE_API_URL}api/shops/new`;
          method = 'POST';
        }
        
        response = await fetch(url, {
          method: method,
          headers: headers,
          body: formData
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }
        
        await this.cargarProductos(); // Recargar la lista después de guardar
        this.cerrarDialogo();
        this.mostrarSnackbar(
          this.editandoIndex !== null ? 'Producte actualitzat correctament.' : 'Producte creat correctament.',
          'success'
        );
      } catch (error) {
        console.error('Error al guardar el producto:', error);
        this.mostrarSnackbar(
          error.message || 'No s\'ha pogut guardar el producte. Si us plau, torneu-ho a provar més tard.',
          'error'
        );
      } finally {
        this.loading = false;
      }
    },
    handleImageError(event) {
      if (event && event.target) {
        event.target.src = '/src/assets/logo.png';
      }
    },
    mostrarDialogoEliminacion(producto) {
      this.productoSeleccionado = producto;
      this.deleteDialog = true;
    },
    async confirmarEliminacion() {
      if (!this.productoSeleccionado) return;
      
      this.loading = true;
      this.deleteDialog = false;

      try {
        const token = localStorage.getItem("token");
        const headers = {};

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${import.meta.env.VITE_API_URL}api/shops/delete/${this.productoSeleccionado.id}`, {
          method: 'DELETE',
          headers: headers
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
        }

        await this.cargarProductos(); // Recargar la lista después de eliminar
        this.mostrarSnackbar('Producte eliminat correctament.', 'success');
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
        this.mostrarSnackbar(
          error.message || 'No s\'ha pogut eliminar el producte. Si us plau, torneu-ho a provar més tard.',
          'error'
        );
      } finally {
        this.loading = false;
        this.productoSeleccionado = null;
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

.preview-image {
  border: 2px solid rgba(156, 39, 176, 0.5);
  border-radius: 4px;
  max-width: 100%;
}
</style>