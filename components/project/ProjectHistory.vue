<template>
  <div class="position-relative p-1 of-scroll-y">
    <div v-for="hist in history" class="history">
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
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { userInfo } from '@/utils/userInfo.client'
import dayjs from 'dayjs'
export default {

  name: 'ProjectHistory',

  data() {
    return {

      history: [{
          updatedAt: '2022-09-02T05:48:02.000Z',
          user: {
            id: "DKgl9av2NwnaG1vz",
            firstName: "Vishwajeet",
            lastName: "Mandal",
            email: "vishwajeet.mandal@qsstechnosoft.com"
          },
        },
        {
          updatedAt: '2022-09-02T05:48:02.000Z',
          user: {
            id: "k61YQdJ6J7ldOGpJ",
            firstName: "Dhruv",
            lastName: "Sharma",
            email: "dhruv.sharma@qsstechnosoft.com"
          },
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      user: "user/getUser2",
      members: 'user/getTeamMembers',
      project: "project/getSingleProject",
    }),
    
    /*userInfo() {
      if (this.members.length) {
        let u = this.members.find((el) => el.id == this.msg.userId)
        // console.log(u)
        return { id: u.id, name: u.firstName + ' ' + u.lastName, email: u.email, pic: u.avatar, jobTitle: "Title/Company Name" }
      }
    },*/
  },
  mounted() {
    this.$store.dispatch("project/fetchHistory", this.project)
      .then(h => {
        // console.log(h)
        this.history = h
      })
      .catch(e => console.error(e))
  },
  methods: {
    displayDate(date) {
      // let d = new Date(date)
      let dd = dayjs(date).format('dddd, D MMM, YYYY @ HH:mm')
      // return d.toDateString()
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
  border-top: 1px solid rgba(29, 29, 32, 0.12);
  gap: 10px;
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
