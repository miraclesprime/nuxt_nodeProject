<template>
  <div id="create-project-modal-wrapper">
    <bib-modal-wrapper @close="closeModal" v-show="showCreateProjectModal" title="Create Project" id="create-project" @keypress.native="bindEnter($event, 'create-project-btn')">
      <template v-slot:content>
        <label class="text-gray6">Project name <span class="text-danger">*</span></label>
        <bib-input v-model.trim="projectName" placeholder="Name your project"></bib-input>
        <small class="text-danger mb-05" style="margin-top:-0.5rem; display:block;">{{projectName ? '' : 'Project name is required'}}</small>
        <!-- <bib-input label="Department" v-model="department" placeholder="Type or select department name"></bib-input> -->
        <label id="create-project-modal-heading" class="text-gray6" style="margin-bottom: -0.5rem;">Assign a project lead <span class="text-danger">*</span></label>
        <bib-button test_id="create-project-dd1" dropdown1="add" label="Type name or email" v-model="owner" v-on:input-keydown="dropdownInputKeydown" :footer="{icon: 'add', label: 'Invite via email', event: 'footer-action'}" @footer-action="inviteViaEmail" class="mb-05">
          <template v-slot:menu>
            <ul id="cpm-fields" class="border-gray1" style="border-radius: 0 !important; border: 1px solid var(--bib-gray1);">
              <li :id="'cpm-field-'+index" v-for="(tm, index) in filterUser" :key="'cpm-item-'+index" v-on:click="dd1ItemClick(tm)">
                <bib-avatar :src="tm.avatar" size="1.25rem"></bib-avatar>
                <span :id="'cpm-person-name'+index" class="ml-05"> {{tm.label}} <span class="ml-075">{{tm.email}}</span></span>
              </li>
            </ul>
          </template>
        </bib-button>
        <div id="project-team-members" class="d-flex pt-025">
          <email-chip v-if="Object.keys(owner).length > 0" :name="owner.label" :email="owner.email ? owner.email : owner.sube" :avatar="owner.avatar" v-bind:close="true" v-on:remove-email="owner = {}"></email-chip>
          <small v-else class="text-danger">Project owner is required</small>
        </div>
        <!-- <bib-input label="Enter email" placeholder="Enter email"></bib-input> -->
        <!-- <div id="cpm-jumbotron-wrapper" class="d-flex p-075 bg-light shape-rounded mt-1">
          <div id="cpm-jumbotron" class="width-2 height-2">
            <bib-avatar text="!" variant="primary" text-variant="light" size="1rem"></bib-avatar>
          </div>
          <span id="cpm-jumbotron-text" class="pl-05 font-sm text-gray6">Lorem ipsum, dolor sit amet consectetur adipisicing, Lorem ipsum dolor sit, amet. elit. Ad, Lorem ipsum dolor sit amet. sunt.</span>
        </div> -->
        <loading :loading="loading"></loading>
      </template>
      <template v-slot:footer>
        <!-- <div v-if="error" class="shape-rounded border-danger px-075 py-05 text-danger font-sm">{{errorMsg}}</div> -->
        <div class="m-auto pt-1 d-flex justify-between" id='tm-create-project-model'>
          <bib-button @click.native="closeModal" variant="light" size="lg" pill label="Cancel"></bib-button>
          <bib-button @click.native="createProject()" variant="success" size="lg" id="create-project-btn" pill label="Create"></bib-button>
        </div>
      </template>
    </bib-modal-wrapper>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: "CreateProjectModal",
  data() {
    return {
      showCreateProjectModal: false,
      projectName: "",
      owner: {},
      department: "",
      projectlead: "Enter name or email",
      filterKey: "",
      error: false,
      errorMsg: "",
      loading: false,
    };
  },

  computed: {
    ...mapGetters({
      user: "user/getUser",
      teamMembers: "user/getTeamMembers",
      // companyUsers: "company/getCompanyMembers"
    }),
    filterUser() {
      return this.teamMembers.filter((u) => {
        if (u.email.indexOf(this.filterKey) >= 0) {
          return u
        }
      })
    },
  },
  mounted() {
    if (this.user) {
      this.$axios.get(`${process.env.USER_API_URL}/${this.user.sub}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }).then((res) => {
          this.owner = {id: res.data[0].Id, firstName: res.data[0].FirstName, lastName: res.data[0].LastName, avatar: res.data[0].Photo, email: res.data[0].Email};
        })
    }
  },
  methods: {
    dropdownInputChange($event) {
      // console.log('dropdownInputChange', e.target)
    },
    dropdownInputKeydown($event) {
      // console.log('dropdown input keydown', $event)
      this.filterKey = $event
    },
    dd1ItemClick(tm) {
      // console.log(tm)
      // this.owner = `${tm.label} - ${tm.email}`
      this.owner = tm
    },
    inviteViaEmail() {
      console.log('inviteViaEmail')
    },
    /*leadChange() {
      console.log(this.owner)
    },*/
    closeModal() {
      this.projectName = ''
      this.owner = {}
      this.showCreateProjectModal = false
    },
    bindEnter(event, button) {
      if (event.key == "Enter") {
        document.getElementById(button).click();
        return false;
      }
    },
    createProject() {
      this.loading = true
      // console.log(this.projectName, this.owner)
      // let ownerId = this.owner.sub || this.owner.id
      // console.log(ownerId)
      if (this.projectName && this.owner.id) {
        this.$store.dispatch('project/createProject', { user: this.owner, title: this.projectName }).then((res) => {
          // console.log(res)
          this.loading = false
          if (res.statusCode == 200) {
            this.projectName = ''
            this.owner = {}
            this.showCreateProjectModal = false
          }
          console.log(res.message)
        }).catch(e => {
          console.log(e.message)
          this.loading = false
        })
      } else {
        this.loading = false
        console.error("required fields");
        /*this.errorMsg = "Please fill required fields"
        this.error = true*/

      }
      // this.$emit("create-project")
    },
    /*triggerModalAction(modal, payload, e = null) {
      this.$emit(modal, payload, e);
    },*/
    removeEmail($event) {
      // alert($event)
      if ($event) {

      }
    },
  },

};

</script>
<style lang="scss" scoped>
::v-deep {
  /*.input {
    &.error {
      input {
        border-color: $danger-sub1; color: $danger;
        &:focus, &:hover { border-color: $danger-sub1; }
      }
    }
  }*/
}

</style>
