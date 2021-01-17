<template>
  <v-row>
    <v-tooltip bottom v-model="tooltip">
      <template v-slot:activator="{}">
        <v-btn icon @click="copy()"><v-icon>fa-copy</v-icon></v-btn>
      </template>
      <span>Copy</span>
    </v-tooltip>
    <v-text-field
      :label="url.name"
      :value="url.url"
      class="mt-2"
    ></v-text-field>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component
export default class ImageUrl extends Vue {
  @Prop()
  url!: { name: string; url: string };

  tooltip = false;

  copy() {
    navigator.clipboard.writeText(this.url.url).then(() => {
      this.tooltip = true;
      setTimeout(() => {
        this.tooltip = false;
      }, 1500);
    });
  }
}
</script>

<style scoped>
.image {
  width: 100%;
}
</style>
