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

        <!-- название -->
        <div class="modal-body">
          <h5> {{ input.name.title }}</h5>
          <div class="input-group mb-3">
            <input
                v-model="input.name.value"
                type="text"
                class="form-control"
            >
          </div>
          <hr>
          <h5>На 100 грамм продукта:</h5>

          <!-- калории -->
          <input-with-validation
              :input-value="input.calories.value"
              :title="input.calories.title"
              :unit="input.calories.unit"
              :pattern="input.calories.pattern"
              :min-value="input.calories.minValue"
              :max-value="input.calories.maxValue"
              @input-form="onInputForm(input.calories, $event)"
              @check-form="onCheckForm(input.calories, $event)"
          />

          <!-- белки -->
          <input-with-validation
              :input-value="input.proteins.value"
              :title="input.proteins.title"
              :unit="input.proteins.unit"
              :pattern="input.proteins.pattern"
              :min-value="input.proteins.minValue"
              :max-value="input.proteins.maxValue"
              @input-form="onInputForm(input.proteins, $event)"
              @check-form="onCheckForm(input.proteins, $event)"
          />

          <!-- жиры -->
          <input-with-validation
              :input-value="input.fats.value"
              :title="input.fats.title"
              :unit="input.fats.unit"
              :pattern="input.fats.pattern"
              :min-value="input.fats.minValue"
              :max-value="input.fats.maxValue"
              @input-form="onInputForm(input.fats, $event)"
              @check-form="onCheckForm(input.fats, $event)"
          />

          <!-- углеводы -->
          <input-with-validation
              :input-value="input.carbs.value"
              :title="input.carbs.title"
              :unit="input.carbs.unit"
              :pattern="input.carbs.pattern"
              :min-value="input.carbs.minValue"
              :max-value="input.carbs.maxValue"
              @input-form="onInputForm(input.carbs, $event)"
              @check-form="onCheckForm(input.carbs, $event)"
          />
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
import InputWithValidation from "./InputWithValidation.vue";

export default {
  name: "AddProduct",
  components: {InputWithValidation},
  data() {
    return {
      input: {
        name: {
          title: 'Название',
          value: null
        },
        calories: {
          title: 'Энергетическая ценность',
          unit: 'кКал',
          value: null,
          pattern: /([0-9]*[.])?[0-9]+/,
          minValue: 0,
          maxValue: null,
          isValid: false
        },
        proteins: {
          title: 'Белки',
          unit: 'г',
          value: null,
          pattern: /([0-9]*[.])?[0-9]+/,
          minValue: 0,
          maxValue: null,
          isValid: false
        },
        fats: {
          title: 'Жиры',
          unit: 'г',
          value: null,
          pattern: /([0-9]*[.])?[0-9]+/,
          minValue: 0,
          maxValue: null,
          isValid: false
        },
        carbs: {
          title: 'Углеводы',
          unit: 'г',
          value: null,
          pattern: /([0-9]*[.])?[0-9]+/,
          minValue: 0,
          maxValue: null,
          isValid: false
        }
      }
    }
  },
  computed: {
    checkForms() {
      return (this.input.calories.isValid && this.input.fats.isValid &&
          this.input.carbs.isValid && this.input.proteins.isValid && this.input.name.value);
    },
  },
  methods: {
    ...mapActions(useProductsStore, {
      addProduct: 'addProduct'
    }),
    onInputForm(inputRef, e) {
      inputRef.value = e.inputValue;
    },
    onCheckForm(inputRef, e) {
      inputRef.isValid = e.isValid;
    },
    onClickAddProduct() {
      this.addProduct({
        name: this.input.name.value,
        calories: this.input.calories.value,
        fats: this.input.fats.value,
        carbs: this.input.carbs.value,
        proteins: this.input.proteins.value
      });
    }
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
