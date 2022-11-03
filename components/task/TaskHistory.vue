<template>
  <div class="d-inline-flex align-center flex-wrap my-025 task-history ">
    <user-info :userId="history.userId" avatarSize="2rem"  weight="600"></user-info>
    <!-- <bib-avatar :src="userInfo(history.userId).Photo"></bib-avatar>
    <span class="text-dark-sub1">{{$userInfo(history.userId).Name}}</span> -->
    <span class="mx-05 ">{{history.text}}</span>
    <span class="text-gray6 ">{{displayDate(history.updatedAt)}}</span>
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
.task-history { font-size: $base-size; color: $text; }
::v-root {
  .user-info-wrapper {
    .user-name { font-weight: 600;}
  }
}
</style>
