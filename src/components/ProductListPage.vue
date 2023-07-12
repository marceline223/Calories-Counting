<template>
  <div class="content">
    <div class="d-flex justify-content-between align-items-center">
      <h4>Справочник</h4>
      <div class="input-group align-content-center search">
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
                @click="prevPage"
                :disabled="currentPage < 1"
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
                  :class="pageNumberStyleClass( getPagesForNavigation().start + i - 1)"
                  @click="currentPage = getPagesForNavigation().start + i - 1"
              >
                {{ getPagesForNavigation().start + i }}
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
                  :class="pageNumberStyleClass( getPagesForNavigation().start + i - 1)"
                  @click="currentPage = getPagesForNavigation().start + i - 1"
              >
                {{ getPagesForNavigation().start + i }}
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
</template>

<script>
import {useProductsStore} from "../store/index.ts";

export default {
  name: "ProductListPage",
  data() {
    return {
      store: useProductsStore(),
      currentPage: 0,
      sizeOfPage: 12,
      chosenPageInput: 1,
      stringForSearch: null
    }
  },
  computed: {
    products() {
      //поиск по строке
      if (this.stringForSearch && this.stringForSearch !== '') {
        return this.store.products.filter(item => item.name.toLowerCase().includes(this.stringForSearch.toLowerCase())).sort();
      }
      return this.store.products;
    },
    pageCount() {
      return Math.ceil(this.products.length / this.sizeOfPage);
    },
    productsForPage() {
      const start = this.currentPage * this.sizeOfPage;
      const end = start + this.sizeOfPage;

      return this.products.slice(start, end);
    }
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

.page-input {
  width: 15em;
  height: 1em;
}


.form-control {
  width: 25em;
}

.btn-light {
  border-color: #e1e1e1;
}
</style>
