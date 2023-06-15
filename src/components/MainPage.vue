<template>
  <b-card title="Завтрак">
    <b-card-text>
      <div v-for="product in mealsForDay.breakfast">
        <div>{{product.id}} - {{product.count}}</div>
      </div>
    </b-card-text>
    <button type="button" class="btn btn-primary">Primary</button>
  </b-card>

</template>

<script>
import {useRecordsStore} from "../store/index.ts";

export default {
  name: "MainPage",
  data() {
    return {
      chosenDate: '2023-06-13'
    }
  },
  computed: {
    mealsForDay() {
      return useRecordsStore().recordByDate(this.chosenDate);
    }
  }
}
</script>

<style scoped>

</style>
