<template>
  <div id="task-actions-wrapper" class="task-actions p-025 ">
    <div class="action-left d-flex " id="ta-action-left">
      <!-- <section-title
        title="Add Task/Section"
        titleSize="15px"
        itemSpace="5px"
      /> -->
      <div class="d-flex gap-05 cursor-pointer text-secondary text-hover-dark" id="ta-add-task-button" v-on:click="showCreateTaskModal">
        <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon> <span id="ta-add-task-text" class="">New Task</span>
      </div>
      <div class="d-flex gap-05 ml-1 cursor-pointer text-secondary text-hover-dark" id="ta-add-section-button" v-on:click="createSectionInline('true')" >
        <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon> <span id="ta-add-section-text" class="">New Section</span>
      </div>
    </div>
    <div class="action-right d-flex gap-05" id="ta-action-right">
      <ul class="actions" id="ta-action-right-actions">
        <li class="action" id="ta-action1">
          <span id="ta-action1-text" class="mr-025">Viewing</span>
          <div id="ta-action1-ddwrap" class="shape-rounded bg-dark bg-hover-gray1 width-105 height-105 d-flex justify-center align-center">
            <bib-button pop="eye-open" icon-variant="white" size="sm">
              <template v-slot:menu>
                <div id="ta-action1-dd" class="list">
                  <span id="ta-action1-dd1" class="list__item orange">Incomplete</span>
                  <span id="ta-action1-dd2" class="list__item purple">Completed</span>
                  <span id="ta-action1-dd3" class="list__item dark">All</span>
                </div>
              </template>
            </bib-button>
          </div>
        </li>
        <li class="action" id="ta-action2">
          <span id="ta-action2-text" class="mr-025">Sorted by</span>
          <div id="ta-action2-ddwrap" class="shape-rounded bg-dark bg-hover-gray1 width-105 height-105 d-flex justify-center align-center">
            <bib-button pop="swap-vertical" icon-variant="white" size="sm">
              <template v-slot:menu>
                <div id="ta-action2-dd" class="list">
                  <span id="ta-action2-dd1" class="list__item primary" @click="sortBy('name')">Name</span>
                  <span id="ta-action2-dd3" class="list__item secondary" @click="sortBy('owner')">Owner</span>
                  <span id="ta-action2-dd4" class="list__item warning" @click="sortBy('status')">Status</span>
                  <span id="ta-action2-dd4" class="list__item danger" @click="sortBy('startDate')">Start Date</span>
                  <span id="ta-action2-dd6" class="list__item success" @click="sortBy('dueDate')">Due Date</span>
                  <span id="ta-action2-dd7" class="list__item dark" @click="sortBy('priority')">Priority</span>
                </div>
              </template>
            </bib-button>
          </div>
        </li>
        <li class="action" id="ta-action3">
          <span id="ta-action3-text" class="mr-025">Filter by</span>
          <bib-button pop="filter-horizontal" class="bg-dark bg-hover-gray1" icon-variant="white" size="sm">
            <template v-slot:menu>
              <div id="ta-action3-dd" class="list filter of-y-scroll" style="max-height:8rem;">
                <span id="ta-action3-dd1" class="list__item">Enter keyword</span>
                <hr>
                <span id="ta-action3-dd2" class="list__item filter">
                  <!-- <bib-checkbox value="projectName" label="Name" name="project-name"></bib-checkbox> -->
                  <bib-input type="text" label="Name" name="name" placeholder="Enter name" size="sm"></bib-input>
                </span>
                <span id="ta-action3-dd3" class="list__item filter">
                  <!-- <bib-checkbox value="projectName" label="Name" name="project-name"></bib-checkbox> -->
                  <bib-input type="text" label="Project" name="project" placeholder="Enter project name" size="sm"></bib-input>
                </span>
                <span id="ta-action3-dd4" class="list__item filter">
                  <!-- <bib-checkbox value="projectName" label="Name" name="project-name"></bib-checkbox> -->
                  <bib-input type="text" label="Owner" name="owner" placeholder="Enter owner name" size="sm"></bib-input>
                </span>
                <span id="ta-action3-dd5" class="list__item filter">
                  <bib-input type="text" label="Status" name="status" placeholder="Search for status" size="sm"></bib-input>
                </span>
                <span id="ta-action3-dd6" class="list__item filter">
                  <bib-input type="text" label="Priority" name="priority" placeholder="Search for priority" size="sm"></bib-input>
                </span>
                <span id="ta-action3-dd7" class="list__item filter">
                  <bib-input type="date" label="Start date" name="start-date" placeholder="Start date" size="sm"></bib-input>
                </span>
                <span id="ta-action3-dd8" class="list__item filter"></span>
                <span id="ta-action3-dd9" class="list__item filter"></span>
              </div>
            </template>
          </bib-button>
        </li>
        <!-- <li class="action" id="ta-action4">
          <bib-icon icon="group" />
          <span id="ta-action4-text">Group</span>
        </li> -->
        <li class="action" id="ta-action5">
          <span class="mr-025" id="ta-action5-text">View</span>
          <div class="d-flex width-105 height-105 align-center justify-center bg-dark bg-hover-gray1 shape-rounded p-025 cursor-pointer" id="ta-action5-link">
            <bib-icon v-if="gridType == 'list'" icon="apps-large" variant="white" @click.native="changeGridType('grid')"></bib-icon>
            <bib-icon v-if="gridType == 'grid'" icon="list" variant="white" @click.native="changeGridType('list')"></bib-icon>
          </div>
        </li>
        <!-- <li class="action" id="ta-action6">
          <a href="#" id="ta-action6-link">
            <bib-icon icon="horizontal-dots" />
          </a>
        </li> -->
      </ul>
    </div>
    <!-- <task-modals
      @create-task="
        (task) => {
          createTask(task);
        }
      "
      @create-section="
        (section) => {
          createSection(section);
        }
      "
      ref="modals"
    ></task-modals> -->
  </div>
