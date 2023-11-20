<template>
  <client-only>
    <div :id="'task-grid-wrapper'+ task.id" class="task-grid position-relative bg-white" @click.stop="$emit('open-sidebar', task)">
      <!-- <figure v-if="task.cover" :id="'task-card-image'+task.id" class="task-image bg-light" style="background-image:url('https://via.placeholder.com/200x110')"></figure> -->
      <div class="task-top" :id="'tg-top-wrap'+ task.id">
        <div class="d-flex" :id="'task-card-inside-wrap'+task.id">
          <span class="cursor-pointer" style="padding-top: 0.15rem;" @click.stop="markComplete(task)">
            <bib-icon icon="check-circle-solid" :scale="1.25" :variant="task.statusId == 5 ? 'success' : 'light'" ></bib-icon>
          </span>
          <span class="flex-grow-1" :id="'task-title'+task.id" >
           <textarea class="editable-input-grid" ref="titleInput" @focus="$nuxt.$emit('open-sidebar', task)" @input="debounceUpdate('Title', 'title', $event.target.value, $event)" rows="1" @blur="restoreField">{{form.title}}</textarea>
          </span>
        </div>
        <div class="shape-circle bg-light width-2 height-2 d-flex flex-shrink-0 justify-center align-center">
          <bib-popup pop="elipsis" icon="elipsis" icon-variant="gray5" icon-hover-variant="dark" @click="openContextMenu()">
            <template v-slot:menu>
              <div class="list box-shadow" :id="'task-list'+task.id">
                <span v-for="(item, index) in contextMenuItems" :key="item.label+index" class="list__item cursor-pointer" :class=" ['list__item__'+item.variant] " @click.stop="contextItemClick(item)">
                  <bib-icon v-if="item.icon" :icon="item.icon" :variant="activeVariant(item)" class="mr-05"></bib-icon> {{item.label}}
                </span>
              </div>
            </template>
          </bib-popup>
        </div>
      </div>
      <div class="task-mid d-flex gap-05">
        <status-badge v-if="task.statusId" :status="task.status"></status-badge>
        <priority-badge v-if="task.priorityId" :priority="task.priority"></priority-badge>
      </div>
      <div class="task-bottom " :id="'tg-bottom'+ task.id">
        <span v-if="task.userId" class="user-info" @click.stop="showUserPicker(task)">
          <user-info :userId="task.userId" class="events-none"></user-info>
        </span>
        <span v-else class="user-name-blank user-info bg-white shape-circle align-center justify-center" @click.stop="showUserPicker(task)">
          <bib-icon icon="user" variant="gray4" class="events-none"></bib-icon>
        </span>
        <div v-if="task.dueDate" class="align-center gap-025 ml-auto" @click.stop="showDatePicker(task)">
          <bib-icon icon="calendar" :variant="overdue" class="events-none"></bib-icon>
          <format-date :datetime="task.dueDate" variant="gray5" class="events-none"></format-date>
        </div>
        <div v-else class="date-info-blank date-info shape-circle align-center justify-center ml-auto" @click.stop="showDatePicker(task)">
          <bib-icon icon="calendar" variant="gray4" class="events-none"></bib-icon>
        </div>
      </div>
      <!-- popup notification -->
      <bib-popup-notification-wrapper>
        <template #wrapper>
          <bib-popup-notification v-for="(msg, index) in popupMessages" :key="index" :message="msg.text" :variant="msg.variant">
          </bib-popup-notification>
        </template>
      </bib-popup-notification-wrapper>
      <!-- confirm delete task -->
      <!-- <confirm-dialog v-if="confirmModal" :message="confirmMsg" @close="confirmDelete"></confirm-dialog> -->
      <alert-dialog v-show="alertDialog" :message="alertMsg" @close="alertDialog = false"></alert-dialog>
    </div>
  </client-only>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import dayjs from 'dayjs'
import { TASK_CONTEXT_MENU } from "../../config/constants";
import { unsecuredCopyToClipboard } from '~/utils/copy-util.js'
import { conditionalExpression } from '@babel/types';

