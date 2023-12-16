<template lang="pug">
.l-default
  header
    template(v-if='isSignin')
      | {{ user.name }}
    atoms-signin(v-else)

  .l-default__main
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

<style lang="scss" scoped>
.l-default {
  &__main {
    max-width: 800px;
    padding: 20px;
    margin: 0 auto;
  }
}
</style>
