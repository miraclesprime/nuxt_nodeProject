<template>
  <div class="of-scroll-x position-relative">
    <draggable v-model="sections" class="d-flex " :move="moveSection" handle=".section-drag-handle">
      <div class="task-grid-section " :id="'task-grid-section-wrapper-'+section.id" v-for="section in sections" :key="`grid-${key}${section.title}${section.id}`">
        <div class="w-100 d-flex justify-between section-drag-handle" :id="'tgs-inner-wrap-'+section.id" style="margin-bottom: 10px">
          <div class="title text-gray" :id="'tgs-label-'+section.id">{{ section.title.includes('_section') ? 'Untitled section' : section.title }}</div>
          <div class="d-flex align-center ml-auto section-options" :id="'tgs-section-options-'+section.id">
            <bib-icon icon="add" class="mx-05"></bib-icon>
            <bib-button pop="elipsis">
              <template v-slot:menu>
                <div :id="'tgs-list'+section.id" class="list">
                  <span class="list__item" :id="'tgs-list-1'+section.id" v-on:click="$nuxt.$emit('open-sidebar', true);">
                    <div class="d-flex align-center" :id="'tgs-list-flex-1'+section.id">
                      <bib-icon icon="add"></bib-icon>
                      <span class="ml-05" :id="'tgs-list-span'+section.id">Add task</span>
                    </div>
                  </span><span class="list__item" :id="'tgs-list-2'+section.id" v-on:click="$nuxt.$emit('section-rename',{id: section.id, title: section.title })">
                    <div class="d-flex align-center" :id="'tgs-list-flex-2'+section.id">
                      <bib-icon icon="pencil"></bib-icon>
                      <span class="ml-05" :id="'tgs-list-span'+section.id">Rename</span>
                    </div>
                  </span>
                </div>
              </template>
            </bib-button>
          </div>
        </div>
        <div class="task-section__body" :id="'tgs-task-section-body-'+section.id">
          <draggable :list="section.tasks" group="task" :move="debounceUpdateTask" @start="taskDragStart" @end="taskDragEnd" class="section-draggable" :class="{highlight: drag}" :data-section="section.id">
            <!-- <transition-group type="transition" :name="!drag ? 'flip-list' : null"> -->
            <div class="task-grid " v-for="task in section.tasks" :key="task.title + key + '-' + task.id" :class="[overdue(task), currentTask.id == task.id ? 'active' : '']" :id="'tg-card-'+task.id" v-on:click="openSidebar(task)">
              <figure v-if="task.cover" id="tg-card-image" class="task-image bg-light" style="background-image:url('https://via.placeholder.com/200x110')"></figure>
              <div class="task-top" :id="'tg-card-top'+task.id">
                <div class="d-flex" :id="'tg-card-inside-wrap'+task.id">
                  <bib-icon icon="check-circle" :scale="1.5" :variant="task.status.text === 'Done' ? 'success' : 'secondary-sub1'" class="cursor-pointer" @click="handleTaskStatus(task)"></bib-icon>
                  <span class="ml-05" :id="'tg-title'+task.id">{{ task.title }} </span>
                </div>
                <bib-button pop="elipsis" icon="elipsis" :icon-variant="overdue(task) == 'bg-danger'? 'white' :'secondary'">
                  <template v-slot:menu>
                    <div class="list" :id="'tg-list'+task.id">
                      <!-- <span class="list__item" v-on:click="openSidebar(task)">Details</span>
                      <hr> -->
                      <span class="list__item" :id="'tg-comp'+task.id">
                        <bib-icon icon="check-circle" class="mr-05"></bib-icon> Mark Completed
                      </span>
                      <span class="list__item" :id="'tg-fav'+task.id" @click="addToFavorites">
                        <bib-icon icon="heart-like" class="mr-05"></bib-icon> Add to favorites
                      </span>
                      <span class="list__item" :id="'tg-attach'+task.id">
                        <bib-icon icon="upload" class="mr-05"></bib-icon> Attach file...
                      </span>
                      <span class="list__item" :id="'tg-assign'+task.id">
                        <bib-icon icon="user-add" class="mr-05"></bib-icon> Assign to...
                      </span>
                      <span class="list__item" :id="'tg-reminder'+task.id">
                        <bib-icon icon="notification" class="mr-05"></bib-icon> Set as reminder
                      </span>
                      <span class="list__item " :id="'tg-copy-link'+task.id">
                        <bib-icon icon="duplicate" class="mr-05"></bib-icon> Copy
                      </span>
                      <span class="list__item" :id="'tg-move'+task.id">
                        <bib-icon icon="transfer" class="mr-05"></bib-icon> Move to
                      </span>
                      <span class="list__item " :id="'tg-view-task'+task.id">
                        <bib-icon icon="warning" class="mr-05"></bib-icon> Report
                      </span>
                      <hr>
                      <span class="list__item danger" :id="'tg-delete-task'+task.id">Delete Task</span>
                    </div>
                  </template>
                </bib-button>
              </div>
              <div class="task-bottom" :id="'tg-card-bottom'+task.id">
                <user-info v-if="task.userId" :userId="task.userId"></user-info>
                <format-date v-if="task.dueDate" :datetime="task.dueDate" class="ml-auto"></format-date>
                <!-- <span :id="'tg-bottom-duedate'+task.id" v-format-date="task.dueDate"></span> -->
              </div>
            </div>
            <!-- </transition-group> -->
          </draggable>
        </div>
      </div>
      <div class="task-grid-section " id="task-grid-section-blank-1"></div>
      <div class="task-grid-section " id="task-grid-section-blank-2"></div>
      <div class="task-grid-section " id="task-grid-section-blank-3"></div>
    </draggable>
    <loading :loading="loading"></loading>
    <bib-popup-notification-wrapper>
      <template #wrapper>
        <bib-popup-notification v-for="(msg, index) in popupMessages" :key="index" :message="msg.text" :variant="msg.variant">
        </bib-popup-notification>
      </template>
    </bib-popup-notification-wrapper>
  </div>
