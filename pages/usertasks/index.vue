<template>
  <client-only>
    <div id="page" class="task-page-wrapper">
      <page-title
        :title="`${selectedUser.firstName} ${selectedUser.lastName}'s Tasks`"
      ></page-title>
      <user-name-task-actions
        :gridType="gridType"
        v-on:filterView="filterView"
        v-on:sort="sortBy"
        v-on:new-task="toggleSidebar($event)"
        @search-user-tasks="searchUserTasks"
      ></user-name-task-actions>
      <div v-show="gridType == 'list'" id="task-table-wrapper" class="listview h-100 position-relative" :style="{ 'width': contentWidth }">
        <advance-table :tableFields="taskFields" :tableData="localData" :contextItems="contextMenuItems" @context-item-event="contextItemClick" @row-click ="openSidebar" @table-sort="sortBy" @title-click="openSidebar" @update-field="updateTask" ></advance-table>
          
        <user-picker
          :show="userPickerOpen"
          :coordinates="popupCoords"
          @selected="
            updateAssignee('Assignee', 'userId', $event.id, $event.label)
          "
          @close="userPickerOpen = false"
        ></user-picker>
        <inline-datepicker
          :show="datePickerOpen"
          :datetime="activeTask[datepickerArgs.field]"
          :coordinates="popupCoords"
          @date-updated="updateDate"
          @close="datePickerOpen = false"
        ></inline-datepicker>
      </div>

      <div v-show="gridType == 'grid'" id="task-grid-wrapper" class="d-flex gridview h-100" >
        <div class="task-grid-section">
          <div class="w-100 d-flex justify-between" style="margin-bottom: 10px" >
            <div class="title text-gray">Department</div>
            <div class="d-flex section-options">
              <div class="mr-1">
                <bib-icon icon="add" variant="success" :scale="1.2" />
              </div>
              <div>
                <bib-icon icon="elipsis" :scale="1.2" />
              </div>
            </div>
          </div>
          <div class="task-section__body">
            <div v-for="(item, index) in tasks" :key="index + '-' + key">
              <task-grid :task="item" v-on:update-key="updateKey" />
            </div>
          </div>
        </div>
      </div>
        <alert-dialog
          v-show="alertDialog"
          :message="alertMsg"
          @close="alertDialog = false"
        ></alert-dialog>
        <loading :loading="loading"></loading>
        <bib-popup-notification-wrapper>
          <template #wrapper>
            <bib-popup-notification
              v-for="(msg, index) in popupMessages"
              :key="index"
              :message="msg.text"
              :variant="msg.variant"
              :autohide="5000"
            >
            </bib-popup-notification>
          </template>
        </bib-popup-notification-wrapper>
    </div>
  </client-only>
</template>

<script>
import { mapGetters } from "vuex";
import _ from "lodash";
import {
  COMPANY_TASK_FIELDS as TaskFields,
  TASK_CONTEXT_MENU,
} from "../../config/constants";
import dayjs from "dayjs";
import { unsecuredCopyToClipboard } from '~/utils/copy-util.js'

