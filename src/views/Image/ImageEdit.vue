<template>
  <div class="container">
    <h1 class="h1">サークル編集</h1>
    <v-form v-model="valid" ref="form" id="form" class="mx-auto">
      <v-col cols="12" sm="4">
        <v-select v-model="category" :items="items" label="種類"></v-select>
      </v-col>

      <v-col cols="12" sm="4">
        <v-text-field
          v-model="name"
          label="名前"
          :rules="requiredRules"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="4">
        <v-file-input
          v-model="file"
          truncate-length="15"
          accept="image/png, image/jpeg"
          :rules="requiredRules"
        ></v-file-input>
      </v-col>

      <v-col cols="12" sm="4">
        <v-img :src="normalImage" v-if="file"></v-img>
        <v-img :src="image" v-if="image"></v-img>
      </v-col>

      <div class="mt-2 d-flex justify-center">
        <v-btn color="red" @click="remove">削除</v-btn>
        <v-btn color="primary" class="ml-6" @click="add">アップロード</v-btn>
      </div>
    </v-form>
  </div>
</template>

<script lang="ts">
import {
  deleteImage,
  getHeaderImageUrl,
  getNormalImageUrl,
  updateNormalImage,
} from '@/plugins/firebase';
import { Component, Vue, Watch } from 'vue-property-decorator';
import { updateHeaderImage } from '../../plugins/firebase';
import { v4 as uuidv4 } from 'uuid';

@Component
export default class ImageEdit extends Vue {
  public file: File | null = null;
  public category = 'Normal';
  public name = '';
  public items = ['Normal', 'Header'];
  public thumbnailWidth = 320;
  public webpSrc: Blob | null = null;
  public thumbnail: Blob | null = null;
  public thumbnailWebp: Blob | null = null;
  public alreadyExists = false;
  public valid = false;

  requiredRules: ((v: string) => boolean | string)[] = [v => !!v || 'Required'];

  created() {
    const name = this.$route.params.name;
    const category = this.$route.query.type;
    if (!name || name === '') {
      return;
    }
    this.name = name;
    if (category === 'header') {
      this.category = 'Header';
    } else {
      this.category = 'Normal';
    }
    this.alreadyExists = true;
  }

  add() {
    if (this.file) {
      if (this.category === 'Header') {
        // .png以外が来ることもあるんじゃないの...
        Promise.all([
          updateHeaderImage(this.name, 'image.png', this.file!),
          updateHeaderImage(this.name, 'image.webp', this.webpSrc!),
          updateHeaderImage(this.name, 'thumbnail.png', this.thumbnail!),
          updateHeaderImage(this.name, 'thumbnail.webp', this.thumbnailWebp!),
        ]).then(() => {
          this.$router.back();
        });
      } else {
        let name = this.name;
        if (!this.alreadyExists) {
          name += `-${uuidv4()}`;
        }
        Promise.all([
          updateNormalImage(`${name}.png`, this.file!),
          updateNormalImage(`${name}.webp`, this.webpSrc!),
        ]).then(() => {
          this.$router.back();
        });
      }
    }
  }

  remove() {
    if (!this.alreadyExists) {
      this.$router.back();
    }

    if (window.confirm('削除しますがよろしいですか')) {
      if (this.category === 'Header') {
        deleteImage(this.name, 'header').then(() => this.$router.back());
      } else {
        Promise.all([
          deleteImage(`${this.name}.png`, 'normal'),
          deleteImage(`${this.name}.webp`, 'normal'),
        ]).then(() => this.$router.back());
      }
    }
  }

  get image() {
    if (!this.alreadyExists) {
      return null;
    }

    if (this.category === 'Header') {
      return getHeaderImageUrl(this.name, 'image.png');
    } else {
      return getNormalImageUrl(this.name + '.png');
    }
  }

  get normalImage() {
    if (this.file) {
      return window.URL.createObjectURL(this.file);
    }
    return null;
  }

  get webpImage() {
    if (this.webpSrc) {
      return window.URL.createObjectURL(this.webpSrc);
    }
    return null;
  }

  @Watch('file')
  onChangeFile() {
    this.genWebp();
    this.genThumbnail();
    this.genThumbnailWebp();
  }

  genWebp() {
    if (this.file) {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        const scale = 1.0;
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        const quality = 0.9;
        const dataUri = canvas.toDataURL('image/webp', quality);

        const byteString = atob(dataUri.split(',')[1]);
        const result = dataUri.match(/(:)([a-z/]+)(;)/);
        if (result) {
          const mimeType = result[2];
          const l = byteString.length;
          const content = new Uint8Array(l);
          for (let i = 0; l > i; i++) {
            content[i] = byteString.charCodeAt(i);
          }
          this.webpSrc = new Blob([content], {
            type: mimeType,
          });
        }
      };
      image.src = window.URL.createObjectURL(this.file);
    }
    this.webpSrc = null;
  }

  genThumbnail() {
    if (this.file) {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        const scale = this.thumbnailWidth / image.width;
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        const quality = 0.9;
        const dataUri = canvas.toDataURL(this.file?.type, quality);

        const byteString = atob(dataUri.split(',')[1]);
        const result = dataUri.match(/(:)([a-z/]+)(;)/);
        if (result) {
          const mimeType = result[2];
          const l = byteString.length;
          const content = new Uint8Array(l);
          for (let i = 0; l > i; i++) {
            content[i] = byteString.charCodeAt(i);
          }
          this.thumbnail = new Blob([content], {
            type: mimeType,
          });
        }
      };
      image.src = window.URL.createObjectURL(this.file);
    }
    this.thumbnail = null;
  }

  genThumbnailWebp() {
    if (this.file) {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

        const scale = this.thumbnailWidth / image.width;
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        const quality = 0.9;
        const dataUri = canvas.toDataURL('image/webp', quality);

        const byteString = atob(dataUri.split(',')[1]);
        const result = dataUri.match(/(:)([a-z/]+)(;)/);
        if (result) {
          const mimeType = result[2];
          const l = byteString.length;
          const content = new Uint8Array(l);
          for (let i = 0; l > i; i++) {
            content[i] = byteString.charCodeAt(i);
          }
          this.thumbnailWebp = new Blob([content], {
            type: mimeType,
          });
        }
      };
      image.src = window.URL.createObjectURL(this.file);
    }
    this.thumbnailWebp = null;
  }
}
</script>

<style scoped>
#form {
  width: 80%;
}
</style>
