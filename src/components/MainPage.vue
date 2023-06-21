<template>
  <div class="content">
    <div class="card col-7 mx-auto my-4">
      <div class="card-header d-flex align-items-center justify-content-between">
        <h5 class="my-auto">Завтрак</h5>
        <div>{{ getMeal('breakfast').total.calories }} кКал</div>
        <button type="button" class="btn p-1"><i class="bi bi-plus-circle"/></button>
      </div>

      <div class="card-body">
        <table class="table table-bordered">
          <thead>
          <tr>
            <th class="col-5"/>
            <th class="col-2">К, кКал</th>
            <th class="col-1">Б, г</th>
            <th class="col-1">Ж, г</th>
            <th class="col-1">У, г</th>
            <th class="col-2">Кол-во, г</th>
            <th/>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="meal of getMeal('breakfast').meals"
              :key="meal.id"
          >
            <td>{{meal.name}}</td>
            <td>{{meal.calories}}</td>
            <td>{{meal.proteins}}</td>
            <td>{{meal.fats}}</td>
            <td>{{meal.carbs}}</td>
            <td>{{meal.count}}</td>
            <td>
              <button type="button" class="btn p-0"><i class="bi bi-pencil"/></button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card col-7 mx-auto my-4">
      <div class="card-header d-flex align-items-center justify-content-between">
        <h5 class="my-auto">Обед</h5>
        <div>{{ getMeal('lunch').total.calories }} кКал</div>
        <button type="button" class="btn p-1"><i class="bi bi-plus-circle"></i></button>
      </div>
      <div class="card-body">
        <table class="table table-bordered">
          <thead>
          <tr>
            <th class="col-5"/>
            <th class="col-2">К, кКал</th>
            <th class="col-1">Б, г</th>
            <th class="col-1">Ж, г</th>
            <th class="col-1">У, г</th>
            <th class="col-2">Кол-во, г</th>
            <th/>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="meal of getMeal('lunch').meals"
              :key="meal.id"
          >
            <td>{{meal.name}}</td>
            <td>{{meal.calories}}</td>
            <td>{{meal.proteins}}</td>
            <td>{{meal.fats}}</td>
            <td>{{meal.carbs}}</td>
            <td>{{meal.count}}</td>
            <td>
              <button type="button" class="btn p-0"><i class="bi bi-pencil"/></button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="card col-7 mx-auto my-4">
      <div class="card-header d-flex align-items-center justify-content-between">
        <h5 class="my-auto">Ужин</h5>
        <div>{{ getMeal('dinner').total.calories }} кКал</div>
        <button type="button" class="btn p-1"><i class="bi bi-plus-circle"></i></button>
      </div>
      <div class="card-body">
        <table class="table table-bordered">
          <thead>
          <tr>
            <th class="col-5"/>
            <th class="col-2">К, кКал</th>
            <th class="col-1">Б, г</th>
            <th class="col-1">Ж, г</th>
            <th class="col-1">У, г</th>
            <th class="col-2">Кол-во, г</th>
            <th/>
          </tr>
          </thead>
          <tbody>
          <tr
              v-for="meal of getMeal('dinner').meals"
              :key="meal.id"
          >
            <td>{{meal.name}}</td>
            <td>{{meal.calories}}</td>
            <td>{{meal.proteins}}</td>
            <td>{{meal.fats}}</td>
            <td>{{meal.carbs}}</td>
            <td>{{meal.count}}</td>
            <td>
              <button type="button" class="btn p-0"><i class="bi bi-pencil"/></button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import {useRecordsStore} from "../store/index.ts";
import {useProductsStore} from "../store/index.ts";
import {mapState} from "pinia";
import Meal from "./Meal.vue";

export default {
  name: "MainPage",
  components: {Meal},
  data() {
    return {
      recordsStore: useRecordsStore(),
      productsStore: useProductsStore(),
      chosenDate: '2023-06-13'
    }
  },
  beforeMount() {
    useProductsStore().fetchProducts();
  },
  computed: {
    mealsForDay() {
      return this.recordsStore.recordByDate(this.chosenDate);
    },
    ...mapState(useProductsStore, ['getProductById'])
  },
  methods: {
    getMeal(type) {
      let meals;
      switch (type) {
        case 'breakfast':
          meals = this.mealsForDay.breakfast;
          break;
        case 'lunch':
          meals = this.mealsForDay.lunch;
          break;
        case 'dinner':
          meals = this.mealsForDay.dinner;
          break;
        default:
          break;
      }

      let mealsArray = [];
      let total = {
        calories: 0,
        proteins: 0,
        fats: 0,
        carbs: 0
      }
      for (const meal of meals) {
        const product = this.productsStore.getProductById(meal.productId);
        const calories = Number.parseInt(product.calories.replace(',', '.')) * meal.count / 100;
        const proteins = Number.parseInt(product.proteins.replace(',', '.')) * meal.count / 100;
        const fats = Number.parseInt(product.fats.replace(',', '.')) * meal.count / 100;
        const carbs = Number.parseInt(product.carbs.replace(',', '.')) * meal.count / 100;
        total.calories += calories;
        total.proteins += proteins;
        total.fats += fats;
        total.carbs += carbs;

        mealsArray.push({
          mealId: meal.id,
          name: product.name,
          calories: calories,
          proteins: proteins,
          fats: fats,
          carbs: carbs,
          count: meal.count
        })
      }
      return {
        meals: mealsArray,
        total: total
      }
    }
  }
}
</script>

<style scoped>

</style>
