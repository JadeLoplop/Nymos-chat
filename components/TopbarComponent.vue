<template>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>My Chat Application</v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="!user">
        <v-btn @click="signInWithGoogle">Google Login</v-btn>
        <v-btn @click="guestLogin">Guest Login</v-btn>
      </template>
      <template v-else>
        <v-btn @click="signOut">Logout</v-btn>
        <v-btn @click="createDummyUsers">createDummyUsers</v-btn>
      </template>
    </v-app-bar>
  </template>
  
  <script setup>
  import { useAuthStore } from '@stores/auth';

  const authStore = useAuthStore();
  const user = ref(authStore.fetchSavedUser)

  watch(() => authStore.fetchSavedUser, (newUser) => {
    user.value = newUser;
  }, { immediate: true });

  const createDummyUsers = async () => {
  await authStore.generateAndSaveDummyUsers();
};

  
  const signInWithGoogle = () => authStore.signInWithGoogle();
  const guestLogin = () => authStore.guestLogin();
  const signOut = () => authStore.signOut();
  
  
  </script>
  
  <style scoped>
  </style>
  