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
            <!-- <bib-input type="select" :options="filterUser" v-model="activegoal.userId" placeholder="Please select..." label="Owner" v-on:change.native="debounceUpdate()" ></bib-input> -->
            <bib-select label="Owner" test_id="po-owner-dd1" :options="filterUser" v-model="activegoal.userId" v-on:change="debounceUpdate()"></bib-select>
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
            <bib-input type="textarea" label="Goal brief" v-model="activegoal.description" placeholder="goal brief" v-on:keyup.native="debounceUpdate()"></bib-input>
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
import GoalOverviewActions from '../GoalOverviewActions.vue';

export default {
  components: { GoalOverviewActions },
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
    })
  },

  methods: {
    debounceUpdate() {
      
    }
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