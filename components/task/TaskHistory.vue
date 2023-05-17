<template>
  <div class="d-inline-flex align-center flex-wrap my-025 task-history position-relative" id="task-history-wrapper">
    <figure class="user-avatar">
      <bib-avatar :src="user.Photo" size="2rem" ></bib-avatar>
    </figure>
    <div id="task-history-titles-wrapper">
      <span class="font-w-600" id="th-username">{{user.Name}}</span>
      <span class="mx-05 " id="th-historytext">{{history.text}}</span>
      <span class="text-gray6 " id="th-historyupdatedat">{{$displayDate(history.updatedAt)}}</span>
    </div>
  </div>
</template>

<script>
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
      user: this.$userInfo(this.history.userId)
    }
  },
}

</script>
<style lang="scss" scoped>
.task-history { font-size: $base-size; color: $text; padding-left: 3rem; min-height: 2rem; }
.user-avatar {
  position: absolute;
  z-index: 2;
  left: 0;
  top: 0.125rem;

}

</style>
