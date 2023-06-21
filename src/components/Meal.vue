<template>
  <div class="card col-7 mx-auto my-4">
    <div class="card-header d-flex align-items-center justify-content-between">
      <h5 class="my-auto">{{this.mealName}}</h5>
      <button type="button" class="btn p-1"><i class="bi bi-plus-circle"/></button>
    </div>

    <div class="card-body">
      <table class="table table-bordered">
        <tbody>
          <tr
              v-for="getMeal in mealsForDay"
              :key="meal.id"
          >
            <td>{{productsStore.getProductById(getMeal.productId).name}}</td>
            <td>{{productsStore.getProductById(getMeal.productId).proteins}}</td>
            <td>{{productsStore.getProductById(getMeal.productId).fats}}</td>
            <td>{{productsStore.getProductById(getMeal.productId).carbs}}</td>
            <td>{{productsStore.getProductById(getMeal.productId).calories}}</td>
            <td>{{getMeal.count}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {useProductsStore, useRecordsStore} from "../store/index.ts";

export default {
  name: "Meal",
  props: {
    mealType: {
      type: String,
      default: 'breakfast'
    },
    chosenDate: {
      type: String,
      default: '2023-06-13'
    }
  },
  beforeMount() {
    useProductsStore().fetchProducts();
  },
  data() {
    return {
      recordsStore: useRecordsStore(),
      productsStore: useProductsStore()
    }
  },
  computed: {
    mealName() {
      switch (this.mealType) {
        case 'breakfast':
          return 'Завтрак';
        case 'lunch':
          return 'Обед';
        case 'dinner':
          return 'Ужин';
      }
    },
    mealsForDay() {
      switch (this.mealType) {
        case 'breakfast':
          return this.recordsStore.recordByDate(this.chosenDate).breakfast;
        case 'lunch':
          return this.recordsStore.recordByDate(this.chosenDate).lunch;
        case 'dinner':
          return this.recordsStore.recordByDate(this.chosenDate).dinner;
      }
    },
    getProductsInfo() {
      let eatenProducts = [];
      for (const getMeal in this.mealsForDay) {
        eatenProducts.push(this.productsStore.getProductById(meal.productId))
      }
      return eatenProducts;
    }
  }
}
</script>

<style scoped>

</style>
