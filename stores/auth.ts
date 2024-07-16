// stores/auth.ts
import { defineStore } from 'pinia';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { getDatabase, ref, set, get } from 'firebase/database';
import { StorageSerializers, useStorage } from '@vueuse/core';
import { usePeerStore } from './peer';

interface User {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: useStorage<User | null>('user', null, undefined, { serializer: StorageSerializers.object }),
  }),
  actions: {
    async signInWithGoogle() {
      const auth = getAuth();
      console.log('auth', auth);
      
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log('user', user);
        
        this.user = {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        };

        await this.addUserToDatabaseIfNotExists(this.user);
      } catch (error) {
        console.error('Google sign-in error:', error.message);
      }
    },
    async signOut() {
      const auth = getAuth();
      
      try {
        await signOut(auth);
        this.user = null;
        // this.reset()
        // this.resetStores()
        
      } catch (error) {
        console.error('Sign out error:', error.message);
      }
      
    },
    observeAuthState() {
      const auth = getAuth();
      onAuthStateChanged(auth, (authUser) => {
        if (authUser) {
          this.user = {
            uid: authUser.uid,
            displayName: authUser.displayName,
            email: authUser.email,
            photoURL: authUser.photoURL,
          };
        } else {
          this.user = null;
        }
      });
    },
    async addUserToDatabaseIfNotExists(user) {
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);
      try {
        const snapshot = await get(userRef);
        if (!snapshot.exists()) {
          await set(userRef, user);
          console.log(`User ${user.displayName} added to database.`);
        } else {
          console.log(`User ${user.displayName} already exists in the database.`);
        }
      } catch (error) {
        console.error('Error adding user to Firebase:', error);
      }
    },
  
    async generateAndSaveDummyUsers() {
      const dummyUsers: User[] = [];

      for (let i = 1; i <= 10; i++) {
        dummyUsers.push({
          uid: `user${i}`,
          displayName: `Dummy User ${i}`,
          email: `dummy${i}@example.com`,
          photoURL: `https://example.com/photo${i}.jpg`,
        });
      }

      const db = getDatabase();
      try {
        for (const user of dummyUsers) {
          const userRef = ref(db, `users/${user.uid}`);
          await set(userRef, user);
          console.log(`Saved user ${user.displayName}`);
        }
      } catch (error) {
        console.error('Error saving users to Firebase:', error);
      }
    },
    // reset() {
    //   this.$reset();
    // },
    // resetStores() {
    //   const peerStore = usePeerStore();
    //   peerStore.reset();
    //   // Add other stores here if needed
    // }
  },
  getters: {
    fetchSavedUser: (state) => state.user,
  },
});