export default {
  name: "UserTasks",
  data() {
    return {
      title: "UserTasks",
      gridType: "list",
      taskFields: TaskFields,
      taskContextMenu: false,
      statusPickerOpen: false,
      priorityPickerOpen: false,
      deptPickerOpen: false,
      popupMessages: [],
      popupCoords: {},
      userPickerOpen: false,
      datePickerOpen: false,
      datepickerArgs: { label: "", field: "" },
      activeTask: {},
      contextMenuItems: TASK_CONTEXT_MENU,
      loading: false,
      flag: false,
      viewName: "all",
      orderBy: "desc",
      key: 100,
      userfortask: "",
      tasks: [],
      taskOrder: "asc",
      selectedUser: {},
      alertDialog: false,
      alertMsg: "",
      localData: [],
      contentWidth: "100%"
    };
  },
  computed: {
    ...mapGetters({
      user: "user/getUser",
      teamMembers: "user/getTeamMembers",
      sidebar: "task/getSidebarVisible",
    }),
  },

  watch: {
    "$route.query": {
      immediate: true,
      handler(newVal) {
        this.userfortask = this.teamMembers.find((u) => {
          if (u.email == newVal.email) {
            this.selectedUser = u;
            return u;
          }
        });
        this.fetchUserTasks();
      },
    },

    gridType() {
      this.key++;
    },

    tasks(newVal) {
      let data = _.cloneDeep(newVal);
      let sortedData = data.sort((a, b) => {
        if (a.priorityId && b.priorityId) {
          return a.priorityId - b.priorityId;
        }
      });
      this.localData = sortedData;
    },
    sidebar(newVal){
      const page = document.getElementById("page")
      this.$nextTick(() => {
        const panel = document.getElementById("side-panel-wrapper")
        // console.log("page width="+page.scrollWidth+", panel width="+panel.offsetWidth)
        if (this.sidebar) {
          this.contentWidth = (page.scrollWidth - panel.offsetWidth) + 'px'
          this.contentWidth = (page.scrollWidth - panel.offsetWidth) + 'px'
        } else {
          this.contentWidth = '100%'
        }
      });
    }
  },

  created() {
    if (process.client) {
      this.$nuxt.$on("update-key", () => {
        this.fetchUserTasks();
      });
      this.$nuxt.$on("user-picker", (payload) => {
        // emitted from <task-grid>
        this.showUserPicker(payload);
      });
      this.$nuxt.$on("date-picker", (payload) => {
        // emitted from <task-grid>
        this.showDatePicker(payload);
      });
    }
  },

  mounted() {
    if (process.client) {
      if (!this.$route.query.email) {
        this.$router.push({ path: "/dashboard" });
      }

      _.delay(() => {
        this.userfortask = this.teamMembers.find((u) => {
          if (u.email == this.$route.query.email) {
            this.selectedUser = u;
            return u;
          }
        });
        this.fetchUserTasks();
      }, 5000);
    }
  },

  methods: {
    async fetchUserTasks() {
      if (process.client) {
        this.loading = true;
        const res = await this.$axios.get("user/user-tasks", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            Filter: "all",
            userid: this.userfortask ? this.userfortask.id : "",
          },
        });

        if (res.data.statusCode == 200) {
          let userTasks = res.data.data;
          let organizedArr = [];

          for (let el of userTasks) {
            if (el.priorityId) {
              organizedArr.unshift(el);
            } else {
              organizedArr.push(el);
            }
          }

          let taskArr = organizedArr.sort((a, b) => {
            if (a.priorityId && b.priorityId) {
              return a.priorityId - b.priorityId;
            }
          });
          this.localData = taskArr;
        } else {
          console.error(e);
        }
        this.loading = false;
      }
    },

    updateKey($event) {
      if ($event) {
        this.popupMessages.push({ text: $event, variant: "success" });
      }
      let compid = JSON.parse(localStorage.getItem("user")).subb;
      this.$store
        .dispatch("company/fetchCompanyTasks", {
          companyId: compid,
          filter: "all",
          sort: this.sortName,
        })
        .then(() => {
          this.key += 1;
        });
      this.fetchUserTasks();
    },



    openSidebar(task, scroll) {
      let fwd = this.$donotCloseSidebar(event.target.classList);
      if (!fwd) {
        this.$nuxt.$emit("close-sidebar");
        return false;
      }
      this.$nuxt.$emit("open-sidebar", { ...task, scrollId: scroll });
    },

    contextItemClick(key, item) {
      switch (key) {
        case "done-task":
          this.taskMarkComplete(item);
          break;
        case "fav-task":
          this.taskSetFavorite(item);
          break;
        case "delete-task":
          this.deleteTask(item);
          break;
        case 'copy-task':
          this.copyTaskLink(item);
          break;
        case 'gotoTeam':
          this.$nuxt.$emit('add-member-to-task')
          break;
        case 'gotoComment':
          this.openSidebar(item, 'task_conversation')
          break;
        case 'gotoSubtask':
          this.openSidebar(item, 'task_subtasks')
          break;
        case 'gotoFiles':
          this.openSidebar(item, 'task_files')
          break;
        default:
          this.alertDialog = true;
          this.alertMsg = "no task assigned";
          break;
      }
    },

    // task context menu methods ----------------------------------------

    copyTaskLink(task) {
        let url = window.location.host + `/tasks/${task.id}`;
        if (navigator.clipboard) { 
          navigator.clipboard.writeText(url);
        } else { 
          unsecuredCopyToClipboard(url);
        }
    },

    taskSetFavorite(task) {
      this.loading = true;
      let isFav = this.favTasks.some((f) => f.taskId == task.id);

      if (isFav) {
        this.$store
          .dispatch("task/removeFromFavorite", { id: task.id })
          .then((msg) => {
            this.updateKey();
            this.loading = false;
          })
          .catch((e) => {
            this.loading = false;
            console.log(e);
          });
      } else {
        this.$store
          .dispatch("task/addToFavorite", { id: task.id })
          .then((msg) => {
            this.updateKey();
            this.loading = false;
          })
          .catch((e) => {
            this.loading = false;
            console.log(e);
          });
      }
    },

    taskMarkComplete(task) {
      this.loading = true;
  
      this.$store
        .dispatch("task/updateTaskStatus", task)
        .then((d) => {
          this.loading = false;
          this.updateKey();
          this.$store.dispatch("task/setSingleTask", d).then(() => {
            this.key += 1;
          });
        })
        .catch((e) => {
          console.log(e);
          this.loading = false;
        });
    },
    updateTask(payload) {
      let user, projectId;
      if (payload.field == "userId" && payload.value != "") {
        user = this.teamMembers.find((t) => t.id == payload.value);
      } else {
        user = null;
      }
      if(payload.field==="title"){
        this.localData=this.localData.map((task)=>{
          if(task.id===payload.item.id)
          task.title=payload.value
          return task
        })
      }
      if (payload.item.project.length > 0) {
        projectId = payload.item.project[0].projectId || payload.item.project[0].project.id;
      } else {
        projectId = null;
      }

      this.$store
        .dispatch("task/updateTask", {
          id: payload.item.id,
          projectId,
          data: { [payload.field]: payload.value },
          user: [user],
          text: `changed ${payload.label} to ${
            payload.historyText || payload.value
          }`,
        })
        .then(async (t) => {
          if (t.statusCode == 200) {
            this.updateKey();
          } else {
            console.warn(t);
          }
        })
        .catch((e) => console.warn(e));
    },

    updateAssignee(label, field, value, historyText) {
      let user;
      if (field == "userId" && value != "") {
        user = this.teamMembers.filter((t) => t.id == value);
      } else {
        user = null;
      }
      this.userPickerOpen = false;
      this.$store
        .dispatch("task/updateTask", {
          id: this.activeTask.id,
          data: { [field]: value },
          user,
          text: `changed ${label} to ${historyText}`,
        })
        .then((t) => {
          this.updateKey();
        })
        .catch((e) => console.warn(e));
    },

    updateDate(value) {
      let user = this.teamMembers.find((tm) => tm.id == this.activeTask.userId);
      let newDate = dayjs(value).format("D MMM YYYY");

      this.$store
        .dispatch("task/updateTask", {
          id: this.activeTask.id,
          user,
          data: { [this.datepickerArgs.field]: value },
          user: null,
          text: `changed ${this.datepickerArgs.label} to ${newDate}`,
        })
        .then((t) => {
          if (t.statusCode == 200) {
            this.updateKey();
          } else {
            console.warn(t);
          }
        })
        .catch((e) => console.warn(e));
    },
    deleteTask(task) {
      this.loading = true;
      this.$store
        .dispatch("task/deleteTask", task)
        .then((t) => {
          if (t.statusCode == 200) {
            this.updateKey();
          } else {
            console.warn(t.message);
          }
          this.loading = false;
        })
        .catch((e) => {
          this.loading = false;
          console.log(e);
        });
    },

    async filterView($event) {
      this.loading = true;
      let compid = JSON.parse(localStorage.getItem("user")).subb;
      const res = await this.$axios.get("user/user-tasks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          Filter: $event,
          userid: this.userfortask ? this.userfortask.id : "",
        },
      });
      if (res.data.statusCode == 200) {
        this.tasks = res.data.data;
        this.key += 1;
      } else {
        console.error(e);
      }
      this.viewName = $event;
      this.loading = false;
    },

    // Sort By Action List
    checkActive() {
      for (let i = 0; i < this.taskFields.length; i++) {
        if (this.taskFields[i].header_icon) {
          this.taskFields[i].header_icon.isActive = false;
        }

        if (
          this.taskFields[i].header_icon &&
          this.taskFields[i].key == this.sortName
        ) {
          this.taskFields[i].header_icon.isActive = true;
        }
      }
    },

    sortBy($event) {
      switch ($event) {
        case "title":
          if (this.taskOrder == "asc") {
            this.localData.sort((a, b) => a.title.localeCompare(b.title));
            this.taskOrder = "desc";
          } else {
            this.localData.sort((a, b) => b.title.localeCompare(a.title));
            this.taskOrder = "asc";
          }
          // this.key += 1;
          this.sortName = "title";
          // this.checkActive();
          break;

        case "status":
          if (this.taskOrder == "asc") {
            this.localData.sort((a, b) =>
              a.status.text.localeCompare(b.status.text)
            );
            this.taskOrder = "desc";
          } else {
            this.localData.sort((a, b) =>
              b.status.text.localeCompare(a.status.text)
            );
            this.taskOrder = "asc";
          }
          this.key += 1;
          this.sortName = "status";
          this.checkActive();
          break;

        case "priority":
          if (this.taskOrder == "asc") {
            this.localData.sort((a, b) => a.priority.id - b.priority.id);
            this.taskOrder = "desc";
          } else {
            this.localData.sort((a, b) => b.priority.id - a.priority.id);
            this.taskOrder = "asc";
          }
          this.key += 1;
          this.sortName = "priority";
          this.checkActive();
          break;

        case "department":
          let deptArr = [];

          for (let i = 0; i < this.localData.length; i++) {
            if (this.localData[i].department.title) {
              deptArr.unshift(this.localData[i]);
            } else {
              deptArr.push(this.localData[i]);
            }
          }

          if (this.taskOrder == "asc") {
            deptArr.sort((a, b) => {
              if (a.departmentId && b.departmentId) {
                return a.department.title.localeCompare(b.department.title);
              }
            });
            this.taskOrder = "desc";
          } else {
            deptArr.sort((a, b) => {
              if (a.departmentId && b.departmentId) {
                return b.department.title.localeCompare(a.department.title);
              }
            });
            this.taskOrder = "asc";
          }

          this.localData = deptArr;
          this.key += 1;
          break;

        case "userId":

          let userArr = [];

          for(let i=0; i<this.localData.length; i++) {
            if(this.localData[i].userId) {
              userArr.unshift(this.localData[i])
            } else {
              userArr.push(this.localData[i])
            }
          }

          if (this.taskOrder == "asc") {
            userArr.sort((a, b) => {
              if (a.userId && b.userId) {
                return a.user.firstName.localeCompare(b.user.firstName);
              }
            });
            this.taskOrder = "desc";
          } else {
            userArr.sort((a, b) => {
              if (a.userId && b.userId) {
                return b.user.firstName.localeCompare(a.user.firstName);
              }
            });
            this.taskOrder = "asc";
          }
          this.key += 1;
          this.localData = userArr;
          this.sortName = "userId";
          this.checkActive();
          break;

        case "dueDate":
          let newArr = [];

          for (let i = 0; i < this.localData.length; i++) {
            if (this.localData[i].dueDate) {
              newArr.unshift(this.localData[i]);
            } else {
              newArr.push(this.localData[i]);
            }
          }

          if (this.taskOrder == "asc") {
            newArr.sort((a, b) => {
              if (a.dueDate && b.dueDate) {
                return new Date(a.dueDate) - new Date(b.dueDate);
              }
            });
            this.taskOrder = "desc";
          } else {
            newArr.sort((a, b) => {
              if (a.dueDate && b.dueDate) {
                return new Date(b.dueDate) - new Date(a.dueDate);
              }
            });
            this.taskOrder = "asc";
          }

          this.localData = newArr;
          this.key += 1;
          this.sortName = "dueDate";
          this.checkActive();
          break;

        case "startDate":
          let newArr2 = [];

          for (let i = 0; i < this.localData.length; i++) {
            if (this.localData[i].startDate) {
              newArr2.unshift(this.localData[i]);
            } else {
              newArr2.push(this.localData[i]);
            }
          }

          if (this.taskOrder == "asc") {
            newArr2.sort((a, b) => {
              if (a.startDate && b.startDate) {
                return new Date(a.startDate) - new Date(b.startDate);
              }
            });
            this.taskOrder = "desc";
          } else {
            newArr2.sort((a, b) => {
              if (a.startDate && b.startDate) {
                return new Date(b.startDate) - new Date(a.startDate);
              }
            });
            this.taskOrder = "asc";
          }

          this.localData = newArr2;
          this.key += 1;
          this.sortName = "startDate";
          this.checkActive();
          break;

        case "project":
          let newArr3 = [];

          for (let i = 0; i < this.localData.length; i++) {
            if (this.localData[i].project[0].project.title != null) {
              newArr3.unshift(this.localData[i]);
            } else {
              newArr3.push(this.localData[i]);
            }
          }

          if (this.taskOrder == "asc") {
            newArr3.sort((a, b) => {
              if (a.project[0].project.title != null && b.project[0].project.title != null) {
                return a.project[0].project.title.localeCompare(b.project[0].project.title);
              }
            });
            this.taskOrder = "desc";
          } else {
            newArr3.sort((a, b) => {
              if (a.project[0].project.title != null && b.project[0].project.title != null) {
                return b.project[0].project.title.localeCompare(a.project[0].project.title);
              }
            });
            this.taskOrder = "asc";
          }

          this.localData = newArr3;
          this.key += 1;
          this.sortName = "project";
          this.checkActive();
          break;

        default:
          this.fetchUserTasks();
          break;
      }

      this.key += 1;
    },

    toggleSidebar($event) {
      if (!$event) {
        this.$nuxt.$emit("open-sidebar", $event);
      }
      this.flag = !this.flag;
    },

    searchUserTasks(text) {
      let formattedText = text.toLowerCase().trim();

      let newArr = this.tasks.filter((t) => {
        if (t.title.includes(formattedText) || t.title.toLowerCase().includes(formattedText)) {
            return t;
          }
      });

      if (newArr.length >= 0) {
        this.localData = newArr;
        this.key++;
      } else {
        this.localData = this.tasks;
        this.key++;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.task-page-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.listview,
.gridview {
  overflow: auto;
}

.section-options {
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s;
}
</style>
