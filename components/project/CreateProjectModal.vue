<template>
  <div id="create-project-modal-wrapper">
    <bib-modal-wrapper @close="showCreateProjectModal = false" v-show="showCreateProjectModal" title="Create Project" id="create-project" @keypress.native="bindEnter($event, 'create-project-btn')">
      <template v-slot:content>
        <label class="text-gray6">Project name <span class="text-danger">*</span></label>
        <bib-input v-model.trim="projectName" placeholder="Name your project"></bib-input>
        <small class="text-danger mb-05" style="margin-top:-0.5rem; display:block;">{{projectName ? '' : 'Project name is required'}}</small>
        <bib-input label="Department" v-model="department" placeholder="Type or select department name"></bib-input>
        <label id="create-project-modal-heading" class="text-gray6">Assign a project lead</label>
        <bib-button dropdown1="add" label="Type name or email" v-model="owner" v-on:input="dropdownInputKeydown" :footer="{icon: 'add', label: 'Invite via email', event: 'footer-action'}" @footer-action="inviteViaEmail" class="mt-05 mb-05">
          <template v-slot:menu>
            <ul id="cpm-fields" class="border-gray1" style="border-radius: 0 !important; border: 1px solid var(--bib-gray1);">
              <li :id="'cpm-field-'+index" v-for="(tm, index) in filterUser" v-on:click="dd1ItemClick(tm)">
                <bib-avatar size="1.5rem"></bib-avatar>
                <span id="cpm-person-name" class="ml-05"> {{tm.label}} <span class="ml-075">{{tm.email}}</span></span>
              </li>
            </ul>
          </template>
        </bib-button>
        <div id="project-team-members" class="d-flex" >
          <email-chip v-if="Object.keys(owner).length > 0" :email="owner.email ? owner.email : owner.sube" :text="(owner.email ? owner.email[0] : '') || (owner.sube ? owner.sube[0] : '') "  v-bind:close="true" v-on:remove-email="removeOwner"></email-chip>
          <small v-else class="text-danger">Project owner is required</small>
        </div>
        <!-- <bib-input label="Enter email" placeholder="Enter email"></bib-input> -->
        <div id="cpm-jumbotron-wrapper" class="d-flex p-075 bg-light shape-rounded mt-1">
          <div id="cpm-jumbotron" class="width-2 height-2">
            <bib-avatar text="!" variant="primary" text-variant="light" size="1rem"></bib-avatar>
          </div>
          <span id="cpm-jumbotron-text" class="pl-05 font-sm text-gray6">Lorem ipsum, dolor sit amet consectetur adipisicing, Lorem ipsum dolor sit, amet. elit. Ad, Lorem ipsum dolor sit amet. sunt.</span>
        </div>
        <loading :loading="loading"></loading>
      </template>
      <template v-slot:footer>
        <div class="m-auto pt-1 d-flex justify-between" id='tm-create-project-model'>
          <bib-button @click.native="
              () => {
                showCreateProjectModal = false;
              }
            " variant="light" size="lg" pill label="Cancel"></bib-button>
          <bib-button @click.native="createProject()" variant="success" size="lg" id="create-project-btn" pill label="Create" ></bib-button>
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
      projectName: "Project name",
      owner: {},
      department: "",
      projectlead: "Enter name or email",
      filterKey: "",
      error: false,
      loading: false,
    };
  },

  computed: {
    ...mapGetters({
      user: "user/getUser",
      teammate: 'user/getTeamMembers'
    }),
    filterUser() {
      return this.teammate.filter((u) => {
        if (u.email.indexOf(this.filterKey) >= 0) {
          return u
        }
      })
    }
  },
  mounted() {
    // console.log(this.user)
    if (this.user) {
      this.owner = JSON.parse(JSON.stringify(this.user))
    }
  },
  methods: {
    dropdownInputChange($event) {
      // console.log('dropdownInputChange', e.target)
    },
    dropdownInputKeydown($event) {
      console.log('dropdown input keydown', $event)
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
    removeOwner(){
      this.owner = {}
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
      let ownerId = this.owner.sub || this.owner.id
      // console.log(ownerId)
      if (this.projectName && ownerId) {
        this.$store.dispatch('project/createProject', { userId: ownerId, title: this.projectName }).then(()=>{
          this.loading = false
          this.showCreateProjectModal = false
        })
      } else {
        this.loading = false
        this.error = true
      }
      // this.$emit("create-project")
    },
    /*triggerModalAction(modal, payload, e = null) {
      this.$emit(modal, payload, e);
    },*/
    removeEmail($event) {
      alert($event)
      if ($event) {

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
    }

    .modal__wrapper__footer {
      padding: 0 1.5rem 1rem;
    }
  }
}

</style>
