<template>
  <div class="container">
    <div class="d-flex justify-end">
      <v-btn color="primary" to="/actor/edit">追加</v-btn>
    </div>
    <h1 class="h1">声優一覧</h1>
    <v-row class="top-2">
      <v-col
        cols="12"
        sm="4"
        md="3"
        lg="2"
        v-for="actor in actors"
        :key="actor.slug"
      >
        <v-card link :to="`/actor/edit/${actor.slug}`">
          <v-card-subtitle class="text-left pb-2">{{
            actor.slug
          }}</v-card-subtitle>
          <v-card-title class="pt-2"
            >{{ actor.name }}({{ actor.count }})</v-card-title
          >
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { fetchActors } from '@/plugins/firebase';
import { Actor } from '@/types/entry';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ActorList extends Vue {
  actors: Actor[] = [];

  created() {
    fetchActors().then(result => {
      this.actors = result.docs.map(d => d.data());
    });
  }
}
</script>

<style scoped></style>
