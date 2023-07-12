<template>
  <div class="content">
    <div class="col-8 mx-auto d-flex">
      <div class="input-group col">
        <input
            id="calendar"
            :value="chosenDate"
            type="date"
            class="form-control"
            @input="onInputChosenDate"
        >
      </div>
      <div class="col">
        <div class="text-end">
          Суточная норма калорий: {{ normOfCalories }} кКал
        </div>
        <div class="text-end">
          Употреблено за день: {{ totalCalories.toFixed(2) }} кКал
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
import {useRecordsStore, useProductsStore} from "../store/index.ts";
import {mapState} from "pinia";
import MealComponent from "./Meal.vue";

export default {
  name: "MainPage",
  components: {MealComponent},
  data() {
    return {
      recordsStore: useRecordsStore(),
      productsStore: useProductsStore()
    }
  },
  computed: {
    ...mapState(useRecordsStore, {
      normOfCalories: store => store.getNormOfCalories,
    }),
    chosenDate() {
      return this.recordsStore.chosenDate;
    },
    totalCalories() {
      let sum = 0;
      useRecordsStore().recordByDate(this.chosenDate).totalCalories.forEach(item => sum += item);
      return sum;
    }
  },
  methods: {
    onInputChosenDate(e) {
      this.recordsStore.setChosenDate(e.target.value);
    }
  }
}
</script>

<style scoped>
i {
  font-size: 1rem;
}
</style>
