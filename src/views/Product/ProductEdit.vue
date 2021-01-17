<template>
  <div class="container">
    <h1 class="h1">作品編集</h1>
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

      <v-row>
        <v-col cols="11">
          <entity-selector
            :items="tags"
            v-model="selectedTags"
            label="タグ"
            multiple
          />
        </v-col>
        <v-col cols="1">
          <v-btn icon class="mt-0" @click="addInfo"
            ><v-icon>fa-plus</v-icon></v-btn
          >
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="11">
          <entity-selector
            :items="actors"
            v-model="selectedActors"
            label="声優"
            multiple
          />
        </v-col>
        <v-col cols="1">
          <v-btn icon class="mt-0" @click="addInfo"
            ><v-icon>fa-plus</v-icon></v-btn
          >
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="11">
          <entity-selector
            :items="circles"
            v-model="selectedCircle"
            label="サークル"
          />
        </v-col>
        <v-col cols="1">
          <v-btn icon class="mt-0" @click="addInfo"
            ><v-icon>fa-plus</v-icon></v-btn
          >
        </v-col>
      </v-row>

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
  fetchActors,
  fetchCircles,
  fetchTagBySlug,
  fetchTags,
  updateTag,
} from '@/plugins/firebase';
import { Component, Vue } from 'vue-property-decorator';
import { Actor, Circle, Tag } from '@/types/entry';
import EntitySelector from '@/components/common/EntitySelector.vue';

@Component({
  components: {
    EntitySelector,
  },
})
export default class ProductEdit extends Vue {
  name = '';
  slug = '';
  id = '';
  count = 0;
  tags: Tag[] = [];
  actors: Actor[] = [];
  circles: Circle[] = [];
  selectedTags: Tag[] = [];
  selectedActors: Actor[] = [];
  selectedCircle: Circle[] = [];

  isEdit = false;
  valid = false;
  canUpdateSlug = true;
  requiredRules: ((v: string) => boolean | string)[] = [v => !!v || 'Required'];

  created() {
    this.initList();

    const slug = this.$route.params.slug;
    if (!slug || slug === '') {
      return;
    }
  }

  initList() {
    return Promise.all([
      fetchTags().then(result => {
        this.tags = result.docs.map(doc => doc.data());
      }),
      fetchCircles().then(result => {
        this.circles = result.docs.map(doc => doc.data());
      }),
      fetchActors().then(result => {
        this.actors = result.docs.map(doc => doc.data());
      }),
    ]);
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
