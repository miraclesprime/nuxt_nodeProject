<template>
  <div class="position-relative " id="proj-history-wrapper">
    <div v-if="history.length == 0" class="placeholder mb-1 d-flex gap-05"  id="proj-history-inner-wrap">
      <div class="left"  id="proj-history-left">
        <div class="shape-circle width-205 height-205 animated-background"  id="proj-history-shape-circle"></div>
      </div>
      <div class="right"  id="proj-history-right">
        <div class="animated-background width-4"  id="proj-history-animated-bg-w4"></div>
        <div class="animated-background width-5 mt-05" id="proj-history-animated-bg-w10"></div>
      </div>
    </div>
    <template v-else>
      <div v-for="(hist, index) in history" class="history"  :id="'proj-history-hist-'+index" :key="index">
        <figure class=" flex-shrink-0 flex-grow-0">
          <bib-avatar size="2.175rem" :src="$userInfo(hist.userId).Photo"></bib-avatar>
        </figure>
        <div class="content"  id="proj-history-content">
          <div class="info" id="proj-history-info">
            <span class="name" id="proj-history-name">{{ $userInfo(hist.userId).FirstName }} {{ $userInfo(hist.userId).LastName }}</span>
            <span class="time" id="proj-history-time">{{ displayDate(hist.updatedAt) }}</span>
          </div>
          <div class="history-text"  id="proj-history-text">{{ hist.text }}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
export default {

  name: 'ProjectHistory',

  data() {
    return {
      showPlaceholder: true,
      history: []
    }
  },
  computed: {
    ...mapGetters({
      user: "user/getUser2",
      members: 'user/getTeamMembers',
      project: "project/getSingleProject",
    }),
  },
  mounted() {
    this.$store.dispatch("project/fetchHistory", this.project)
      .then(h => {
        this.history = h
      })
      .catch(e => console.error(e))
  },
  methods: {
    displayDate(date) {
      let dd = dayjs(date).format('dddd, D MMM, YYYY @ HH:mm')
      return dd
    },
  }
}

</script>
<style lang="scss" scoped>
.history {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-top: 12px;
  margin-bottom: 8px;
  padding-top: 12px;
  border-top: 1px solid $light;
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
