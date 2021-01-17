<template>
  <v-app>
    <v-app-bar app>
      <v-btn text to="/login" v-if="!user">Login</v-btn>
      <v-btn text to="/circle" v-if="user">サークル</v-btn>
      <v-btn text to="/actor" v-if="user">声優</v-btn>
      <v-btn text to="/tag" v-if="user">タグ</v-btn>
      <v-btn text to="/image" v-if="user">画像</v-btn>
      <v-spacer />
      <v-btn color="secondary" v-if="user" @click="logout">logout</v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import firebase from '@/plugins/firebase';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class App extends Vue {
  user = firebase.auth().currentUser;
  created() {
    firebase.auth().onAuthStateChanged(user => {
      this.user = user;
    });
  }

  logout() {
    firebase.auth().signOut();
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN',
    'Hiragino Sans', 'BIZ UDPGothic', Meiryo, sans-serif;
  font-weight: 400;
  text-align: center;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
