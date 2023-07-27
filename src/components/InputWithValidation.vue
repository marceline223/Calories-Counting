<template>
  <div class="my-4">
    <h6 class="heading-with-margin">
      {{ title }}
      <i
          v-if="isDirty"
          class="small-icon bi"
          :class="iconClass"
      />
    </h6>
    <div class="input-group small-input-group mb-3">
      <input
          :value="newValue"
          type="text"
          class="form-control"
          @input="onInput($event)"
      >
      <span
          v-if="unit"
          class="input-group-text"
      >
        {{ unit }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "InputWithValidation",
  props: {
    inputValue: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null
    },
    unit: {
      type: String,
      default: null
    },
    pattern: {
      type: Object,
      default: new RegExp(/^[0-9]+$/)
    },
    minValue: {
      type: Number,
      default: null
    },
    maxValue: {
      type: Number,
      default: null
    }
  },
emits: ['inputForm', 'checkForm'],
  data() {
    return {
      newValue: this.inputValue,
      isDirty: false
    }
  },
  computed: {
    isValid() {
      return this.pattern.test(this.newValue) &&
          (this.minValue ? this.newValue >= this.minValue : true) &&
          (this.maxValue ? this.newValue <= this.maxValue : true);
    },
    iconClass() {
      return this.isValid ? 'bi-check-circle text-success' : 'bi-exclamation-circle text-danger';
    }
  },
  beforeMount() {
    this.$emit('checkForm', {
      isValid: this.isValid
    });
  },
  methods: {
    onInput(e) {
      this.isDirty = true;
      this.newValue = e.target.value;

      this.$emit('checkForm', {
        isValid: this.isValid
      });
      this.$emit('inputForm', {
        inputValue: this.newValue
      });
    }
  }
}
</script>
