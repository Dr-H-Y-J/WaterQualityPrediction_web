<template>
  <router-view />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
</script>

<!-- <template>
  <div id="app">
    <component :is="layoutComponent" />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { userStore } from "./stores/user";
import layout from "./components/layout/layout.vue";
import Login from "./components/Login.vue";

const store = userStore();
const layoutComponent = computed(() => {
  return store.isLoggedIn ? layout : Login;
});
</script>

<style scoped></style> -->
