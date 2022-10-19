<template>
  <span :id="'date-' + Math.random().toString().slice(-3)" class="date-info text-truncate" :class="'text-'+variant">{{output}}</span>
</template>
<script>
export default {

  name: 'FormatDate',
  props: {
    datetime: { type: String },
    variant: String,
  },
  data() {
    return {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    }
  },
  computed: {
    output() {
      if (!this.datetime) {
        return ""
      }
      let d = new Date(this.datetime)
      let m = d.getMonth()
      return `${d.getDate()} ${this.months[m]} ${d.getFullYear()}`
    }
  },
}

</script>
<style lang="css" scoped>
</style>
