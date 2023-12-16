<template>
  <div>
    <h1>全国の{{ collection.label }}</h1>
    <ul>
      <li v-for="prefecture in prefectures">
        <h2>
          {{ prefecture.label }}({{
            itemsGroupedByPrefecture[prefecture.id].length
          }})
        </h2>
        <ul>
          <li v-for="item in itemsGroupedByPrefecture[prefecture.id]">
            {{ visitedIds.includes(item.id) }}
            {{ item.name }}
          </li>
        </ul>
      </li>
    </ul>
  </div>
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
      if (!user) return;
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
