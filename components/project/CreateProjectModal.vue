<template>
  <div id="create-project-modal-wrapper">
    <bib-modal-wrapper @close="showCreateProjectModal = false" v-show="showCreateProjectModal" title="Create Project" id="create-project" @keypress.native="bindEnter($event, 'create-project-btn')">
      <template v-slot:content>
        <label class="text-gray6">Project name <span class="text-danger">*</span></label>
        <bib-input v-model.trim="projectName" placeholder="Name your project"></bib-input>
        <small class="text-danger" style="margin-top:-0.5rem; display:block;">{{projectName ? '' : 'Project name is required'}}</small>
        <bib-input label="Department" v-model="department" placeholder="Type or select department name"></bib-input>
        <label id="create-project-modal-heading" class="text-gray6">Assign a project lead</label>
        <bib-button dropdown1="" :label="projectlead" opend-label="Select or invite participants" class="mt-05 mb-05">
          <template v-slot:menu>
            <ul id="cpm-fields">
              <li :id="'cpm-field-'+index" v-for="(tm, index) in teammate" v-on:click="dd1ItemClick(tm)">
                <bib-avatar size="1.5rem"></bib-avatar>
                <span id="cpm-person-name" class="ml-05"> {{tm.label}} <span class="ml-075">{{tm.email}}</span></span>
              </li>
              <li id="cpm-field-invite" @click="inviteViaEmail">
                <div class="d-flex" id="cpm-field-wrap">
                  <bib-icon icon="add" variant="success" :scale="1.125"></bib-icon>
                  <span class="ml-05" id="cpm-email-invite"> Invite via email </span>
                </div>
              </li>
            </ul>
          </template>
        </bib-button>
        <div id="project-team-members" class="d-flex gap-05 flex-wrap">
        <email-chip :email="user ? user.sube : 'bruno@biztree.com'" v-bind:close="true"></email-chip>

        </div>
        <div id="cpm-jumbotron-wrapper" class="d-flex p-075 bg-light shape-rounded mt-1">
          <div id="cpm-jumbotron" class="width-2 height-2">
            <bib-avatar text="!" variant="primary" text-variant="light" size="1rem"></bib-avatar>
          </div>
          <span id="cpm-jumbotron-text" class="pl-05 font-sm text-gray6">Lorem ipsum, dolor sit amet consectetur adipisicing, Lorem ipsum dolor sit, amet. elit. Ad, Lorem ipsum dolor sit amet. sunt.</span>
        </div>
      </template>
      <template v-slot:footer>
        <div class="m-auto pt-1 d-flex justify-between" id='tm-create-project-model'>
          <bib-button @click.native="
              () => {
                showCreateProjectModal = false;
              }
            " variant="light" size="lg" pill label="Cancel"></bib-button>
          <bib-button @click.native="createProject()" variant="success" size="lg" id="create-project-btn" pill label="Create" :disabled="!projectName"></bib-button>
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
      department: "",
      projectlead: "Enter name or email",
    };
  },
  mounted() {
    /*if (process.client) {
      this.user = localStorage.getItem("user")
    }*/
  },
  computed: {
    ...mapGetters({
      user: "user/getUser",
      teammate: 'user/getTeamMembers'
    })
  },
  methods: {
    dd1ItemClick(teammate) {
      console.log(teammate)
      this.projectlead = `${teammate.label} - ${teammate.email}`
    },
    inviteViaEmail() {

    },
    bindEnter(event, button) {
      if (event.key == "Enter") {
        document.getElementById(button).click();
        return false;
      }
    },
    createProject() {
      console.log(this.projectName)
      if (this.projectName) {
        this.$store.dispatch('project/createProject', this.projectName);
        this.showCreateProjectModal = false
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

  mounted() {
    this.projectlead = `${this.user.sube}`
  }
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
