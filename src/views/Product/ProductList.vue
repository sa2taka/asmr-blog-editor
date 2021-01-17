<template>
  <div class="container">
    <div class="d-flex justify-end">
      <v-btn color="primary" to="/tag/edit">追加</v-btn>
    </div>
    <h1 class="h1">作品一覧</h1>
    <v-row class="top-2">
      <v-col
        cols="12"
        sm="4"
        md="3"
        lg="2"
        v-for="product in products"
        :key="product.slug"
      >
        <v-card link :to="`/product/edit/${product.slug}`">
          <v-card-subtitle class="text-left pb-2">{{
            product.slug
          }}</v-card-subtitle>
          <v-card-title class="pt-2"
            >{{ product.name }}({{ product.count }})</v-card-title
          >
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { fetchProducts } from '@/plugins/firebase';
import { Product } from '@/types/entry';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class ProductList extends Vue {
  products: Product[] = [];

  created() {
    fetchProducts().then(result => {
      this.products = result.docs.map(d => d.data());
    });
  }
}
</script>

<style scoped></style>
