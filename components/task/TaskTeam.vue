<template>
  <div id="task-team-wrapper" class="task-group position-relative w-100">
    <div class="bg-light p-1 shape-rounded">
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
      <p v-if="message" v-text="message" class="font-sm mt-025 text-danger"></p>
    </div>
     </div>
      <div class="bg-light p-1 mt-05 shape-rounded">
    <label class="text-gray6 font-md">Team</label>
    <template v-if="taskMembers.length && mode == 'task'">
      <bib-table :key="'tt-' + key" :fields="tableFields" class="border-top-gray3 bg-white" :sections="taskMembers" :hide-no-column="true" headless>
        <template #cell(name)="data">
          <div class="d-flex gap-05">
            <bib-avatar :src="data.value.avatar" class="mt-auto mb-auto" size="1.5rem"></bib-avatar>
            <!-- <bib-avatar class="mt-auto mb-auto" size="1.5rem"> -->
            <!-- </bib-avatar> -->
              <strong class="text-dark px-030 font-sm" >{{ data.value.name }}</strong>
              <span class=" text-black px-030 font-sm">{{ data.value.email }}</span>
              <span class=" text-secondary px-030 font-sm" v-if="data.value.isOwner">(Owner)</span>
          </div>
        </template>
        <template #cell_action="data">
          <div class="cursor-pointer shape-circle" v-on:click="deleteMember(data.value)">
            <bib-icon icon="trash-solid" variant="gray5"></bib-icon>
          </div>
        </template>
      </bib-table>
      <!-- <div v-show="this.newTeam.length >0 " class="border-top-success" ></div> -->
       <!-- <bib-table :key="'ttt-' + key" :fields="tableFields" class="border-top-gray3 bg-white" :sections="this.teamMembers.filter(item=>this.newTeam.some(value=>value.id===item.id))" :hide-no-column="true" headless>
        <template #cell(name)="data">
          <div class="d-flex gap-05">
            <bib-avatar :src="data.value.avatar" class="mt-auto mb-auto" size="1.5rem"></bib-avatar>

               <strong class="text-dark px-030 font-sm" >{{ data.value.label }}</strong>
              <span class=" text-black px-030 font-sm">{{ data.value.email }}</span>
          </div>
        </template>
        <template #cell_action="data">
          <div v-if="!data.value.isOwner" class="cursor-pointer shape-circle" v-on:click="deleteMember(data.value)">
            <bib-icon icon="trash-solid" variant="gray5"></bib-icon>
          </div>
        </template>
      </bib-table> -->
    </template>
    <template v-else>
      <bib-table :key="'st-' + key" :fields="tableFields" class="border-top-gray3 bg-white" :sections="subtaskMembers" :hide-no-column="true" headless>
        <template #cell(name)="data">
          <div class="d-flex gap-05">
            <bib-avatar :src="data.value.avatar" class="mt-auto mb-auto" size="1.5rem"></bib-avatar>
            <!-- <bib-avatar class="mt-auto mb-auto" size="1.5rem"> -->
            <!-- </bib-avatar> -->
              <strong class="text-dark px-030 font-sm" >{{ data.value.name }}</strong>
              <span class=" text-black px-030 font-sm">{{ data.value.email }}</span>
              <span class=" text-secondary px-030 font-sm" v-if="data.value.isOwner">(Owner)</span>
          </div>
        </template>
        <template #cell_action="data">
          <div class="cursor-pointer shape-circle" v-on:click="deleteMember(data.value)">
            <bib-icon icon="trash-solid" variant="gray5"></bib-icon>
          </div>
        </template>
      </bib-table>
    </template>
    <template v-if="norecord">
      <span id="projects-0" class="d-inline-flex gap-05 align-center text-gray5 font-md">
         No Team Members
      </span>
    </template>
      </div>
    <div v-show="team.length > 0" class="pt-05 pb-1 justify-end">
      <bib-button label="Add" variant="primary-24" pill @click="addTeamMember"></bib-button>
    </div>
    <loading :loading="loading"></loading>
  </div>
</template>

<script>
import { PROJECT_TEAM_FIELDS } from "~/config/constants";
import { mapGetters } from 'vuex';

