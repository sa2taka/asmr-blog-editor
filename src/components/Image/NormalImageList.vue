<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        sm="4"
        md="3"
        lg="2"
        v-for="(image, index) in pngList"
        :key="nameList[index]"
      >
        <img :src="image" class="image" @click="openInfo(index)" />
      </v-col>
    </v-row>
    <image-info v-model="drawer" :name="name" type="normal" :urls="urls" />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { fetchNormalImages } from '@/plugins/firebase';
import ImageInfo from '@/components/Image/ImageInfo.vue';

@Component({
  components: {
    ImageInfo,
  },
})
export default class NormalImageList extends Vue {
  pngList: string[] = [];
  nameList: string[] = [];
  name = '';
  urls: { name: string; url: string }[] = [];
  drawer = false;

  created() {
    fetchNormalImages().then(images => {
      const regexp = /media%2Fimage%2F(?<file>.+)\.(png|webp)/;
      this.nameList = [
        ...new Set(
          images.map(image => {
            const match = image.match(regexp);
            if (match) {
              return match.groups!['file'];
            }
            return '';
          })
        ),
      ];
      this.pngList = images.filter(image => {
        return image.includes('png');
      });
    });
  }

  openInfo(index: number) {
    this.name = this.nameList[index];
    this.urls = [
      {
        name: 'png',
        url: this.pngList[index],
      },
    ];
    this.drawer = true;
  }
}
</script>

<style scoped>
.image {
  width: 100%;
}
</style>
