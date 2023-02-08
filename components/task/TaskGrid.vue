<template>
  <div :id="'task-grid-wrapper'+ task.id" class="task-grid bg-white" @click.stop="$emit('open-sidebar', task)">
    <figure v-if="task.cover" :id="'task-card-image'+task.id" class="task-image bg-light" style="background-image:url('https://via.placeholder.com/200x110')"></figure>
    <div class="task-top" :id="'tg-top-wrap'+ task.id">
      <div class="d-flex" :id="'task-card-inside-wrap'+task.id">
        <span class="cursor-pointer" @click.stop="markComplete(task)">
          <bib-icon icon="check-circle-solid" :scale="1.5" :variant="task.statusId == 5 ? 'success' : 'light'"></bib-icon>
        </span>
        <span class="flex-grow-1" :id="'task-title'+task.id">
          <textarea class="editable-input" :class="{'loading': loading}" v-model="form.title" @input="debounceUpdate('Title', 'title', form.title)" rows="1"></textarea></span>
      </div>
      <div class="shape-circle bg-light width-2 height-2 d-flex flex-shrink-0 justify-center align-center">
        <bib-popup pop="elipsis" icon="elipsis" icon-variant="gray5" icon-hover-variant="dark">
          <template v-slot:menu>
            <div class="list" :id="'task-list'+task.id">
              <span v-for="(item, index) in contextMenuItems" :key="item.label+index" class="list__item cursor-pointer" :class=" ['list__item__'+item.variant] " v-on:click.stop="contextItemClick(item)">
                <bib-icon v-if="item.icon" :icon="item.icon" :variant="activeVariant(item)" class="mr-05"></bib-icon> {{item.label}}
              </span>
            </div>
          </template>
        </bib-popup>
      </div>
    </div>
    <div class="task-mid d-flex gap-05">
      <status-badge :status="task.status"></status-badge>
      <priority-badge :priority="task.priority"></priority-badge>
      <!-- <priority-comp :priority="task.priority" :iconOnly="true"></priority-comp> -->
    </div>
    <div class="task-bottom" :id="'tg-bottom'+ task.id">
      <span :name="'user'+task.id">
        <user-info v-if="task.userId" :userId="task.userId" ></user-info>
        <bib-avatar v-else size="1.25rem"></bib-avatar>
      </span>
      <div v-if="task.dueDate" class="align-center gap-05 ml-auto">
        <bib-icon icon="calendar" :variant="overdue(task)"></bib-icon>
        <format-date :datetime="task.dueDate" :variant="overdue(task)"></format-date>
      </div>
    </div>
    <tippy :to="'user'+task.id" :key="'user'+task.id" theme="light-border" arrow="false" trigger="click" interactive="true">
      <div v-for="user in users">
        <p>{{user.label}}</p>
      </div>
    </tippy>
    <!-- <button :name="'exp'+task.id">Tooltip using component</button> -->
  </div>
