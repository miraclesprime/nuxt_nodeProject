<template>
  <client-only>
    <div id="inbox-wrapper" class="inbox-wrapper d-flex h-100">
      <main class="position-relative">
        <page-title title="Inbox" ></page-title>
        <!-- <bib-tabs class="border-bottom-light" :tabs="bibTabs" :value="activeTab" @change="handleChange_Tabs"></bib-tabs> -->
        <div class="position-relative h-100  overflow-y-auto" style="background-color: var(--bib-gray9)" >
          <!-- <template v-if="activeTab == 'inbox'"> -->
            <div v-for="(value, key) in combinedInbox">
              <h4 class="font-md text-gray6 text-capitalize py-1 px-105 border-bottom-gray2">{{key}}</h4>
              <template v-for="(o, index) in value">
                <inbox-item :item="o" :key="o.id" @task-click="fetchTask" @project-click="fetchProject" :active="active" :members="members"></inbox-item>
              </template>
            </div>
            <div ref="infinitescrolltrigger" v-show="currentPage <= pageCount" class="align-center justify-center py-05">
              <!-- <bib-spinner variant="gray5"></bib-spinner> -->
              <div class="animated-background w-100" style="height: 2px;"></div>
              <!-- <skeleton-box></skeleton-box> -->
            </div>
          <!-- </template> -->
          <!-- <template v-if="activeTab == 'flagged' || activeTab == 'archived'">
            <div v-for="inb in inboxState" class="py-05 px-1">
              <user-info :userId="inb.userId"></user-info>

              <div class="align-center gap-05 mt-05">
                <tippy arrow >
                  <template slot="trigger">
                    <bib-icon v-if="markFlag" icon="bookmark-solid" variant="success"></bib-icon>
                    <bib-icon v-else icon="bookmark"></bib-icon>
                  </template>
                  <div>Bookmark</div>
                </tippy>
                <tippy arrow>
                  <template slot="trigger">
                    <bib-icon v-if="markArchive" icon="collection-solid" variant="success"></bib-icon>
                    <bib-icon v-else icon="collection"></bib-icon>
                  </template>
                  <div>Archive</div>
                </tippy>
                <tippy arrow>
                  <template slot="trigger">
                    <bib-icon v-if="markRead" icon="mail-new-solid" variant="success"></bib-icon>
                    <bib-icon v-else icon="mail"></bib-icon>
                  </template>
                  <div>Mark read/unread</div>
                </tippy>
              </div>
            </div>
          </template> -->
          <!-- <template v-if="activeTab == 'archived'">
            
          </template> -->
        </div>
      </main>
      <aside class="position-relative bg-white border-left-gray4">
        <inbox-task v-if="taskProject == 'task'" :task="task" @update-key="task = $event"></inbox-task>
        <inbox-project v-if="taskProject == 'project'" :project="project"></inbox-project>
        <div v-if="taskProject == ''" class="position-absolute align-center justify-center" style="inset:5rem; z-index: 2;">
          <!-- <bib-icon icon="bib-logo" variant="light" :scale="3"></bib-icon> -->
          <no-data></no-data>
        </div>
      </aside>
    </div>
  </client-only>
</template>

<script>
import { mapGetters } from 'vuex'
import _ from 'lodash'
import { TippyComponent } from 'vue-tippy';
import "~/assets/tippy-theme.scss";