</template>
<script>
// import { Container, Draggable } from "vue-smooth-dnd";
import draggable from 'vuedraggable'
import { mapGetters } from 'vuex';

export default {
  components: {
    /*Container,
    Draggable,*/
    draggable
  },
  data() {
    return {
      // sections: this.taskSections,
      localdata: [],
      flag: false,
      ordered: [],
      key: 0,
      loading: false,
      drag: false,
      popupMessages: [],
    };
  },
  props: {
    sections: { type: Array, required: true },
    // activeTask: { type: Object },
    // tasks: { type: Array },
  },
  /*created() {
    this.$nuxt.$on("update-key", () => {
      console.log('updated-key received')
      this.$store.dispatch("section/fetchProjectSections", {projectId:this.project.id})
        .then(() => {
          // this.taskByOrder();
          // console.log(this.sections)

          this.localdata = JSON.parse(JSON.stringify(this.sections))

          let sorted = this.localdata.map(s => {
            let t = s.tasks.sort((a, b) => a.order - b.order)
            s.tasks = t
            return s
          })
          // console.log("sorted =>", sorted)
          this.localdata = sorted
          this.key += 1
        })
        .catch(e => console.log(e))
    })
  },*/
  mounted() {
    // console.info('mounted', this.project)
    this.$store.dispatch("section/fetchProjectSections", { projectId: this.project.id })
    this.key += parseInt(Math.random().toString().slice(-2))

    // this.taskByOrder();

  },
  computed: {
    ...mapGetters({
      token: "token/getToken",
      project: "project/getSingleProject",
      currentTask: 'task/getSelectedTask',
      // sections: "section/getProjectSections",
    }),
    templateKey() {

    },
  },
  methods: {
    taskDragStart(e) {
      this.drag = true
      // console.log('drag start', e)
    },
    taskDragEnd(e) {
      this.drag = false
      // console.log('drag end', e)
    },
    taskByOrder() {
      this.localdata = JSON.parse(JSON.stringify(this.sections))

      let sorted = this.localdata.map(s => {
        let t = s.tasks.sort((a, b) => a.order - b.order)
        s.tasks = t
        return s
      })
      // console.log("sorted =>", sorted)
      this.localdata = sorted
      this.key += 1
      this.$nuxt.$emit("update-key", this.key)
    },
    /*moveTask(e) {
      console.info(e.relatedContext)
      let tasks = []

      setTimeout(function() {
        e.relatedContext.list.forEach((element, index) => {
          element['order'] = index
          tasks.push(element)
          // console.log(element.order, element.title)
        })
      }, 1000)

      setTimeout(() => {
        this.taskDragDrop(tasks, e.relatedContext.element.sectionId)
      }, 1500)

    },*/
    moveSection(e) {
      let ordered = []

      setTimeout(() => {
        this.localdata.forEach(function(element, index) {
          element.order = index
          ordered.push(element)
        });
      }, 800)

      setTimeout(() => {
        this.ordered = [...ordered]
        this.sectionDragDrop()
      }, 1200)

    },
    async sectionDragDrop() {
      this.loading = true
      let sectionDnD = await this.$axios.$put("/section/dragdrop", { projectId: this.project.id, data: this.ordered }, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
          "Content-Type": "application/json"
        }
      })

      // console.log(sectionDnD)
      if (sectionDnD.statusCode == 200) {
        // console.info(sectionDnD.message)
        this.$store.dispatch("section/fetchProjectSections", { projectId: this.$route.params.id }).then(() => {
          this.key += 1
          this.$nuxt.$emit("update-key", this.key)
        })
      } else {
        console.warn(sectionDnD.message)
        this.popupMessages.push({ text: sectionDnD.message, variant: "warning" })
      }

      this.loading = false
    },
    async taskDragDrop(newData, sectionId) {
      this.loading = true
      let taskDnD;
      if (sectionId) {
        taskDnD = await this.$axios.$put("/section/crossSectionDragDrop", { data: newData, sectionId: sectionId }, {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          }
        })
      } else {
        taskDnD = await this.$axios.$put("/task/dragdrop", { data: newData }, {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          }
        })
      }

      // console.log(taskDnD)
      if (taskDnD.statusCode == 200) {
        // console.info(taskDnD.message)
        this.$store.dispatch("section/fetchProjectSections", { projectId: this.$route.params.id }).then(() => {
          this.taskByOrder();
          this.popupMessages.push({ text: taskDnD.message, variant: "success" })
        })
      } else {
        console.warn(taskDnD.message)
        this.popupMessages.push({ text: taskDnD.message, variant: "warning" })
      }
      this.loading = false
    },
    taskWithSection(sectionId) {
      var arr = []

      for (var j = 0; j < this.tasks.length; ++j) {
        if (this.tasks[j].sectionId == sectionId) {
          arr.push(this.tasks[j]);
        }
      }

      // Sort By Title
      if (this.sortName == 'name' && this.orderBy == 'asc') {
        arr.sort((a, b) => a.title.localeCompare(b.title));
      }

      if (this.sortName == 'name' && this.orderBy == 'desc') {
        arr.sort((a, b) => b.title.localeCompare(a.title));
      }

      // Sort By owner
      if (this.sortName == 'owner' && this.orderBy == 'asc') {
        arr.sort((a, b) => a.user.firstName.localeCompare(b.user.firstName));
      }

      if (this.sortName == 'owner' && this.orderBy == 'desc') {
        arr.sort((a, b) => b.user.firstName.localeCompare(a.user.firstName));
      }

      // sort By Status
      if (this.sortName == 'status' && this.orderBy == 'asc') {
        arr.sort((a, b) => a.status.text.localeCompare(b.status.text));
      }

      if (this.sortName == 'status' && this.orderBy == 'desc') {
        arr.sort((a, b) => b.status.text.localeCompare(a.status.text));
      }

      // sort By Start Date

      if (this.sortName == 'startDate' && this.orderBy == 'asc') {
        arr.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }

      if (this.sortName == 'startDate' && this.orderBy == 'asc') {
        arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      // sort By DueDate
      if (this.sortName == 'dueDate' && this.orderBy == 'asc') {
        arr.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      }

      if (this.sortName == 'dueDate' && this.orderBy == 'desc') {
        arr.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
      }

      // Sort By Priotity
      if (this.sortName == 'priority' && this.orderBy == 'asc') {
        arr.sort((a, b) => a.priority.text.localeCompare(b.priority.text));
      }

      if (this.sortName == 'priority' && this.orderBy == 'desc') {
        arr.sort((a, b) => b.priority.text.localeCompare(a.priority.text));
      }

      return arr;
    },
    debounceUpdateTask: _.debounce(function(e) {
      let tasks = []
      // console.log(e.to.dataset)

      e.relatedContext.list.forEach((element, index) => {
        element['order'] = index
        tasks.push(element)
        // console.log(element.order, element.title)
      })

      // console.log(tasks)

      this.taskDragDrop(tasks, e.to.dataset.section)

    }, 800),
    overdue(item) {
      // console.log(new Date(item.dueDate), new Date);
      return (new Date(item.dueDate) < new Date() && item.statusId != 5) ? 'bg-danger' : '';
    },

    openSidebar($event) {
      this.$nuxt.$emit("open-sidebar", true);
      this.$store.dispatch('task/setSingleTask', $event)
      // console.log(event.target)
      let el = event.target.offsetParent
      let scrollAmt = event.target.offsetLeft - event.target.offsetWidth;

      el.scrollTo({
        top: 0,
        left: scrollAmt,
        behavior: 'smooth'
      });

    },
    addToFavorites() {
      console.log('favorites')
    }
  },
};

