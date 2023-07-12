<template>
    <header-component/>
    <router-view/>
</template>

<script>
  import HeaderComponent from "./components/HeaderComponent.vue";
  import {useProductsStore, useRecordsStore} from "./store/index.ts";
  export default {
    components: {HeaderComponent},
    data() {
      return {
        recordsStore: useRecordsStore(),
        productsStore: useProductsStore()
      }
    },
    beforeMount() {
      this.recordsStore.fetchRecords();
      this.recordsStore.fetchSettings();
      this.recordsStore.fetchChosenDate();
      this.recordsStore.fetchCurrentId();

      this.productsStore.fetchProducts();
    }
  }
</script>


