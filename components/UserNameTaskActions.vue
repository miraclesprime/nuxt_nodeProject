<template>
  <div id="task-actions-wrapper" class="task-actions p-025 bg-white">
    <div class="action-left d-flex " id="ta-action-left">
      <div class="d-flex gap-05 py-025 px-05 shape-rounded cursor-pointer text-success bg-success-sub6 bg-hover-success-sub3 " id="ta-add-task-button" v-on:click.stop="showCreateTaskModal">
        <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon> <span id="ta-add-task-text" class="">New Task</span>
      </div>
    </div>
    <div class="action-right d-flex gap-05" id="ta-action-right">
      <template>
        <bib-input size="sm" type="text" v-model="searchText" name="name" @input="$emit('search-user-tasks', searchText)" placeholder="Search User Tasks..." :variant="searchText.length > 50 ? 'alert': ''"></bib-input>
      </template>
      <ul class="actions" id="ta-action-right-actions">
        <li class="action" id="ta-action1" v-tooltip="'View'">
          <sorting-comp :items="viewing" icon="eye-open" activeIcon="tick" v-on:change-sort="changeViewName"></sorting-comp>
        </li>
        <li class="action" id="ta-action3" title="Group by"  v-tooltip="'Group By'">
          <sorting-comp label="Group by" :items="groupBy" icon="accessibility-braille-solid" v-on:change-sort="groupTasks($event)"></sorting-comp>
        </li>
    
        <li class="action" id="ta-action2" v-tooltip="'Sort By'">
          <sorting-comp :items="sorting" icon="swap-vertical" v-on:change-sort="sortBy"></sorting-comp>
        </li>
        
      </ul>
    </div>
    
  </div>
</template>

<script>
import { VIEW_FILTER, COMPANY_TASK_SORT,PROJECT_GROUP } from 'config/constants.js'
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
      searchText: '',
      selectInfo: null,
      sortName: '',
      groupBy:PROJECT_GROUP,
      viewing: VIEW_FILTER,
      sorting: COMPANY_TASK_SORT
    };
  },
  methods: {
    showCreateTaskModal() {
      this.$emit("new-task", false) //event will be captured by parent only
    },
    async createTask(task) {
      console.log(task);
    },


    groupTasks($event) {
      this.$emit("userTaskGroup", $event)
    },
    sortBy($event) {
      this.$emit("userTaskSort", $event)
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
