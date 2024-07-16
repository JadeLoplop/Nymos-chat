import { defineStore } from 'pinia';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase, ref, set, get } from 'firebase/database';
import { StorageSerializers, useStorage } from '@vueuse/core';


export const usePeerStore = defineStore('peer', {
    state: () => ({
        selectedPeer: useStorage('selectedPeer', null),
        peers: []
    }),

    actions: {
        async retrieveAuthUsers() {
            const db = getDatabase();
            const usersRef = ref(db, 'users');


            try {
                const snapshot = await get(usersRef);
                console.log('snapshot', snapshot.val());
                if (snapshot.exists()) {
                    this.peers = Object.values(snapshot.val());
                } else {
                    console.log('No users found in the database.');
                }
            } catch (error) {
                console.error('Error fetching users from Firebase:', error);
            }
        },

        storeSelectedPeer(peer){
            this.selectedPeer = peer
        }

    },

    getters: {
        fetchSelectedPeer: (state) => state.selectedPeer,
        fetchAllPeers: (state) => state.peers,
    }

});