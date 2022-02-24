<template>
  <div id="task-actions-wrapper" class="task-actions ml-05">
    <div class="action-left d-flex " id="ta-action-left">
      <!-- <section-title
        title="Add Task/Section"
        titleSize="15px"
        itemSpace="5px"
      /> -->
      <div class="d-flex gap-05 cursor-pointer text-secondary text-hover-dark" id="ta-add-task-button">
        <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon> <span id="ta-add-task-text" class="">New Task</span>
      </div>
      <div class="d-flex gap-05 ml-1 cursor-pointer text-secondary text-hover-dark" id="ta-add-section-button">
        <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon> <span id="ta-add-section-text" class="">New Section</span>
      </div>
    </div>
    <div class="action-right d-flex gap-05" id="ta-action-right">
      <ul class="actions" id="ta-action-right-actions">
        <li class="action" id="ta-action1">
          <span id="ta-action1-text">Viewing</span>
          <bib-button pop="eye-open">
            <template v-slot:menu>
              <div class="list">
                <span class="list__item">Incomplete</span>
                <span class="list__item">Completed</span>
                <span class="list__item primary">All</span>
              </div>
            </template>
          </bib-button>
        </li>
        <li class="action" id="ta-action2">
          <span id="ta-action2-text">Sorted by</span>
          <bib-button pop="swap-vertical">
            <template v-slot:menu>
              <div class="list">
                <span class="list__item">Name</span>
                <span class="list__item">Project</span>
                <span class="list__item">Owner</span>
                <span class="list__item">Status</span>
                <span class="list__item">Start Date</span>
                <span class="list__item">Due Date</span>
                <span class="list__item">Priority</span>
              </div>
            </template>
          </bib-button>
        </li>
        <li class="action" id="ta-action3">
          <span id="ta-action3-text">Filter by</span>
          <bib-button pop="filter-horizontal">
            <template v-slot:menu>
              <div class="list filter">
                <span class="list__item">Enter keyword</span>
                <hr>
                <span class="list__item filter">
                  <!-- <bib-checkbox value="projectName" label="Name" name="project-name"></bib-checkbox> -->
                  <bib-input type="text" label="Name" name="name" placeholder="Enter name" size="sm"></bib-input>
                </span>
                <span class="list__item filter">
                  <!-- <bib-checkbox value="projectName" label="Name" name="project-name"></bib-checkbox> -->
                  <bib-input type="text" label="Project" name="project" placeholder="Enter project name" size="sm"></bib-input>
                </span>
                <span class="list__item filter">
                  <!-- <bib-checkbox value="projectName" label="Name" name="project-name"></bib-checkbox> -->
                  <bib-input type="text" label="Owner" name="owner" placeholder="Enter owner name" size="sm"></bib-input>
                </span>
                <span class="list__item filter"></span>
                <span class="list__item filter"></span>
                <span class="list__item filter"></span>
                <span class="list__item filter"></span>
                <span class="list__item filter"></span>
              </div>
            </template>
          </bib-button>
        </li>
        <!-- <li class="action" id="ta-action4">
          <bib-icon icon="group" />
          <span id="ta-action4-text">Group</span>
        </li> -->
        <li class="action" id="ta-action5">
          <span style="margin-right: 5px" id="ta-action5-text">View</span>
          <a href="#" class="grid-type" id="ta-action5-link" @click.prevent="changeGridType('list')">
            <bib-icon icon="list" />
            <bib-icon icon="apps-large" />
          </a>
          <!-- <a href="#" class="grid-type" id="ta-action5-link2" @click.prevent="changeGridType('grid')">
            <bib-icon icon="apps-large"  />
          </a> -->
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
      type: this.gridType,
      selectInfo: null
    };
  },
  methods: {
    changeGridType(gType) {
      this.type = gType;
      this.$root.$emit("change-grid-type", this.type);
    },
    showCreateTaskModal(data) {
      this.$refs.modals.modalSize = "lg";
      this.$refs.modals.showCreateTaskModal = true;
      this.selectInfo = data;
    },
    showCreateSectionModal() {
      this.$refs.modals.showCreateSectionModal = true;
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
  },
};

</script>
<style scoped lang="scss">
.task-actions {
  display: flex;
  padding: 8px 0;
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

.custom-control-label {
  &::before {
    position: static;
    transform: none;
  }

  svg {
    left: 2px;
  }
}

.grid-type {
  border: 1px solid $gray4;
  padding: 2px 3px 0px;
  border-radius: 5px;
}

</style>
