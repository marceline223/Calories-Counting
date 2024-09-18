<template>
  <div class="content">
    <div class="d-flex justify-content-between align-items-center">
      <h4>
        Справочник
        <button
            type="button"
            class="btn"
            data-bs-toggle="modal"
            data-bs-target="#addProductModal"
        >
          <i class="bi bi-plus-circle medium-icon"/>
        </button>
      </h4>
      <add-product/>
      <div class="input-group align-content-center small-input-group">
        <input
            v-model="stringForSearch"
            type="text"
            placeholder="Поиск"
            class="form-control"
        >
      </div>
    </div>
    <product-list-table
        :is-choosing-product-needed="false"
        :string-for-search="stringForSearch"
    />
  </div>
</template>

<script>
import AddProduct from "../components/AddProduct.vue";
import ProductListTable from "../components/ProductListTable.vue";

export default {
  name: "ProductListPage",
  components: {ProductListTable, AddProduct},
  data() {
    return {
      stringForSearch: null
    }
  }
}
</script>

<style scoped>
.medium-icon {
  font-size: 1.5em;
}
</style>
