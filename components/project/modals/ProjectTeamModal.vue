<template>
  <div id="ptm-task-team-wrapper" class="task-group position-relative w-100">
    <div class="bg-light p-1 shape-rounded">
    <label id="ptm-create-team-modal-heading" class="text-gray6 font-md">Invite people </label>
    <bib-button test_id="teamlist-dd1" dropdown1="add1" label="Type name or email" v-model="member" v-on:input-keydown="teamInputKeydown" class="mt-05 mb-05">
      <template v-slot:menu>
        <ul id="ptm-atm-fields" class="border-gray1" style="border-radius: 0 !important; border: 1px solid var(--bib-gray1);">
          <li :id="'ptm-atm-field-'+index" v-for="(tm, index) in filterTeam" :key="'atm-items'+index" v-on:click="teamItemClick(tm)">
            <bib-avatar :src="tm.avatar" size="1.5rem"></bib-avatar>
            <span :id="'ptm-atm-person-name'+index" class="ml-05"> {{tm.label}} <span class="ml-075">{{tm.email}}</span></span>
          </li>
        </ul>
      </template>
    </bib-button>
    <div id="ptm-project-team-members" class="py-025">
      <template v-for="t in team">
        <email-chip :key="t.id" :email="t.email" :name="t.label" :avatar="t.avatar" class="mt-05" :close="true" v-on:remove-email="removeMember(t)"></email-chip>
      </template>
      <small v-show="team.length == 0" class="text-danger" id="ptm-team-length">Select at least 1 team member.</small>
      <p v-if="message" v-text="message" class="font-sm mt-025 text-orange" id="ptm-message"></p>
    </div>
  </div> 
  <div class="bg-light p-1 mt-05 shape-rounded">
  
    <label class="text-gray6 font-md" id="ptm-team-label">Team</label>
    <template v-if="projectMembers.length">
      <bib-table :key="'tt-' + key" :fields="tableFields" class="border-top-gray3 bg-white" :sections="this.teamMembers.filter(item=>this.projectMembers.some(value=>value.id===item.id)).filter(item1=>!this.newTeam.some(val=>val.id===item1.id))"  :hide-no-column="true" headless>
        <template #cell(name)="data">
          <div class="d-flex gap-05" id="ptm-owner-text">
            <bib-avatar :src="data.value.avatar" class="mt-auto mb-auto" size="1.5rem"></bib-avatar>
            <!-- <bib-avatar class="mt-auto mb-auto" size="1.5rem">
            </bib-avatar> -->
            <!-- <span class="text-dark" id="ptm-dark-owner">
              {{ data.value.name }} <span v-if="data.value.isOwner" id="ptm-owner-show">(Owner)</span>
            </span> -->
            <strong class="text-dark px-030 font-sm" >{{ data.value.label }}</strong>
              <span class=" text-black px-030 font-sm">{{ data.value.email }}</span>
          </div>
        </template>
        <template #cell_action="data">
          <div v-if="!data.value.isOwner" id="ptm-trash-solid" class="cursor-pointer shape-circle" v-on:click="deleteMember(data.value)">
            <bib-icon icon="trash-solid" variant="gray5"></bib-icon>
          </div>
        </template>
      </bib-table>
      <bib-table :key="'ttt-' + key" :fields="tableFields" class="border-top-gray3 bg-white" :sections="this.teamMembers.filter(item=>this.newTeam.some(value=>value.id===item.id))" :hide-no-column="true" headless>
        <template #cell(name)="data">
          <div class="d-flex gap-05" id="ptm-owner-text">
            <bib-avatar :src="data.value.avatar" class="mt-auto mb-auto" size="1.5rem"></bib-avatar>
            <!-- <bib-avatar class="mt-auto mb-auto" size="1.5rem">
            </bib-avatar> -->
            <!-- <span class="text-dark" id="ptm-dark-owner">
              {{ data.value.name }} <span v-if="data.value.isOwner" id="ptm-owner-show">(Owner)</span>
            </span> -->
            <strong class="text-dark px-030 font-sm" >{{ data.value.label }}</strong>
              <span class=" text-black px-030 font-sm">{{ data.value.email }}</span>
          </div>
        </template>
        <template #cell_action="data">
          <div v-if="!data.value.isOwner" id="ptm-trash-solid" class="cursor-pointer shape-circle" v-on:click="deleteMember(data.value)">
            <bib-icon icon="trash-solid" variant="gray5"></bib-icon>
          </div>
        </template>
      </bib-table>
    </template>
    <template v-if="norecord">
      <span id="ptm-projects-0" class="d-inline-flex gap-1 align-center m-1 bg-warning-sub3 border-warning shape-rounded py-05 px-1">
        <bib-icon icon="warning"></bib-icon> No records found
      </span>
    </template>
    </div>
    <div v-show="team.length > 0" class="pt-05 pb-1 justify-end" id="ptm-addIteamMember">
      <bib-button label="Add" variant="success" class="w-20"  @click="addTeamMember"></bib-button>
    </div>
    <loading :loading="loading"></loading>
  </div>
</template>

<script>
import { PROJECT_TEAM_FIELDS } from "~/config/constants";
import { mapGetters } from 'vuex';

export default {
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
      norecord: false,
    };
  },

  watch: {
    projectMembers() {
      if (this.projectMembers.length == 0) {
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
      project: "project/getSingleProject",
      projectMembers: 'project/getProjectMembers',
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
    this.$store.dispatch('project/fetchTeamMember', { projectId: this.$route.params.id || this.project.id})
    // console.log("sdsd",this.projectMembers)
  },

  created() {
    this.$root.$on('update-key', ($event) => {
      this.$store.dispatch('project/fetchTeamMember', { projectId: this.$route.params.id || this.project.id }).then(() => {
        this.key += $event
      })
    })
  },
  methods: {
    teamInputKeydown($event) {
      this.filterKey = $event
    },
    teamItemClick(tm) {
      let existing = this.projectMembers.filter(ex => ex.id == tm.id)
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
      // console.log(rm.indexOf(true))
      this.team.splice(rm.indexOf(true), 1)
    },
    addTeamMember() {
      this.loading = true
   
      if (this.team.length == 0) {
        this.loading = false
        return false
      } else {
        this.team.map((index)=>{
          let newObj={id:index.id,name:index.label}
          this.newTeam.push(newObj)
        })
        // console.log("1111",this.newTeam)
        this.$store.dispatch('project/addMember', { projectId: this.project.id, team: this.team }).then(() => {
          this.loading = false;
          this.message = ""
          this.team = []
        }).catch((err) => {
          this.loading = false;
          this.message = ""
          this.team = []
          console.warn(err)
        })
      }
    },
    async deleteMember(member) {
      this.loading = true
      this.newTeam = this.newTeam.filter((item)=>item.id!==member.id);
      // let confirmDelete = window.confirm("Are you sure want to delete " + member.name + "!")
      // if (confirmDelete) {
        await this.$store.dispatch("project/deleteMember", { projectId: this.$route.params.id || this.project.id, member: member })
          .then((res) => {
            this.key += 1
          })
          .catch(e => console.warn(e))
        this.loading = false
      // }
    },
  }
};

</script>
<style scoped lang="scss">

</style>
