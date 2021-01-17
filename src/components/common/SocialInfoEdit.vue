<template>
  <v-row justify="center" align="center">
    <v-col cols="12" md="3">
      <v-text-field
        v-model="name"
        label="name"
        required
        :rules="requiredRules"
      ></v-text-field>
    </v-col>
    <v-col cols="12" md="3">
      <v-text-field
        v-model="social"
        label="social"
        required
        :rules="requiredRules"
      ></v-text-field>
    </v-col>
    <v-col cols="12" md="3">
      <v-text-field
        v-model="link"
        label="link"
        required
        :rules="requiredRules"
        class=""
      ></v-text-field>
    </v-col>
    <v-col cols="1" md="1">
      <v-btn icon @click="deleteInfo()"><v-icon>fa-minus</v-icon></v-btn>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { SocialInfo } from '@/types/entry';
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class SocialInfoEdit extends Vue {
  @Prop({ required: true })
  info!: SocialInfo;
  link = '';
  name = '';
  social = '';
  requiredRules: ((v: string) => boolean | string)[] = [v => !!v || 'Required'];

  created() {
    this.link = this.info.link;
    this.name = this.info.name;
    this.social = this.info.social;
  }

  @Emit()
  input() {
    return {
      link: this.link,
      name: this.name,
      social: this.social,
    } as SocialInfo;
  }

  @Emit()
  delete() {
    return {
      link: this.link,
      name: this.name,
      social: this.social,
    } as SocialInfo;
  }

  deleteInfo() {
    this.delete();
  }

  @Watch('link')
  onCHangeLink() {
    this.input();
  }

  @Watch('name')
  onCHangeName() {
    this.input();
  }

  @Watch('social')
  onCHangeSocial() {
    this.input();
  }
}
</script>

<style scoped></style>
