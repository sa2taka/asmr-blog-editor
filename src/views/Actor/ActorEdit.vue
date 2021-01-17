<template>
  <div class="container">
    <h1 class="h1">声優編集</h1>
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

      <div class="mt-6">アカウント</div>

      <social-info-edit
        v-for="(SocialInfo, index) in socialInfoList"
        :key="SocialInfo.link"
        :info="SocialInfo"
        @input="value => changeInfo(value, index)"
        @delete="_ => deleteInfo(index)"
      />
      <v-btn icon class="mt-0" @click="addInfo"><v-icon>fa-plus</v-icon></v-btn>

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
  addActor,
  deleteActor,
  fetchActorBySlug,
  updateActor,
} from '@/plugins/firebase';
import { SocialInfo } from '@/types/entry';
import { Component, Vue } from 'vue-property-decorator';
import SocialInfoEdit from '@/components/common/SocialInfoEdit.vue';

@Component({
  components: {
    SocialInfoEdit,
  },
})
export default class TagList extends Vue {
  name = '';
  slug = '';
  id = '';
  socialInfoList: SocialInfo[] = [];
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
    fetchActorBySlug(slug).then(result => {
      const data = result.data();
      if (data) {
        this.id = result.id;
        this.name = data.name;
        this.slug = data.slug;
        this.socialInfoList = data.info;
        this.isEdit = true;
        this.canUpdateSlug = data.count === 0;
        this.count = data.count;
      }
    });
  }

  changeInfo(info: SocialInfo, index: number) {
    this.socialInfoList[index] = info;
  }

  deleteInfo(index: number) {
    this.socialInfoList.splice(index, 1);
  }

  addInfo() {
    this.socialInfoList.push({
      link: '',
      name: '',
      social: '',
    });
  }

  add() {
    if (!this.valid) {
      (this.$refs.form as HTMLFormElement).validate();
      return;
    }

    const back = () => this.$router.back();
    if (this.isEdit && this.id) {
      updateActor(this.id, {
        name: this.name,
        slug: this.slug,
        count: this.count,
        info: this.socialInfoList,
      }).then(back);
    } else {
      addActor({
        name: this.name,
        slug: this.slug,
        count: this.count,
        info: this.socialInfoList,
      }).then(back);
    }
  }

  remove() {
    if (window.confirm('削除しますがよろしいですか')) {
      deleteActor(this.id).then(() => this.$router.back());
    }
  }
}
</script>

<style scoped>
#form {
  width: 80%;
}
</style>
