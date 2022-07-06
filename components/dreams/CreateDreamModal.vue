<template>
  <div id="cd-modal-wrapper">
    <bib-modal-wrapper @close="showCreateDreamModal = false" v-show="showCreateDreamModal" title="Set a Dream" id="create-dream" @keypress.native="bindEnter($event, 'create-dream-btn')">
      <template v-slot:content>
        <div class="mb-075">
          <label class="text-gray6">Dream name<span class="text-danger">*</span></label>
          <bib-input v-model.trim="dreamName" placeholder="Dream"></bib-input>
          <small class="text-danger " style="margin-top:-0.25rem; display:block;">{{dreamName ? '' : 'Dream name is required'}}</small>
        </div>
        <bib-input type="textarea" v-model="description" placeholder="Description" label="Description" class="mb-05"></bib-input>
        <div class="row">
          <div class="col-6">
            <bib-input type="date" v-model="startDate" placeholder="Start Date" label="Start Date" class="mb-05"></bib-input>
          </div>
          <div class="col-6">
            <bib-input type="date" v-model="dueDate" placeholder="Due Date" label="Due Date" class="mb-05"></bib-input>
          </div>
        </div>
        <bib-input label="Set for Department" v-model="department" placeholder="Type or select department name" class="mb-05"></bib-input>
        <div class="mb-05">
          <label id="cd-modal-project-label" class="text-gray6" style="margin-bottom: -0.25rem;">Set for Project </label>
          <!-- <bib-input v-model="project" placeholder="Type or select project name" class="mb-05"></bib-input> -->
          <bib-button test_id="cd-project-dd1" dropdown1="add" label="Type or select project" v-model="project" v-on:input-keydown="dropdownInputKeydown" class="mt-05 mb-05">
            <template v-slot:menu>
              <ul id="cd-project-fields" class="border-gray1" style="border-radius: 0 !important; border: 1px solid var(--bib-gray1);">
                <li :id="'cd-project-field-'+index" v-for="(proj, index) in filterProject" :key="'cd-project-item-'+index" v-on:click="dd2ItemClick(proj)">
                  <!-- <bib-avatar :src="proj.avatar" size="1.25rem"></bib-avatar> -->
                  <span :id="'cd-project-name'+index" class="ml-05"> {{proj.title}} </span>
                </li>
              </ul>
            </template>
          </bib-button>
          <div id="cd-project-owner" class="d-flex pt-025">
            <email-chip v-if="Object.keys(project).length > 0" :name="project.title" :email="project.user.email" v-bind:close="true" v-on:remove-email="removeProject"></email-chip>
            <!-- <small v-else class="text-danger" style="margin-top: -0.25rem;">Dream owner is required</small> -->
          </div>
        </div>
        <div class="mb-05">
          <label id="cd-modal-owner-label" class="text-gray6" style="margin-bottom: -0.25rem;">Assign a dreamer </label>
          <bib-button test_id="create-dream-dd1" dropdown1="add" label="Type name or email" v-model="owner" v-on:input-keydown="dropdownInputKeydown" :footer="{icon: 'add', label: 'Invite via email', event: 'footer-action'}" @footer-action="inviteViaEmail" class="mt-05 mb-05">
            <template v-slot:menu>
              <ul id="cd-owner-fields" class="border-gray1" style="border-radius: 0 !important; border: 1px solid var(--bib-gray1);">
                <li :id="'cd-owner-field-'+index" v-for="(tm, index) in filterUser" :key="'cd-owner-item-'+index" v-on:click="dd1ItemClick(tm)">
                  <bib-avatar :src="tm.avatar" size="1.25rem"></bib-avatar>
                  <span :id="'cd-owner-person-name'+index" class="ml-05"> {{tm.label}} <span class="ml-075">{{tm.email}}</span></span>
                </li>
              </ul>
            </template>
          </bib-button>
          <div id="cd-team-members" class="d-flex pt-025">
            <email-chip v-if="Object.keys(owner).length > 0" :name="owner.label" :email="owner.email ? owner.email : owner.sube" :avatar="owner.avatar" v-bind:close="true" v-on:remove-email="removeOwner"></email-chip>
            <!-- <small v-else class="text-danger" style="margin-top: -0.25rem;">Dream owner is required</small> -->
          </div>
        </div>
        <loading :loading="loading"></loading>
      </template>
      <template v-slot:footer>
        <div class="m-auto pt-1 d-flex justify-between" id="cd-model-footer">
          <bib-button @click.native="
              () => {
                showCreateDreamModal = false;
              }
            " variant="light" size="lg" pill label="Cancel"></bib-button>
          <bib-button @click.native="createDream()" variant="success" size="lg" id="create-dream-btn" pill label="Create"></bib-button>
        </div>
      </template>
    </bib-modal-wrapper>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: "CreateDreamModal",
  data() {
    return {
      showCreateDreamModal: false,
      dreamName: "",
      description: "",
      startDate: "",
      dueDate: "",
      owner: {},
      startDate: "",
      dueDate: "",
      department: "",
      project: {},
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
      projects: "project/getAllProjects",
      // companyUsers: "company/getCompanyMembers"
    }),
    filterProject() {
      return this.projects.filter(p => {
        if (p.title.indexOf(this.filterKey) >= 0) {
          return p
        }
      })
    },
    filterUser() {
      return this.teamMembers.filter((u) => {
        if (u.email.indexOf(this.filterKey) >= 0) {
          return u
        }
      })
    },
  },
  mounted() {
    // console.log(this.user)
    /*if (this.user) {
      this.owner = JSON.parse(JSON.stringify(this.user))
    }*/
  },
  methods: {
    
    dd2ItemClick(proj) {
      console.log(proj)
      // this.owner = `${proj.label} - ${proj.email}`
      this.project = proj
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
    removeProject(){
      this.project = {}
    },
    removeOwner() {
      this.owner = {}
    },
    bindEnter(event, button) {
      if (event.key == "Enter") {
        document.getElementById(button).click();
        return false;
      }
    },
    createDream() {
      this.loading = true
      console.log(this.owner)
      let payload = {
        title: this.dreamName, 
        companyId: JSON.parse(localStorage.getItem('user')).subb,
        userId: Object.keys(this.owner).length ? this.owner.id : null,
        description: this.description ? this.description : null,
        department: this.department ? this.department : null,
        createdAt: this.startDate ? this.startDate : null,
        dueDate: this.dueDate ? this.dueDate : null,
        projectId: Object.keys(this.project).length ? this.project.id : null,
        user: Object.keys(this.owner).length ? this.owner : null
      }
      if (this.dreamName && Object.keys(this.owner).length) {
        this.$store.dispatch('dream/createDream', payload).then((res) => {
          // console.log(res)
          this.loading = false
            this.showCreateDreamModal = false
          // if (res.statusCode == 200) {
          // }
          console.log(res.message)
        }).catch(e => {
          console.log(e.message)
          this.loading = false
        })
      } else {
        this.loading = false
        console.error("required fields");
        
      }
      // this.$emit("create-dream")
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
    }

    .modal__wrapper__footer {
      padding: 0 1.5rem 1rem;
    }
  }
}

</style>
