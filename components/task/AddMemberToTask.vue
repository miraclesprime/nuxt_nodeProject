<template>
  <div id="create-team-modal-wrapper">
    <bib-modal-wrapper @close="showTaskTeamModal = false" v-show="showTaskTeamModal" :title="'Assign people to task - '+localtask.title" id="create-team" @keypress.native="bindEnter($event, 'create-team-task-btn')">
      <template v-slot:content>
        <div v-if="showTaskTeamModal" style="min-height: 12rem;">
          <task-team :task="localtask"></task-team>
          <loading :loading="loading"></loading>
        </div>
      </template>
    </bib-modal-wrapper>
    
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: "AddMemberToTask",
  data() {
    return {
      showTaskTeamModal: false,
      localtask: {},
      member: "",
      team: [],
      filterKey: "",
      error: false,
      loading: false,
      message: "",
    };
  },

  watch: {
    showTaskTeamModal(newValue){
      if (newValue) {
        this.localtask = this.task
      } else {
        this.localtask = {}
      }
    },
  },

  computed: {
    ...mapGetters({
      user: "user/getUser",
      project: "project/getSingleProject",
      taskMembers: "task/getTaskMembers",
      teamMembers: "user/getTeamMembers",
      task: "task/getSelectedTask",
    }),
    filterTeam() {
      let regex = new RegExp(this.filterKey, 'g\i')

      return this.teamMembers.filter((u) => {
        if (regex.test(u.label) || regex.test(u.email)) {
          return u
        }
      })
    },
    taskUrl() {
      return process.env.VUE_APP_URL + "/task/" + this.task.id
    }
  },
  methods: {

    teamInputChange() {
      console.log('team input change')
    },
    teamInputKeydown($event) {
      this.filterKey = $event
    },
    teamItemClick(tm) {
      let existing = this.taskMembers.filter(ex => ex.id == tm.id)
      if (existing.length == 0) {
        this.message = ""
        let m = this.teamMembers.filter(t => t.id == tm.id)
        if (this.team.some(el => el.id == m[0].id)) {
          return false
        }
        this.team.push(m[0])
      } else {
        this.message = "User already exists"
      }
    },
    inviteViaEmail() {
      console.log('inviteViaEmail')
    },
    removeMember(tm) {
      let rm = this.team.map(t => t.id == tm.id)
      this.team.splice(rm.indexOf(true), 1)
    },
    bindEnter(event, button) {
      if (event.key == "Enter") {
        document.getElementById(button).click();
        return false;
      }
    },
    
  },

};

</script>
<style lang="scss" scoped>
::v-deep {
  .modal__wrapper {
    .modal__wrapper__header {
      padding: 1rem 1.5rem 0;

      span {
        font-weight: bold;
      }
    }

    .modal__wrapper__content {
      padding: 1.5rem;
      position: relative;
    }

    .modal__wrapper__footer {
      padding: 0 1.5rem 1rem;
    }
  }
}

</style>
