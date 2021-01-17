<template>
  <div class="container">
    <div class="d-flex justify-end">
      <v-btn color="primary" to="/image/edit">追加</v-btn>
    </div>
    <h1 class="h1">画像一覧</h1>

    <v-tabs v-model="tab" align-with-title>
      <v-tab>Normal</v-tab>
      <v-tab>Header</v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab" class="pa-2">
      <v-tab-item>
        <normal-image-list />
      </v-tab-item>
      <v-tab-item>
        <header-image-list />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import NormalImageList from '@/components/Image/NormalImageList.vue';
import HeaderImageList from '@/components/Image/HeaderImageList.vue';

@Component({
  components: {
    NormalImageList,
    HeaderImageList,
  },
})
export default class ImageList extends Vue {
  tab = '';
}
</script>

<style scoped></style>
