<template>
  <v-app>
    <router-view></router-view>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.visible" :timeout="3000" color="error" multi-line>
      {{ snackbar.message }}
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      snackbar: {
        visible: false,
        message: "",
      },
    };
  },
  created() {
    window.addEventListener("show-snackbar", this.showSnackbar);
  },
  beforeUnmount() {
    window.removeEventListener("show-snackbar", this.showSnackbar);
  },
  methods: {
    showSnackbar(event) {
      this.snackbar.message = event.detail;
      this.snackbar.visible = true;
    },
  },
};
</script>
