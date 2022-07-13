<template>
  <client-only>
    <div>
    <goal-overview-actions />
    <div id="goal-overview-wrapper" class="row mt-4">
      <div id="goal-overview-inner" class="overview-wrapper my-2 mx-auto position-relative">
        <div id="goal-row2" class="row">

          <div id="goal-row2-col1" class="col-8">
            <bib-input type="text" label="Goal name" placeholder="goal name" v-model="activegoal.title" v-on:keyup.native="debounceUpdate()"></bib-input>
          </div>
          <div id="goal-row2-col2" class="col-4">
            <bib-input type="date" label="Due date" v-model="dateInput" v-on:change.native="debounceUpdate()"></bib-input>
          </div>
        </div>
        <div id="goal-row3" class="row">
          <div id="goal-row3-col1" class="col-6">
            <bib-select label="Owner" test_id="go-owner-dd1" :options="filterUser" v-model="activegoal.userId" v-on:change="debounceUpdate()"></bib-select>
          </div>
          <div id="goal-row3-col2" class="col-6">
            <bib-input type="select" label="Department" :options="department" placeholder="Department"></bib-input>
          </div>
        </div>
        <div id="goal-row4" class="row">
          <div id="goal-row4-col1" class="col-6">
            <bib-input type="select" label="Priority" v-model.number="activegoal.priorityId" :options="priority" placeholder="Please select..." v-on:change.native="debounceUpdate()"></bib-input>
          </div>
          <div id="goal-row4-col2" class="col-6">
            <bib-input type="select" label="Status" v-model.number="activegoal.statusId" :options="status" placeholder="Please select..." v-on:change.native="debounceUpdate()"></bib-input>
          </div>
        </div>
        <div id="goal-row5" class="row">
          <div id="goal-row5-col1" class="col-4">
            <label class="text-gray6">Time</label>
            <div class="shape-rounded border-gray4 my-05 p-05">Hours </div>
            <!-- <bib-input type="time" v-model="time" placeholder="Select your time" label="Time"></bib-input> -->
          </div>
          <div id="goal-row5-col2" class="col-4">
            <bib-input type="number" icon-left="currency-dollar" v-model="activegoal.budget" placeholder="Set your Budget" label="Budget" v-on:keyup.native="debounceUpdate()"></bib-input>
          </div>
          <div id="goal-row5-col3" class="col-4">
            <label class="text-gray6">Progress</label>
            <div class="shape-rounded border-gray4 my-05 p-05">%</div>
            <!-- <bib-input type="text" :value="progress + '%'" placeholder="Select your progress" label="Progress" disabled></bib-input> -->
          </div>
        </div>
        <div id="goal-row6" class="row">
          <div id="goal-row6-col1" class="col-12">
            <bib-input type="textarea" label="Goal brief" v-model="activegoal.description" placeholder="Goal brief" v-on:keyup.native="debounceUpdate()"></bib-input>
          </div>
        </div>
        <loading :loading="loading"></loading>
      </div>
    </div>
  </div>
  </client-only>
</template>

<script>
import _ from 'lodash'
import {mapGetters} from 'vuex';
import { DEPARTMENT, STATUS, PRIORITY } from '~/config/constants.js'

export default {
  data() {
    return {
      goal: {},
      activegoal: {},
      department: DEPARTMENT,
      status: STATUS,
      priority: PRIORITY,
      loading: false,
      owner: {}
    }
  },

  watch: {
    goal() {
      if (Object.keys(this.goal).length) {
        this.activegoal = JSON.parse(JSON.stringify(this.goal));
        this.owner = this.teamMembers.filter(tm => tm.id == this.activegoal.userId)

      } else {
        this.activegoal = {
          title: "",
          dueDate: "",
          priorityId: null,
          statusId: null,
          // time: "",
          budget: 0,
          // progress: 0
          user: {},
          userId: "",
          description: "",
        }

      }
    },
  },

  computed: {
    ...mapGetters({
      teamMembers: "user/getTeamMembers"
    }),

    progress() {
      // if (this.totalTasks.length < 1) {
      //   return 0
      // } else {
      //   let done = this.totalTasks.filter(t => t.statusId == 5)
      //   // console.log(done.length, this.totalTasks.length)
      //   return Math.round((done.length / this.totalTasks.length) * 100)
      // }
    },

    filterUser() {
      return this.teamMembers.map((u) => {
        return { value: u.id, id: u.id, label: u.firstName + ' ' + u.lastName, firstName: u.firstName, lastName: u.lastName, email: u.email, img: u.avatar }
      })
    },

    dateInput: {
      get: function() {
        let nd
        if (!this.activegoal.dueDate) {
          nd = new Date()
        } else {
          nd = new Date(this.activegoal.dueDate)
        }
        let mm = (nd.getMonth() + 1) < 10 ? '0' + (nd.getMonth() + 1) : nd.getMonth() + 1
        let dd = (nd.getDate()) < 10 ? '0' + (nd.getDate()) : nd.getDate()
        return `${nd.getFullYear()}-${mm}-${dd}`
      },
      set: function(newValue) {
        this.activegoal.dueDate = new Date(newValue)
      }
    },

    time() {
      if (this.activegoal.dueDate) {
        let diff = new Date(this.activegoal.dueDate) - new Date();
        let diffDays = Math.floor(diff / 864e5); // days
        let diffHrs = Math.floor((diff % 864e5) / 36e5); // hours
        let diffMins = Math.round(((diff % 864e5) % 36e5) / 6e4); // minutes
        let totalHrs = (diffDays * 24) + diffHrs
        return `${totalHrs}:${diffMins}`
      } else {
        return "00:00"
      }
    },
  },

  methods: {
    
    async updateGoal() {
      // console.log('from debounce function')
      this.loading = true
      let g = await this.$axios.$put("/goal", { id: this.goal.id, user: this.owner[0], data: this.activegoal }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      })
      // console.log(proj.data)
      if (g.statusCode == 200) {
        this.goal = g.data.data;
        this.$store.dispatch("goals/setSingleGoal", g.data.data)
        // this.$axios.$get(`goal/${this.$route.params.id}`, {
        //   headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        // }).then((res) => {
        //   if (res) {
        //     this.goal = res.data;
        //     this.loading = false
        //   }
        // }).catch(err => {
        //   console.log(err);
        // })
      }
      this.loading = false
    },
    debounceUpdate: _.debounce(function() {
      // console.log('Debounce clicked!', this.activegoal.userId)
      this.owner = this.teamMembers.filter(tm => tm.id == this.activegoal.userId)
      if (this.activegoal.priorityId == "") {
        this.activegoal.priority = null
        this.activegoal.priorityId = null
      }
      if (this.activegoal.statusId == "") {
        this.activegoal.status = null
        this.activegoal.statusId = null
      }
      this.updateGoal()
    }, 1000)
  },

  mounted() {
    if (process.client) {
      this.loading = true
      this.$axios.$get(`goal/${this.$route.params.id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      }).then((res) => {
        if (res) {
          this.goal = res.data;
          this.loading = false
        }
      }).catch(err => {
        console.log(err);
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.overview-wrapper {
  width: $overview-width;
}

@media screen and (max-width:1600px) {
  .overview-wrapper {
    max-width: $overview-width - 160px;
    width: 60%;
  }
}

#goal-overview-alert {
  a {
    text-decoration: underline;
  }
}

::v-deep {
  .input--select.input--select--collapsed {
    margin: 0.5em 0 !important;
    border-color: var(--bib-gray4);
  }
}
</style>