</template>
<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import { TASK_CONTEXT_MENU } from "../../config/constants";
import tippy from 'tippy.js';
import VueTippy, { TippyComponent } from 'vue-tippy';
export default {
  name: "TaskGrid",
  components: {
    tippy: TippyComponent,
  },
  props: {
    task: Object,
    project: Number,
  },
  data() {
    return {
      // flag: false,
      contextMenuItems: TASK_CONTEXT_MENU,
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      favTasks: "task/getFavTasks",
      users: "user/getTeamMembers",
    }),
    isFavorite() {
      let fav = this.favTasks.some(t => t.task.id == this.task.id)
      if (fav) {
        return { variant: "orange", text: "Remove favorite", status: true }
      } else {
        return { variant: "gray5", text: "Add to favorites", status: false }
      }
    },
    form() {
      return _.cloneDeep(this.task)
    },
  },
  mounted() {
    const tx = document.getElementsByTagName("textarea");
    for (let i = 0; i < tx.length; i++) {
      tx[i].setAttribute("style", "height:" + (tx[i].scrollHeight) + "px;overflow-y:hidden;");
      tx[i].addEventListener("input", OnInput, false);
    }

    function OnInput() {
      this.style.height = 0;
      this.style.height = (this.scrollHeight) + "px";
    }
  },
  methods: {
    overdue(item) {
      // console.log(new Date(item.dueDate), new Date);
      return (new Date(item.dueDate) < new Date() && item.statusId != 5) ? 'danger' : 'gray5';
    },

    openSidebar(task, scroll) {
      // console.log(task)
      this.$nuxt.$emit("open-sidebar", { ...task, scrollId: scroll });
    },

    debounceUpdate: _.debounce(function(title, field, value) {
      console.log(...arguments)
      this.updateTask(title, field, value)
    }, 1500),

    updateTask(title, field, value) {
      this.loading = true
      const project = () => {
        if (this.task.project.length > 0) {
          return this.task.project[0].projectId
        } else if (this.project) {
          return this.project
        } else {
          return null
        }
      }
      console.info(project(), this.task.project.length)
      this.$store.dispatch("task/updateTask", {
          id: this.task.id,
          projectId: project(),
          data: {
            [field]: value
          },
          text: `changed ${title} to ${value}`
        })
        .then(res => {
          console.info(res)
          this.loading = false
        })
        .catch(e => console.warn(e))
    },

    addToFavorites(task) {
      // console.info("to be fav task", task)
      let isFav = this.favTasks.some((f) => f.taskId == task.id)
      // console.log(isFav)

      if (isFav) {
        this.$store.dispatch("task/removeFromFavorite", { id: task.id })
          .then(msg => {
            // console.log(msg)
            this.$emit("update-key", msg)
          })
          .catch(e => {
            console.log(e)
          })
      } else {
        this.$store.dispatch("task/addToFavorite", { id: task.id })
          .then(msg => {
            // console.log(msg)
            this.$emit("update-key", msg)
          })
          .catch(e => {
            console.log(e)
          })
      }
    },
    markComplete(task) {
      // console.log(this.currentTask)
      this.$store.dispatch('task/updateTaskStatus', task)
        .then((d) => {
          console.log(d)
          this.$nuxt.$emit("update-key")
          this.$store.dispatch("task/setSingleTask", d)
        }).catch(e => {
          console.log(e)
        })
    },
    deleteTask(task) {
      this.$store.dispatch("task/deleteTask", task).then(t => {
        if (t.statusCode == 200) {
          this.$emit("update-key", t.message)
        } else {
          console.warn(t.message);
        }
      }).catch(e => {
        console.log(e)
      })
    },
    activeVariant(item) {
      if (item.label.includes('Complete')) {
        return this.task.statusId == 5 ? 'success' : 'gray5'
      }
      if (item.label.includes('Delete')) {
        return 'danger'
      }
      if (item.label.includes('Favorites')) {
        let fata = this.favTasks.some(ft => ft.taskId == this.task.id)
        // console.log(fata, fapo)
        return fata ? 'orange' : 'gray5'
      }
    },
    contextItemClick(item) {
      // console.log(item)
      switch (item.event) {
        case 'done-task':
          // statements_1
          this.markComplete(this.task)
          break;
        case 'fav-task':
          this.addToFavorites(this.task)
          break;
        case 'delete-task':
          this.deleteTask(this.task)
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
          alert("no task assigned")
          break;
      }
    },
  },
};

</script>
<style scoped lang="scss">
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
    border-color: $dark;
    box-shadow: 0 0 0 4px $primary-sub3;
  }

  .task-image {
    aspect-ratio: 16/9;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  .editable-input {
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
    padding: 8px;
  }

  .task-top {
    margin-bottom: 0.5rem;
  }

  .task-mid {
    padding: 4px 8px;
  }

  .task-bottom {
    align-items: center;
    color: $gray5;

    span {
      font-size: 13px;
    }
  }

}

</style>
