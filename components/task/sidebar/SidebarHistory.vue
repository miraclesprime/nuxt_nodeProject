<template>
  <div id="sh-container" class="px-1 py-05 h-100 position-relative">
    <template v-if="taskHistory.length > 0">
      <div v-for="hist in taskHistory" class="history">
        <figure class=" flex-shrink-0 flex-grow-0">
          <bib-avatar size="2.175rem" :src="$userInfo(hist.userId).Photo"></bib-avatar>
        </figure>
        <div class="content">
          <div class="info">
            <span class="name">{{ $userInfo(hist.userId).FirstName }} {{ $userInfo(hist.userId).LastName }}</span>
            <!-- <span class="name">{{ hist.userId }} </span> -->
            <span class="time">{{ displayDate(hist.updatedAt) }}</span>
          </div>
          <div class="history-text">{{ hist.text }}</div>
          <!-- {{$userInfo(hist.user.id)}} -->
        </div>
      </div>
    </template>
    <div v-else>No history</div>
    <loading :loading="loading"></loading>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { userInfo } from '@/utils/userInfo.client'
import dayjs from 'dayjs'
export default {
  props: {
    groupName: {
      type: String,
      default () {
        return "history";
      },
    },
  },
  data: function() {
    return {
      history: [],
      loading: false,
      /*taskSections: [
        {
          key: 1,
          time: "8:00",
          content: "Action",
        },
        {
          key: 2,
          time: "8:00",
          content: "Action",
        },
        {
          key: 3,
          time: "8:00",
          content: "Action",
        },
      ],
      taskFields: [
        {
          key: "time",
          label: "Time",
        },
        {
          key: "content",
          label: "Task Content",
        },
      ],*/
      flag: false,
    };
  },
  computed: {
    ...mapGetters({
      task: "task/getSelectedTask",
      taskHistory: "task/getTaskHistory",
    })
  },
  watch: {
    task(newValue, oldValue) {
      if (newValue != oldValue) {
        this.fetchHistory()
      }
    }
  },
  mounted() {
    this.fetchHistory()
  },
  methods: {
    fetchHistory() {
      this.loading = true
      this.$store.dispatch("task/fetchHistory", this.task)
        .then(h => {
          // console.log(h)
          // this.history = h
          this.loading = false
        })
        .catch(e => {
          console.error(e)
          this.loading = false

        })
    },
    displayDate(date) {
      // let d = new Date(date)
      let dd = dayjs(date).format('dddd, D MMM, YYYY @ HH:mm')
      // return d.toDateString()
      return dd
    },
  },
};

</script>
<style lang="scss" scoped>
.history {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-top: 12px;
  margin-bottom: 8px;
  padding-top: 12px;
  border-top: 1px solid rgba(29, 29, 32, 0.12);
  gap: 10px;

  &:first-child {
    border-top: 0 none;
    padding-top: 0;
  }
}

.name {
  font-size: 0.9rem;
  font-weight: 500;
  color: $text;
}

.time {
  font-size: 0.8rem;
  color: $gray5;
  margin-left: 10px;
}

.content {
  font-size: 0.85rem;
  line-height: 1.5;
  color: $gray6;
}

.history-text {
  color: $gray6;

  a {
    color: $primary;
    text-decoration: underline;
  }
}

</style>
