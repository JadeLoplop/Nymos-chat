<template>
  <v-card>
    <v-card-title>Peers</v-card-title>
    <v-text-field v-model="peer" label="Seach peers" @keyup.stop="searchPeers"></v-text-field>

    <template v-if="users.length <= 0">
    <v-list >
      <v-list-item v-for="(user, index) in peers" :key="index" @click="selectUser(user)"
        :class="{ 'v-list-item--active': selectedPeer && selectedPeer.uid === user.uid }">
        <v-list-item-content>
          <v-list-item-title>{{ user.displayName }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </template>
  <template v-else>
    <v-list >
      <v-list-item v-for="(user, index) in users" :key="index" @click="selectUser(user)"
        :class="{ 'v-list-item--active': selectedPeer && selectedPeer.uid === user.uid }">
        <v-list-item-content>
          <v-list-item-title>{{ user.displayName }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </template>

  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@stores/auth';
import { usePeerStore } from '@stores/peer';

const authStore = useAuthStore();
const peerStore = usePeerStore();

const peers = ref([]);
const users = ref([]);
const peer = ref('');

const selectedPeer = ref(null)

const searchPeers = () => {
  peerStore.retrieveAuthUsers();
  
  const query = peer.value.toLowerCase();
  if (!query.trim()) {
    users.value = []
  } else {
    users.value = peerStore.fetchAllUsers.filter(user =>
      user.displayName.toLowerCase().includes(query)
    );
  }

};
const emits = defineEmits(['select-user']);

const selectUser = (user) => {
  selectedPeer.value = user
  users.value = []
  peer.value = ''
  emits('select-user', user);
};

// watch(peer)
// watch(users)
watch(() => peerStore.fetchAllPeers, (newPeers) => {
  console.log('fetching all peers');
  peers.value = newPeers;
});

// onMounted(() => {
//   if (authStore.user) {
//     peerStore.getPreviouslyContactedPeers(authStore.user.duid)
//   } else {
//     peers.value = []
//   }
// })

watchEffect(() => {
  console.log('trigger watch effect');
  if (authStore.user) {
    console.log('trigger retrieve prev peers');
    peerStore.getPreviouslyContactedPeers(authStore.user.uid)
  } else {
    peers.value = []
  }
})
</script>

<style scoped>
.v-list-item--active {
  background-color: #e0e0e0;
}
</style>
