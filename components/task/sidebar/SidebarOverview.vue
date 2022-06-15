<template>
  <div id="sidebar-overview-wrapper" class="sidebar-overview-wrapper py-05 px-105">
    <div class="d-flex justify-between sub-title pb-05">
      <p class="text-gray6 ">Subtasks </p>
      <sorting-comp :items="sortingItems" icon="swap-vertical"></sorting-comp>
    </div>
    <task-group title="Subtasks"></task-group>
    <div class="task-team" id="sidebar-team">
      <div class="container" id="sidebar-container">
        <div class="team-list w-100" id="sidebar-team-heading">
          Team
          <div class="teammate active" id="sidebar-team-active">
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
import { TEAMMATES } from '~/config/constants.js'
import { mapGetters } from 'vuex';

export default {
  /*props: {
    activeTask: Object,
  },*/
  data() {
    return {
      // loading: true,
      sortingItems: [
        { label: "Due Date", value:"dueDate" },
        { label: "Assignee", value:"assignee" },
        { label: "Priority", value:"priority" },
        { label: "Status", value:"status" },
      ],
      
      isContentExpanded: false,
      form: {
        profile: "",
      },
      teammates: TEAMMATES,
      activeMate: 0,
    };
  },

  computed: {
    ...mapGetters({
      currentTask: 'task/getSelectedTask',
      project: "project/getSingleProject",
      // sections: "section/getProjectSections",
    }),

  },

  methods: {


  }
};

</script>
<style lang="scss" scoped>
.sidebar-overview-wrapper { align-self: end; display: grid; grid-template-columns: 1fr; grid-auto-flow: row; }
.sub-title { font-size: 14px; border-bottom: 1px solid var(--bib-gray4);}
.task-info {
  padding: 1rem 0;
  position: relative;
}

.task-team {
  align-self: end;
  padding: 1rem 0;
  margin-left: -1.5rem;
  margin-right: -1.5rem;
  margin-bottom: -0.5rem;
  margin-top: auto;
  background-color: $gray3;
  border-top: 1px solid $gray4;
}

.team-list {
  display: flex;
  align-items: center;

  a {
    text-decoration: underline;
    color: var(--bib-primary);
  }
}

.teammate {
  border: 1px solid transparent;
  border-radius: 50%;

  &:not(.active) {
    margin-right: -5px;
  }

  &.active {
    margin: 0 12px 0 8px;
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
