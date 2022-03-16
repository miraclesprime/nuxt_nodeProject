<template>
  <div id="create-project-modal-wrapper">
    <bib-modal-wrapper size="lg" @close="showCreateProjectModal = false" v-show="showCreateProjectModal" title="Create Project" id="create-project" @keypress.native="bindEnter($event, 'create-project-btn')">
      <template v-slot:content>
        <bib-input label="Project name" :value="contextProject.name" @input="($event) => { contextProject.name = $event; }" placeholder="Name your project"></bib-input>
        <bib-input label="Department" :value="department" placeholder="Type or select department name"></bib-input>
        <label id="create-project-modal-heading" class="text-gray6">Assign a project lead</label>
        <bib-button dropdown1="" label="Enter name or email" opend-label="Select or invite participants" class="mt-05 mb-05">
          <template v-slot:menu>
            <ul id="cpm-fields">
              <li id="cpm-field-1" @click="dd1ItemClick(1)">
                <bib-avatar size="1.5rem"></bib-avatar>
                <span id="cpm-person-name" class="ml-05"> Persons Name </span>
              </li>
              <li id="cpm-field-2" @click="dd1ItemClick(0)">
                <div class="d-flex" id="cpm-field-wrap">
                  <bib-icon icon="add" variant="success" :scale="1.125"></bib-icon>
                  <span class="ml-05" id="cpm-email-invite"> Invite via email </span>
                </div>
              </li>
            </ul>
          </template>
        </bib-button>
        <div id="project-team-members" class="d-flex gap-05 flex-wrap">
          <email-chip :email="user ? user.sube : 'bruno@biztree.com'" avatar="B" v-bind:close="true" v-on:remove-email="getUser"></email-chip>
          <!-- <div class="align-center text-secondary p-05 bg-light shape-rounded">
            <bib-avatar size="1.5rem"></bib-avatar>
            <span class="pl-025 pr-025">bruno@biztree.com</span>
            <bib-icon icon="close" :scale="1" class="cursor-pointer"></bib-icon>
          </div>
          <div class="align-center text-secondary p-05 bg-light shape-rounded">
            <bib-avatar size="1.5rem"></bib-avatar>
            <span class="pl-025 pr-025">ramon@biztree.com</span>
            <bib-icon icon="close" :scale="1" class="cursor-pointer"></bib-icon>
          </div> -->
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
          <bib-button @click.native="triggerModalAction('create-project', contextProject)" variant="success" size="lg" id="create-project-btn" pill label="Create"></bib-button>
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
      modalSize: "md",
      contextSection: {
        name: "",
      },
      contextProject: {
        name: "",
      },
      department: "",
    };
  },
  mounted() {
    /*if (process.client) {
      this.user = localStorage.getItem("user")
    }*/
  },
  computed: {
    ...mapGetters({
      user: "user/getUser"
    })

  },
  methods: {
    bindEnter(event, button) {
      if (event.key == "Enter") {
        document.getElementById(button).click();
        return false;
      }
    },
    triggerModalAction(modal, payload, e = null) {
      this.$emit(modal, payload, e);
    },
    removeEmail($event) {
      alert($event)
      if ($event) {

      }
    },
    getUser() {
      // var requestOptions = {
      //   method: 'GET',
      //   redirect: 'follow'
      // };

      // fetch("https://www.biztree.com/usr-ctrl-test/api/user/4q2VolejRejNmGQB", requestOptions)
      //   .then(response => response.text())
      //   .then(result => console.log(result))
      //   .catch(error => console.log('error', error));
    }
  },
};

</script>
