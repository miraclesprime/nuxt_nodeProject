<template>
  <div class="task-actions ml-05">
    <div class="action-left">
      <!-- <section-title
        title="Add Task/Section"
        titleSize="15px"
        itemSpace="5px"
      /> -->

      <bib-button pop="add" label="Add Project" size="sm"></bib-button>
    </div>

    <div class="action-right">
      <ul class="actions">
        <li class="action">
          <span>Viewing: {{selectedView}}</span>
            <bib-button pop="arrow-down">
                <template v-slot:menu>
                    <div class="list">
                        <span class="list__item" @click="changeViewName('Incompleted Tasks')">Incompleted Tasks</span>
                        <span class="list__item" @click="changeViewName('Completed Tasks')">Completed Tasks</span>
                        <span class="list__item" @click="changeViewName('All')">All</span>
                    </div>
                </template>
            </bib-button>
        </li>
        
          <li class="action">
          <span>Filter By:</span>
            <bib-button pop="filter-horizontal">
                <template v-slot:menu>
                    <div class="list">
                        <span class="list__item" @click="changeViewName('Incompleted Tasks')">Incompleted Tasks</span>
                        <span class="list__item" @click="changeViewName('Completed Tasks')">Completed Tasks</span>
                        <span class="list__item" @click="changeViewName('All')">All</span>
                    </div>
                </template>
            </bib-button>
        </li>
       
        <li class="action">
          <span>Sorted By: {{selectedSort}}</span>
            <bib-button pop="swap-vertical">
                <template v-slot:menu>
                    <div class="list">
                        <span class="list__item" @click="changeSortName('Name')">Name</span>
                        <span class="list__item" @click="changeSortName('Project')">Project</span>
                        <span class="list__item" @click="changeSortName('Owner')">Owner</span>
                        <span class="list__item" @click="changeSortName('Status')">Status</span>
                        <span class="list__item" @click="changeSortName('Start Date')">Start Date</span>
                        <span class="list__item" @click="changeSortName('Due Date')">Due Date</span>
                        <span class="list__item" @click="changeSortName('Tag')">Tag</span>
                        <span class="list__item" @click="changeSortName('Team')">Team</span>
                    </div>
                </template>
            </bib-button>
        </li>

        <li class="action">
          <span style="margin-right: 5px">Views</span>
          <a href="#" class="grid-type" @click.prevent="changeGridType('list')">
            <bib-icon
              icon="apps-large"
              :variant="type === 'list' ? 'black' : 'gray'"
            />
          </a>

          <a href="#" class="grid-type" @click.prevent="changeGridType('grid')">
            <bib-icon
              icon="apps-large-solid"
              :variant="type === 'grid' ? 'black' : 'gray'"
            />
          </a>
        </li>

      
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
      selectInfo: null,
      selectedView: null,
      selectedSort: null
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

    changeViewName(viewName) {
      this.selectedView = viewName;
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