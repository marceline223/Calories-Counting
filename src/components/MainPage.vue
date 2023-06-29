<template>
  <div class="content">
    <div class="col-7 mx-auto d-flex">
      <div class="input-group col">
        <input
            v-model="chosenDate"
            type="date"
            class="form-control"
        >
      </div>
      <div class="col">
        <div class="text-end">
          Суточная норма калорий: {{ normOfCalories }} кКал
        </div>
        <div class="text-end">
          Употреблено за день: {{ totalCalories }} кКал
        </div>
      </div>
    </div>

    <!--ЗАВТРАК-->
    <meal-component
        :chosen-date="chosenDate"
        meal-type="breakfast"
    />

    <!--ОБЕД-->
    <meal-component
        :chosen-date="chosenDate"
        meal-type="lunch"
    />

    <!--УЖИН-->
    <meal-component
        :chosen-date="chosenDate"
        meal-type="dinner"
    />
  </div>
</template>

<script>
import {useRecordsStore} from "../store/index.ts";
import {useProductsStore} from "../store/index.ts";
import {mapState} from "pinia";
import MealComponent from "./Meal.vue";

export default {
  name: "MainPage",
  components: {MealComponent},
  data() {
    return {
      recordsStore: useRecordsStore(),
      productsStore: useProductsStore(),
      chosenDate: '2023-06-13'
    }
  },
  computed: {
    ...mapState(useRecordsStore, {
      normOfCalories: (store) => store.getNormOfCalories,
    }),
    totalCalories() {
      let sum = 0;
      useRecordsStore().recordByDate(this.chosenDate).totalCalories.forEach(item => sum += item);
      return sum;
    }
  },
  beforeMount() {
    useProductsStore().fetchProducts();
    useRecordsStore().fetchSettings();
    useRecordsStore().fetchRecords();
  }
}
</script>

<style scoped>
i {
  font-size: 1rem;
}
</style>
