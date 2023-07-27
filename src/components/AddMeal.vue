<template>
  <div
      :id="mealType"
      class="modal"
      aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title align-content-center mt-1">
            Добавить запись: {{ mealName }} {{ formattedDate }}
          </h5>
          <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
          />
        </div>
        <div class="modal-body">
          <div class="row justify-content-between">
            <div class="col mb-4">
              <div class="d-flex align-items-center">
                <h6 class="heading-with-margin">Продукт: </h6>
                <span class="mx-2">
                   {{ chosenProductName || "Выберите продукт" }}
                </span>
              </div>

              <div class="d-flex">
                <!-- ввод количества -->
                <div class="input-group small-input-group">
                  <input
                      :value="countOfProduct.value"
                      type="text"
                      placeholder="Введите количество"
                      class="form-control"
                      @input="onInputCountOfProduct"
                  >
                  <span class="input-group-text">
                г
                </span>
                </div>
                <i
                    v-if="countOfProduct.isDirty"
                    class="bi mx-3 my-auto small-icon"
                    :class="iconClass"
                />
              </div>
            </div>

            <!-- поиск по списку -->
            <div class="input-group small-input-group align-content-end mb-4">
              <input
                  v-model="stringForSearch"
                  type="text"
                  placeholder="Поиск"
                  class="form-control"
              >
            </div>
          </div>

          <!-- список -->
          <product-list-table
              :is-choosing-product-needed="true"
              :string-for-search="stringForSearch"
              @change-chosen-product-id="onChangeChosenProductId($event)"
          />


<!--          <table class="table table-bordered">-->
<!--            <thead>-->
<!--            <tr>-->
<!--              <th>Название</th>-->
<!--              <th>Энергетическая ценность (на 100 г)</th>-->
<!--              <th>Б</th>-->
<!--              <th>Ж</th>-->
<!--              <th>У</th>-->
<!--              <th/>-->
<!--            </tr>-->
<!--            </thead>-->
<!--            <tbody>-->
<!--            <tr-->
<!--                v-for="product in productsForPage"-->
<!--                :key="product.id"-->
<!--            >-->
<!--              <td>{{ product.name }}</td>-->
<!--              <td>{{ product.calories }}</td>-->
<!--              <td>{{ product.proteins }}</td>-->
<!--              <td>{{ product.fats }}</td>-->
<!--              <td>{{ product.carbs }}</td>-->
<!--              <td>-->
<!--                &lt;!&ndash; выбор продукта для добавления &ndash;&gt;-->
<!--                <div class="form-check">-->
<!--                  <input-->
<!--                      :id="product.id"-->
<!--                      v-model="chosenProductId"-->
<!--                      class="form-check-input"-->
<!--                      type="radio"-->
<!--                      name="addProduct"-->
<!--                      :value="product.id"-->
<!--                  >-->
<!--                </div>-->
<!--              </td>-->
<!--            </tr>-->
<!--            </tbody>-->
<!--          </table>-->

<!--          &lt;!&ndash; пагинация &ndash;&gt;-->
<!--          <div class="d-flex justify-content-between">-->
<!--            <nav>-->
<!--              <ul class="pagination">-->

<!--                &lt;!&ndash;переход на предыдущую страницу&ndash;&gt;-->
<!--                <li class="page-item">-->
<!--                  <button-->
<!--                      class="page-link"-->
<!--                      aria-label="Предыдущая"-->
<!--                      :disabled="currentPage < 1"-->
<!--                      @click="onClickPrevPage"-->
<!--                  >-->
<!--                    <span aria-hidden="true">&laquo;</span>-->
<!--                  </button>-->
<!--                </li>-->

<!--                &lt;!&ndash; отображаем (n-2) (n-1) n (n+1) (n+2) страницы&ndash;&gt;-->
<!--                &lt;!&ndash; если текущая страница 1, 2, (n-1) или (n-2) - она не в центре&ndash;&gt;-->

<!--                <div-->
<!--                    v-if="pageCount >= 5"-->
<!--                    class="d-flex"-->
<!--                >-->
<!--                  <li-->
<!--                      v-for="i in 5"-->
<!--                      :key="i"-->
<!--                      class="page-item"-->
<!--                  >-->
<!--                    <a-->
<!--                        class="page-link"-->
<!--                        :class="getPageNumberStyleClass( pagesForNavigation.start + i - 1)"-->
<!--                        @click="currentPage = pagesForNavigation.start + i - 1"-->
<!--                    >-->
<!--                      {{ pagesForNavigation.start + i }}-->
<!--                    </a>-->
<!--                  </li>-->
<!--                </div>-->

