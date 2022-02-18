<template>
  <div>
    <bib-modal-wrapper @close="showCreateProjectModal = false" v-show="showCreateProjectModal" title="Create Project" id="create-project" @keypress.native="bindEnter($event, 'create-project-btn')">
      <template v-slot:content>
        <bib-input label="Project name" :value="contextProject.name" @input="($event) => { contextProject.name = $event; }" placeholder="Name your project"></bib-input>
        <bib-input label="Department" :value="department" placeholder="Type or select department name"></bib-input>
        <label class="text-gray6">Assign a project lead</label>
        <bib-button dropdown1="" label="Enter name or email" opend-label="Select or invite participants" class="mt-05 mb-05">
          <template v-slot:menu>
            <ul>
              <li @click="dd1ItemClick(1)">
                <bib-avatar size="1.5rem"></bib-avatar>
                <span class="ml-05"> Persons Name </span>
              </li>
              <li @click="dd1ItemClick(0)">
                <div class="d-flex">
                  <bib-icon icon="add" variant="success" :scale="1.125"></bib-icon>
                  <span class="ml-05"> Invite via email </span>
                </div>
              </li>
            </ul>
          </template>
        </bib-button>
        <div id="project-team-members">
          <div class="m-auto p-05 bg-light shape-rounded">
            <bib-avatar size="1.5rem"></bib-avatar>
            <!-- <bib-icon icon="folder" :scale="1.25"></bib-icon> -->
            <span class="pl-025 ">bruno@biztree.com</span>
          </div>
        </div>
        <div class="d-flex p-075 bg-light shape-rounded mt-1">
          <div class="width-2 height-2">
            <bib-avatar text="!" variant="primary" text-variant="light" size="1rem"></bib-avatar>
          </div>
          <span class="pl-05 font-sm text-gray6">Lorem ipsum, dolor sit amet consectetur adipisicing, Lorem ipsum dolor sit, amet. elit. Ad, Lorem ipsum dolor sit amet. sunt.</span>
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
export default {
  name: "BibDriveModals",
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

    };
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
  },
};

</script>
