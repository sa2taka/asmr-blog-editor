<template>
  <v-autocomplete
    v-model="selected"
    :items="formatedItems"
    outlined
    dense
    chips
    deletable-chips
    :multiple="multiple"
    :label="label"
  ></v-autocomplete>
</template>

<script lang="ts">
import { SocialInfo } from '@/types/entry';
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class SocialInfoEdit extends Vue {
  @Prop({ required: true })
  items!: { name: string; slug: string }[];
  @Prop({ required: true })
  value!: { name: string; slug: string }[];
  @Prop({ default: false })
  multiple!: boolean;
  @Prop()
  label!: string;

  @Emit()
  change(value: { name: string; slug: string }[]) {
    return value;
  }

  get formatedItems() {
    return this.items.map(item => {
      return {
        text: item.name,
        value: item.slug,
      };
    });
  }

  get selected() {
    return this.value;
  }

  set selected(value: { name: string; slug: string }[]) {
    this.change(value);
  }
}
</script>

<style scoped></style>
