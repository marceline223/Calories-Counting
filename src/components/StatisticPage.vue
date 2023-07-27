<template>
  <div class="content">
    <alert-component
        v-if="!normOfCalories"
        id-alert="statisticPageAlert"
    />

    <h4 class="heading-with-margin">
      Статистика
    </h4>

    <div class="row justify-content-around">
      <input-calendar
          prefix="с"
          :value="firstDate"
          :max-value="secondDate"
          @input-date="onInputChosenDateForStatistic('first', $event)"
      />
      <input-calendar
          prefix="по"
          :value="secondDate"
          :min-value="firstDate"
          @input-date="onInputChosenDateForStatistic('second', $event)"
      />
    </div>

    <h5 class="heading-with-margin">
      Калории
    </h5>
    <div class="chart-container medium-chart-container my-3">
      <Bar
          :data="caloriesBarData"
          :options="optionsCalories"
      />
    </div>

    <h5 class="heading-with-margin">
      Макроэлементы
    </h5>
    <div class="chart-container medium-chart-container my-3">
      <Bar
          :data="macronutrientsBarData"
          :options="optionsMacronutrients"
      />
    </div>
  </div>
</template>

<script>

import {Bar} from 'vue-chartjs';
import {Chart as Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import {useRecordsStore} from "../store/index.ts";
import {mapActions, mapState} from "pinia";
import moment from "moment";
import AlertComponent from "./AlertComponent.vue";
import InputCalendar from "./InputCalendar.vue";

Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, annotationPlugin);

export default {
  name: "StatisticPage",
  components: {InputCalendar, Bar, AlertComponent},
  data() {
    return {
      recordsStore: useRecordsStore(),
    }
  },
  computed: {
    ...mapState(useRecordsStore, {
      recordByDate: "recordByDate",
      normOfCalories: store => store.settings.normOfCalories,
      firstDate: store => store.chosenDatesForStatistic.first,
      secondDate: store => store.chosenDatesForStatistic.second
    }),
    optionsMacronutrients() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true
          }
        }
      }
    },
    optionsCalories() {
      return {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true
          }
        },
        plugins: {
          annotation: {
            annotations: {
              normOfCaloriesLine: {
                type: 'line',
                yMin: this.normOfCalories,
                yMax: this.normOfCalories,
                drawTime: 'afterDatasetsDraw',
                borderColor: 'green',
                borderWidth: 2,
                label: {
                  enabled: true,
                  content: 'Норма',
                  position: 'end',
                  drawTime: 'afterDatasetsDraw',
                  backgroundColor: 'rgba(238, 68, 226,0.4)'
                }
              }
            }
          }
        }
      }
    },
    chartLabels() {
      if (this.firstDate && this.secondDate) {
        const result = [];

        const first = new Date(this.firstDate);
        const second = new Date(this.secondDate);
        for (let i = first; i <= second; i.setDate(i.getDate() + 1)) {
          result.push(i.toLocaleDateString());
        }
        return result;
      }
      return [];
    },
    caloriesDataSet() {
      const datasets = [];
      if (this.firstDate && this.secondDate) {
        const tempData = {
          breakfast: [],
          lunch: [],
          dinner: []
        };
        const first = new Date(this.firstDate);
        const second = new Date(this.secondDate);

        for (let i = first; i <= second; i.setDate(i.getDate() + 1)) {
          const record = this.recordByDate(i);
          if (record) {
            tempData.breakfast.push(record.totalCalories[0]);
            tempData.lunch.push(record.totalCalories[1]);
            tempData.dinner.push(record.totalCalories[2]);
          } else {
            tempData.breakfast.push(0);
            tempData.lunch.push(0);
            tempData.dinner.push(0);
          }
        }
        datasets.push({
          label: 'Завтрак',
          data: tempData.breakfast,
          backgroundColor: '#D6E9C6'
        });
        datasets.push({
          label: 'Обед',
          data: tempData.lunch,
          backgroundColor: '#FAEBCC',
        });
        datasets.push({
          label: 'Ужин',
          data: tempData.dinner,
          backgroundColor: '#EBCCD1',
        });
        return datasets;
      }
      return [];
    },
    macronutrientsDataSet() {
      const datasets = [];
      if (this.firstDate && this.secondDate) {
        const tempData = {
          carbs: [],
          fats: [],
          proteins: []
        };
        const firstDate = moment(this.firstDate);
        const secondDate = moment(this.secondDate);

        for (let i = firstDate; i <= secondDate; i.add(1, 'd')) {
          const record = this.recordByDate(i);
          if (record) {
            tempData.fats.push(record.fats.reduce((a, b) => a + b, 0));
            tempData.carbs.push(record.carbs.reduce((a, b) => a + b, 0));
            tempData.proteins.push(record.proteins.reduce((a, b) => a + b, 0));
          } else {
            tempData.fats.push(0);
            tempData.carbs.push(0);
            tempData.proteins.push(0);
          }
        }
        datasets.push({
          label: 'Белки',
          data: tempData.proteins,
          backgroundColor: '#D6E9C6',
        });
        datasets.push({
          label: 'Жиры',
          data: tempData.fats,
          backgroundColor: '#FAEBCC',
        });
        datasets.push({
          label: 'Углеводы',
          data: tempData.carbs,
          backgroundColor: '#EBCCD1',
        });
        return datasets;
      }
      return [];
    },
    caloriesBarData() {
      return {
        labels: this.chartLabels,
        datasets: this.caloriesDataSet
      }
    },
    macronutrientsBarData() {
      return {
        labels: this.chartLabels,
        datasets: this.macronutrientsDataSet
      }
    }
  },
  methods: {
    ...mapActions(useRecordsStore, {
      setChosenDatesForStatistic: 'setChosenDatesForStatistic'
    }),
    onInputChosenDateForStatistic(type, e) {
      this.setChosenDatesForStatistic({
        type: type,
        date: e.date
      });
    }
  }
}
</script>

<style scoped>
.medium-chart-container {
  height: 25em;
}
</style>
