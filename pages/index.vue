<template lang="pug">
.p-index
  h1.p-index__title
    | 全国の{{ collection.label }}
  ul
    li.p-index__block(v-for="prefecture in prefectures")
      h2.p-index__title-second
        | {{ prefecture.label }}({{ itemsGroupedByPrefecture[prefecture.id].length }})
      ul.p-index__collection
        li.p-index__collection-item(
          v-for="item in itemsGroupedByPrefecture[prefecture.id]",
          :class="{ isVisited: visitedIds.includes(item.id) }"
        )
          | {{ item.name }}
</template>

<script>
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '~/scripts/firebase';
import { COLLECTIONS } from '~/constants/collections';
import { PREFECTURES } from '~/constants/prefectures';
import { User } from '~/models/user';

export default {
  name: 'PagesIndex',
  props: {
    user: { type: User, default: null },
  },
  data() {
    return {
      collection: COLLECTIONS[0],
      items: [],
      prefectures: PREFECTURES,
      visitedIds: [],
    };
  },
  computed: {
    itemsGroupedByPrefecture() {
      const itemsGroupedByPrefecture = {};
      PREFECTURES.forEach(
        (prefecture) => (itemsGroupedByPrefecture[prefecture.id] = [])
      );
      this.items.forEach((item) =>
        itemsGroupedByPrefecture[item.prefecture].push(item)
      );
      return itemsGroupedByPrefecture;
    },
  },
  watch: {
    user(user) {
      if (!user || !user.uid) return;
      this.fetchVisitRecords();
    },
  },
  async created() {
    const q = query(collection(db, this.collection.value));

    const snapShots = await getDocs(q);
    snapShots.forEach((snapShot) => {
      this.items.push({ id: snapShot.id, ...snapShot.data() });
    });

    if (!this.user || !this.user.uid) return;
    this.fetchVisitRecords();
  },
  methods: {
    async fetchVisitRecords() {
      const q = query(
        collection(db, 'visitRecords'),
        where('uid', '==', this.user.uid),
        where('collection', '==', this.collection.value)
      );
      const snapShots = await getDocs(q);
      snapShots.forEach(async (snapShot) => {
        const visitRecord = snapShot.data();
        this.visitedIds.push(visitRecord.collectionId);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.p-index {
  &__title {
    font-size: 20px;
    margin: 20px 0;
  }

  &__title-second {
    font-weight: bold;
    margin: 5px 0;
  }

  &__block {
    margin: 10px 0;
  }

  &__collection {
    padding-left: 20px;
  }

  &__collection-item {
    list-style: circle;
    &.isVisited {
      font-weight: bold;
    }
  }
}
</style>
