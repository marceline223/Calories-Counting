<template>
  <div class="content">
    <h4>Справочник</h4>
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
          :key=product.name
      >
        <td>{{ product.name }}</td>
        <td>{{ product.calories }}</td>
        <td>{{ product.proteins }}</td>
        <td>{{ product.fats }}</td>
        <td>{{ product.carbs }}</td>
      </tr>
      </tbody>
    </table>

    <nav>
      <ul class="pagination">
        <!--переход на предыдущую страницу-->
        <li class="page-item">
          <a
              class="page-link"
              aria-label="Предыдущая"
              @click="prevPage"
          >
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>

        <!-- отображаем (n-2) (n-1) n (n+1) (n+2) страницы-->
        <!-- если текущая страница 1, 2, (n-1) или (n-2) - она не в центре-->

        <div class="d-flex">
          <li
              v-for="i in 5"
              :key="i"
              class="page-item"
          >
            <a
                class="page-link"
                :class="pageNumberStyleClass( getPagesForNavigation().start + i  - 1)"
                @click="currentPage = getPagesForNavigation().start + i  - 1">
              {{ getPagesForNavigation().start + i }}
            </a>
          </li>
        </div>


        <!--переход на следующую страницу-->
        <li class="page-item">
          <a
              class="page-link"
              aria-label="Следующая"
              @click="nextPage"
          >
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import {useProductsStore} from "../store/index.ts";

export default {
  name: "ProductListPage",
  beforeMount() {
    useProductsStore().fetchProducts();
  },
  data() {
    return {
      store: useProductsStore(),
      currentPage: 0,
      sizeOfPage: 13
    }
  },
  computed: {
    products() {
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
      if (this.currentPage < this.pageCount) {
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
    getPagesForNavigation() {
      if (this.currentPage < 2) {
        return {
          start: 0
        }
      } else if (this.currentPage > this.pageCount - 2) {
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
</style>
