<template lang="pug">
    form
      input(v-model='email', placeholder='email')
      input(type='password', v-model='password', placeholder='password')
      button(type='button', @click='signin') Signin
      p {{ error }}
    </template>

<script>
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default {
  name: 'AtomsSignin',
  data() {
    return {
      email: '',
      password: '',
      error: '',
    };
  },
  methods: {
    async signin() {
      const auth = getAuth();
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);
      } catch (error) {
        this.error = error;
        console.error(error);
      }
    },
  },
};
</script>