<!--                <div-->
<!--                    v-else-->
<!--                    class="d-flex"-->
<!--                >-->
<!--                  <li-->
<!--                      v-for="i in pageCount"-->
<!--                      :key="i"-->
<!--                      class="page-item"-->
<!--                  >-->
<!--                    <a-->
<!--                        class="page-link"-->
<!--                        :class="getPageNumberStyleClass( pagesForNavigation.start + i - 1)"-->
<!--                        @click="currentPage = pagesForNavigation.start + i - 1"-->
<!--                    >-->
<!--                      {{ pagesForNavigation.start + i }}-->
<!--                    </a>-->
<!--                  </li>-->
<!--                </div>-->

<!--                &lt;!&ndash;переход на следующую страницу&ndash;&gt;-->
<!--                <li class="page-item">-->
<!--                  <button-->
<!--                      class="page-link"-->
<!--                      aria-label="Следующая"-->
<!--                      :disabled="currentPage > pageCount - 2"-->
<!--                      @click="onClickNextPage"-->
<!--                  >-->
<!--                    <span aria-hidden="true">&raquo;</span>-->
<!--                  </button>-->
<!--                </li>-->
<!--              </ul>-->
<!--            </nav>-->

<!--            &lt;!&ndash; переход по номеру страницы &ndash;&gt;-->
<!--            <div class="input-group page-input">-->
<!--              <span class="input-group-text">-->
<!--                Страница-->
<!--              </span>-->
<!--              <input-->
<!--                  v-model="chosenPageInput"-->
<!--                  type="text"-->
<!--                  class="form-control form-control-sm"-->
<!--                  inputmode="numeric"-->
<!--              >-->
<!--              <button-->
<!--                  class="btn btn-light btn-sm"-->
<!--                  :disabled="!isChosenPageValid"-->
<!--                  @click="onClickGoToChosenPage"-->
<!--              >-->
<!--                ✓-->
<!--              </button>-->
<!--            </div>-->
<!--          </div>-->

        </div>
        <div class="modal-footer">
          <button
              type="button"
              class="btn btn-success"
              :disabled="!countOfProduct.isValid"
              @click="onClickAddToMeal"
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {useProductsStore, useRecordsStore} from "../store/index.ts";
import {mapState} from "pinia";
import moment from "moment";
import ProductListTable from "./ProductListTable.vue";

export default {
  name: "AddMeal",
  components: {ProductListTable},
  props: {
    mealType: {
      type: String,
      default: 'breakfast'
    }
  },
  data() {
    return {
      productStore: useProductsStore(),
      recordsStore: useRecordsStore(),
      currentPage: 0,
      sizeOfPage: 8,
      chosenPageInput: 1,
      stringForSearch: null,
      chosenProductId: null,
      countOfProduct: {
        value: null,
        isDirty: false,
        isValid: false
      }
    }
  },
  computed: {
    ...mapState(useRecordsStore, {
      chosenDate: store => store.chosenDate
    }),
    ...mapState(useProductsStore, {
      productNameById: (store) => {
        return (id) => store.products.find((product) => product.id === id).name;
      }
    }),
    formattedDate() {
      return moment(this.chosenDate).format("DD.MM.YYYY");
    },
    mealName() {
      switch (this.mealType) {
        case 'breakfast':
          return 'завтрак';
        case 'lunch':
          return 'обед';
        case 'dinner':
          return 'ужин';
        default:
          return 'не найдено';
      }
    },
    chosenProductName() {
      if (this.chosenProductId !== null) {
        return this.productNameById(this.chosenProductId);
      }
      return null;
    },
    iconClass() {
      return this.countOfProduct.isValid ? 'bi-check-circle text-success' : 'bi-exclamation-circle text-danger';
    }
  },
  methods: {
    onChangeChosenProductId(e) {
      this.chosenProductId = e.productId;
    },
    onClickAddToMeal() {
      this.recordsStore.addToMeal({
        date: this.chosenDate,
        type: this.mealType,
        productId: this.chosenProductId,
        count: this.countOfProduct.value
      });
    },
    onInputCountOfProduct(e) {
      this.countOfProduct.value = e.target.value;
      this.countOfProduct.isDirty = true;
      const pattern = /([0-9]*[.])?[0-9]+/;
      this.countOfProduct.isValid = pattern.test(this.countOfProduct.value) && this.countOfProduct.value > 0;
    }
  }
}
</script>
