<template>
  <div class="content">
    <h4>
      Статистика
    </h4>
    <div class="row justify-content-around">
      <div class="input-group">
        <span class="input-group-text">
              с
        </span>
        <input
            id="calendar"
            :value="getDateForCalendar('first')"
            :max="getDateForCalendar('second')"
            type="date"
            class="form-control"
            @input="onInputChosenDates('first', $event)"
        >
      </div>
      <div class="input-group">
        <span class="input-group-text">
              по
        </span>
        <input
            id="calendar"
            :value="getDateForCalendar('second')"
            :min="getDateForCalendar('first')"
            type="date"
            class="form-control"
            @input="onInputChosenDates('second', $event)"
        >
      </div>
    </div>

    <h5>Калории</h5>
    <div class="chart-container my-3">
      <Bar
          id="123"
          :data="getCaloriesBarData"
          :options="optionsCalories"
      />
    </div>

    <h5>Макроэлементы</h5>
    <div class="chart-container my-3">
      <Bar
          id="123"
          :data="getMacronutrientsBarData"
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

Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, annotationPlugin);

export default {
  name: "StatisticPage",
  components: {Bar},
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
    getLabels() {
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
    getCaloriesDataSet() {
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
    getMacronutrientsDataSet() {
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
    getCaloriesBarData() {
      return {
        labels: this.getLabels,
        datasets: this.getCaloriesDataSet
      }
    },
    getMacronutrientsBarData() {
      return {
        labels: this.getLabels,
        datasets: this.getMacronutrientsDataSet
      }
    }
  },
  methods: {
    ...mapActions(useRecordsStore, {
      setChosenDatesForStatistic: 'setChosenDatesForStatistic'
    }),
    onInputChosenDates(type, e) {
      this.setChosenDatesForStatistic({
        type: type,
        date: moment.utc(e.target.value)
      });
    },
    getDateForCalendar(type) {
      // т.к. календарь использует другой формат даты
      switch (type) {
        case 'first':
          if (this.firstDate) {
            return moment(this.firstDate).format('YYYY-MM-DD');
          }
          return null;
        case 'second':
          if (this.secondDate) {
            return moment(this.secondDate).format('YYYY-MM-DD');
          }
          return null;
      }
    }
  }
}
</script>

<style scoped>
.input-group {
  width: 30em;
}

.chart-container {
  height: 20em;
}
</style>
