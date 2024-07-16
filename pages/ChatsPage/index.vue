<!-- pages/ChatPage.vue -->
<template>
  <v-container>
    <v-row>
      <v-col cols="4">
        <PeersComponent @select-user="handleSelectUser" />
      </v-col>
      <v-col cols="8">
        <ChatComponent :peer="selectedPeer" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import PeersComponent from './PeersComponent.vue';
import ChatComponent from './ChatComponent.vue';

const selectedPeer = ref(null);

const handleSelectUser = (user) => {
  console.log(user);
  selectedPeer.value = user;
};

watchEffect(() => {
  console.log('watching');
  if (selectedPeer.value) {
    console.log(selectedPeer.value);
  }
 
});

</script>