import { defineStore } from 'pinia';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase, ref, set, get, onValue } from 'firebase/database';
import { StorageSerializers, useStorage } from '@vueuse/core';


export const usePeerStore = defineStore('peer', {
    state: () => ({
        selectedPeer: useStorage('selectedPeer', null),
        peers: [],
        users: []
    }),

    actions: {
        async getPreviouslyContactedPeers(userId: string) {

            const db = getDatabase();
            const userChatsRef = ref(db, `user_chats/${userId}`);
            // const snapshot = await get(userChatsRef);

            onValue(userChatsRef, async (snapshot) => {
                if (snapshot.exists()) {
                    this.peers = []
                    const chatRooms = snapshot.val();
                    
                    for (const [peerId, chatInfo] of Object.entries(chatRooms)) {
                        
                        const peerData = {
                            uid: peerId,
                            displayName: await this.getDisplayName(peerId), // Assume this is a function to get display name
                            lastMessageAt: chatInfo.lastMessageAt
                        };
                        this.peers.push(peerData);
                    }
                    this.peers.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());
                } else {
                    console.log('No chat rooms found for this user.');
                }
            });

           
        },

        async checkIfPeerExists(uid1: string, uid2: string) {
            const db = getDatabase();
            const user1ChatRef = ref(db, `user_chats/${uid1}/${uid2}`);
            const user2ChatRef = ref(db, `user_chats/${uid2}/${uid1}`);

            const snapshot1 = await get(user1ChatRef);
            const snapshot2 = await get(user2ChatRef);

            return snapshot1.exists() || snapshot2.exists();
        },

        async getDisplayName(uid: string): Promise<string> {
            const db = getDatabase();
            const userRef = ref(db, `users/${uid}`);
            const snapshot = await get(userRef);

            if (snapshot.exists()) {
                const userData = snapshot.val();
                return userData.displayName || 'Unknown User';
            } else {
                return 'Unknown User';
            }
        },

        async retrieveAuthUsers() {
            const db = getDatabase();
            const usersRef = ref(db, 'users');


            try {
                const snapshot = await get(usersRef);
                console.log('snapshot', snapshot.val());
                onValue(usersRef, (snapshot) => {
                    if (snapshot.exists()) {
                        this.users = Object.values(snapshot.val());
                    } else {
                        console.log('No users found in the database.');
                    }
                });
            } catch (error) {
                console.error('Error fetching users from Firebase:', error);
            }


        },

        clearPeers() {
            console.log('here');

            this.peers = []
        },

        storeSelectedPeer(peer) {
            this.selectedPeer = peer
        },
    },

    getters: {
        fetchSelectedPeer: (state) => state.selectedPeer,
        fetchAllPeers: (state) => state.peers,
        fetchAllUsers: (state) => state.users,
    }

});