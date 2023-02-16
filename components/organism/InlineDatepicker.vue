<template>
  <client-only>
    <div >
      <div v-if="localDate" class="align-center gap-05 ml-auto" @click.stop="triggerDatePicker">
        <bib-icon icon="calendar" :variant="newOverdue ? 'gray5' : 'danger'" class="events-none"></bib-icon>
        <format-date :datetime="localDate" :variant="newOverdue ? 'gray5' : 'danger'" class="events-none"></format-date>
      </div>
      <div v-else class="date-info-blank date-info shape-circle align-center justify-center ml-auto" @click.stop="triggerDatePicker">
        <bib-icon icon="calendar" variant="gray4" class="events-none"></bib-icon> <span v-format-date="localDate"></span>
      </div>
      <!-- date picker -->
      <tippy :visible="datePickerOpen" appendTo="parent" theme="light-border p-0" :animate-fill="false" arrow="false" distance="1" trigger="manual" interactive="true" :onHide="() => defer(() => datePickerOpen = false)">
        <datepicker :value="localDate" v-model="localDate" :inline="true" @input="datePicked" @click.native.stop placeholder="Due date"></datepicker>
      </tippy>
    </div>
  </client-only>
</template>
<script>
import tippy from 'tippy.js';
import VueTippy, { TippyComponent } from 'vue-tippy';
import dayjs from 'dayjs'
import _ from 'lodash'
export default {

  name: 'InlineDatepicker',
  components: {
    tippy: TippyComponent,
  },
  props: {
    datetime: [Date, String],
    overdue: Boolean,
  },

  data() {
    return {
      datePickerOpen: false,
      localDate: null,
    }
  },

  computed: {
    newOverdue() {
      return (new Date(this.localDate) < new Date()) ? false : true
    },
  },
  mounted() {
    this.localDate = _.clone(this.datetime)
  },
  methods: {
    defer(func) {
      // console.warn('defer function')
      setTimeout(func, 0);
    },
    triggerDatePicker() {
      this.datePickerOpen = !this.datePickerOpen
    },
    datePicked() {
      // console.log('input', this.localDate)
      this.datePickerOpen = false
      this.$emit("date-updated", this.localDate)
    },

  }
}

</script>
<style lang="scss" scoped>
.date-info-blank {
  width: 1.5rem;
  height: 1.5rem;
  border: 1px dashed $gray4;
}

</style>
