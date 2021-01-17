import firebase from '@/plugins/firebase';
import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/tag',
    name: 'tag',
    component: () =>
      import(/* webpackChunkName: "editor" */ '../views/Tag/TagList.vue'),
  },
  {
    path: '/tag/edit/',
    name: 'TagEdit',
    component: () =>
      import(/* webpackChunkName: "editor" */ '../views/Tag/TagEdit.vue'),
    meta: { isPublic: true },
  },
  {
    path: '/tag/edit/:slug',
    name: 'TagEditSlug',
    component: () =>
      import(/* webpackChunkName: "editor" */ '../views/Tag/TagEdit.vue'),
    meta: { isPublic: true },
  },
  {
    path: '/actor',
    name: 'actor',
    component: () =>
      import(/* webpackChunkName: "editor" */ '../views/Actor/ActorList.vue'),
  },
  {
    path: '/actor/edit/',
    name: 'actorEdit',
    component: () =>
      import(/* webpackChunkName: "editor" */ '../views/Actor/ActorEdit.vue'),
    meta: { isPublic: true },
  },
  {
    path: '/actor/edit/:slug',
    name: 'actorEditSlug',
    component: () =>
      import(/* webpackChunkName: "editor" */ '../views/Actor/ActorEdit.vue'),
    meta: { isPublic: true },
  },
  {
    path: '/circle',
    name: 'circle',
    component: () =>
      import(/* webpackChunkName: "editor" */ '../views/Circle/CircleList.vue'),
  },
  {
    path: '/circle/edit/',
    name: 'circleEdit',
    component: () =>
      import(/* webpackChunkName: "editor" */ '../views/Circle/CircleEdit.vue'),
    meta: { isPublic: true },
  },
  {
    path: '/circle/edit/:slug',
    name: 'circleEditSlug',
    component: () =>
      import(/* webpackChunkName: "editor" */ '../views/Circle/CircleEdit.vue'),
    meta: { isPublic: true },
  },
  {
    path: '/image/',
    name: 'image',
    component: () =>
      import(/* webpackChunkName: "editor" */ '../views/Image/ImageList.vue'),
    meta: { isPublic: true },
  },
  {
    path: '/image/edit/',
    name: 'imageEdit',
    component: () =>
      import(/* webpackChunkName: "editor" */ '../views/Image/ImageEdit.vue'),
    meta: { isPublic: true },
  },
  {
    path: '/image/edit/:name',
    name: 'imageEditName',
    component: () =>
      import(/* webpackChunkName: "editor" */ '../views/Image/ImageEdit.vue'),
    meta: { isPublic: true },
  },
  {
    path: '/product/',
    name: 'product',
    component: () =>
      import(
        /* webpackChunkName: "editor" */ '../views/Product/ProductList.vue'
      ),
    meta: { isPublic: true },
  },
  {
    path: '/product/edit/',
    name: 'productEdit',
    component: () =>
      import(
        /* webpackChunkName: "editor" */ '../views/Product/ProductEdit.vue'
      ),
    meta: { isPublic: true },
  },
  {
    path: '/product/edit/:name',
    name: 'productEditName',
    component: () =>
      import(
        /* webpackChunkName: "editor" */ '../views/Product/ProductEdit.vue'
      ),
    meta: { isPublic: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () =>
      import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: { isPublic: true },
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, _, next) => {
  const isPublic = to.matched.some(record => record.meta.isPublic);
  const current = firebase.auth().currentUser;
  if (current) {
    return next();
  }
  firebase.auth().onAuthStateChanged(user => {
    if (!user && !isPublic) {
      return next({
        path: '/login',
        query: { redirect: to.fullPath },
      });
    }
    return next();
  });
});

export default router;
