<template>
  <div class="modal">
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title align-content-center mt-1">
            Добавить запись: {{ mealName }} {{ date }}
          </h5>
          <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
          />
        </div>
        <div class="modal-body">
          <!-- ТАБЛИЦА -->
          <div class="row  justify-content-between">
            <div class="col mb-4">
              <div class="d-flex align-items-center">
                <h6>Продукт: </h6>
                <span class="mx-2">
                   {{ chosenProductName || "Выберите продукт"}}
                </span>
              </div>

              <div class="input-group amount">
                <input
                    :value="countOfProduct.value"
                    type="text"
                    placeholder="Введите количество"
                    class="form-control amount"
                    @input="onInputAmountOfProduct"
                >
                <span class="input-group-text">
                г
                </span>
              <i
                  v-if="countOfProduct.isDirty"
                  class="bi mx-3 my-auto"
                  :class="getIconClass"
              />
              </div>
            </div>
            <div class="input-group search align-content-end mb-4">
              <input
                  v-model="stringForSearch"
                  type="text"
                  placeholder="Поиск"
                  class="form-control"
              >
            </div>
          </div>
          <table class="table table-bordered">
            <thead>
            <tr>
              <th>Название</th>
              <th>Энергетическая ценность (на 100 г)</th>
              <th>Б</th>
              <th>Ж</th>
              <th>У</th>
              <th/>
            </tr>
            </thead>
            <tbody>
            <tr
                v-for="product in productsForPage"
                :key="product.id"
            >
              <td>{{ product.name }}</td>
              <td>{{ product.calories }}</td>
              <td>{{ product.proteins }}</td>
              <td>{{ product.fats }}</td>
              <td>{{ product.carbs }}</td>
              <td>
                <!-- ВЫБОР ПРОДУКТА -->
                <div class="form-check">
                  <input
                      :id="product.id"
                      v-model="chosenProductId"
                      class="form-check-input"
                      type="radio"
                      name="addProduct"
                      :value="product.id"
                  >
                </div>
              </td>
            </tr>
            </tbody>
          </table>
          <div class="d-flex justify-content-between">
            <nav>
              <ul class="pagination">
                <!--переход на предыдущую страницу-->
                <li class="page-item">
                  <button
                      class="page-link"
                      aria-label="Предыдущая"
                      :disabled="currentPage < 1"
                      @click="prevPage"
                  >
                    <span aria-hidden="true">&laquo;</span>
                  </button>
                </li>

                <!-- отображаем (n-2) (n-1) n (n+1) (n+2) страницы-->
                <!-- если текущая страница 1, 2, (n-1) или (n-2) - она не в центре-->

                <div
                    v-if="pageCount >= 5"
                    class="d-flex"
                >
                  <li
                      v-for="i in 5"
                      :key="i"
                      class="page-item"
                  >
                    <a
                        class="page-link"
                        :class="pageNumberStyleClass( getPagesForNavigation.start + i - 1)"
                        @click="currentPage = getPagesForNavigation.start + i - 1"
                    >
                      {{ getPagesForNavigation.start + i }}
                    </a>
                  </li>
                </div>

                <div
                    v-else
                    class="d-flex"
                >
                  <li
                      v-for="i in pageCount"
                      :key="i"
                      class="page-item"
                  >
                    <a
                        class="page-link"
                        :class="pageNumberStyleClass( getPagesForNavigation.start + i - 1)"
                        @click="currentPage = getPagesForNavigation.start + i - 1"
                    >
                      {{ getPagesForNavigation.start + i }}
                    </a>
                  </li>
                </div>


                <!--переход на следующую страницу-->
                <li class="page-item">
                  <button
                      class="page-link"
                      aria-label="Следующая"
                      :disabled="currentPage > pageCount - 2"
                      @click="nextPage"
                  >
                    <span aria-hidden="true">&raquo;</span>
                  </button>
                </li>
              </ul>
            </nav>

            <div class="input-group page-input">
              <span class="input-group-text">
                Страница
              </span>
              <input
                  v-model="chosenPageInput"
                  type="number"
                  class="form-control form-control-sm"
                  inputmode="numeric"
              >
              <button
                  class="btn btn-light btn-sm"
                  @click="goToChosenPage"
              >
                ✓
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
              type="button"
              class="btn btn-success"
              :disabled="!countOfProduct.isValid"
              @click="addToMeal"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {useProductsStore, useRecordsStore} from "../store/index.ts";
import moment from 'moment'

export default {
  name: "AddMeal",
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
  mount() {
    console.log(this.mealType)
  },
  computed: {
    date() {
      return moment(this.chosenDate).format('DD.MM.YYYY');
    },
    products() {
      //если пользователь использовал поиск по строке
      if (this.stringForSearch && this.stringForSearch !== '') {
        return this.productStore.products.filter(item => item.name.toLowerCase().includes(this.stringForSearch.toLowerCase())).sort();
      }
      //иначе - весь список
      return this.productStore.products;
    },
    pageCount() {
      return Math.ceil(this.products.length / this.sizeOfPage);
    },
    productsForPage() {
      const start = this.currentPage * this.sizeOfPage;
      const end = start + this.sizeOfPage;

      return this.products.slice(start, end);
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
        return this.productStore.getProductNameById(this.chosenProductId);
      }
      return null;
    },
    chosenDate() {
      return this.recordsStore.chosenDate;
    },
    getIconClass() {
      return this.countOfProduct.isValid ? 'bi-check-circle text-success' : 'bi-exclamation-circle text-danger';
    },
    getPagesForNavigation() {
      if (this.currentPage < 2) {
        return {
          start: 0
        }
      } else if (this.currentPage > this.pageCount - 3) {
        return {
          start: this.pageCount - 5
        }
      } else {
        return {
          start: this.currentPage - 2
        }
      }
    }
  },
  beforeMount() {
    this.productStore.fetchProducts();
  },
  methods: {
    nextPage() {
      if (this.currentPage < this.pageCount - 1) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
      }
    },
    addToMeal() {
      console.log('addToMeal in AddMeal.vue');
      this.recordsStore.addToMeal({
        date: this.chosenDate,
        type: this.mealType,
        productId: this.chosenProductId,
        count: this.countOfProduct.value
      });
    },
    pageNumberStyleClass(pageNumber) {
      if (pageNumber === this.currentPage) {
        return 'chosen-page'
      }
    },
    goToChosenPage() {
      if (this.chosenPageInput > 0 && this.chosenPageInput <= this.pageCount) {
        this.currentPage = this.chosenPageInput - 1;
      } else if (this.chosenPageInput <= 0) {
        this.currentPage = 0;
      } else {
        this.currentPage = this.pageCount - 1;
      }
    },
    onInputAmountOfProduct(e) {
      this.countOfProduct.value = e.target.value;
      this.countOfProduct.isDirty = true;
      const pattern = /([0-9]*[.])?[0-9]+/;
      this.countOfProduct.isValid = pattern.test(this.countOfProduct.value) && this.countOfProduct.value > 0;
    }
  }
}
</script>

<style scoped>
.chosen-page {
  font-weight: bold;
  background-color: #ececec;
}

.page-link, .page-link:hover {
  color: black;
}

.search {
  width: 25em;
}

.amount {
  width: 25em;
}

.page-input {
  width: 15em;
  height: 1em;
}

.btn-light {
  border-color: #e1e1e1;
}

i {
  font-size: 1rem;
  margin-left: 1rem;
}
</style>
