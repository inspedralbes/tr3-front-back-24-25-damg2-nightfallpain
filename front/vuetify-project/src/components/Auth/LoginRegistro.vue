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
            Registro
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

    const handleLogin = () => {
      console.log("Login con: ", login.value);
      router.push("/dashboard");
    };

    const handleRegister = () => {
      console.log("Registro con: ", register.value);
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
