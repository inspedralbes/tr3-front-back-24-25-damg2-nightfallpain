<template>
  <div class="lila-background">
    <v-container>
      <v-card class="mx-auto" max-width="500" color="grey-darken-3" dark>
        <v-tabs v-model="tab" background-color="primary" dark>
          <v-tab value="login">
            <v-icon left>mdi-account</v-icon>
            Login
          </v-tab>
          <v-tab value="register">
            <v-icon left>mdi-account-plus</v-icon>
            Registrarse
          </v-tab>
        </v-tabs>
        <v-card-text>
          <v-window v-model="tab">
            <v-window-item value="login">
              <v-form @submit.prevent="handleLogin">
                <v-text-field
                  v-model="login.email"
                  label="Email"
                  type="email"
                  required
                  prepend-icon="mdi-email"
                  color="white"
                ></v-text-field>
                <v-text-field
                  v-model="login.password"
                  label="Contraseña"
                  type="password"
                  required
                  prepend-icon="mdi-lock"
                  color="white"
                ></v-text-field>
                <v-btn type="submit" block class="black-button">
                  <v-icon left>mdi-login</v-icon>
                  Ingresar
                </v-btn>
              </v-form>
            </v-window-item>
            <v-window-item value="register">
              <v-form @submit.prevent="handleRegister">
                <v-text-field
                  v-model="register.name"
                  label="Nombre"
                  required
                  prepend-icon="mdi-account"
                  color="white"
                ></v-text-field>
                <v-text-field
                  v-model="register.email"
                  label="Email"
                  type="email"
                  required
                  prepend-icon="mdi-email"
                  color="white"
                ></v-text-field>
                <v-text-field
                  v-model="register.password"
                  label="Contraseña"
                  type="password"
                  required
                  prepend-icon="mdi-lock"
                  color="white"
                ></v-text-field>
                <v-btn type="submit" block class="black-button">
                  <v-icon left>mdi-account-plus</v-icon>
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

    // 📌 URL base de la API (ajusta según tu backend)
    const API_URL = "http://localhost:5000/api/usuarios";

    // 📌 FUNCIÓN PARA INICIAR SESIÓN
    const handleLogin = async () => {
      try {
        const response = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: login.value.email,
            contrasenya: login.value.password, // Debe coincidir con el backend
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error al iniciar sesión");
        }

        console.log("Inicio de sesión exitoso:", data);
        alert("Inicio de sesión exitoso");

        // Redirigir a dashboard
        router.push("/dashboard");
      } catch (error) {
        console.error("Error en el login:", error.message);
        alert(error.message);
      }
    };

    // 📌 FUNCIÓN PARA REGISTRAR USUARIO
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
            contrasenya: register.value.password, // Debe coincidir con el backend
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error al registrar usuario");
        }

        console.log("Registro exitoso:", data);
        alert("Usuario registrado con éxito");

        // Cambiar a la pestaña de login automáticamente
        tab.value = "login";
      } catch (error) {
        console.error("Error en el registro:", error.message);
        alert(error.message);
      }
    };

    return { tab, login, register, handleLogin, handleRegister };
  },
};
</script>


<style scoped>
.lila-background {
  background-color: #483b4b;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.black-button {
  background-color: black !important;
  color: white !important;
}
</style>
