<template>
  <div class="container">
    <div class="d-flex justify-end">
      <v-btn color="primary" to="/circle/edit">追加</v-btn>
    </div>
    <h1 class="h1">サークル一覧</h1>
    <v-row class="top-2">
      <v-col
        cols="12"
        sm="4"
        md="3"
        lg="2"
        v-for="circle in circles"
        :key="circle.slug"
      >
        <v-card link :to="`/circle/edit/${circle.slug}`">
          <v-card-subtitle class="text-left pb-2">{{
            circle.slug
          }}</v-card-subtitle>
          <v-card-title class="pt-2"
            >{{ circle.name }}({{ circle.count }})</v-card-title
          >
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { fetchCircles } from '@/plugins/firebase';
import { Circle } from '@/types/entry';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class CircleList extends Vue {
  circles: Circle[] = [];

  created() {
    fetchCircles().then(result => {
      this.circles = result.docs.map(d => d.data());
    });
  }
}
</script>

<style scoped></style>
