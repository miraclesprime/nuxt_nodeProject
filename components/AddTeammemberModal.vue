<template>
  <div id="create-team-modal-wrapper">
    <bib-modal-wrapper @close="showTeamCreateModal = false" v-show="showTeamCreateModal" title="Assign people to project/task " id="create-team" @keypress.native="bindEnter($event, 'create-team-btn')">
      <template v-slot:content>
        <label id="create-team-modal-heading" class="text-gray6">Participants</label>
        <!-- <bib-input type="select" :options="memberOptions" v-model="member" v-on:change.native="selectTeam"></bib-input> -->
        <bib-button test_id="create-team-dd1" dropdown1="add" label="Type name or email" v-model="member" v-on:input-change="teamInputChange" v-on:input-keydown="teamInputKeydown" class="mt-05 mb-05">
          <template v-slot:menu>
            <ul id="atm-fields" class="border-gray1" style="border-radius: 0 !important; border: 1px solid var(--bib-gray1);">
              <li :id="'atm-field-'+index" v-for="(tm, index) in filterTeam" :key="'atm-items'+index" v-on:click="teamItemClick(tm)">
                <bib-avatar size="1.5rem"></bib-avatar>
                <span :id="'atm-person-name'+index" class="ml-05"> {{tm.label}} <span class="ml-075">{{tm.email}}</span></span>
              </li>
            </ul>
          </template>
        </bib-button>
        <div id="project-team-members" class="pt-025" style="min-height:10rem;">
          <template v-for="t in team">
            <email-chip :email="t.email" :name="t.label" :text="t.email[0]" class="mt-05" :close="true" v-on:remove-email="removeMember(t)"></email-chip>
          </template>
          <small v-show="team.length == 0" class="text-danger">Select at least 1 team member</small>
        </div>
        <loading :loading="loading"></loading>
      </template>
      <template v-slot:footer>
        <div class=" d-flex justify-end" id="create-team-model-footer">
          <bib-button @click.native="createProject" variant="success" size="lg" id="create-team-btn" pill label="Done"></bib-button>
        </div>
      </template>
    </bib-modal-wrapper>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: "AddTeammemberModal",
  data() {
    return {
      showTeamCreateModal: false,
      // assignee: {},
      member: "",
      team: [],
      filterKey: "",
      error: false,
      loading: false,
    };
  },

  computed: {
    ...mapGetters({
      user: "user/getUser",
      companyUsers: "company/getCompanyMembers",
      project: "project/getSingleProject",
      // teammate: 'user/getTeamMembers',
      task: "task/getSelectedTask",
    }),
    filterTeam() {
      return this.companyUsers.filter((u) => {
        if (u.email.indexOf(this.filterKey) >= 0) {
          return u
        }
      })
    },
    /*memberOptions(){
      let arr = [{label:"Select member"}]
      this.companyUsers.map(t=>arr.push({label:`${t.firstName} ${t.lastName}`, value:t.id, id: t.id}))
      return arr
    }*/
  },
  mounted() {
    // console.log(this.user)
    if (this.user) {
      // this.assignee = JSON.parse(JSON.stringify(this.user))
      this.$store.dispatch("company/fetchCompanyMembers", this.user.subb)
    }
  },
  methods: {
    teamInputChange() {
      console.log('team input change')
    },
    teamInputKeydown($event) {
      // console.log('dropdown input keydown', $event)
      this.filterKey = $event
    },
    teamItemClick(tm) {
      // console.log(tm)
      let m = this.companyUsers.filter(t => t.id == tm.id)
      // console.log(m[0])
      if (this.team.some(el => el.id == m[0].id)) {
        return false
      }
      this.team.push(m[0])
    },
    // dropdownFooterAction(){},
    inviteViaEmail() {
      console.log('inviteViaEmail')
    },
    removeMember(tm) {
      // console.log(tm)
      // let rm = this.team.filter(t=>t.id == tm.id)
      let rm = this.team.map(t => t.id == tm.id)
      console.log(rm.indexOf(true))
      this.team.splice(rm.indexOf(true), 1)
    },
    bindEnter(event, button) {
      if (event.key == "Enter") {
        document.getElementById(button).click();
        return false;
      }
    },
    /*selectTeam(){
      let m = this.teammate.filter(t=>t.id == this.member)
      // console.log(m[0])
      if (this.team.some(el=>el.id == m[0].id)) {
        return false
      }
      this.team.push(m[0])
    },*/
    createProject() {
      this.loading = true
      console.log(this.project, this.task, this.team)

      /*if (this.project.title && ownerId) {
        this.$store.dispatch('project/createProject', { userId: ownerId, title: this.project.title }).then(()=>{
          this.loading = false
          this.showTeamCreateModal = false
        })
      } else {
        this.loading = false
        this.error = true
      }*/

      if (this.team.length == 0) {
        this.loading = false
        return false
      } else {
        setTimeout(() => {
          this.showTeamCreateModal = false
        }, 2500)
      }

    },
  },

};

</script>
<style lang="scss" scoped>
::v-deep {
  .modal__wrapper {
    .modal__wrapper__header {
      padding: 1rem 1.5rem 0;

      span {
        font-weight: bold;
      }
    }

    .modal__wrapper__content {
      padding: 1.5rem;
      position: relative;
    }

    .modal__wrapper__footer {
      padding: 0 1.5rem 1rem;
    }
  }
}

</style>
