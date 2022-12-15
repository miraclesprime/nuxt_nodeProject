<template>
  <client-only>
    <div id="inbox-wrapper" class="inbox-wrapper d-flex h-100">
      <main class="position-relative">
        <page-title title="Inbox" :avatar="'I'"></page-title>
        <nav id="inbox-nav" class="d-flex align-center gap-05 py-05 px-025 border-bottom-light">
          <div id="inbox-action-wrapper" class="action-left">
            <div class="d-flex gap-05 shape-rounded py-025 px-05 cursor-pointer text-success bg-success-sub6 bg-hover-success-sub3" id="inbox-add-project-button" v-on:click="$nuxt.$emit('create-project-modal')">
              <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon> <span id="inbox-add-project-text">New Project</span>
            </div>
          </div>
          <div class="action-right" id="pa-action-right">
            <!-- <ul class="actions" id="pa-actions-list">
            <li class="action" id="pa-action-item1">
              <sorting-comp label="Viewing" :items="viewing" icon="eye-open" v-on:change-sort="viewProjects($event)"></sorting-comp>
            </li>
            <li class="action" id="pa-action-item3">
              <sorting-comp label="Sorted by" :items="sorting" icon="swap-vertical" v-on:change-sort="sortBy($event)"></sorting-comp>
            </li>
          </ul> -->
          </div>
        </nav>
        <div class="position-relative h-100 of-scroll-y">
          <div v-for="n in combinedInbox">
            <inbox-item :item="n" :key="n.id" @task-click="fetchTask" @project-click="fetchProject" :active="active"></inbox-item>
          </div>
          <loading :loading="loading"></loading>
        </div>
      </main>
      <aside class="position-relative bg-white border-left-gray4">
        <inbox-task v-if="taskProject == 'task'" :task="task"></inbox-task>
        <inbox-project v-if="taskProject == 'project'" :project="project"></inbox-project>
        <figure v-if="taskProject == ''" class="position-absolute d-flex align-center justify-center" style="inset:45%; z-index: 5;">
          <bib-icon icon="bib-logo" variant="light" :scale="3"></bib-icon>
        </figure>
        <loading :loading="loading2"></loading>
      </aside>
    </div>
  </client-only>
</template>
<script>
import { mapGetters } from 'vuex'
export default {

  name: 'Inbox',

  data() {
    return {
      loading: false,
      loading2: false,
      inbox: [],
      task: {},
      project: {},
      active: 0,
      taskProject: '',
    }
  },
  computed: {
    ...mapGetters({
      token: "token/getToken"
    }),
    combinedInbox(){
      let inbox2 = []
      
      this.inbox.forEach(i => {
        // inbox2.push(i)
        let lastinbox2 = inbox2.slice(-1)[0]
        // console.log(inbox2.length, i.taskId, i.projectId, i.userId)
        if (inbox2.length == 0) {
          inbox2.push(i)
          return
        }
        if((lastinbox2?.taskId == i.taskId || lastinbox2?.projectId == i.projectId) && lastinbox2.userId == i.userId){
          if (!lastinbox2?.content) {
            lastinbox2['content'] = []
          } 
          if (!lastinbox2?.comment) {
            lastinbox2['comment'] = []
          }
          lastinbox2.content.push({ title: i.text, time: this.$toTime(i.updatedAt) })
          if (i.taskComment) {
            lastinbox2.comment.push( i.taskComment )
          }
          if (i.projectComment) {
            lastinbox2.comment.push( i.projectComment )
          }
          inbox2[inbox2.length - 1] = lastinbox2
        } else {
          inbox2.push(i)
        }
      })
      return inbox2
    }
  },
  mounted() {
    this.loading = true

    this.$axios.get('user/user-history', {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("accessToken"),
      }
    }).then(i => {
      this.inbox = i.data.data
      this.loading = false
      this.switchTaskProject()

    }).catch(e => {
      console.warn(e)
      this.loading = false
    })
  },
  methods: {
    switchTaskProject() {
      this.active = this.inbox[0].id
      // console.log('active->', this.inbox[0].id)
      if (this.inbox[0].taskId) {
        // console.log('taskId->', this.inbox[0].taskId);
        this.taskProject = "task"
        this.fetchTask({ id: this.inbox[0].id, taskId: this.inbox[0].taskId })
      }
      if (this.inbox[0].projectId) {
        // console.log('projectId->', this.inbox[0].projectId);
        this.taskProject = "project"
        this.fetchProject({ id: this.inbox[0].id, projectId: this.inbox[0].projectId })
      }
    },
    fetchTask(payload) {
      // console.info(payload)
      this.active = payload.id
      this.project = {}
      // console.log(payload)
      this.loading2 = true
      this.taskProject = "task"
      this.$store.dispatch("task/fetchSingleTask", payload.taskId)
        .then(i => {
          // console.log('inbox task->',i.data)
          this.task = i.data
          this.loading2 = false
        })
        .catch(e => {
          console.warn(e)
          this.loading2 = false
        })
    },
    fetchProject(payload) {
      // console.info(payload)
      this.active = payload.id
      this.task = {}
      this.loading2 = true
      this.taskProject = "project"
      this.$store.dispatch("project/fetchSingleProject", payload.projectId)
        .then(p => {
          // console.log(p)
          this.project = p.data
          this.loading2 = false
        })
        .catch(e => {
          console.warn(e)
          this.loading2 = false
        })
    }
  },
}

</script>
<style lang="scss" scoped>
.inbox-wrapper {
  main {
    flex: 1 1 auto;
  }

  aside {
    flex: 0 0 $sidebar-width;
  }
}

</style>
