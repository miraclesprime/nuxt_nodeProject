<template>
  <div id="task-team-wrapper" class="task-group w-100">
    <project-team-action />
    <loading :loading="loading"></loading>
    <template v-if="projectMembers.length">
      <bib-table
        :key="'tt-' + key"
        :fields="tableFields"
        class="border-gray4 bg-white"
        :sections="projectMembers"
        :hide-no-column="true"
      >
        <template #cell(name)="data">
          <div class="d-flex gap-05">
            <bib-avatar
              class="mt-auto mb-auto"
              size="1.5rem"
            >
            </bib-avatar>
            <span class="text-dark">
              {{ data.value.name }}
            </span>
          </div>
        </template>
      </bib-table>
    </template>

    <template v-else>
      <span
        id="projects-0"
        class="d-flex gap-1 align-center m-1 bg-warning-sub3 border-warning shape-rounded py-05 px-1">
        <bib-icon icon="warning"></bib-icon> No records found
      </span>
    </template>
  </div>
</template>

<script>
import { PROJECT_TEAM_FIELDS } from "../../../config/constants";
import {mapGetters} from 'vuex';

export default {
  data: function () {
    return {
      tableFields: PROJECT_TEAM_FIELDS,
      flag: false,
      key: 0
    };
  },

  computed: {
    ...mapGetters({
        projectMembers: 'project/getProjectMembers'
    }),

    loading() {
      if (this.projectMembers != null) {
        return false
      } else {
        return true
      }
    },
  },

  mounted() {
    this.$store.dispatch('project/fetchTeamMember', {projectId: this.$route.params.id})
  },

  created() {
    this.$root.$on('update-key', ($event) => {
      this.$store.dispatch('project/fetchTeamMember', {projectId: this.$route.params.id}).then(() => {
        this.key += $event
      })
    })
  }
};
</script>

<style scoped lang="scss">
.task-group {
  margin-bottom: 3rem;
}

::v-deep {
  .task-key {
    width: 4%;
    justify-content: center;
  }
  .task-name {
    width: 50%;
  }
  .task-location {
    width: 16%;
  }
  .task-position {
    width: 15%;
  }
  .task-options {
    width: 15%;
  }
}
</style>