export default {
  props: {
    task: Object,
    mode: { type: String, default: "task" },
  },
  data: function() {
    return {
      member: "",
      team: [],
      newTeam:[],//updated by @wen 5.25
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
      if (this.mode == "task") {
        if (this.taskMembers.length == 0) {
          this.loading = false
          this.norecord = true
        } else {
          this.norecord = false
          this.loading = false
        }
      }
    },
    subtaskMembers() {
      if (this.mode == "subtask") {
        if (this.subtaskMembers.length == 0) {
          this.loading = false
          this.norecord = true
        } else {
          this.norecord = false
          this.loading = false
        }
      }
    },
  },

  computed: {
    ...mapGetters({
      taskMembers: 'task/getTaskMembers',
      teamMembers: "user/getTeamMembers",
      subtaskMembers: 'subtask/getSubtaskMembers',
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
    if (this.mode == "task") {
      this.$store.dispatch('task/fetchTeamMember', { id: this.task.id, userId: this.task.userId })
    }
    if (this.mode == "subtask") {
      this.$store.dispatch("subtask/fetchSubtaskMembers", { id: this.task.id, userId: this.task.userId })
    }
  },

  created() {
    this.$root.$on('update-key', ($event) => {
      if (this.mode == "task") {
        this.$store.dispatch('task/fetchTeamMember', { id: this.task.id, userId: this.task.userId }).then(() => this.key += $event)
      }
      if(this.mode == "subtask") {
        this.$store.dispatch("subtask/fetchSubtaskMembers", { id: this.task.id, userId: this.task.userId }).then(() => this.key += $event)
      }
    })
  },
  methods: {
    teamInputKeydown($event) {
      this.filterKey = $event
    },
    teamItemClick(tm) {
      let existing = this.taskMembers.filter(ex => ex.id == tm.id)
      if (existing.length == 0) {
        this.message = ""
        let m = this.teamMembers.filter(t => t.id == tm.id)
        if (this.team.some(el => el.id == m[0].id)) {
          return false
        }
        this.team.push(m[0])
      } else {
        this.message = "User already exists"
      }
    },
    removeMember(tm) {
      let rm = this.team.map(t => t.id == tm.id)
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
        //updated by @wen 5.25
      this.team.map((index)=>{
          let newObj={id:index.id,name:index.label}
          this.newTeam.push(newObj)
        })
        if (this.mode == "task") {
          this.$store.dispatch('task/addMember', { taskId: this.task.id, team: this.team, text: `added ${teamtext.join(', ')} to task` }).then(() => {
            this.loading = false;
            this.message = ""
            this.team = []
            this.$store.dispatch('task/fetchTeamMember', { id: this.task.id, userId: this.task.userId })
          }).catch((err) => {
            this.loading = false;
            this.message = ""
            this.team = []
            console.log(err)
          })
        }
        if(this.mode == "subtask") {
          this.$store.dispatch("subtask/addMembers", { id: this.task.id, team: this.team, text: `added ${teamtext.join(', ')} to subtask` })
          .then(() => {
            this.loading = false;
            this.message = ""
            this.team = []
            this.$store.dispatch("subtask/fetchSubtaskMembers", { id: this.task.id, userId: this.task.userId })
          })
          .catch((err) => {
            this.loading = false;
            this.message = ""
            this.team = []
            console.log(err)
          })
        }
      }
    },
    async deleteMember(member) {
      //updated by @wen 5.25
      this.newTeam = this.newTeam.filter((item)=>item.id!==member.id);
      this.loading = true
      if (this.mode == "task") {
        await this.$store.dispatch("task/deleteMember", { taskId: this.task.id, memberId: member.id, text: `${member.name} removed from task` })
          .then((res) => {
            this.$store.dispatch('task/fetchTeamMember', { id: this.task.id, userId: this.task.userId })
            this.key += 1
          })
          .catch(e => console.log(e))
        this.loading = false
      }
      if (this.mode == "subtask") {
        await this.$store.dispatch("subtask/deleteMember", { id: this.task.id, memberId: member.id, text: `${member.name} removed from subtask` })
          .then((res) => {
            this.$store.dispatch('subtask/fetchSubtaskMembers', { id: this.task.id, userId: this.task.userId })
            this.key += 1
          })
          .catch(e => console.log(e))
        this.loading = false
      }
    },
  }
};

</script>
<style scoped lang="scss">
</style>