</template>
<script>
export default {
  props: {
    gridType: {
      type: String,
      default: "list",
    }
  },
  data() {
    return {
      selectInfo: null
    };
  },
  methods: {
    changeGridType($event) {
      this.$nuxt.$emit("change-grid-type", $event);
    },
    showCreateTaskModal() {
      this.$emit("create-task", false) //event will be captured by parent only
      this.$nuxt.$emit("create-task", false) //event will be available to all
    },
    showCreateSectionModal() {
      this.$refs.modals.showCreateSectionModal = true;
    },
    createSectionInline($event){
      this.$emit("create-section", $event)
      this.$nuxt.$emit("create-section", $event)
    },
    async createTask(task) {
      //COLLECTING FOLDER INFO
      console.log(task);
      // if (task.title != "" && task.title !== "") {
      //   try {
      //     const response = await this.$axios.$post("/task", {
      //       company: task.company,
      //       status: task.status,
      //       title: task.title,
      //       description: task.description,
      //       dueDate: task.dueDate,
      //       priority: task.priority,
      //       budget: task.budget,
      //       section: task.section,
      //     });

      //     this.$refs.modals.showCreateTaskModal = false;
      //     this.$refs.modals.modalSize = "md";
      //     this.$emit("change-data");
      //   } catch (err) {
      //     console.log(err);
      //   }
      // }
    },
    async createSection(section) {
      if (section.name != "") {
        try {
          await this.$axios.$post("/section", {
            title: section.name,
          });
          this.$refs.modals.showCreateSectionModal = false;
          this.$emit("change-data");
        } catch (err) {
          console.log(err);
        }
      }
    },

    sortBy(value) {
      this.$store.dispatch('section/sortSections', value)
    }
  },
};

</script>
<style scoped lang="scss">
.task-actions {
  display: flex;
  border-bottom: 1px solid $gray4;
  align-items: center;
}

.action-right {
  margin-left: auto;
}

.actions {
  display: flex;
  color: $gray1;

  span {
    margin-left: 5px;
    font-size: 13px;
  }

  svg,
  svg g {
    fill: $gray1;
  }
}

.action {
  display: flex;
  padding: 0 20px;
  align-items: center;
}

.button {
  .list.filter {
    .list__item {
      height: auto;

      .input--sm {
        input {
          min-height: 1.75rem;
        }
      }
    }

  }
}

</style>
