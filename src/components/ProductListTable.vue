<template>
  <div>
    <!-- список -->
    <table class="table table-bordered">
      <thead>
      <tr>
        <th>Название</th>
        <th>Энергетическая ценность (на 100 г)</th>
        <th>Б</th>
        <th>Ж</th>
        <th>У</th>
        <th v-if="isChoosingProductNeeded"/>
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
        <td v-if="isChoosingProductNeeded">
          <!-- выбор продукта для добавления -->
          <div class="form-check">
            <input
                :id="product.id"
                v-model="chosenProductId"
                class="form-check-input"
                type="radio"
                name="addProduct"
                :value="product.id"
                @change="onChangeChosenProductId"
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
                class="page-link black-page-link"
                aria-label="Предыдущая"
                :disabled="currentPage < 1"
                @click="onClickPrevPage"
            >
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>

          <!-- отображаем (n-2) (n-1) n (n+1) (n+2) страницы-->
          <!-- если текущая страница 1, 2, (n-1) или (n-2) - она не в центре-->

          <div
              v-if="pageCount >= countOfPagesForPagination"
              class="d-flex"
          >
            <li
                v-for="i in countOfPagesForPagination"
                :key="i"
                class="page-item"
            >
              <a
                  class="page-link black-page-link"
                  :class="getPageNumberStyleClass(pagesForNavigation.start + i - 1)"
                  @click="currentPage = pagesForNavigation.start + i - 1"
              >
                {{ pagesForNavigation.start + i }}
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
                  class="page-link black-page-link"
                  :class="getPageNumberStyleClass(pagesForNavigation.start + i - 1)"
                  @click="currentPage = pagesForNavigation.start + i - 1"
              >
                {{ pagesForNavigation.start + i }}
              </a>
            </li>
          </div>


          <!--переход на следующую страницу-->
          <li class="page-item">
            <button
                class="page-link black-page-link"
                aria-label="Следующая"
                :disabled="currentPage > pageCount - 2"
                @click="onClickNextPage"
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
            type="text"
            class="form-control form-control-sm"
            inputmode="numeric"
        >
        <button
            class="btn btn-light light-bordered btn-sm"
            :disabled="!isChosenPageValid"
            @click="onClickGoToChosenPage"
        >
          ✓
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from "pinia";
import {useProductsStore} from "../store/index.ts";

export default {
  name: "ProductListTable",
  props: {
    isChoosingProductNeeded: {
      type: Boolean,
      default: false
    },
    stringForSearch: {
      type: String,
      default: null
    }
  },
emits: ['changeChosenProductId'],
  data() {
    return {
      chosenProductId: null,
      productStore: useProductsStore(),
      currentPage: 0,
      sizeOfPage: 8,
      countOfPagesForPagination: 5,
      chosenPageInput: 1
    }
  },
  computed: {
    ...mapState(useProductsStore, {
      productNameById: (store) => {
        return (id) => store.products.find((product) => product.id === id).name;
      }
    }),
    isChosenPageValid() {
      const pattern = /^[0-9]+$/;
      return pattern.test(this.chosenPageInput);
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
    pagesForNavigation() {
      if (this.currentPage < Math.floor(this.countOfPagesForPagination / 2)) {
        return {
          start: 0
        }
      } else if (this.currentPage > Math.floor(this.pageCount - this.countOfPagesForPagination / 2)) {
        return {
          start: this.pageCount - this.countOfPagesForPagination
        }
      } else {
        return {
          start: this.currentPage - Math.floor(this.countOfPagesForPagination / 2)
        }
      }
    }
  },
  methods: {
    getPageNumberStyleClass(pageNumber) {
      if (pageNumber === this.currentPage) {
        return 'chosen-page'
      }
    },
    onClickNextPage() {
      if (this.currentPage < this.pageCount - 1) {
        this.currentPage++;
      }
    },
    onClickPrevPage() {
      if (this.currentPage > 0) {
        this.currentPage--;
      }
    },
    onClickGoToChosenPage() {
      if (this.chosenPageInput > 0 && this.chosenPageInput <= this.pageCount) {
        this.currentPage = this.chosenPageInput - 1;
      } else if (this.chosenPageInput <= 0) {
        this.currentPage = 0;
      } else {
        this.currentPage = this.pageCount - 1;
      }
    },
    onChangeChosenProductId() {
      this.$emit('changeChosenProductId', {
        productId: this.chosenProductId
      });
    }
  }
}
</script>

<style scoped>
.chosen-page {
  font-weight: bold;
  background-color: #ececec;
}

.black-page-link, .black-page-link:hover {
  color: black;
}

.page-input {
  width: 15em;
  height: 1em;
}

.light-bordered {
  border-color: #e1e1e1;
}
</style>
