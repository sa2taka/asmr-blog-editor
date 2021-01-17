<template>
  <div class="container">
    <h1 class="h1">タグ編集</h1>
    <v-form v-model="valid" ref="form" id="form" class="mx-auto">
      <v-text-field
        v-model="name"
        label="name"
        required
        :rules="requiredRules"
        class=""
      ></v-text-field>

      <v-text-field
        v-model="slug"
        label="slug"
        :disabled="!canUpdateSlug"
        required
        :rules="requiredRules"
      ></v-text-field>

      <div class="mt-2 d-flex justify-center">
        <v-btn color="red" @click="remove" :disabled="!canUpdateSlug"
          >削除</v-btn
        >
        <v-btn color="primary" class="ml-6" @click="add">{{
          isEdit ? '更新' : '追加'
        }}</v-btn>
      </div>
    </v-form>
  </div>
</template>

<script lang="ts">
import {
  addTag,
  deleteTag,
  fetchTagBySlug,
  updateTag,
} from '@/plugins/firebase';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class TagEdit extends Vue {
  name = '';
  slug = '';
  id = '';
  count = 0;
  isEdit = false;
  valid = false;
  canUpdateSlug = true;
  requiredRules: ((v: string) => boolean | string)[] = [v => !!v || 'Required'];

  created() {
    const slug = this.$route.params.slug;
    if (!slug || slug === '') {
      return;
    }
    fetchTagBySlug(slug).then(result => {
      const data = result.data();
      if (data) {
        this.id = result.id;
        this.name = data.name;
        this.slug = data.slug;
        this.isEdit = true;
        this.canUpdateSlug = data.count === 0;
        this.count = data.count;
      }
    });
  }

  add() {
    if (!this.valid) {
      (this.$refs.form as HTMLFormElement).validate();
      return;
    }

    const back = () => this.$router.back();
    if (this.isEdit && this.id) {
      updateTag(this.id, {
        name: this.name,
        slug: this.slug,
        count: this.count,
      }).then(back);
    } else {
      addTag({
        name: this.name,
        slug: this.slug,
        count: this.count,
      }).then(back);
    }
  }

  remove() {
    if (window.confirm('削除しますがよろしいですか')) {
      deleteTag(this.id).then(() => this.$router.back());
    }
  }
}
</script>

<style scoped>
#form {
  width: 80%;
}
</style>
