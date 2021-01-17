<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        sm="4"
        md="3"
        lg="2"
        v-for="(image, index) in imageList"
        :key="nameList[index]"
      >
        <img :src="image.thumbnail" class="image" @click="openInfo(index)" />
      </v-col>
    </v-row>
    <image-info v-model="drawer" :name="name" type="header" :urls="urls" />
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ImageInfo from '@/components/Image/ImageInfo.vue';
import { fetchHeaderImages, getHeaderImageUrl } from '@/plugins/firebase';

@Component({
  components: {
    ImageInfo,
  },
})
export default class NormalImageList extends Vue {
  imageList: {
    png: string;
    webp: string;
    thumbnail: string;
    thumbnailWebp: string;
  }[] = [];
  nameList: string[] = [];
  name = '';
  urls: { name: string; url: string }[] = [];
  drawer = false;

  created() {
    fetchHeaderImages().then(images => {
      this.nameList = images;
      this.imageList = images.map(image => {
        return {
          png: getHeaderImageUrl(image, 'image.png'),
          webp: getHeaderImageUrl(image, 'image.webp'),
          thumbnail: getHeaderImageUrl(image, 'thumbnail.png'),
          thumbnailWebp: getHeaderImageUrl(image, 'thumbnail.webp'),
        };
      });
    });
  }

  openInfo(index: number) {
    this.name = this.nameList[index];
    this.urls = [
      {
        name: 'name',
        url: this.nameList[index],
      },
      {
        name: 'png',
        url: this.imageList[index].png,
      },
      {
        name: 'webp',
        url: this.imageList[index].webp,
      },
      {
        name: 'thumbnail',
        url: this.imageList[index].thumbnail,
      },
      {
        name: 'thumbnailWebp',
        url: this.imageList[index].thumbnailWebp,
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
