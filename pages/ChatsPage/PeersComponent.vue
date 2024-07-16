<template>
  <v-card>
    <v-card-title>Peers</v-card-title>
    <v-text-field v-model="peer" label="Seach peers" @keyup.stop="searchPeers"></v-text-field>
    <!-- <v-card-actions>
      <v-autocomplete v-model="selectedPeer" :items="filteredUsers.map(x=> x.displayName)" item-text="displayName" item-value="uid"
        label="Search peer" clearable @change="selectUser" return-object></v-autocomplete>
    </v-card-actions> -->

    <!-- Display filtered peers -->
    <v-list>
      <v-list-item v-for="(user, index) in peers" :key="index" @click="selectUser(user)"
        :class="{ 'v-list-item--active': selectedPeer && selectedPeer.uid === user.uid }">
        <v-list-item-content>
          <v-list-item-title>{{ user.displayName }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@stores/auth';
import { usePeerStore } from '@stores/peer';

const authStore = useAuthStore();
const peerStore = usePeerStore();

const peers = ref(peerStore.fetchAllPeers);
const peer = ref('');

const selectedPeer = ref(null)

const searchPeers = () => {
  const query = peer.value.toLowerCase();
  if (!query.trim()) {
    peers.value = peerStore.fetchAllPeers;
  } else {
    peers.value = peerStore.fetchAllPeers.filter(user =>
      user.displayName.toLowerCase().includes(query)
    );
  }

  console.log(peers.value);
};
const emits = defineEmits(['select-user']);

const selectUser = (user) => {
  selectedPeer.value = user
  emits('select-user', user);
};

onMounted(() => {
  if (authStore.user) {
    peerStore.retrieveAuthUsers();
  }
});

watch(peerStore.fetchAllPeers, (newPeers) => {
  peers.value = newPeers;
});
</script>

<style scoped>
.v-list-item--active {
  background-color: #e0e0e0;
}
</style>
