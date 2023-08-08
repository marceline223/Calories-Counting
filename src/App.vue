<template>
  <div>
    <header-component/>
    <router-view/>
  </div>
</template>

<script>
  import HeaderComponent from "./components/HeaderComponent.vue";
  import {useProductsStore, useRecordsStore} from "./store/index.ts";
  import {mapActions} from "pinia";

  export default {
    components: {HeaderComponent},
    data() {
      return {
        recordsStore: useRecordsStore(),
        productsStore: useProductsStore()
      }
    },
    beforeMount() {
      this.fetchRecordsStore();
      this.fetchProductsStore();
    },
    methods: {
      ...mapActions(useRecordsStore, ['fetchRecordsStore']),
      ...mapActions(useProductsStore, ['fetchProductsStore'])
    }
  }
</script>


