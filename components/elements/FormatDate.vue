<template>
  <span :id="'date-' + Math.random().toString().slice(-3)" class="text-dark text-truncate">{{output}}</span>
</template>
<script>
export default {

  name: 'FormatDate',
  props: {
    datetime: { type: String, required: true }
  },
  data() {
    return {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    }
  },
  computed: {
    output() {
      let d = new Date(this.datetime)
      let m = d.getMonth()
      return `${d.getDate()} ${this.months[m]} ${d.getFullYear()}`
    }
  },
}

</script>
<style lang="css" scoped>
</style>
