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
          @click='openForm(item)'
        )
          | {{ item.name }}
  .p-index__form(v-if='isFormShow')
    button(@click='isFormShow = false' type='button') 閉じる
    div
      |{{items.find(item => item.id === visitRecord.collectionId).name}}
    div
      label
        | 訪問した日:
        input.p-index__input(v-model='visitRecord.visitedAtText')
    div
      label
        | メモ
        textarea.p-index__textarea(v-model='visitRecord.description')
    button(type='button' @click='onSaveClicked') 送信
</template>

<script>
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '~/scripts/firebase';
import { COLLECTIONS } from '~/constants/collections';
import { PREFECTURES } from '~/constants/prefectures';
import { User } from '~/models/user';
import { VisitRecord } from '~/models/visitRecord';

export default {
  name: 'PagesIndex',
  props: {
    user: { type: User, default: null },
  },
  data() {
    return {
      collection: COLLECTIONS[0],
      isFormShow: false,
      items: [],
      prefectures: PREFECTURES,
      visitedIds: [],
      visitRecord: new VisitRecord(),
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
    async onSaveClicked() {
      try {
        await addDoc(collection(db, 'visitRecords'), {
          uid: this.user.uid,
          ...this.visitRecord,
        });
        this.isFormShow = false;
      } catch (e) {
        console.error(e);
      }
    },

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
    openForm(item) {
      this.isFormShow = true;
      this.visitRecord = new VisitRecord({
        uid: this.user.uid,
        collection: this.collection.value,
        collectionId: item.id,
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

  &__form {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;
    width: 80vw;
    height: 80vw;
    border-radius: 5px;
    background-color: #fff;
    color: #000;
    padding: 20px;
  }

  &__input,
  &__textarea {
    border: 1px solid;
    border-radius: 5px;
    padding: 5px 10px;
  }
}
</style>