export default {

  name: 'Inbox',
  components: {
    tippy: TippyComponent,

  },

  data() {
    return {
      // loading: false,
      inbox: [],
      members: [],
      task: {},
      project: {},
      active: 0,
      taskProject: '',
      currentPage: -1,
      pageCount: 1,
      bibTabs: [
        {
          title: "Inbox",
          value: "inbox",
        },
        {
          title: "Flagged",
          value: "flagged",
        },
        {
          title: "Archived",
          value: "archived",
        },
        
      ],
      activeTab: "inbox",
    }
  },
  computed: {
    ...mapGetters({
      inboxState: 'inbox/getInbox'
    }),
    combinedInbox() {

      const organizedData = {
        today: [],
        yesterday: [],
        older: []
      };

      const now = new Date(); 

      this.inbox.forEach(entry => {
        const updatedAt = new Date(entry.updatedAt);

        const timeDifference = now - updatedAt;

        const timeDifferenceInDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        if (timeDifferenceInDays === 0) {
          organizedData.today.push(entry);
        } else if (timeDifferenceInDays === 1) {
          organizedData.yesterday.push(entry);
        } else {
          organizedData.older.push(entry);
        }
      });

      const inboxData = [];

      for (const day in organizedData) {
        organizedData[day].forEach(entry => {
          const groupId = (entry.taskId ? 'task-' : 'project-') + (entry.taskId || entry.projectId);

          let groupIndex = inboxData.findIndex(group => group.id === groupId);
          if (groupIndex === -1) {
            inboxData.push({
              id: groupId,
              mode: groupId.split("-")[0],
              title: entry.task?.title || entry.project?.title,
              history: [] 
            });
            groupIndex = inboxData.length - 1; 
          }

          inboxData[groupIndex].history.push(entry);
        });
      }

      const categorizeEntries = (group) => {
        const todayEntries = [];
        const yesterdayEntries = [];
        const olderEntries = [];

        group.history.forEach(entry => {
          const updatedAt = new Date(entry.updatedAt);
          const timeDifferenceInDays = Math.floor((now - updatedAt) / (1000 * 60 * 60 * 24));

          if (timeDifferenceInDays === 0) {
            todayEntries.push(entry);
          } else if (timeDifferenceInDays === 1) {
            yesterdayEntries.push(entry);
          } else {
            olderEntries.push(entry);
          }
        });

        return {
          today: todayEntries,
          yesterday: yesterdayEntries,
          older: olderEntries
        };
      };


      inboxData.forEach(group => {
        const categorizedEntries = categorizeEntries(group);
        group.history = categorizedEntries;
      });

      let newData = {
        today: [],
        yesterday: [],
        older: []
      }

      inboxData.forEach((torp) => {
        if(torp.history.today.length > 0) {
          newData.today.push({data: torp.history.today, id: torp.id, mode: torp.mode, title: torp.title, updatedAt: torp.updatedAt});
        }
        if(torp.history.yesterday.length > 0) {
          newData.yesterday.push({data: torp.history.yesterday, id: torp.id, mode: torp.mode, title: torp.title, updatedAt: torp.updatedAt});
        }
        if(torp.history.older.length > 0) {
          newData.older.push({data: torp.history.older, id: torp.id, mode: torp.mode, title: torp.title, updatedAt: torp.updatedAt});
        }
      })

      let newtod = newData.today.sort((a,b) => b.updatedAt - a.updatedAt),
      newyes = newData.yesterday.sort((a,b) => b.updatedAt - a.updatedAt),
      newold = newData.older.sort((a,b) => b.updatedAt - a.updatedAt)
      newData.today = newtod, newData.yesterday = newyes, newData.older = newold

      // console.log(newData.today)
      // make first item active
      if (newData.today.length > 0) {
        this.switchTaskProject(newData.today[0])
        return newData
      }
      if (newData.yesterday.length > 0) {
        this.switchTaskProject(newData.yesterday[0])
        return newData
      }
      if (newData.older.length > 0) {
        this.switchTaskProject(newData.older[0])
        return newData
      }

    },
  },

  created() {
    if(process.client) {
      let members= [];

      this.$axios.$get(`${process.env.ORG_API_ENDPOINT}/${JSON.parse(localStorage.getItem('user')).subb}/users`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem('accessToken')}`
        }
      }).then((res) => {
          res.map(t => {
            members.push({ label: t.FirstName + ' ' + t.LastName, firstName: t.FirstName, lastName: t.LastName, email: t.Email, icon: "user", id: t.Id, status: t.Status, role: t.Role, avatar: t.Photo, selected: false })
          })
      })

      this.members = members
    }
  },

  mounted() {

    this.$store.dispatch("inbox/fetchInboxEntries").then(res => {
      // console.log(res.data)
    }).catch(err => {
      console.warn(err)
    })

    this.scrollTrigger();
  },
  methods: {
    handleChange_Tabs(tab) {
      this.activeTab = tab.value
    },
    scrollTrigger() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if(entry.intersectionRatio > 0 && this.currentPage <= this.pageCount) {

            const newdata = _.debounce(() => {
              this.$store.dispatch("user/fetchUserHistory", { page: this.currentPage + 1}).then(h => {
                if (h.data.statusCode == 200) {
                  this.pageCount = h.data.totalPage
                  this.currentPage++
                  this.inbox.push(...h.data.data)
                }
              })
            }, 600)

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
    switchTaskProject(item) {
      // console.log(item.data[0].id)
      // this.active = item.data[0].id
      if (item.id.split('-')[0] == 'task') {
        this.taskProject = "task"
        this.fetchTask({ id: item.id, historyId: item.data[0].id, taskId: Number(item.id.split('-')[1]) })
        // console.log('inbox task')
      }
      if (item.id.split('-')[0] == 'project') {
        this.taskProject = "project"
        this.fetchProject({ id: item.id, historyId: item.data[0].id, projectId: Number(item.id.split('-')[1]) })
        // console.log('inbox project')
      }
    },
    fetchTask(payload) {
      // console.log(payload)
      this.active = payload.historyId
      this.project = {}
      this.taskProject = "task"
      this.$store.dispatch("task/fetchSingleTask", payload.taskId)
        .then(i => {
          this.task = i.data
        })
        .catch(e => {
          console.warn(e)
        })
    },
    fetchProject(payload) {
      // console.log(payload)
      this.active = payload.historyId
      this.task = {}
      this.taskProject = "project"
      this.$store.dispatch("project/fetchSingleProject", payload.projectId)
        .then(p => {
          this.project = p.data
        })
        .catch(e => {
          console.warn(e)
        })
    },

    refreshTask(task) {
      this.task = task
    }
  },
}

</script>
<style lang="scss" scoped>
.inbox-wrapper {
  main {
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
  }

  aside {
    flex: 0 0 $sidebar-width;
  }
}

@media screen and (max-width: 1440px){
  .inbox-wrapper {
    aside { flex-basis: 50%; }
  }
}

</style>