export default {
  name: "TaskGrid",
  props: {
    task: { type: Object },
    project: { type: Number }
  },
  data() {
    return {
      contextMenuItems: TASK_CONTEXT_MENU,
      filterKey: "",
      loading: false,
      popupMessages: [],
      taskToDelete: {},
      // confirmModal: false,
      // confirmMsg: "",
      alertDialog: false,
      alertMsg:"",
    };
  },
  computed: {
    ...mapGetters({
      favTasks: "task/getFavTasks",
      teamMembers: "user/getTeamMembers",
    }),
    // isFavorite() {
    //   let fav = this.favTasks.some(t => t.task.id == this.task.id)
    //   if (fav) {
    //     return { variant: "orange", text: "Remove favorite", status: true }
    //   } else {
    //     return { variant: "gray5", text: "Add to favorites", status: false }
    //   }
    // },
    overdue() {
      return (new Date(this.task.dueDate) < new Date() && this.task.statusId != 5) ? 'danger-sub1' : 'gray4';
    },
    form() {
      return _.cloneDeep(this.task)
    },
    
  },
  updated() {
    let ht = this.$refs.titleInput.scrollHeight
    this.$refs.titleInput.style.height = ht + 2 + 'px'
  },
  methods: {

    openContextMenu() {
      let isFav = this.favTasks.some((f) => f.taskId == this.task.id)
      if (isFav) {
          this.contextMenuItems=this.contextMenuItems.map(item => item.label === "Add to Favorites" ? { ...item, label: "Remove favorite"} : item);
      }
           if(this.task.statusId==5){
        this.contextMenuItems=this.contextMenuItems.map(item => item.label === "Mark Complete" ? { ...item, label: "Completed"} : item);
        }
      else{
        this.contextMenuItems=this.contextMenuItems.map(item => item.label === "Completed" ? { ...item, label: "Mark Complete"} : item);
      }
    },

    showUserPicker(task) {
      this.$nuxt.$emit("user-picker", { event, task })
      this.$emit("user-picker", { event, task })
    },
    showDatePicker(task) {
      this.$nuxt.$emit("date-picker", { event, task })
      this.$emit("date-picker", { event, task })
    },

    openSidebar(task, scroll) {
      this.$nuxt.$emit("open-sidebar", { ...task, scrollId: scroll });
    },

    restoreField(){
      if (event.target.value == "") {
        event.target.value = this.form.title
        event.target.classList.remove("error")
      }
    },

    debounceUpdate: _.debounce(function(label, field, value, $event) {
      let historyText;

      if (label == "Due date" || label == "Start date") {
        historyText = dayjs(taskData.value).format('DD MMM, YYYY')
      }

      if (_.trim(value) == "") {
        $event.target.classList.add('error')
        console.warn(field + ' cannot be left blank')
      } else {
        $event.target.classList.remove('error')
        this.updateTask(label, field, value, historyText)
      }

    }, 1200),

    updateTask(label, field, value, historyText) {
      this.userPickerOpen = false
      const project = () => {
        if (this.task.project.length > 0) {
          return this.task.project[0].projectId
        } else if (this.project) {
          return this.project
        } else {
          return null
        }
      }

      let user
      if (field == "userId" && value != '') {
        user = this.teamMembers.filter(t => t.id == value)
      } else {
        user = null
      }

      this.$store.dispatch("task/updateTask", {
          id: this.task.id,
          data: {
            [field]: value
          },
          user,
          text: `changed ${label} to ${historyText ?? value}`
        })
        .then(res => {
          this.loading = false
          this.$nuxt.$emit("update-key")
        })
        .catch(e => console.warn(e))
    },

    addToFavorites(task) {
      let isFav = this.favTasks.some((f) => f.taskId == task.id)

      if (isFav) {
        this.$store.dispatch("task/removeFromFavorite", { id: task.id })
          .then(msg => {
            this.$emit("update-key", msg)
          })
          .catch(e => {
            console.log(e)
          })
      } else {
        this.$store.dispatch("task/addToFavorite", { id: task.id })
          .then(msg => {
            this.$emit("update-key", msg)
          })
          .catch(e => {
            console.log(e)
          })
      }
    },
    markComplete(task) {
      this.$store.dispatch('task/updateTaskStatus', task)
        .then((d) => {
          this.$nuxt.$emit("update-key")
          this.$store.dispatch("task/setSingleTask", d)
        }).catch(e => {
          console.log(e)
        })
    },
    // confirmDelete(state){
    //   this.confirmModal = false
    //   this.confirmMsg = ""
    //   if (state) {
    //     this.$store.dispatch("task/deleteTask", this.taskToDelete)
    //     .then(t => {
    //       if (t.statusCode == 200) {
    //         this.popupMessages.push({ text: t.message, variant: "success" })
    //         this.$emit("update-key", t.message)
    //         this.taskToDelete = {}
    //       } else {
    //         this.popupMessages.push({ text: t.message, variant: "orange" })
    //         console.warn(t.message);
    //       }
    //     })
    //     .catch(e => {
    //       console.warn(e)
    //     })
    //   } else {
    //     this.popupMessages.push({ text: "Action cancelled", variant: "orange" })
    //     this.taskToDelete = {}
    //   }
    // },
    deleteTask(task) {
      if (task) {
        this.$store.dispatch("task/deleteTask", task)
        .then(t => {
          if (t.statusCode == 200) {
            this.popupMessages.push({ text: t.message, variant: "success" })
            this.$emit("update-key", t.message)
            // this.taskToDelete = {}
          } else {
            this.popupMessages.push({ text: t.message, variant: "orange" })
            console.warn(t.message);
          }
        })
        .catch(e => {
          console.warn(e)
        })
      } else {
        this.popupMessages.push({ text: "Action cancelled", variant: "orange" })
        // this.taskToDelete = {}
      }
      // this.taskToDelete = task
      // this.confirmMsg = "Are you sure "
      // this.confirmModal = true
    },
    activeVariant(item) {
      if (item.label.includes('Completed')) {
          return this.variant='success'
        }
        if (item.label=='Remove favorite') {
          return this.variant='warning'
        }
      if (item.label.includes('Complete')) {
        return this.task.statusId == 5 ? 'success' : 'gray5'
      }
      if (item.label.includes('Delete')) {
        return 'danger'
      }
      // if (item.label.includes('Favorites')) {
      //   let fata = this.favTasks.some(ft => ft.taskId == this.task.id)
      //   return fata ? 'orange' : 'gray5'
      // }
    },
    contextItemClick(item) {
      switch (item.event) {
        case 'done-task':
          this.markComplete(this.task)
          break;
        case 'fav-task':
          this.addToFavorites(this.task)
      
          break;
        case 'delete-task':
          this.deleteTask(this.task)
          break;
        case 'copy-task':
          this.copyTaskLink(this.task)
          break;
        case 'gotoTeam':
          this.$nuxt.$emit('add-member-to-task')
          break;
        case 'gotoComment':
          this.openSidebar(this.task, 'task_conversation')
          break;
        case 'gotoSubtask':
          this.openSidebar(this.task, 'task_subtasks')
          break;
        case 'gotoFiles':
          this.openSidebar(this.task, 'task_files')
          break;
        default:
          this.alertDialog = true
          this.alertMsg = "no task assigned"
          break;
      }
    },

    copyTaskLink(task) {
      
        let url = window.location.host + `/tasks/${task.id}`;
        
        if (navigator.clipboard) { 
          navigator.clipboard.writeText(url);
        } else { 
          unsecuredCopyToClipboard(url);
        }
    }
  },
};

