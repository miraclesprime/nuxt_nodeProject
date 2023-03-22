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
        <div class="position-relative h-100 of-scroll-y" style="padding-bottom: 2rem;">
          <div v-for="(value, key) in combinedInbox">
            <h4 class="font-md text-gray6 text-capitalize py-05 px-2 border-bottom-light">{{key}}</h4>
            <template v-for="(o, index) in value">
              <inbox-item :item="o" :key="o.id"  @task-click="fetchTask" @project-click="fetchProject" :active="active"></inbox-item>
            </template>
          </div>
          <div ref="infinitescrolltrigger" class="h-8"></div>
          <loading :loading="loading"></loading>
        </div>
      </main>
      <aside class="position-relative bg-white border-left-gray4">
        <inbox-task v-if="taskProject == 'task'" :task="task" @update-key="task = $event"></inbox-task>
        <inbox-project v-if="taskProject == 'project'" :project="project"></inbox-project>
        <figure v-if="taskProject == ''" class="position-absolute d-flex align-center justify-center" style="inset:45%; z-index: 5;">
          <bib-icon icon="bib-logo" variant="light" :scale="3"></bib-icon>
        </figure>
        <!-- <loading :loading="loading2"></loading> -->
      </aside>
    </div>
  </client-only>
</template>
<script>
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
import _ from 'lodash'
export default {

  name: 'Inbox',

  data() {
    return {
      loading: false,
      // loading2: false,
      inbox: [],
      task: {},
      project: {},
      active: 0,
      taskProject: '',
      // inboxStatus: [],
      currentPage: 1,
      pageCount: 1,
    }
  },
  computed: {
    ...mapGetters({
      // token: "token/getToken",
      // inboxStatus: "inbox/getInbox",
    }),
    combinedInbox() {
      let today = [],
        yesterday = [],
        older = [];

      let inbox2 = { today: today, yesterday: yesterday, older: older }

      this.inbox.forEach((item, index) => {
        // let ud = new Date(item.updatedAt).getTime()
        let timeDiff = new Date().getTime() - new Date(item.updatedAt).getTime()
        let daysDiff = Math.round(timeDiff / (1000 * 60 * 60 * 24))
        // console.info(item.id, daysDiff)

        if (daysDiff >= 0 && daysDiff < 1) {
          today.push(item)
          return
        }
        if (daysDiff >= 1 && daysDiff < 2) {
          yesterday.push(item)
          return
        }
        older.push(item)
      })

      let o2 = [],
        t2 = [],
        y2 = []

      today.forEach(o => {
        if (t2.length == 0) {
          t2.push(o)
        }

        let prIndex = t2.findIndex(a => a.userId == o.userId && a?.projectId == o?.projectId)
        let taIndex = t2.findIndex(a => a.userId == o.userId && a?.taskId == o?.taskId)
        // console.log('index->', prIndex, taIndex)

        if (prIndex >= 0) {
          if (!t2[prIndex]?.content) {
            t2[prIndex]['content'] = []
          }
          if (!t2[prIndex]?.comment) {
            t2[prIndex]['comment'] = []
          }
          t2[prIndex].content.push({ title: o.text, time: this.$toTime(o.updatedAt) })
          if (o.projectComment.id) {
            t2[prIndex].comment.push(o.projectComment)
          }
          return
        }

        if (taIndex >= 0) {
          if (!t2[taIndex]?.content) {
            t2[taIndex]['content'] = []
          }
          if (!t2[taIndex]?.comment) {
            t2[taIndex]['comment'] = []
          }
          t2[taIndex].content.push({ title: o.text, time: this.$toTime(o.updatedAt) })
          if (o.taskComment.id) {
            t2[taIndex].comment.push(o.taskComment)
          }
          return
        }

        t2.push(o)

      })

      yesterday.forEach(o => {
        if (y2.length == 0) {
          y2.push(o)
        }

        let prIndex = y2.findIndex(a => a.userId == o.userId && a?.projectId == o?.projectId)
        let taIndex = y2.findIndex(a => a.userId == o.userId && a?.taskId == o?.taskId)

        if (prIndex >= 0) {
          if (!y2[prIndex]?.content) {
            y2[prIndex]['content'] = []
          }
          if (!y2[prIndex]?.comment) {
            y2[prIndex]['comment'] = []
          }
          y2[prIndex].content.push({ title: o.text, time: this.$toTime(o.updatedAt) })
          if (o.projectComment.id) {
            y2[prIndex].comment.push(o.projectComment)
          }
          return
        }

        if (taIndex >= 0) {
          if (!y2[taIndex]?.content) {
            y2[taIndex]['content'] = []
          }
          if (!y2[taIndex]?.comment) {
            y2[taIndex]['comment'] = []
          }
          y2[taIndex].content.push({ title: o.text, time: this.$toTime(o.updatedAt) })
          if (o.taskComment.id) {
            y2[taIndex].comment.push(o.taskComment)
          }
          return
        }

        y2.push(o)
      })

      older.forEach(o => {
        let o2last = o2.slice(-1)[0]
        // console.log(o2.length, i.taskId, i.projectId, i.userId)
        if (o2.length == 0) {
          o2.push(o)
          return
        }
        if ((o2last?.taskId == o.taskId || o2last?.projectId == o.projectId) && o2last.userId == o.userId) {
          if (!o2last?.content) {
            o2last['content'] = []
          }
          if (!o2last?.comment) {
            o2last['comment'] = []
          }
          o2last.content.push({ title: o.text, time: this.$toTime(o.updatedAt) })
          if (o.taskComment.id) {
            o2last.comment.push(o.taskComment)
          }
          if (o.projectComment.id) {
            o2last.comment.push(o.projectComment)
          }
          o2[o2.length - 1] = o2last
        } else {
          o2.push(o)
        }
      })

      return { today: t2, yesterday: y2, older: o2 }
    }
  },
  fetch() {
    this.$axios.get('user/user-history', {
      headers: {
        "page": 1,
        "Authorization": "Bearer " + localStorage.getItem("accessToken"),
      }
    }).then(i => {
      this.inbox = i.data.data
      this.pageCount = i.data.totalPage
      // this.loading = false
      this.switchTaskProject()
    }).catch(e => {
      console.warn(e)
      // this.loading = false
    })
  },
  mounted() {
    this.loading = true

    /*this.$axios.get('user/user-history', {
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
    })*/

    this.$store.dispatch("inbox/fetchInboxEntries").then(res => {
      this.loading = false
    }).catch(err => {
      console.warn(err)
      this.loading = false
    })

    this.scrollTrigger();

  },
  methods: {
    scrollTrigger() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if(entry.intersectionRatio > 0 && this.currentPage < this.pageCount) {
            console.log(this.currentPage, " of ", this.pageCount)
            /*const newdata = _.throttle( () => {
              console.log('throttle trigger')
            }, 1000)*/

            const newdata = _.debounce(() => {
              this.$store.dispatch("user/fetchUserHistory", { page: this.currentPage + 1}).then(h => {
                console.log(h.data)
                if (h.data.statusCode == 200) {
                  this.currentPage++
                  this.inbox = h.data.data
                }
              })
            }, 1500)

            newdata()
          }
        });
      });
      process.nextTick(()=>{
        observer.observe(this.$refs.infinitescrolltrigger);
      });
    },
    testUserTask(arr, item) {
      return arr.findIndex(a => a.userId == item.userId && a.taskId == item.taskId)
    },
    testUserProject(arr, item) {
      return arr.findIndex(a => a.userId == item.userId && a.projectId == item.projectId)
    },
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
      if (payload.id) {
        this.active = payload.id
      }
      this.project = {}
      // console.log(payload)
      // this.loading2 = true
      this.taskProject = "task"
      this.$store.dispatch("task/fetchSingleTask", payload.taskId)
        .then(i => {
          // console.log('inbox task->',i.data)
          this.task = i.data
          // this.loading2 = false
        })
        .catch(e => {
          console.warn(e)
          // this.loading2 = false
        })
    },
    fetchProject(payload) {
      // console.info(payload)
      this.active = payload.id
      this.task = {}
      // this.loading2 = true
      this.taskProject = "project"
      console.log(payload.projectId)
      this.$store.dispatch("project/fetchSingleProject", payload.projectId)
        .then(p => {
          // console.log(p)
          this.project = p.data
          // this.loading2 = false
        })
        .catch(e => {
          console.warn(e)
          // this.loading2 = false
        })
    },

    refreshTask(task) {
      this.task = task
    }

    /*inboxItemStatus(inbox){
      return this.inboxStatus.find(item => item.historyId == inbox.id)
    },*/
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
