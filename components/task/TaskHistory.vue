<template>
  <div class="d-inline-flex align-center flex-wrap my-025 task-history position-relative" id="task-history-wrapper">
    <!-- <figure class="user-avatar">
      <bib-avatar :src="user.Photo" size="2rem" ></bib-avatar>
    </figure> -->
    <div id="task-history-titles-wrapper">
      <span class="font-w-500" id="th-username">{{$userInfo(history.userId).Name}}</span>
      <span class="mx-05 text-secondary font-sm" id="th-historytext">{{history.text}}</span>
      <span class="text-gray4 font-sm" id="th-historyupdatedat">{{$displayDate(history.updatedAt)}}</span>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'
import { mapGetters } from "vuex"

var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

export default {

  name: 'TaskHistory',
  props: {
    history: Object,
  },
  computed: {
    ...mapGetters({
      teamMembers: "user/getTeamMembers",
    }),
  },
  data: function() {
    return {
      user:""
    };
  },

}

</script>
<style lang="scss" scoped>
.task-history { font-size: $base-size; color: $text; /*min-height: 1.5rem;*/ }
/*.user-avatar {
  position: absolute;
  z-index: 2;
  left: 0;
  top: 0.125rem;

}*/

</style>
