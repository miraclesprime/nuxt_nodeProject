<template>
  <div id="task-actions-wrapper" class="task-actions p-025 bg-white">
    <div class="action-left d-flex " id="ta-action-left">
      <div class="d-flex gap-05 py-025 px-05 shape-rounded cursor-pointer text-success bg-success-sub6 bg-hover-success-sub3 " id="ta-add-task-button" v-on:click.stop="showCreateTaskModal">
        <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon> <span id="ta-add-task-text" class="">New Task</span>
      </div>
    </div>
    <div class="action-right d-flex gap-05" id="ta-action-right">
      <ul class="actions" id="ta-action-right-actions">
        <li class="action" id="ta-action1" v-tooltip="'View'">
          <sorting-comp :items="viewing" icon="eye-open" v-on:change-sort="changeViewName"></sorting-comp>
        </li>
        <li class="action" id="ta-action2" v-tooltip="'Sort By'">
          <sorting-comp :items="sorting" icon="swap-vertical" v-on:change-sort="sortBy"></sorting-comp>
        </li>
        
        <li class="action" id="ta-action5">
          <!-- <span class="mr-025" id="ta-action5-text">View</span> -->
          <div class="d-flex width-2 height-2 align-center justify-center bg-light bg-hover-gray2 shape-circle p-025 cursor-pointer" id="ta-action5-link" v-tooltip="'List/Grid'">
            <bib-icon v-if="gridType == 'list'" icon="table" variant="gray6" @click.native="changeGridType('grid')"></bib-icon>
            <bib-icon v-if="gridType == 'grid'" icon="list" variant="gray6" @click.native="changeGridType('list')"></bib-icon>
          </div>
        </li>
      </ul>
    </div>
    
  </div>
</template>

<script>
import { VIEW_FILTER, COMPANY_TASK_SORT } from 'config/constants.js'
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
      sorting: COMPANY_TASK_SORT
    };
  },
  methods: {
    changeGridType($event) {
      this.$emit("change-grid-type", $event);
    },
    showCreateTaskModal() {
      // console.log('show create task modal')
      this.$emit("new-task", false) //event will be captured by parent only
      // this.$nuxt.$emit("new-task", false) //event will be available to all
    },
    async createTask(task) {
      console.log(task);
    },


    sortBy($event) {
      this.$emit("sort", $event)
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
  padding: 0 4px;
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
