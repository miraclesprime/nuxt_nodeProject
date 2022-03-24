<template>
  <div id="sidebar-overview-wrapper">
    <div class="container" id='sidebar-wrapper'>
      <div class="task-info w-100" id='sidebar-inner-wrap'>
        <!-- <pre>{{activeTask}}</pre> -->
        <!-- <pre>{{activeItem}}</pre> -->
        <div class="row" id='sidebar-row-1'>
          <div class="col-4" id='sidebar-col-1'>
            <bib-input type="select" :options="selectItems" placeholder="Please select..." label="Assignee *"></bib-input>
          </div>
          <div class="col-4" id='sidebar-col-2'>
            <!-- <bib-input type="select" :options="projects" placeholder="Please select..." label="Project"></bib-input> -->
            <bib-input type="text" label="Project" :value="project.title" disabled></bib-input>
          </div>
          <div class="col-4">
            <bib-input type="select" label="Section" :options="sectionOpts" v-model.number="activeItem.sectionId" placeholder="Please select ..." v-on:change.native="debounceUpdate()"></bib-input>
          </div>
        </div>
        <div class="row" id='sidebar-row-2'>
          <div class="col-4" id='sidebar-col-3'>
            <bib-input type="select" label="Department" :options="department" placeholder="Please select..."></bib-input>
          </div>
          <div class="col-4" id='sidebar-col-4'>
            <bib-input type="select" label="Priority" v-model.number="activeItem.priorityId" :options="priorityValues" placeholder="Please select..." v-on:change.native="debounceUpdate()"></bib-input>
          </div>
          <div class="col-4" id='sidebar-col-5'>
            <bib-input type="select" label="Status" v-model.number="activeItem.statusId" :options="statusValues" placeholder="Please select..." v-on:change.native="debounceUpdate()"></bib-input>
          </div>
        </div>
        <div class="row" id='sidebar-row-3'>
          <div class="col-12" id='sidebar-col-6'>
            <bib-input type="textarea" v-model.trim="activeItem.description" placeholder="Enter task description..." label="Description" v-on:keyup.native="debounceUpdate()"></bib-input>
          </div>
        </div>
        
        <bib-button v-if="!activeTask.id" label="Create Task" variant="primary" v-on:click="createTask"></bib-button>
      </div>
      <task-group title="Subtasks"></task-group>
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
import { TEAMMATES, DEPARTMENT, STATUS, PRIORITY } from '~/config/constants.js'
import { mapGetters } from 'vuex';

export default {
  props: {
    activeTask: Object,
  },
  data() {
    return {
      activeItem: {},
      // loading: true,
      selectItems: [
        { label: 'Please Choose One', value: "orange" }
      ],
      statusValues: STATUS,
      priorityValues: PRIORITY,
      projects: [
        // {label: 'Project 1', value: "p1"}
      ],
      department: DEPARTMENT,
      // description: "",
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
      // this.activeItem = this.activeTask;
      if (Object.keys(this.activeTask).length) {
        this.activeItem = JSON.parse(JSON.stringify(this.activeTask));
      } else {
        this.activeItem = {
          sectionId: '',
          projectId: this.project.id,
          statusId: 1,
          priorityId: 2,
          description: '',
          budget: 0,
        }
      }
    },
  },
  computed: {
    ...mapGetters({
      // activeItem: 'task/getSelectedTask',
      project: "project/getSingleProject",
      sections: "section/getProjectSections",
    }),

    sectionOpts() {
      let sec = [{ label: "Select section" }]
      this.sections.forEach((s) => {
        sec.push({ label: s.title, value: s.id })
      });
      return sec
    },

    newTaskForm() {
      return {
        sectionId: this.activeItem.sectionId,
        projectId: this.project.id,
        title: "",
        description: this.activeItem.description,
        dueDate: "",
        priorityId: this.activeItem.priorityId,
        budget: 0,
        statusId: this.activeItem.statusId
      }
    }
  },

  methods: {
    createTask() {
      console.log('create task')
      this.$emit('create-task', this.newTaskForm)
    },

    updateTask() {
      console.log('update task')
      this.$emit('update-task', this.newTaskForm)
    },

    debounceUpdate: _.debounce(function() {
      if(this.activeItem.id) {
        console.log('Debounce clicked!')
        this.updateTask()        
      }

    }, 2000)

  }
};

</script>
<style lang="scss" scoped>
.task-info {
  padding: 1rem 0;
  font-size: $sidebar-size;
  position: relative;
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
