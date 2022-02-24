<template>
  <div id="task-actions-wrapper" class="task-actions ml-05">
    <div class="action-left" id="ta-action-left">
      <!-- <section-title
        title="Add Task/Section"
        titleSize="15px"
        itemSpace="5px"
      /> -->

      <bib-button pop="add" label="Add Task/Section" size="sm">
        <template v-slot:menu>
          <div class="list" id="ta-list">
            <span class="list__item" id="ta-list-item1" @click="showCreateTaskModal"
              >Add Task</span
            >
            <span class="list__item" id="ta-list-item2" @click="showCreateSectionModal"
              >Add Section</span
            >
          </div>
        </template>
      </bib-button>
    </div>

    <div class="action-right" id="ta-action-right">
      <ul class="actions" id="ta-action-right-actions">
        <li class="action" id="ta-action1">
          <custom-check-box />

          <span id="ta-action1-text">My items only</span>
        </li>
        <li class="action" id="ta-action2">
          <bib-icon icon="sort" />
          <span id="ta-action2-text">Sort</span>
        </li>
        <li class="action" id="ta-action3">
          <bib-icon icon="filter-horizontal" />
          <span id="ta-action3-text">Filter</span>
        </li>
        <li class="action" id="ta-action4">
          <bib-icon icon="group" />
          <span id="ta-action4-text">Group</span>
        </li>
        <li class="action" id="ta-action5">
          <span style="margin-right: 5px" id="ta-action5-text">Views</span>
          <a href="#" class="grid-type" id="ta-action5-link" @click.prevent="changeGridType('list')">
            <bib-icon
              icon="list"
              :variant="type === 'list' ? 'black' : 'gray'"
            />
          </a>

          <a href="#" class="grid-type" id="ta-action5-link2" @click.prevent="changeGridType('grid')">
            <bib-icon
              icon="kanban"
              :variant="type === 'grid' ? 'black' : 'gray'"
            />
          </a>
        </li>
        <li class="action" id="ta-action6">
          <a href="#" id="ta-action6-link">
            <bib-icon icon="horizontal-dots" />
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