<template>
  <div class="content">
    <alert-component
        v-if="!normOfCalories"
        id-alert="mainPageAlert"
    />

    <div class="col-8 mx-auto d-flex">
      <input-calendar
          :value="chosenDate"
          @input-date="onInputChosenDate($event)"
      />

      <div class="col">
        <div class="text-end">
          Суточная норма калорий: {{ normOfCalories }} кКал
        </div>
        <div class="text-end">
          Употреблено за день: {{ totalCalories.toFixed(2) }} кКал
        </div>
      </div>
    </div>

    <!-- завтрак -->
    <meal-component
        :chosen-date="chosenDate"
        meal-type="breakfast"
    />

    <!-- обед -->
    <meal-component
        :chosen-date="chosenDate"
        meal-type="lunch"
    />

    <!-- ужин -->
    <meal-component
        :chosen-date="chosenDate"
        meal-type="dinner"
    />
  </div>
</template>

<script>
import {useRecordsStore, useProductsStore} from "../store/index.ts";
import {mapActions, mapState} from "pinia";

import MealComponent from "../components/Meal.vue";
import AlertComponent from "../components/AlertComponent.vue";
import InputCalendar from "../components/InputCalendar.vue";

export default {
  name: "MainPage",
  components: {InputCalendar, MealComponent, AlertComponent},
  data() {
    return {
      recordsStore: useRecordsStore(),
      productsStore: useProductsStore()
    }
  },
  computed: {
    ...mapState(useRecordsStore, {
      normOfCalories: store => store.settings.normOfCalories,
      chosenDate: store => store.chosenDate,
      recordByDate: "recordByDate"
    }),
    totalCalories() {
      return this.recordByDate(this.chosenDate).totalCalories.reduce((a, b) => a + b, 0);
    }
  },
  methods: {
    ...mapActions(useRecordsStore, {
      setChosenDate: "setChosenDate"
    }),
    onInputChosenDate(e) {
      this.setChosenDate(e.date);
    }
  }
}
</script>
