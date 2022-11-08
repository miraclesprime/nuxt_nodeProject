<template>
  <div id="task-actions-wrapper" class="task-actions p-025 bg-white">
    <div class="action-left d-flex " id="ta-action-left">
      <div class="d-flex gap-05 shape-rounded py-025 px-05 cursor-pointer text-secondary text-hover-dark bg-hover-gray3" id="ta-add-task-button" v-on:click.stop="showCreateTaskModal">
        <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon> <span id="ta-add-task-text" class="">New Task</span>
      </div>
      <div class="d-flex gap-05 ml-1 shape-rounded py-025 px-05 cursor-pointer text-secondary text-hover-dark bg-hover-gray3" id="ta-add-section-button" v-on:click="createSectionInline('true')">
        <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon> <span id="ta-add-section-text" class="">New Section</span>
      </div>
    </div>
    <div class="action-right d-flex gap-05" id="ta-action-right">
      <ul class="actions" id="ta-action-right-actions">
        <li class="action" id="ta-action1" title="Viewing">
          <sorting-comp label="Viewing" :items="viewing" icon="eye-open" v-on:change-sort="changeViewName"></sorting-comp>
        </li>
        <li class="action" id="ta-action2" title="Sort by">
          <sorting-comp label="Sorted by" :items="sorting" icon="swap-vertical" v-on:change-sort="sortBy"></sorting-comp>
        </li>
        <li class="action" id="ta-action3" title="Group by">
          <sorting-comp label="Group by" :items="groupby" icon="group" v-on:change-sort="groupBy"></sorting-comp>
        </li>
        <li class="action" id="ta-action5">
          <!-- <span class="mr-025" id="ta-action5-text">View</span> -->
          <div class="d-flex width-2 height-2 align-center justify-center bg-light bg-hover-gray2 shape-circle p-025 cursor-pointer" id="ta-action5-link" title="Change view">
            <bib-icon v-if="gridType == 'list'" icon="table" variant="gray6" @click.native="changeGridType('grid')"></bib-icon>
            <bib-icon v-if="gridType == 'grid'" icon="list" variant="gray6" @click.native="changeGridType('list')"></bib-icon>
          </div>
        </li>
      </ul>
    </div>
    
  </div>
</template>

<script>
import { VIEW_FILTER, TASK_SORT, TASK_GROUP } from 'config/constants.js'
export default {
  props: {
    gridType: {
      type: String,
      default: "list",
      sortDir: {default: "asc"}
    }
  },
  data() {
    return {
      selectInfo: null,
      sortName: '',
      viewing: VIEW_FILTER,
      sorting: TASK_SORT,
      groupby: TASK_GROUP,
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
    createSectionInline($event) {
      this.$emit("show-newsection", $event)
      // this.$nuxt.$emit("show-newsection", $event)
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


    sortBy($event) {
      this.$emit("sort", $event)
    },

    groupBy($event) {
      this.$emit("group", $event)
    },

    changeViewName($event){
      this.$emit("filterView", $event)
    }

  },
};

</script>
<style scoped lang="scss">
.task-actions {
  display: flex;
  border-bottom: 1px solid $light;
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
  padding: 0 0.25rem;
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