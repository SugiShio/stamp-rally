<template>
  <div>
    <h1>全国の{{ collection.label }}</h1>
    <ul>
      <li v-for="prefecture in prefectures">
        <h2>{{ prefecture.label }}</h2>
        <ul>
          <li v-for="item in itemsGroupedByPrefecture[prefecture.id]">
            {{ item.name }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script>
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '~/scripts/firebase';
import { COLLECTIONS } from '~/constants/collections';
import { PREFECTURES } from '~/constants/prefectures';

export default {
  name: 'PagesIndex',
  data() {
    return {
      collection: COLLECTIONS[0],
      items: [],
      prefectures: PREFECTURES,
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
  async created() {
    const q = query(collection(db, this.collection.value));

    const snapShots = await getDocs(q);
    snapShots.forEach((snapShot) => {
      this.items.push(snapShot.data());
    });
  },
};
</script>
