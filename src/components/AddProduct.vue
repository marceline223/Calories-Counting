<template>
  <div
      id="addProductModal"
      class="modal"
      aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title align-content-center mt-1">
            Добавить продукт
          </h5>
          <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
          />
        </div>
        <div class="modal-body">
          <h5>Название</h5>
          <div class="input-group mb-3">
            <input
                v-model="title"
                type="text"
                class="form-control"
            >
          </div>
          <hr>
          <h5>На 100 грамм продукта:</h5>
          <h6>
            Энергетическая ценность, кКал
            <i
                v-if="calories.isDirty"
                class="bi"
                :class="getIconClass('calories')"
            />
          </h6>
          <div class="input-group mb-3">
            <input
                :value="calories.value"
                type="text"
                class="form-control"
                @input="onInputForm('calories', $event)"
            >
          </div>

          <h6>
            Белки, г
            <i
                v-if="proteins.isDirty"
                class="bi"
                :class="getIconClass('proteins')"
            />
          </h6>
          <div class="input-group mb-3">
            <input
                :value="proteins.value"
                type="text"
                class="form-control"
                @input="onInputForm('proteins', $event)"
            >
          </div>

          <h6>
            Жиры, г
            <i
                v-if="fats.isDirty"
                class="bi"
                :class="getIconClass('fats')"
            />
          </h6>
          <div class="input-group mb-3">
            <input
                :value="fats.value"
                type="text"
                class="form-control"
                @input="onInputForm('fats', $event)"
            >
          </div>

          <h6>
            Углеводы, г
            <i
                v-if="carbs.isDirty"
                class="bi"
                :class="getIconClass('carbs')"
            />
          </h6>
          <div class="input-group mb-3">
            <input
                :value="carbs.value"
                type="text"
                class="form-control"
                @input="onInputForm('carbs', $event)"
            >
          </div>

        </div>
        <div class="modal-footer">
          <button
              type="button"
              class="btn btn-success"
              :disabled="!checkForms"
              @click="onClickAddProduct"
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions} from "pinia";
import {useProductsStore} from "../store/index.ts";

export default {
  name: "AddProduct",
  data() {
    return {
      title: null,
      countOfProduct: {
        value: null,
        isDirty: false,
        isValid: false
      },
      calories: {
        value: null,
        isDirty: false,
        isValid: false
      },
      fats: {
        value: null,
        isDirty: false,
        isValid: false
      },
      carbs: {
        value: null,
        isDirty: false,
        isValid: false
      },
      proteins: {
        value: null,
        isDirty: false,
        isValid: false
      }
    }
  },
  computed: {
    checkForms() {
      return (this.calories.isValid && this.fats.isValid && this.carbs.isValid && this.proteins.isValid && this.title);
    },
  },
  methods: {
    ...mapActions(useProductsStore, {
      addProduct: 'addProduct'
    }),
    onClickAddProduct() {
      this.addProduct({
        name: this.title,
        calories: this.calories.value,
        fats: this.fats.value,
        carbs: this.carbs.value,
        proteins: this.proteins.value
      });
    },
    onInputForm(type, e) {
      const pattern = /^[0-9]+$/;
      switch (type) {
        case 'calories':
          this.calories.value = e.target.value;
          this.calories.isValid = pattern.test(this.calories.value) && (this.calories.value > 0);
          this.calories.isDirty = true;
          break;
        case 'fats':
          this.fats.value = e.target.value;
          this.fats.isValid = pattern.test(this.fats.value) && (this.fats.value > 0);
          this.fats.isDirty = true;
          break;
        case 'carbs':
          this.carbs.value = e.target.value;
          this.carbs.isValid = pattern.test(this.carbs.value) && (this.carbs.value > 0);
          this.carbs.isDirty = true;
          break;
        case 'proteins':
          this.proteins.value = e.target.value;
          this.proteins.isValid = pattern.test(this.proteins.value) && (this.proteins.value > 0);
          this.proteins.isDirty = true;
          break;
      }
    },
    getIconClass(type) {
      switch (type) {
        case 'calories':
          return this.calories.isValid ? 'bi-check-circle text-success' : 'bi-exclamation-circle text-danger';
        case 'fats':
          return this.fats.isValid ? 'bi-check-circle text-success' : 'bi-exclamation-circle text-danger';
        case 'carbs':
          return this.carbs.isValid ? 'bi-check-circle text-success' : 'bi-exclamation-circle text-danger';
        case 'proteins':
          return this.proteins.isValid ? 'bi-check-circle text-success' : 'bi-exclamation-circle text-danger';
      }
    },
  }
}
</script>

<style scoped>
i {
  font-size: 1em;
  margin-left: 0.5em;
}

.input-group {
  width: 20em;
}
</style>
