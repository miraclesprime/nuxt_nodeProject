<template>
  <div id="create-project-modal-wrapper">
    <bib-modal-wrapper @close="closeModal" v-show="showCreateProjectModal" title="Create Project" id="create-project" @keypress.native="bindEnter($event, 'create-project-btn')">
      <template v-slot:content>
        <label class="text-gray6" id="cpm-project-name">Project name <span class="text-danger">*</span></label>
        <bib-input v-model.trim="projectName" placeholder="Name your project"></bib-input>
        <small v-if="btnCreate" class="text-danger mb-05" id="cpm-project-name-alert" style="margin-top:-0.5rem; display:block;">{{projectName ? '' : 'Project name is required'}}</small>
        <template>
            <bib-input v-model="department" :options="departments" size="md" type="select"></bib-input>
        </template>
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
        <div id="cpm-project-team-members" class="d-flex pt-025">
          <template v-if="btnCreate">
            <email-chip v-if="Object.keys(owner).length > 0" :name="owner.label" :email="owner.email ? owner.email : owner.sube" :avatar="owner.avatar" v-bind:close="true" v-on:remove-email="owner = {}"></email-chip>
            <small v-else class="text-danger">Project owner is required</small>
          </template>
          <template v-else>
            <email-chip v-if="Object.keys(owner).length > 0" :name="owner.label" :email="owner.email ? owner.email : owner.sube" :avatar="owner.avatar" v-bind:close="true" v-on:remove-email="owner = {}"></email-chip>
          </template>
        </div>
        <loading :loading="loading"></loading>
      </template>
      <template v-slot:footer>
        <div class="m-auto pt-1 d-flex justify-between" id='cpm-create-project-model'>
          <bib-button @click.native="closeModal" variant="light" size="lg" pill label="Cancel"></bib-button>
          <bib-button @click.native="createProject()" variant="primary-24" size="lg" id="create-project-btn" pill label="Create"></bib-button>
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
      department: null,
      projectlead: "Enter name or email",
      filterKey: "",
      error: false,
      errorMsg: "",
      loading: false,
      btnCreate:false
    };
  },

  computed: {
    ...mapGetters({
      user: "user/getUser",
      teamMembers: "user/getTeamMembers",
      departments: "department/getAllDepartments",
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
      this.$axios.get(`${process.env.USER_API_ENDPOINT}/${this.user.sub}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }).then((res) => {
          this.owner = {id: res.data.Id, firstName: res.data.FirstName, lastName: res.data.LastName, avatar: res.data.Photo, email: res.data.Email};
        })
    }

  },
  methods: {
    dropdownInputChange($event) {
    },
    dropdownInputKeydown($event) {
      this.filterKey = $event
    },
    dd1ItemClick(tm) {
      this.owner = tm
    },
    inviteViaEmail() {
      console.log('inviteViaEmail')
    },
    closeModal() {
      this.btnCreate=false
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
      this.btnCreate=true
      this.loading = true
      if (this.projectName && this.owner.id) {
        this.$store.dispatch('project/createProject', { user: this.owner, title: this.projectName, departmentId: this.department }).then((res) => {
          this.loading = false
          if (res.statusCode == 200) {
            this.projectName = ''
            this.owner = {}
            this.showCreateProjectModal = false

             this.$axios.$get(`/project/company/all`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                  'Filter': 'all'
                }
              }).then((pro)=>{
                if(pro.data.length==1){
                  this.$nuxt.$emit("project-refresh-table");
                  return;

                }
                else{
                  this.$nuxt.$emit("newTask",res.data,this.$route.fullPath)
                }
              })

         
          }
        }).catch(e => {
          console.log(e.message)
          this.loading = false
        })
      } else {
        this.loading = false
        console.error("required fields");

      }
    },
  },

};

</script>
<style lang="scss" scoped>

</style>
