<template>
  <v-container>
    <v-card v-if="peer && authStore.user">
      <v-card-title>Chat with {{ peer.displayName }}</v-card-title>
      <hr>
      <v-card-text>
        <v-list class="chat-container" id="messagesContainer">
          <div class="d-flex" v-for="(message, index) in messages" :key="message.timestamp"
            :class="message.senderId === authStore.user.uid ? 'justify-end' : 'justify-start'">
            <div class="d-flex flex-column"
              :class="message.senderId === authStore.user.uid ? 'message-right' : 'message-left'">
              <v-list-item-title class="mb-3">{{ message.senderId === authStore.user.uid ? 'You' : peer.displayName
                }}</v-list-item-title>
              <p class="mb-3">{{ message.message }}</p>
              <v-list-item-subtitle class="text-right">{{ formatTimestamp(message.timestamp) }}</v-list-item-subtitle>
            </div>
          </div>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-text-field v-model="newMessage" label="Type a message" @keyup.enter="sendMessage"></v-text-field>
        <v-btn @click="sendMessage">Send</v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else>
      <v-card-text>Select a user to start chatting</v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { watchEffect } from 'vue';
import { useAuthStore } from '@stores/auth';
import { useMessageStore } from '@stores/message';
import { format } from 'date-fns'

const authStore = useAuthStore();
const messageStore = useMessageStore();
const props = defineProps({
  peer: Object
});

const messages = ref([])
const newMessage = ref('')
const currentUser = ref('');

const scrollToBottom = () => {
  const container = document.getElementById('messagesContainer');
  if (container) {
    console.log('asdasd', container);
    container.scrollTop = container.scrollHeight
  } else {
    console.log('scrool noooo', container);
  }
 
};

watch(
  () => props.peer,
  async (newPeer) => {
    if (newPeer) {
      scrollToBottom();
    }
  },
  { immediate: true }
);

watch(
  () => messages.value,
  () => {
    scrollToBottom();
  }
);

const sendMessage = async () => {
  const selectedPeer = props.peer.uid
  const currentUserId = currentUser.value.uid

  if (newMessage.value.trim() !== '' && selectedPeer) {
    await messageStore.sendMessage(currentUserId, selectedPeer, currentUserId, newMessage.value.trim());
    newMessage.value = '';
  }
};

const formatTimestamp = (timestamp) => {
  return format(new Date(timestamp), 'yyyy-MM-dd HH:mm'); // Example formatd
}

watchEffect(() => {
  currentUser.value = authStore.user
  
  if (!currentUser.value) {
    console.log('asd');
    props.peer = {}
  } else {
    if (props.peer) {
    console.log('Selected Peer:', props.peer.uid);

    const roomId = messageStore.generateRoomId(currentUser.value.uid, props.peer.uid);
    messageStore.getMessages(roomId, (newMessages) => {
      console.log('newMessages', newMessages);
      messages.value = newMessages;
    });
  }
  }
});
</script>

<style scoped>

.chat-container{
  height: 70vh;
  max-height: 80vh;
  overflow-y: auto;
}

.message-left {
  background-color: #e0e0e0;
  /* Light gray for received messages */
  padding: 10px;
  margin: 5px;
  border-radius: 10px;
  width: fit-content;
  min-width: 25%;
  max-width: 70%;
}

.message-right {
  background-color: #007bff;
  /* Blue for sent messages */
  color: white;
  padding: 10px;
  margin: 5px;
  border-radius: 10px;
  min-width: 15%;
  width: fit-content;
  max-width: 70%;
}
</style>
