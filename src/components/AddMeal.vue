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
                <h6 class="heading-with-margin">
                  Продукт:
                </h6>
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

            <!-- поиск по таблице -->
            <div class="input-group small-input-group align-content-end mb-4">
              <input
                  v-model="stringForSearch"
                  type="text"
                  placeholder="Поиск"
                  class="form-control"
              >
            </div>
          </div>
          <!-- таблица с пагинацией -->
          <product-list-table
              :is-choosing-product-needed="true"
              :string-for-search="stringForSearch"
              @change-chosen-product-id="onChangeChosenProductId($event)"
          />
        </div>
        <div class="modal-footer">
          <button
              type="button"
              class="btn btn-success"
              :disabled="!countOfProduct.isValid || chosenProductId === null"
              data-bs-dismiss="modal"
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
      this.stringForSearch = null;
      this.countOfProduct = {
        isDirty: false,
        isValid: false,
        value: null
      }
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
