<template>
  <div id="project-action-wrapper" class="task-actions ml-05">
    <div id="pa-add-project-wrapper" class="action-left">
      <!-- <section-title
        title="Add Task/Section"
        titleSize="15px"
        itemSpace="5px"
      /> -->
      <div class="d-flex gap-05 cursor-pointer text-secondary text-hover-dark" id="pa-add-project-button" v-on:click="showCreateTaskModal">
        <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon> <span id="ta-add-task-text">New Project</span>
      </div>
      <!-- <bib-button pop="add" label="Add Project" size="sm"></bib-button> -->
    </div>
    <div class="action-right" id="pa-action-right">
      <ul class="actions" id="pa-actions-list">
        <li class="action" id="pa-action-item1">
          <sorting-comp label="Viewing" :items="viewing" icon="eye-open" v-on:change-sort="changeViewName" ></sorting-comp>
        </li>
        <li class="action" id="pa-action-item2">
          <span id="pa-action-item2-text" class="mr-025">Filter By:</span>
          <div class="shape-rounded bg-dark width-105 height-105 d-flex justify-center align-center">
            <bib-button pop="filter-horizontal" icon-variant="white" size="sm">
              <template v-slot:menu>
                <div class="list" id="pa-item2-dropdown">
                  <span id="pa-item2-dropdown-el1" class="list__item" @click="changeViewName('Incompleted Tasks')">Incompleted Tasks</span>
                  <span id="pa-item2-dropdown-el2" class="list__item" @click="changeViewName('Completed Tasks')">Completed Tasks</span>
                  <span id="pa-item2-dropdown-el3" class="list__item" @click="changeViewName('All')">All</span>
                </div>
              </template>
            </bib-button>
          </div>
        </li>
        <li class="action" id="pa-action-item3">
          <sorting-comp label="Sorted by" :items="sorting" icon="swap-vertical" v-on:change-sort="changeSortName"></sorting-comp>
        </li>
        <!-- <li class="action" id="pa-action-item4">
          <span id="pa-action-item4-text" class="mr-025">Views</span>
          <div class="d-flex width-105 height-105 align-center justify-center bg-dark shape-rounded p-025" id="pa-action5-link">
            <bib-icon v-if="gridType == 'list'" icon="apps-large" variant="white" @click.native="changeGridType('grid')"></bib-icon>
            <bib-icon v-if="gridType == 'grid'" icon="list" variant="white" @click.native="changeGridType('list')"></bib-icon>
          </div>
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
import { VIEW_FILTER, PROJECT_SORT } from 'config/constants.js'
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
      selectInfo: null,
      selectedView: 'All',
      selectedSort: null,
      viewing: VIEW_FILTER,
      sorting: PROJECT_SORT
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

    changeViewName(view) {
      this.selectedView = view;
    },

    changeSortName(sortName) {
      this.selectedSort = sortName;
    }
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
