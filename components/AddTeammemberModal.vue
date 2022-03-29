<template>
  <div id="create-team-modal-wrapper">
    <bib-modal-wrapper @close="showTeamCreateModal = false" v-show="showTeamCreateModal" title="Assign project to people" id="create-team" @keypress.native="bindEnter($event, 'create-team-btn')">
      <template v-slot:content>
        <label id="create-team-modal-heading" class="text-gray6">Participants</label>
        <bib-input type="select" :options="memberOptions" v-model="member" v-on:change.native="selectTeam"></bib-input>
        <!-- <bib-button id="create-team-dd1" dropdown1="" label="Type name or email" v-model="assignee" v-on:input-change="teamInputChange" v-on:input="teamInputKeydown" class="mt-05 mb-05">
          <template v-slot:menu>
            <ul id="atm-fields" class="border-gray1" style="border-radius: 0 !important; border: 1px solid var(--bib-gray1);">
              <li :id="'atm-field-'+index" v-for="(tm, index) in filterTeam" :key="'atm-items'+index" v-on:click="teamItemClick(tm)">
                <bib-avatar size="1.5rem"></bib-avatar>
                <span :id="'atm-person-name'+index" class="ml-05"> {{tm.label}} <span class="ml-075">{{tm.email}}</span></span>
              </li>
            </ul>
          </template>
        </bib-button> -->
        <div id="project-team-members" class="d-flex gap-05" style="flex-wrap: wrap;">
          <template v-for="t in team">
            <email-chip :email="t.email" :name="t.label" :text="t.email[0]" :close="true" v-on:remove-email="removeMember(t)"></email-chip>
          </template>
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
      projectName: "Project name",
      assignee: {},
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
      teammate: 'user/getTeamMembers',
      // company: "company/getSingleCompany"
    }),
    filterTeam() {
      return this.teammate.filter((u) => {
        if (u.email.indexOf(this.filterKey) >= 0) {
          return u
        }
      })
    },
    memberOptions(){
      let arr = [{label:"Select member"}]
      this.teammate.map(t=>arr.push({label:t.label, value:t.id, id: t.id}))
      return arr
    }
  },
  mounted() {
    // console.log(this.user)
    if (this.user) {
      this.assignee = JSON.parse(JSON.stringify(this.user))
      // this.$store.dispatch("company/getSingleCompany", this.user.subb)
    }
  },
  methods: {
    teamInputChange() {},
    teamInputKeydown($event) {
      console.log('dropdown input keydown', $event)
      this.filterKey = $event
    },
    teamItemClick(tm) {
      // console.log(tm)
      // this.assignee = `${tm.label} - ${tm.email}`
      this.assignee = tm
    },
    // dropdownFooterAction(){},
    inviteViaEmail() {
      console.log('inviteViaEmail')
    },
    removeMember(tm) {
      // console.log(tm)
      // let rm = this.team.filter(t=>t.id == tm.id)
      let rm = this.team.map(t=>t.id == tm.id)
      console.log(rm.indexOf(true))
      this.team.splice(rm.indexOf(true), 1)
    },
    bindEnter(event, button) {
      if (event.key == "Enter") {
        document.getElementById(button).click();
        return false;
      }
    },
    selectTeam(){
      let m = this.teammate.filter(t=>t.id == this.member)
      // console.log(m[0])
      if (this.team.some(el=>el.id == m[0].id)) {
        return false
      }
      this.team.push(m[0])
    },
    createProject() {
      this.loading = true
      // console.log(this.projectName, this.assignee)
      let ownerId = this.assignee.sub || this.assignee.id
      // console.log(ownerId)
      /*if (this.projectName && ownerId) {
        this.$store.dispatch('project/createProject', { userId: ownerId, title: this.projectName }).then(()=>{
          this.loading = false
          this.showTeamCreateModal = false
        })
      } else {
        this.loading = false
        this.error = true
      }*/

      setTimeout(() => {
        this.showTeamCreateModal = false
      }, 2500)

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
