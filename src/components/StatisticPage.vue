<template>
  <div class="content">
    <h4>
      Статистика
    </h4>
    {{normOfCalories}}
    <div class="row justify-content-around">
      <div class="input-group">
        <span class="input-group-text">
              с
        </span>
        <input
            id="calendar"
            v-model="firstDate"
            :max="secondDate"
            type="date"
            class="form-control"
        >
      </div>
      <div class="input-group">
        <span class="input-group-text">
              по
        </span>
        <input
            id="calendar"
            v-model="secondDate"
            :min="firstDate"
            type="date"
            class="form-control"
        >
      </div>
    </div>

    <h5>Калории</h5>
    <!-- Столбчатая диаграмма -->
    <div class="chart-container my-3">
      <Bar
          id="123"
          :data="getBarData"
          :options="options"
      />
    </div>

    <h5>Макроэлементы</h5>
    <!-- Столбчатая диаграмма -->
    <div class="chart-container my-3">
      <Bar
          id="123"
          :data="getBarData"
          :options="options"
      />
    </div>
  </div>
</template>

<script>

import {Bar} from 'vue-chartjs';
import {Chart as Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import {useRecordsStore} from "../store/index.ts";
import {mapState} from "pinia";

Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, annotationPlugin);

export default {
  name: "StatisticPage",
  components: {Bar},
  data() {
    return {
      firstDate: null,
      secondDate: null,
      recordsStore: useRecordsStore(),
      normOfCalories: this.normOfCalories,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true
          },
          y: {
            stacked: true,
            max: this.normOfCalories
          }
        },
        plugins: {
          annotation: {
            annotations: {
              normOfCaloriesLine: {
                type: 'line',
                scaleID: 'y',
                value: this.normOfCalories,
                borderColor: 'green',
                borderWidth: 2
              }
            }
          }
        }
      }
    }
  },
  computed: {
    ...mapState(useRecordsStore, {
      getRecordByDateObj(store) {
        return (date) => store.records.find(record => {
          return this.areDatesEquals(this.dateFromString(record.date), new Date(date));
        });
      },
      normOfCalories: store => store.getNormOfCalories,
    }),
    getNorm() {
      return this.normOfCalories;
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
    getBarDataSets() {
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
          const record = this.getRecordByDateObj(i);
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
    getBarData() {
      return {
        labels: this.getLabels,
        datasets: this.getBarDataSets
      }
    },
  },
  methods: {
    dateFromString(dateStr) {
      const dateResult = new Date();
      const day = Number.parseInt(dateStr.slice(8, 10));
      const month = Number.parseInt(dateStr.slice(5, 7)) - 1;
      const year = Number.parseInt(dateStr.slice(0, 4));

      dateResult.setFullYear(year, month, day);

      return dateResult;
    },

    areDatesEquals(first, second) {
      return (first.getFullYear() === second.getFullYear()
          && first.getMonth() === second.getMonth()
          && first.getDate() === second.getDate()
      )
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
