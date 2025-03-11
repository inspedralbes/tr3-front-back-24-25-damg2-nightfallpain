<template>
  <div class="auth-background">
    <v-container>
      <v-card class="auth-card mx-auto" max-width="450" rounded="lg" elevation="5">
        <h1 class="text-center pt-5">Bienvenido</h1>
        
        <v-tabs v-model="tab" background-color="transparent" slider-color="primary" centered>
          <v-tab value="login">Iniciar Sesión</v-tab>
          <v-tab value="register">Registrarse</v-tab>
        </v-tabs>
        
        <v-card-text>
          <v-window v-model="tab">
            <!-- Login Tab -->
            <v-window-item value="login">
              <v-form @submit.prevent="handleLogin">
                <v-text-field
                  v-model="login.email"
                  label="Email"
                  prepend-inner-icon="mdi-email"
                  variant="outlined"
                ></v-text-field>
                
                <v-text-field
                  v-model="login.password"
                  label="Contraseña"
                  :type="showPassword ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                  variant="outlined"
                ></v-text-field>
                
                <v-btn 
                  type="submit" 
                  block 
                  color="primary"
                  class="mt-4"
                >
                  Iniciar Sesión
                </v-btn>
              </v-form>
            </v-window-item>
            
            <!-- Register Tab -->
            <v-window-item value="register">
              <v-form @submit.prevent="handleRegister">
                <v-text-field
                  v-model="register.name"
                  label="Nombre"
                  prepend-inner-icon="mdi-account"
                  variant="outlined"
                ></v-text-field>
                
                <v-text-field
                  v-model="register.email"
                  label="Email"
                  type="email"
                  prepend-inner-icon="mdi-email"
                  variant="outlined"
                ></v-text-field>
                
                <v-text-field
                  v-model="register.password"
                  label="Contraseña"
                  :type="showPassword ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock"
                  variant="outlined"
                ></v-text-field>
                
                <v-btn 
                  type="submit" 
                  block 
                  color="primary"
                  class="mt-4"
                >
                  Registrarse
                </v-btn>
              </v-form>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script>
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const tab = ref("login");
    const login = ref({ email: "", password: "" });
    const register = ref({ name: "", email: "", password: "" });
    const router = useRouter();
    const showPassword = ref(false);
    const errorMessage = ref("");

    // URL base de la API
    const API_URL = "http://localhost:5000/api/usuarios";

    // FUNCIÓN PARA INICIAR SESIÓN CON VERIFICACIÓN DE ADMIN
    // FUNCIÓN PARA INICIAR SESIÓN MODIFICADA
const handleLogin = async () => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: login.value.email,
        contrasenya: login.value.password,
      }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Error al iniciar sesión");

    // Verificación de admin en el frontend
    if (data.usuario && data.usuario.es_admin === true) {
      localStorage.setItem("usuario", JSON.stringify(data.usuario));
      router.push("/admin");
    } else {
      alert("Acceso solo disponible para administradores");
      localStorage.removeItem("usuario"); // Limpiar credenciales
    }
  } catch (error) {
    alert(error.message);
  }
};


    // FUNCIÓN PARA REGISTRAR USUARIO
    const handleRegister = async () => {
      try {
        const response = await fetch(`${API_URL}/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nom: register.value.name,
            email: register.value.email,
            contrasenya: register.value.password,
            // Por defecto, los usuarios registrados no son admin
            es_admin: 0
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error al registrar usuario");
        }

        alert("Usuario registrado. Solo los administradores pueden acceder al sistema.");
        tab.value = "login";
      } catch (error) {
        console.error("Error en el registro:", error.message);
        alert(error.message);
      }
    };

    return { 
      tab, 
      login, 
      register, 
      handleLogin, 
      handleRegister, 
      showPassword,
      errorMessage
    };
  },
};
</script>

<style scoped>
.auth-background {
  background: linear-gradient(to right, #6a11cb, #2575fc);
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.auth-card {
  padding-bottom: 20px;
}
</style>