</script>
<style scoped lang="scss">
.smooth-dnd-container.vertical>.smooth-dnd-draggable-wrapper {
  overflow: initial;
}

.section-draggable {
  min-height: calc(100vh - 260px);
}

.highlight {
  outline: 3px lightblue dashed;
}

.task-grid-section {
  flex: 0 0 16rem;
  /*min-height: calc(100vh - 200px);*/
  padding: 10px;
  user-select: none;

  .section-drag-handle {
    cursor: grab;
  }

  &:not(:first-child) {
    border-left: 1px solid $gray4;
  }

  &:last-child {
    border-right: 1px solid $gray4;
  }

  .title {
    font-weight: bold;
  }

  &:hover {

    &,
    &+.task-grid-section {
      border-left-color: $gray5;
    }

  }

  &:last-child:hover {
    border-right-color: $gray5;
  }
}


.task-top,
.task-bottom {
  display: flex;
  justify-content: space-between;
  padding: 8px;
}

.task-top {
  margin-bottom: 1rem;
}

.task-bottom {
  align-items: center;
}

.task-grid {
  margin: 8px 4px 8px;
  background: var(--bib-light);
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;

  &.bg-danger {
    background-color: var(--bib-danger);
    color: #fff;

    .user-name {
      color: #fff
    }
  }

  &.active {
    background-color: var(--bib-gray4);
    border-color: var(--bib-gray6);
  }

  .task-image {
    aspect-ratio: 16 / 9;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  span {
    font-size: 15px;
    font-weight: 500;
  }

  .task-bottom span {
    font-size: 13px;
  }

}

.flip-list-move {
  transition: transform 0.5s;
}

::v-deep {
  .user-info-wrapper {
    .user-name {
      visibility: hidden;
      opacity: 0;
      transition: opacity 200ms ease-out;
    }

    &:hover .user-name {
      visibility: visible;
      opacity: 1;
    }
  }

  .bg-danger {
    .user-name {
      color: #fff
    }
  }

  .custom-control-label {
    &::before {
      width: 1.4rem;
      height: 1.4rem;
    }
  }

  .custom-checkbox {
    height: 22px;
  }
}

</style>
