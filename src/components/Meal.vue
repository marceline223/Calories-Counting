<template>
  <div class="card col-8 mx-auto my-3">
    <add-meal
        v-if="showAddingDialog"
        :id="mealType"
        :key="showAddingDialog"
        :meal-type="mealType"
    />
    <div class="card-header d-flex align-items-center justify-content-between">
      <h6 class="my-auto">
        {{ mealName }}
      </h6>
      <div>
          <span>
          {{ getMealInfo.total.calories.toFixed(2) }} кКал
          </span>
        <button
            type="button"
            class="btn p-1"
            data-bs-toggle="modal"
            :data-bs-target="'#' + mealType"
            :disabled="!chosenDate"
            @click="onClickShowAddDialog"
        >
          <i class="bi bi-plus-circle"/>
        </button>
      </div>
    </div>

    <div class="card-body">
      <table
          v-if="getMeal.length > 0"
          class="table table-sm"
      >
        <thead>
        <tr>
          <th class="col-6"/>
          <th class="col-2">
            Кол-во, г
          </th>
          <th class="col-1">
            Б, г
          </th>
          <th class="col-1">
            Ж, г
          </th>
          <th class="col-1">
            У, г
          </th>
          <th class="col-1">
            К, кКал
          </th>
          <th/>
          <th/>
        </tr>
        </thead>
        <tbody>
        <tr
            v-for="meal of getMealInfo.meals"
            :key="meal.id"
        >
          <td>{{ meal.name }}</td>
          <td v-if="productIdForEditing === meal.id">
            <div class="input-group input-group-sm">
              <input
                  v-model="newCount"
                  class="form-control form-control-sm"
                  type="number"
              >
            </div>
          </td>
          <td v-else>
            {{ meal.count }}
          </td>
          <td>{{ meal.proteins.toFixed(2) }}</td>
          <td>{{ meal.fats.toFixed(2) }}</td>
          <td>{{ meal.carbs.toFixed(2) }}</td>
          <td>{{ meal.calories.toFixed(2) }}</td>
          <td>
            <button
                v-if="productIdForEditing === meal.id"
                type="button"
                class="btn btn-light p-0"
                :disabled="!isNewCountValid"
                @click="saveCount(meal.id)"
            >
              <i class="bi bi-check-circle text-success"/>
            </button>
            <button
                v-else
                type="button"
                class="btn btn-light p-0"
                @click="editCount(meal.id)"
            >
              <i class="bi bi-pencil"/>
            </button>
          </td>
          <td>
            <button
                v-if="productIdForEditing === meal.id"
                type="button"
                class="btn btn-light p-0"
                @click="productIdForEditing = null"
            >
              <i class="bi bi-arrow-counterclockwise"/>
            </button>
            <button
                v-else
                type="button"
                class="btn btn-light p-0"
                @click="onDeleteFromMeal(meal.id)"
            >
              <i class="bi bi-x text-danger"/>
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import {useProductsStore, useRecordsStore} from "../store/index.ts";
import {mapActions, mapState} from "pinia";
import AddMeal from "./AddMeal.vue";

export default {
  name: "MealComponent",
  components: {AddMeal},
  props: {
    mealType: {
      type: String,
      default: 'breakfast'
    }
  },
  data() {
    return {
      recordsStore: useRecordsStore(),
      productsStore: useProductsStore(),
      showAddingDialog: false,
      productIdForEditing: null,
      newCount: null
    }
  },
  computed: {
    ...mapState(useRecordsStore, {
      getRecordByDate: (store) => (date) => store.records.find((record) => record.date === date)
    }),
    chosenDate() {
      return this.recordsStore.chosenDate;
    },
    mealName() {
      switch (this.mealType) {
        case 'breakfast':
          return 'Завтрак';
        case 'lunch':
          return 'Обед';
        case 'dinner':
          return 'Ужин';
        default:
          return 'Не найдено';
      }
    },
    getMeal() {
      switch (this.mealType) {
        case 'breakfast':
          return this.recordsStore.recordByDate(this.chosenDate).breakfast;
        case 'lunch':
          return this.recordsStore.recordByDate(this.chosenDate).lunch;
        case 'dinner':
          return this.recordsStore.recordByDate(this.chosenDate).dinner;
        default:
          return null;
      }
    },
    getMealInfo() {
      const eatenProducts = this.getMeal;
      const productsInfo = [];
      const total = {
        calories: 0,
        proteins: 0,
        fats: 0,
        carbs: 0
      }
      for (const eatenProduct of eatenProducts) {
        const productInfo = this.productsStore.getProductById(eatenProduct.productId);
        const calories = Number.parseFloat(productInfo.calories.replace(',', '.')) * eatenProduct.count / 100;
        const proteins = Number.parseFloat(productInfo.proteins.replace(',', '.')) * eatenProduct.count / 100;
        const fats = Number.parseFloat(productInfo.fats.replace(',', '.')) * eatenProduct.count / 100;
        const carbs = Number.parseFloat(productInfo.carbs.replace(',', '.')) * eatenProduct.count / 100;
        total.calories += calories;
        total.proteins += proteins;
        total.fats += fats;
        total.carbs += carbs;

        productsInfo.push({
          id: eatenProduct.id,
          name: productInfo.name,
          calories: calories,
          proteins: proteins,
          fats: fats,
          carbs: carbs,
          count: eatenProduct.count
        })
      }
      let mealIndex = 0;
      switch (this.mealType) {
        case 'breakfast':
          mealIndex = 0;
          break;
        case 'lunch':
          mealIndex = 1;
          break;
        case 'dinner':
          mealIndex = 2;
          break;
      }
      this.recordsStore.setTotalCalories({
        date: this.chosenDate,
        index: mealIndex,
        calories: total.calories
      })
      return {
        meals: productsInfo,
        total: total
      }
    },
    isNewCountValid() {
      const pattern = /([0-9]*[.])?[0-9]+/;
      return pattern.test(this.newCount) && this.newCount > 0;
    }
  },
  methods: {
    onDeleteFromMeal(mealIndex) {
      this.recordsStore.deleteFromMeal({
        type: this.mealType,
        id: mealIndex,
        date: this.chosenDate
      });
    },
    onClickShowAddDialog() {
      // ПЕРЕДЕЛАТЬ ЧЕТ НЕ РАБОТАЕТ
      this.showAddingDialog = true;
      this.$nextTick(() => {
        $('#myModal').modal('show');
      });
    },
    editCount(productIdForEditing) {
      this.productIdForEditing = productIdForEditing;
    },
    saveCount() {
      this.editMeal({
        type: this.mealType,
        eatenProductId: this.productIdForEditing,
        date: this.chosenDate,
        count: this.newCount
      });
      this.productIdForEditing = null;
    },
    ...mapActions(useRecordsStore, {
      editMeal: 'editMeal'
    })
  }
}
</script>

<style scoped>
i {
  font-size: 1.1em;
}

.input-group-sm {
  height: 1em;
}
</style>
