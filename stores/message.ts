import { defineStore } from 'pinia';
import { getDatabase, ref, set, get, push, onValue } from 'firebase/database';
import { usePeerStore } from './peer';

interface Message {
    uid: string;
    sender_uid: string | null;
    receiver_uid: string | null;
    timestamp: string | null;
}

export const useMessageStore = defineStore('message', {
    state: () => ({
        messsage: null,
    }),
    actions: {
        generateRoomId(uid1: string, uid2: string) {
            return [uid1, uid2].sort().join('_');
        },

        async createOrGetChatRoom(uid1: string, uid2: string) {
            const roomId = this.generateRoomId(uid1, uid2)
            const db = getDatabase();
            const roomRef = ref(db, `chat_rooms/${roomId}`);
            const snapshot = await get(roomRef);

            if (!snapshot.exists()) {
                await set(roomRef, {
                    participants: {
                        [uid1]: true,
                        [uid2]: true,
                    },
                    messages: {}
                });
            }

            return roomId;
        },

        async sendMessage(uid1: string, uid2: string, senderId: string, message: string) {
            const roomId = await this.createOrGetChatRoom(uid1, uid2);
            const db = getDatabase();
            const messagesRef = ref(db, `chat_rooms/${roomId}/messages`);
            const newMessageRef = push(messagesRef);

            try {
                await set(newMessageRef, {
                    senderId,
                    message,
                    timestamp: new Date().toISOString()
                });

                await this.saveChatRoomInfo(uid1, uid2);

                
                console.log('Message saved successfully.');

                const peerStore = usePeerStore();
                // await peerStore.getPreviouslyContactedPeers(uid1);
                // await peerStore.getPreviouslyContactedPeers(uid2);

                const receiverPeers = await peerStore.checkIfPeerExists(uid2, uid1);
                if (!receiverPeers) {
                  await peerStore.getPreviouslyContactedPeers(uid2);
                }

            } catch (error) {
                console.error('Error saving message:', error.message);
            }
        },

        async saveChatRoomInfo(uid1: string, uid2: string) {
            const db = getDatabase();
            const user1ChatRef = ref(db, `user_chats/${uid1}/${uid2}`);
            const user2ChatRef = ref(db, `user_chats/${uid2}/${uid1}`);
        
            const chatInfo = {
                lastMessageAt: new Date().toISOString(),
                users: [uid1, uid2]
            };
        
            try {
                await set(user1ChatRef, chatInfo);
                await set(user2ChatRef, chatInfo);
                console.log('Chat room info saved successfully.');
            } catch (error) {
                console.error('Error saving chat room info:', error.message);
            }
        },

        getMessages(roomId: string, callback: any) {
            const db = getDatabase();
            const messagesRef = ref(db, `chat_rooms/${roomId}/messages`);

            onValue(messagesRef, (snapshot) => {
                const messages = snapshot.val();
                callback(messages ? Object.values(messages) : []);
            });
        },
        reset() {
            this.$reset();
          },
    },
});
