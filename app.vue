<template lang="pug">
div
  NuxtLayout(:user='user')
    NuxtPage(:user='user')
</template>

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDoc, doc } from 'firebase/firestore';
import { app, db } from '~/scripts/firebase';
import { User } from '~/models/user';
const auth = getAuth(app);

export default {
  name: 'App',
  data() {
    return {
      user: {},
    };
  },
  created() {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const snapshot = await getDoc(doc(db, 'users', user.uid));
        if (snapshot.exists()) {
          this.user = new User({
            uid: user.uid,
            ...snapshot.data(),
          });
        } else {
          this.user = {};
        }
      }
    });
  },
};
</script>
