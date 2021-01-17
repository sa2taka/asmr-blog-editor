<template>
  <div class="container">
    <div class="d-flex justify-end">
      <v-btn color="primary" to="/tag/edit">追加</v-btn>
    </div>
    <h1 class="h1">タグ一覧</h1>
    <v-row class="top-2">
      <v-col cols="12" sm="4" md="3" lg="2" v-for="tag in tags" :key="tag.slug">
        <v-card link :to="`/tag/edit/${tag.slug}`">
          <v-card-subtitle class="text-left pb-2">{{
            tag.slug
          }}</v-card-subtitle>
          <v-card-title class="pt-2"
            >{{ tag.name }}({{ tag.count }})</v-card-title
          >
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { fetchTags } from '@/plugins/firebase';
import { Tag } from '@/types/entry';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class TagList extends Vue {
  tags: Tag[] = [];

  created() {
    fetchTags().then(result => {
      this.tags = result.docs.map(d => d.data());
    });
  }
}
</script>

<style scoped></style>
