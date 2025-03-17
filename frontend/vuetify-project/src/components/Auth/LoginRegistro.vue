<template>
  <div class="cyber-background">
    <v-container>
      <v-card class="auth-card mx-auto" max-width="450" rounded="lg" elevation="5" color="#0F1923">
        <h1 class="text-center pt-5 cyberpunk-title">NightFall Pain Admin</h1>
        
        <v-tabs v-model="tab" background-color="transparent" slider-color="#9C27B0" centered>
          <v-tab value="login" class="cyber-text" color="#9C27B0">INICIAR SESIÓ</v-tab>
          <v-tab value="register" class="cyber-text" color="#9C27B0">REGISTRARSE</v-tab>
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
                  color="#9C27B0"
                  bg-color="#151C27"
                  class="cyber-input"
                ></v-text-field>
                
                <v-text-field
                  v-model="login.password"
                  label="Password"
                  :type="showPassword ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                  variant="outlined"
                  color="#9C27B0"
                  bg-color="#151C27"
                  class="cyber-input"
                ></v-text-field>
                
                <v-btn type="submit" block color="#9C27B0" class="mt-4 cyber-button">
                  <span class="text-white font-weight-bold">ACCEDIR</span>
                </v-btn>
              </v-form>
            </v-window-item>
            
            <!-- Register Tab -->
            <v-window-item value="register">
              <v-form @submit.prevent="handleRegister">
                <v-text-field
                  v-model="register.name"
                  label="Name"
                  prepend-inner-icon="mdi-account"
                  variant="outlined"
                  color="#9C27B0"
                  bg-color="#151C27"
                  class="cyber-input"
                ></v-text-field>
                
                <v-text-field
                  v-model="register.email"
                  label="Email"
                  type="email"
                  prepend-inner-icon="mdi-email"
                  variant="outlined"
                  color="#9C27B0"
                  bg-color="#151C27"
                  class="cyber-input"
                ></v-text-field>
                
                <v-text-field
                  v-model="register.password"
                  label="Password"
                  :type="showPassword ? 'text' : 'password'"
                  prepend-inner-icon="mdi-lock"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  @click:append-inner="showPassword = !showPassword"
                  variant="outlined"
                  color="#9C27B0"
                  bg-color="#151C27"
                  class="cyber-input"
                ></v-text-field>
                
                <v-btn type="submit" block color="#9C27B0" class="mt-4 cyber-button">
                  <span class="text-white font-weight-bold">REGISTRARSE</span>
                </v-btn>
              </v-form>
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </v-container>
    
    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000" dark>
      {{ snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar.show = false" class="neon-button">Cerrar</v-btn>
      </template>
    </v-snackbar>
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
    const snackbar = ref({ show: false, message: "", color: "success" });

    const showSnackbar = (message, color = "success") => {
      snackbar.value = { show: true, message, color };
    };

    const handleLogin = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/usuarios/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: login.value.email, password: login.value.password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Error al inicia sesió");

        if (data.user && data.user.admin === true) {
          localStorage.setItem("usuario", JSON.stringify(data.user));
          router.push("/admin");
          showSnackbar("Inici de sesió reeixit", "success");
        } else {
          showSnackbar("Accés només per a administradors", "error");
          localStorage.removeItem("usuario");
        }
      } catch (error) {
        showSnackbar(error.message, "error");
      }
    };

    const handleRegister = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}api/usuarios/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: register.value.name,
            email: register.value.email,
            password: register.value.password,
            admin: 0,
            speed: 10,
            health: 100,
            damage: 25,
            arma: "espada",
            shop: "Tienda1",
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Error al registrar l'usuari");
        showSnackbar("Registre reeixit. Només admins poden accedir.", "success");
        tab.value = "login";
      } catch (error) {
        showSnackbar(error.message, "error");
      }
    };

    return { tab, login, register, handleLogin, handleRegister, showPassword, snackbar };
  },
};
</script>


<style scoped>
.cyber-background {
  background-color: #151C27;
  background-image: linear-gradient(rgba(15, 25, 35, 0.9), rgba(15, 25, 35, 0.85)), 
                    repeating-linear-gradient(90deg, rgba(156, 39, 176, 0.1) 0px, rgba(156, 39, 176, 0.1) 1px, transparent 1px, transparent 7px);
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.auth-card {
  padding-bottom: 20px;
  border: 1px solid rgba(156, 39, 176, 0.3);
  position: relative;
  overflow: hidden;
}

.auth-card::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(to right, transparent, #CE93D8, transparent);
}

.cyberpunk-title {
  font-family: 'Arial', sans-serif;
  font-weight: 800;
  letter-spacing: 2px;
  color: #9C27B0;
  margin-bottom: 10px;
}
.form-container {
  margin-top: 20px; /* Puedes ajustar este valor según sea necesario */
}

.cyber-text {
  font-family: 'Arial', sans-serif;
  font-weight: 600;
  letter-spacing: 1px;
}

.cyber-input :deep(.v-field__outline) {
  color: #CE93D8 !important;
}

.cyber-input :deep(.v-field__field) {
  color: white !important;
}

.cyber-input :deep(.v-field__input) {
  color: white !important;
}

.cyber-button {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid #9C27B0;
}

.cyber-button:hover {
  background-color: #CE93D8 !important;
  border-color: #CE93D8;
}

.cyber-button:hover span {
  color: #0F1923 !important;
}

/* Para los tabs */
:deep(.v-tab--selected) {
  color: #CE93D8 !important;
}

:deep(.v-tab:not(.v-tab--selected)) {
  opacity: 0.7;
}

:deep(.v-tabs .v-slide-group__content) {
  border-bottom: 1px solid rgba(156, 39, 176, 0.3);
}
</style>