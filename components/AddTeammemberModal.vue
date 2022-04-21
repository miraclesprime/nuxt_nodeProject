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
        <div id="project-team-members" class="py-025">
          <template v-for="t in team">
            <email-chip :email="t.email" :name="t.label" :text="t.email[0]" class="mt-05" :close="true" v-on:remove-email="removeMember(t)"></email-chip>
          </template>
          <small v-show="team.length == 0" class="text-danger">Select at least 1 team member.</small>
          <p v-if="message" v-text="message" class="font-sm mt-025 text-orange"></p>
        </div>
        <div class="pt-2">
          <strong>Use link to invite</strong>
          <div class="d-flex align-end mt-1">
            <div class="flex-grow-1">
              <bib-input type="text" label="Url" size="sm" :value="projectUrl" disabled></bib-input>
            </div>
            <div class="mb-05 pl-05">
              <bib-button variant="primary" label="Copy link" pill @click="copyUrl"></bib-button>
            </div>
          </div>
          <!-- <div class="row">
            <div class="col-6">
              <bib-input type="select" label="Who can open this link?" :options="[{label:'Anyone',value:'any'}]"></bib-input>
            </div>
            <div class="col-6">
              <bib-input type="select" label="Rights" :options="[{label:'Viewer',value:'viewer'}, {label:'Editor',value:'editor'}]"></bib-input>
            </div>
          </div> -->
        </div>
        <loading :loading="loading"></loading>
      </template>
      <template v-slot:footer>
        <div class=" d-flex justify-end" id="create-team-model-footer">
          <bib-button @click.native="addTeamMember" variant="success" size="lg" id="create-team-btn" pill label="Done"></bib-button>
        </div>
      </template>
    </bib-modal-wrapper>
    <bib-popup-notification-wrapper>
      <template #wrapper>
        <bib-popup-notification v-for="(msg, index) in popupMessages" :key="index" :message="msg.text" :variant="msg.variant">
        </bib-popup-notification>
      </template>
    </bib-popup-notification-wrapper>
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
      message: "",
      popupMessages: [],
    };
  },

  computed: {
    ...mapGetters({
      user: "user/getUser",
      companyUsers: "company/getCompanyMembers",
      project: "project/getSingleProject",
      projectMembers: "project/getProjectMembers",
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
    projectUrl() {
      return process.env.VUE_APP_URL + "/project/" + this.project.id
    }
  },
  /*mounted() {
    // console.log(this.user)
    let user = JSON.parse(localStorage.getItem("user"))
    this.$store.dispatch("company/fetchCompanyMembers", user.subb)
  },*/
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
      let existing = this.projectMembers.filter(ex => ex.id == tm.id)
      // console.log(existing)
      if (existing.length == 0) {
        this.message = ""
        let m = this.companyUsers.filter(t => t.id == tm.id)
        // console.log(m[0])
        if (this.team.some(el => el.id == m[0].id)) {
          return false
        }
        this.team.push(m[0])
      } else {
        this.message = "User already exists"
      }
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
    addTeamMember() {
      this.loading = true

      if (this.team.length == 0) {
        this.loading = false
        return false
      } else {
        this.$store.dispatch('project/addMember', { projectId: this.project.id, team: this.team }).then(() => {
          this.$nuxt.$emit('update-key', 1)
          this.showTeamCreateModal = false
          this.loading = false;
          this.team = []
        }).catch((err) => {
          this.loading = false;
          this.showTeamCreateModal = false
          this.team = []
          console.log(err)

        })
      }

    },
    copyUrl() {
      // let th = this
      navigator.clipboard.writeText(this.projectUrl).then(() => {
        // console.log('success')
        this.popupMessages.push({ text: "Copied successfully", variant: "success" })
      }, () => {
        alert("failed to copy")
      });

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
