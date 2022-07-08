<template>
  <div id="goal-action-wrapper" class="task-actions ml-05">
    <div id="ga-add-goal-wrapper" class="action-left">
      <div class="d-flex gap-05 cursor-pointer text-secondary text-hover-dark" id="pa-add-goal-button" v-on:click="openCreateGoalModal">
        <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon> <span id="ta-add-task-text">New Goal</span>
      </div>
    </div>
    <div class="action-right" id="ga-action-right">
      <ul class="actions" id="ga-actions-list">
        <li class="action" id="ga-action-item1">
          <sorting-comp label="Viewing" :items="viewing" icon="eye-open" v-on:change-sort="viewGoals($event)"></sorting-comp>
        </li>
        
        <li class="action" id="ga-action-item3">
          <sorting-comp label="Sorted by" :items="sorting" icon="swap-vertical" v-on:change-sort="sortBy($event)"></sorting-comp>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { GOAL_VIEW_FILTER, GOAL_SORT } from 'config/constants.js'

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
      viewing: GOAL_VIEW_FILTER,
      sorting: GOAL_SORT
    };
  },
  
  methods: {
    openCreateGoalModal(){
      this.$emit('goal-create-modal', true)
    }
    ,
    viewGoals($event) {
    //   this.$emit("loading", true)
    //   this.$store.dispatch('project/fetchProjects', $event).then(() => { this.$emit("loading", false) })
    //   this.selectedView = $event;
    //   this.$emit('viewValue', $event)
    },

    sortBy($event) {
      if(this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      this.$store.dispatch('goals/sortGoals', {key: $event, order: this.orderBy})
      this.selectedSort = $event;
      this.$emit('sortValue', $event)
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
