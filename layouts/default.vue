<template lang="pug">
div
  header
    template(v-if='isSignin')
      | {{ user.name }}
    atoms-signin(v-else)

  slot
</template>

<script>
import { getAuth } from 'firebase/auth';

import { app } from '~/scripts/firebase';
const auth = getAuth(app);

export default {
  name: 'LayoutsDefault',
  props: {
    user: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  computed: {
    isSignin() {
      return !!Object.keys(this.user).length;
    },
  },
};
</script>
