<template>
  <div class="content">
    <div
        v-if="!normOfCalories"
        id="mainPageAlert"
        class="alert alert-primary d-flex justify-content-between"
        role="alert"
    >
        Вы можете рассчитать свою норму калорий на странице настроек.
      <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          data-bs-target="#mainPageAlert"
          aria-label="Закрыть"
      />
    </div>
    <div class="col-8 mx-auto d-flex">
      <div class="input-group col">
        <input
            :value="chosenDateForCalendar"
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
import MealComponent from "./Meal.vue";
import moment from "moment";

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
      normOfCalories: store => store.settings.normOfCalories,
      chosenDate: store => store.chosenDate,
      recordByDate: "recordByDate"
    }),
    totalCalories() {
      return this.recordByDate(this.chosenDate).totalCalories.reduce((a, b) => a + b, 0);
    },
    chosenDateForCalendar() {
      return moment(this.chosenDate).format('YYYY-MM-DD');
    }
  },
  methods: {
    ...mapActions(useRecordsStore, {
      setChosenDate: "setChosenDate"
    }),
    onInputChosenDate(e) {
      this.setChosenDate(moment.utc(e.target.value));
    }
  }
}
</script>

<style scoped>
i {
  font-size: 1rem;
}
</style>
