<template>
  <div id="go-action-wrapper" class="task-actions ml-05">
    <div id="goa-add-goal-wrapper" class="action-left d-flex">
      <div class="d-flex gap-05 cursor-pointer text-secondary text-hover-dark" id="goa-add-project-button" v-on:click.stop="openCreateProjectModal">
        <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon> <span id="goa-add-project-text" class="">New Project</span>
      </div>
      <div class="d-flex gap-05 ml-1 cursor-pointer text-secondary text-hover-dark" id="goa-add-task-button" v-on:click="openCreateTaskModal">
        <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon> <span id="goa-add-task-text" class="">New Task</span>
      </div>
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
    };
  },
  
  methods: {
    openCreateProjectModal(){
      this.$nuxt.$emit('create-project-modal', true)
    },

    openCreateTaskModal() {
      this.$nuxt.$emit('create-task-modal', true)
    },

    viewGoals($event) {
    //   this.$emit("loading", true)
    //   this.$store.dispatch('project/fetchProjects', $event).then(() => { this.$emit("loading", false) })
    //   this.selectedView = $event;
    //   this.$emit('viewValue', $event)
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