</script>
<style scoped lang="scss">
.box-shadow {
  box-shadow: 0 6px 30px -2px rgba(0,0,0,.38);
}
.task-grid {
  font-size: 14px;
  margin: 1rem 0;
  border: 1px solid var(--bib-gray4);
  border-radius: 6px;
  cursor: pointer;
  transition: all 200ms ease;

  &.bg-danger {
    background-color: var(--bib-danger);
    color: #fff;

    .user-name {
      color: #fff
    }
  }

  &.active {
    /*background-color: $gray9;*/
    /*border-color: $gray4;*/
    box-shadow: 0 0 0 2px $gray5 inset;
  }

  .task-image {
    aspect-ratio: 16/9;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  .editable-input-grid {
    font-size: $base-size;
    font-weight: normal;
    resize: initial;
    padding-block: 0.1rem;
    min-height: 1.8rem;
  }

  .task-top,
  .task-bottom {
    display: flex;
    justify-content: space-between;
    gap: 0.25rem;
    padding: 8px;
  }

  .task-mid {
    padding: 4px 8px;
  }

  .task-bottom {
    align-items: center;
    color: $gray5;
  }

}

.user-name-blank,
.date-info-blank {
  width: 1.5rem;
  height: 1.5rem;
  border: 1px dashed $gray4;
}

</style>
