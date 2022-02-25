<template>
  <div id="sidebar-overview-wrapper">
    <div class="container" id='sidebar-wrapper' v-if="activeItem">
      <div class="task-info w-100" id='sidebar-inner-wrap'>
        <div class="row" id='sidebar-row-1'>
          <div class="col-4" id='sidebar-col-1'>
            <bib-input type="select" :options="selectItems" placeholder="Please select..." label="Assignee"></bib-input>
          </div>
          <div class="col-8" id='sidebar-col-2'>
            <!-- <bib-input type="select" :options="projects" placeholder="Please select..." label="Project"></bib-input> -->
            <bib-input type="text" label="Project" :value="project.title" disabled></bib-input>
          </div>
        </div>
        <div class="row" id='sidebar-row-2'>
          <div class="col-4" id='sidebar-col-3'>
            <bib-input type="select" :options="department" placeholder="Please select..." label="Department"></bib-input>
          </div>
          <div class="col-4" id='sidebar-col-4'>
            <bib-input type="select" :value="activeItem.priority ? activeItem.priority.text : ''" :options="priorityValues" placeholder="Please select..." label="Priority"></bib-input>
          </div>
          <div class="col-4" id='sidebar-col-5'>
            <bib-input type="select" :value="activeItem.status ? activeItem.status.text : '' " :options="statusValues" placeholder="Please select..." label="Status"></bib-input>
          </div>
        </div>
        <div class="row" id='sidebar-row-3'>
          <div class="col-12" id='sidebar-col-6'>
            <bib-input type="textarea" :value="activeItem.description" placeholder="Enter task description..." label="Description"></bib-input>
          </div>
        </div>
      </div>
      <task-group title="Subtasks"></task-group>
      <div class="task-details w-100" id='sidebar-details'>
        <a href="#" id='sidebar-link' class="title" @click="isContentExpanded = !isContentExpanded">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 48 48">
            <title id='sidebar-icon'>arrowhead-right</title>
            <g id="Layer_2" data-name="Layer 2">
              <g id="invisible_box" data-name="invisible box">
                <rect width="48" height="48" fill="none"></rect>
              </g>
              <g id="icons_Q2" data-name="icons Q2">
                <path d="M27.2,24,16.6,34.6a1.9,1.9,0,0,0,.2,3,2.1,2.1,0,0,0,2.7-.2l11.9-12a1.9,1.9,0,0,0,0-2.8l-11.9-12a2.1,2.1,0,0,0-2.7-.2,1.9,1.9,0,0,0-.2,3Z"></path>
              </g>
            </g>
          </svg>
          Other details
        </a>
        <div class="row" id='sidebar-row-4' v-if="isContentExpanded">
          <div class="col-4" id='sidebar-col-7'>
            <bib-input type="time" v-model="form.time" placeholder="Select your time" label="Time"></bib-input>
          </div>
          <div class="col-4" id='sidebar-col-8'>
            <bib-input type="text" v-model="form.budget" placeholder="Set your Budget" label="Budget"></bib-input>
          </div>
          <div class="col-4" id='sidebar-col-9'>
            <bib-input type="text" v-model="form.progress" placeholder="Select your progress" label="Progress"></bib-input>
          </div>
        </div>
      </div>
    </div>
    <div class="task-team" id='sidebar-team'>
      <div class="container" id='sidebar-container'>
        <div class="team-list w-100" id='sidebar-team-heading'>
          Team
          <div class="teammate active" id='sidebar-team-active'>
            <bib-avatar size="25px"></bib-avatar>
          </div>
          <template v-for="(item, index) in teammates">
            <div class="teammate" :id="'teammate-' + index" v-if="index !== activeMate" :key="'teammate-' + index" :style="'z-index:' + (100 - index)">
              <bib-avatar size="25px"></bib-avatar>
            </div>
          </template>
          <span class="teammates-count" id='sidebar-team-count'> + {{ teammates.length }} others </span>
          <a href="#" class="ml-auto" id='sidebar-add-team'>Add a team member</a>
        </div>
        <div class="add-comment w-100" id='sidebar-add-comment'>
          <bib-avatar size="40px"></bib-avatar>
          <bib-input type="text" v-model="form.profile" placeholder="Add your comment..."></bib-input>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { TEAMMATES } from "config/constants";
import { mapGetters } from 'vuex';

export default {
  props: {
    activeTask: Object,
  },
  data: function() {
    return {
      // activeItem: this.activeTask,
      selectItems: [
        { label: 'Please Choose One', value: "orange" }
      ],
      statusValues: [
        { label: 'Not Started', value: 'Not Started' },
        { label: 'In-Progress', value: 'In-Progress' },
        { label: 'Waiting', value: 'Waiting' },
        { label: 'Deferred', value: 'Deferred' },
        { label: 'Done', value: 'Done' },
      ],
      priorityValues: [
        { label: 'low', value: 'low' },
        { label: 'medium', value: 'medium' },
        { label: 'high', value: 'high' }
      ],
      projects: [
        // {label: 'Project 1', value: "p1"}
      ],
      department: [
        { label: 'IT', value: "it" }
      ],
      description: "",
      isContentExpanded: false,
      form: {
        time: "08:45:25",
        profile: "",
      },
      teammates: TEAMMATES,
      activeMate: 0,
    };
  },
  watch: {
    activeTask() {
      this.activeItem = this.activeTask;
    },
  },
  computed: {
    ...mapGetters({
      activeItem: 'task/getSelectedTask',
      project: "project/getSingleProject",
    }),

    /*projects() {
      return { label: this.project.title, value: this.project.id }
    },*/
  },
  
};

</script>
<style lang="scss" scoped>
.task-info {
  padding: 1rem 0;
  font-size: $sidebar-size;
}

.task-team {
  padding: 1rem 0;
  background-color: $gray3;
  border-top: 1px solid $gray4;
}

.team-list {
  display: flex;
  align-items: center;

  a {
    text-decoration: underline;
    color: var(--primary);
  }
}

.teammate {
  border: 1px solid transparent;
  border-radius: 50%;

  &:not(.active) {
    margin-right: -4px;
  }

  &.active {
    margin: 0 13px 0 8px;
  }

  &:hover {
    border-color: $gray1;
  }
}

.teammates-count {
  margin-left: 1rem;
}

.row {
  margin-top: 5px;
}

.task-details {
  padding-bottom: 5px;

  .title {
    width: 100%;
    padding: 8px 0;
    border-top: 1px solid $gray4;
    border-bottom: 1px solid $gray6;
  }

  .row {
    margin-top: 10px;
    font-size: $sidebar-size;
  }
}

.title svg {
  margin: 0 7px 0 5px;
  vertical-align: bottom;
}

.add-comment::v-deep {
  display: flex;
  align-items: center;
  margin-top: 1rem;

  input {
    margin: 0 0 0 10px;
  }
}

</style>
