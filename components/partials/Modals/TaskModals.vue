<template>
  <div>
    <!-- CREATE FOLDER  -->
    <bib-modal-wrapper
      @close="showCreateTaskModal = false"
      v-show="showCreateTaskModal"
      title="Create Task"
      id="create-task"
      :size="modalSize"
      @keypress.native="bindEnter($event, 'create-task-btn')"
    >
      <template v-slot:content>
        <div class="mt-1">
          <div class="d-flex">
            <bib-form-group required class="w-50" label="Task Name">
              <template v-slot:content>
                <bib-input
                  :value="taskInfo.title"
                  @input="
                    (val) => {
                      taskInfo.title = val;
                    }
                  "
                  type="text"
                  placeholder="Enter task title..."
                ></bib-input>
              </template>
            </bib-form-group>

            <bib-form-group class="w-50 ml-05" label="Section Title" required>
              <template v-slot:content>
                <bib-input
                  :value="taskInfo.section"
                  @input="
                    (val) => {
                      taskInfo.section = val;
                    }
                  "
                  placeholder="Enter section title..."
                ></bib-input>
              </template>
            </bib-form-group>

            <bib-form-group class="w-50 ml-05" label="Task Budget" required>
              <template v-slot:content>
                <bib-input
                  :value="taskInfo.budget"
                  @input="
                    (val) => {
                      taskInfo.budget = val;
                    }
                  "
                  placeholder="Enter budget..."
                ></bib-input>
              </template>
            </bib-form-group>
          </div>

          <div class="d-flex">
            <bib-form-group required class="w-50" label="Task Progress">
              <template v-slot:content>
                <bib-input
                  :value="taskInfo.progress"
                  @input="
                    (val) => {
                      taskInfo.progress = val;
                    }
                  "
                  type="text"
                  placeholder="Enter task progress..."
                ></bib-input>
              </template>
            </bib-form-group>

            <bib-form-group class="w-50 ml-05" label="Task Status" required>
              <template v-slot:content>
                <bib-input
                  :value="taskInfo.status"
                  @input="
                    (val) => {
                      taskInfo.status = val;
                    }
                  "
                  placeholder="Enter task status..."
                ></bib-input>
              </template>
            </bib-form-group>

            <bib-form-group required class="w-50 ml-05" label="Priority">
              <template v-slot:content>
                <bib-input
                  :value="taskInfo.priority"
                  @input="
                    (val) => {
                      taskInfo.priority = val;
                    }
                  "
                  type="text"
                  placeholder="Enter priority..."
                ></bib-input>
              </template>
            </bib-form-group>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <div class="m-auto pt-1 d-flex justify-between">
          <bib-button
            @click.native="
              () => {
                showCreateTaskModal = false;
              }
            "
            variant="light"
            size="lg"
            pill
            label="Cancel"
          ></bib-button>
          <bib-button
            @click.native="triggerModalAction('create-task', taskInfo)"
            variant="success"
            size="lg"
            id="create-task-btn"
            pill
            label="Create"
          ></bib-button>
        </div>
      </template>
    </bib-modal-wrapper>

    <bib-modal-wrapper
      @close="showCreateSectionModal = false"
      v-show="showCreateSectionModal"
      title="Create Section"
      id="create-section"
      @keypress.native="bindEnter($event, 'create-section-btn')"
    >
      <template v-slot:content>
        <bib-input
          class="placeholder--dark"
          :value="contextSection.name"
          @input="
            ($event) => {
              contextSection.name = $event;
            }
          "
          placeholder="Enter section name..."
        ></bib-input>
      </template>
      <template v-slot:footer>
        <div class="m-auto pt-1 d-flex justify-between">
          <bib-button
            @click.native="
              () => {
                showCreateSectionModal = false;
              }
            "
            variant="light"
            size="lg"
            pill
            label="Cancel"
          ></bib-button>
          <bib-button
            @click.native="triggerModalAction('create-section', contextSection)"
            variant="success"
            size="lg"
            id="create-section-btn"
            pill
            label="Create"
          ></bib-button>
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
      showCreateTaskModal: false,
      showCreateSectionModal: false,
      modalSize: "md",
      contextSection: {
        name: "",
      },
      taskInfo: {
        section: "",
        title: "",
        priority: "",
        progress: "",
        status: "",
        assignee: "",
        budget: "",
        description: "",
        dueDate: "2021-02-11",
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