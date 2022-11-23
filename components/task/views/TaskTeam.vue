<template>
  <div id="task-team-wrapper" class="task-group w-100">
    <!-- <project-team-action ></project-team-action> -->
    <label id="create-team-modal-heading" class="text-gray6 font-md">Invite people </label>
    <bib-button test_id="teamlist-dd1" dropdown1="add1" label="Type name or email" v-model="member" v-on:input-keydown="teamInputKeydown" class="mt-05 mb-05">
      <template v-slot:menu>
        <ul id="atm-fields" class="border-gray1" style="border-radius: 0 !important; border: 1px solid var(--bib-gray1);">
          <li :id="'atm-field-'+index" v-for="(tm, index) in filterTeam" :key="'atm-items'+index" v-on:click="teamItemClick(tm)">
            <bib-avatar :src="tm.avatar" size="1.5rem"></bib-avatar>
            <span :id="'atm-person-name'+index" class="ml-05"> {{tm.label}} <span class="ml-075">{{tm.email}}</span></span>
          </li>
        </ul>
      </template>
    </bib-button>
    <div id="task-team-members" class="py-025">
      <template v-for="t in team">
        <email-chip :key="t.id" :email="t.email" :name="t.label" :avatar="t.avatar" class="mt-05" :close="true" v-on:remove-email="removeMember(t)"></email-chip>
      </template>
      <small v-show="team.length == 0" class="text-danger">Select at least 1 team member.</small>
      <p v-if="message" v-text="message" class="font-sm mt-025 text-orange"></p>
    </div>
    <div v-show="team.length > 0" class="pt-05 pb-1">
      <bib-button label="Add" variant="primary" pill @click="addTeamMember"></bib-button>
    </div>
    <label class="text-gray6 font-md">Team</label>
    <template v-if="taskMembers.length">
      <bib-table :key="'tt-' + key" :fields="tableFields" class="border-top-gray3 bg-white" :sections="taskMembers" :hide-no-column="true" headless>
        <template #cell(name)="data">
          <div class="d-flex gap-05">
            <bib-avatar class="mt-auto mb-auto" size="1.5rem">
            </bib-avatar>
            <span class="text-dark">
              {{ data.value.name }} <span v-if="data.value.isOwner">(Owner)</span>
            </span>
          </div>
        </template>
        <template #cell_action="data">
          <div v-if="!data.value.isOwner" class="cursor-pointer shape-circle" v-on:click="deleteMember(data.value)">
            <bib-icon icon="trash-solid" variant="gray5"></bib-icon>
          </div>
        </template>
      </bib-table>
    </template>
    <template v-if="norecord">
      <span id="projects-0" class="d-inline-flex gap-1 align-center m-1 bg-warning-sub3 border-warning shape-rounded py-05 px-1">
        <bib-icon icon="warning"></bib-icon> No records found
      </span>
    </template>
    <loading :loading="loading"></loading>
  </div>
</template>

<script>
import { PROJECT_TEAM_FIELDS } from "../../../config/constants";
import { mapGetters } from 'vuex';

export default {
  data: function() {
    return {
      member: "",
      team: [],
      filterKey: "",
      message: "",
      tableFields: PROJECT_TEAM_FIELDS,
      flag: false,
      key: 0,
      loading: false,
      norecord: false
    };
  },

  watch: {
    taskMembers() {
      if (this.taskMembers.length == 0) {
        this.loading = false
        this.norecord = true
      } else {
        this.norecord = false
        this.loading = false
      }
    }
  },

  computed: {
    ...mapGetters({
      task: "task/getSelectedTask",
      taskMembers: 'task/getTaskMembers',
      teamMembers: "user/getTeamMembers",
    }),

    filterTeam() {
      let regex = new RegExp(this.filterKey, 'g\i')
      return this.teamMembers.filter((u) => {
        if (regex.test(u.label) || regex.test(u.email)) {
          return u
        }
      })
    },
  },

  mounted() {
    this.loading = true
    console.log(this.task.id)
    this.$store.dispatch('task/fetchTeamMember', { id: this.task.id })
  },

  created() {
    this.$root.$on('update-key', ($event) => {
      this.$store.dispatch('task/fetchTeamMember', { id: this.task.id }).then(() => {
        this.key += $event
      })
    })
  },
  methods: {
    teamInputKeydown($event) {
      // console.log('dropdown input keydown', $event)
      this.filterKey = $event
    },
    teamItemClick(tm) {
      // console.log(tm)
      let existing = this.taskMembers.filter(ex => ex.id == tm.id)
      // console.log(existing)
      if (existing.length == 0) {
        this.message = ""
        let m = this.teamMembers.filter(t => t.id == tm.id)
        // console.log(m[0])
        if (this.team.some(el => el.id == m[0].id)) {
          return false
        }
        this.team.push(m[0])
      } else {
        this.message = "User already exists"
      }
    },
    removeMember(tm) {
      // console.log(tm)
      // let rm = this.team.filter(t=>t.id == tm.id)
      let rm = this.team.map(t => t.id == tm.id)
      console.log(rm.indexOf(true))
      this.team.splice(rm.indexOf(true), 1)
    },
    addTeamMember() {
      this.loading = true

      if (this.team.length == 0) {
        this.loading = false
        return false
      } else {
        let teamtext = this.team.map(t => {
          return t.label
        })
        // console.log(teamtext.join(', '));
        this.$store.dispatch('task/addMember', { taskId: this.task.id, team: this.team, text: `added ${teamtext.join(', ')} to task` }).then(() => {
          // this.$nuxt.$emit('update-key', 1)
          // this.showTeamCreateModal = false
          this.loading = false;
          this.message = ""
          this.team = []
        }).catch((err) => {
          this.loading = false;
          // this.showTeamCreateModal = false
          this.message = ""
          this.team = []
          console.log(err)
        })
      }
    },
    async deleteMember(member) {
      // console.log(member)
      this.loading = true
      let confirmDelete = window.confirm("Are you sure want to delete " + member.name + "!")
      if (confirmDelete) {
        await this.$store.dispatch("task/deleteMember", { taskId: this.task.id, member: member })
          .then((res) => {
            // console.log(res)
            this.key += 1
            // alert(res)
          })
          .catch(e => console.log(e))
        this.loading = false
      }
    },
  }
};

</script>
<style scoped lang="scss">
/*.task-group {
  margin-bottom: 3rem;
}*/

</style>
