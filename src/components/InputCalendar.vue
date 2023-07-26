<template>
  <div class="input-group col">
        <span
            v-if="prefix"
            class="input-group-text"
        >
          {{ prefix }}
        </span>
    <input
        id="calendar"
        type="date"
        class="form-control"
        :value="getDateForCalendar(value)"
        :min="getDateForCalendar(minValue)"
        :max="getDateForCalendar(maxValue)"
        @input="onInputDate($event)"
    >
  </div>
</template>

<script>
import moment from "moment/moment.js";

export default {
  name: "InputCalendar",
  props: {
    prefix: {
      type: String,
      default: null
    },
    value: {
      type: Object,
      default: null
    },
    minValue: {
      type: Object,
      default: null
    },
    maxValue: {
      type: Object,
      default: null
    }
  },
  emits: ['inputDate'],
  methods: {
    getDateForCalendar(dateObj) {
      return moment(dateObj).format('YYYY-MM-DD');
    },
    onInputDate(e) {
      this.$emit('inputDate', {
        date: moment.utc(e.target.value)
      })
    }
  }
}
</script>

<style scoped>

</style>
