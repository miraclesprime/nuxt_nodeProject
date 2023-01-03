<template>
  <div id="project-action-wrapper" class="task-actions py-025 ml-025">
    <div id="pa-add-project-wrapper" class="action-left">
      <div class="d-flex gap-05 shape-rounded py-025 px-05 cursor-pointer text-success bg-success-sub6 bg-hover-success-sub3" id="pa-add-project-button" v-on:click="showCreateTaskModal">
        <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon> <span id="ta-add-task-text">New Project</span>
      </div>
    </div>
    <div class="action-right" id="pa-action-right">
      <ul class="actions" id="pa-actions-list">
        <li class="action" id="pa-action-item1">
          <sorting-comp label="Viewing" :items="viewing" icon="eye-open" v-on:change-sort="viewProjects($event)"></sorting-comp>
        </li>
        <!-- <li class="action" id="pa-action-item2">
          <span id="pa-action-item2-text" class="mr-025">Filter By:</span>
          <div class="shape-rounded bg-dark width-105 height-105 d-flex justify-center align-center">
            <bib-button pop="filter-horizontal" icon-variant="white" size="sm">
            </bib-button>
          </div>
        </li> -->
        <li class="action" id="pa-action-item3">
          <sorting-comp label="Sorted by" :items="sorting" icon="swap-vertical" v-on:change-sort="sortBy($event)"></sorting-comp>
        </li>
      </ul>
    </div>
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
      orderBy: '',
      viewing: VIEW_FILTER,
      sorting: PROJECT_SORT
    };
  },
  
  methods: {
    showCreateTaskModal(data) {
      this.$nuxt.$emit("create-project-modal");
      this.selectInfo = data;
    },

    showCreateSectionModal() {
      this.$refs.modals.showCreateSectionModal = true;
    },

    async createTask(task) {
      console.log(task);
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

    viewProjects($event) {
      this.$emit("loading", true)
      this.$store.dispatch('project/fetchProjects', $event).then(() => { this.$emit("loading", false) })
      this.selectedView = $event;
      this.$emit('viewValue', $event)
    },

    sortBy($event) {
      if(this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      this.$store.dispatch('project/sortProjects', {key: $event, order: this.orderBy})
      this.selectedSort = $event;
      this.$emit('sortValue', $event)
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