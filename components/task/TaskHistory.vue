<template>
  <div class="d-inline-block my-025 ml-5 font-sm">
    <span class="text-dark-sub1">{{$userInfo(history.userId).Name}}</span>
    <span class="mx-05 text-gray6">{{history.text}}</span>
    <span class="text-gray5 ">{{displayDate(history.updatedAt)}}</span>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import dayjs from 'dayjs'
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

export default {

  name: 'TaskHistory',
  props: {
    history: Object,
  },

  data() {
    return {

    }
  },
  methods: {
    displayDate(date) {      
      return dayjs(date).fromNow()
    },
  }
}

</script>
<style lang="scss" scoped>
</style>
