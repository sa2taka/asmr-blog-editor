<template>
  <v-navigation-drawer fixed right :value="value" @input="input">
    <v-btn
      block
      colol="primary"
      class="mt-8 mb- 4"
      :to="`/image/edit/${name}?type=${type}`"
    >
      編集
    </v-btn>
    <v-divider />
    <image-url
      v-for="url in urls"
      :url="url"
      :key="url.name"
      class="mx-2 mt-4 align-center"
    />
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import ImageUrl from '@/components/Image/ImageUrl.vue';

@Component({
  components: {
    ImageUrl,
  },
})
export default class ImageInfo extends Vue {
  @Prop()
  name!: string;
  @Prop()
  type!: string;
  @Prop()
  value!: boolean;
  @Prop()
  urls!: { name: string; url: string }[];

  @Emit()
  input(value: boolean) {
    return value;
  }
}
</script>

<style scoped>
.image {
  width: 100%;
}
</style>
