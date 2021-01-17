<template>
  <div class="container">
    <v-btn color="primary" @click="login()">Googleでログイン</v-btn>
  </div>
</template>

<script lang="ts">
import firebase from '@/plugins/firebase';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Login extends Vue {
  login() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        if (
          result &&
          result.credential &&
          result.user &&
          result.additionalUserInfo?.profile
        ) {
          firebase
            .firestore()
            .collection('users')
            .doc(result.user.uid)
            .set({
              id: result.user.uid,
            });
        }
        this.$router.push({ name: 'home' });
      });
  }
}
</script>

<style scoped></style>
