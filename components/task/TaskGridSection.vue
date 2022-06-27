<template>
  <div class="of-scroll-x position-relative" style="min-height: 20rem;">
    <draggable :list="localdata" class="d-flex " :move="moveSection" v-on:end="sectionDragEnd" handle=".section-drag-handle">
      <div class="task-grid-section " :id="'task-grid-section-wrapper-'+section.id" v-for="section in localdata" :key="`grid-${templateKey}${section.title}${section.id}`">
        <div class="w-100 d-flex " :id="'tgs-inner-wrap-'+section.id" style="margin-bottom: 10px">
          <div class="title text-gray section-drag-handle flex-grow-1" :id="'tgs-label-'+section.id">{{ section.title.includes('_section') ? 'Untitled section' : section.title }}</div>
          <div class="d-flex align-center section-options" :id="'tgs-section-options-'+section.id">
            <div class="cursor-pointer mx-05 d-flex align-center" v-on:click.stop="showCreateTaskModal(section.id)">
              <bib-icon icon="add" variant="gray5" :scale="1.25"></bib-icon>
            </div>
            <bib-popup pop="elipsis" icon-variant="gray5" :scale="1.1">
              <template v-slot:menu>
                <div :id="'tgs-list'+section.id" class="list">
                  <span class="list__item" :id="'tgs-list-1'+section.id" v-on:click.stop="showCreateTaskModal(section.id)">
                    <div class="d-flex align-center" :id="'tgs-list-flex-1'+section.id">
                      <bib-icon icon="add"></bib-icon>
                      <span class="ml-05" :id="'tgs-list-span'+section.id">Add task</span>
                    </div>
                  </span><span class="list__item" :id="'tgs-list-2'+section.id" v-on:click="$nuxt.$emit('section-rename',{id: section.id, title: section.title })">
                    <div class="d-flex align-center" :id="'tgs-list-flex-2'+section.id">
                      <bib-icon icon="pencil"></bib-icon>
                      <span class="ml-05" :id="'tgs-list-span'+section.id">Rename</span>
                    </div>
                  </span><hr>
                  <span class="list__item danger" :id="'tgs-list-3'+section.id" v-on:click="$nuxt.$emit('section-delete',{id: section.id })">
                    Delete section
                  </span>
                </div>
              </template>
            </bib-popup>
          </div>
        </div>
        <div class="task-section__body" :id="'tgs-task-section-body-'+section.id">
          <draggable :list="section.tasks" :group="{name: 'task'}" :move="moveTask" @start="taskDragStart" @end="taskDragEnd" class="section-draggable" :class="{highlight: highlight == section.id}" :data-section="section.id">
            <!-- <transition-group > -->
            <div class="task-grid " v-for="task in section.tasks" :key="task.title + templateKey + '-' + task.id" :class="[overdue(task), currentTask.id == task.id ? 'active' : '']" :id="'tg-card-'+task.id" v-on:click="openSidebar(task, section.projectId)">
              <figure v-if="task.cover" id="tg-card-image" class="task-image bg-light" style="background-image:url('https://via.placeholder.com/200x110')"></figure>
              <div class="task-top" :id="'tg-card-top'+task.id">
                <div class="d-flex" :id="'tg-card-inside-wrap'+task.id">
                  <bib-icon icon="check-circle" :scale="1.5" :variant="task.statusId == 5 ? 'success' : 'secondary-sub1'" class="cursor-pointer" @click="markComplete(task)"></bib-icon>
                  <span class="ml-05" :id="'tg-title'+task.id">{{ task.title }} </span>
                </div>
                <bib-button pop="elipsis" icon="elipsis" :icon-variant="overdue(task) == 'bg-danger'? 'white' :'secondary'">
                  <template v-slot:menu>
                    <div class="list" :id="'tg-list'+task.id">
                      <span class="list__item success" :id="'tg-comp'+task.id" v-on:click="markComplete(task)">
                        <bib-icon icon="check-circle" :variant="task.statusId == 5 ? 'success' : 'secondary-sub1'" class="mr-05"></bib-icon> {{task.statusId != 5 ? "Mark" : ""}} Completed
                      </span>
                      <span class="list__item" :id="'tg-fav'+task.id" data-fav="isFavorite(task).status" v-on:click.stop="addToFavorites(task)">
                        <bib-icon :icon="isFavorite(task).icon" :variant="isFavorite(task).variant" class="mr-05"></bib-icon> {{isFavorite(task).text}}
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
                      <span class="list__item danger" :id="'tg-delete-task'+task.id" @click="$emit('delete-task', task)">Delete Task</span>
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
import draggable from 'vuedraggable'
import { mapGetters } from 'vuex';

export default {
  components: {
    draggable
  },
  data() {
    return {
      // sections: this.taskSections,
      localdata: [],
      flag: false,
      ordered: [],
      loading: false,
      drag: false,
      highlight: null,
      taskDnDlist: [],
      taskDnDsectionId: null,
      popupMessages: [],
    };
  },
  props: {
    sections: { type: Array, required: true },
    templateKey: { default: 0 },
    // activeTask: { type: Object },
    // tasks: { type: Array },
  },

  computed: {
    ...mapGetters({
      token: "token/getToken",
      project: "project/getSingleProject",
      currentTask: 'task/getSelectedTask',
      // sections: "section/getProjectSections",
      favTasks: "task/getFavTasks",
    }),
    
  },

  watch: {
    sections(newVal) {
      // console.info(newVal)
      this.localdata = newVal
    }
  },

  mounted() {
    this.loading = true
    // console.info('mounted', this.project)
    this.$store.dispatch("section/fetchProjectSections", { projectId: this.project.id }).then((sections) => {
      let key = parseInt(Math.random().toString().slice(-2))
      // console.log(sections)
      this.localdata = sections
      this.$emit("update-key")
      this.loading = false
    }).catch(e => console.log(e))

  },

  methods: {
    isFavorite(task) {
      let fav = this.favTasks.some(t  => t.task.id == task.id)
      if (fav) {
        return { icon: "bookmark-solid", variant: "orange", text: "Remove favorite", status: true }
      } else {
        return { icon: "bookmark", variant: "gray5", text: "Add to favorites", status: false }
      }
    },
    showCreateTaskModal(sectionId) {
      this.$emit("create-task", sectionId) //event will be captured by parent only
      this.$nuxt.$emit("create-task", sectionId) //event will be available to all
    },
    taskDragStart(e) {
      this.drag = true
      // console.log('drag start', e)
    },

    moveTask(e) {
      // console.log("move =>",e)
      // console.log("move to section =>",e.to.dataset.section)
      // console.log("related context list =>", list, list.length)

      // this.taskDnDlist = tasks
      this.taskDnDsectionId = +e.to.dataset.section
      this.highlight = +e.to.dataset.section

    },

    /*debounceMoveTask: _.debounce(function(e) {
      // console.info('move', e.draggedContext.element)
      console.log("move ", e)
      console.log("move to section =>",e.to.dataset.section)
      // console.info("move list", e.relatedContext.list);
      // console.log("task move=>", this.taskDnDlist, this.taskDnDsectionId)

      let tasks = []

      e.relatedContext.list.forEach((element, index) => {
        element['order'] = index
        tasks.push(element)
        // console.table(element.order, element.title)
      })

      // console.log(tasks, e.to.dataset.section)
      this.taskDnDlist = tasks
      this.taskDnDsectionId = +e.to.dataset.section
      this.highlight = +e.to.dataset.section

    }, 400),*/

    taskDragEnd: _.debounce(async function(e) {
      // this.drag = false
      // console.log('move end =>', e)
      this.highlight = null
      this.loading = true

      // console.log("move end =>", e.to.dataset.section)

      let tasklist = this.localdata.filter((t) => t.id == e.to.dataset.section )

      // console.log(tasklist[0].tasks)

      tasklist[0].tasks.forEach((e,i)=>{
        e.order = i
      })

      // console.log(tasklist[0].tasks)


      let taskDnD;
      if (this.taskDnDsectionId) {
        taskDnD = await this.$axios.$put("/section/crossSectionDragDrop", { data: tasklist[0].tasks, sectionId: this.taskDnDsectionId }, {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          }
        })
      } else {
        taskDnD = await this.$axios.$put("/task/dragdrop", { data: this.taskDnDlist }, {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("accessToken"),
            "Content-Type": "application/json"
          }
        })
      }

      console.log(taskDnD.message)
      if (taskDnD.statusCode == 200) {
        // console.info(taskDnD.message)
        this.$emit("update-key")
        // this.taskDnDsectionId = null
      } else {
        console.warn(taskDnD.message)
      }
      this.loading = false
    }, 600),

    /*taskByOrder() {
      this.localdata = JSON.parse(JSON.stringify(this.sections))

      let sorted = this.localdata.map(s => {
        let t = s.tasks.sort((a, b) => a.order - b.order)
        s.tasks = t
        return s
      })
      // console.log("sorted =>", sorted)
      this.localdata = sorted
      // this.key += 1
      this.$nuxt.$emit("update-key")
    },*/

    moveSection(e){

      // console.log("move section =>",e.relatedContext.list)
      this.highlight = +e.to.dataset.section

    },

    /*moveSection: _.debounce(function(e) {

      console.log("move section =>",e.relatedContext.list)

      let ordered = []
      e.relatedContext.list.forEach(function(element, index) {
        element["order"] = index
        ordered.push(element)
      });

      this.ordered = ordered

    }, 400),*/

    sectionDragEnd: _.debounce(async function(e) {

      this.loading = true
      this.localdata.forEach((el,i)=>{
        el.order = i
      })

      console.log("ordered sections =>",this.localdata)

      let sectionDnD = await this.$axios.$put("/section/dragdrop", { projectId: this.project.id, data: this.localdata }, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
          "Content-Type": "application/json"
        }
      })

      console.log(sectionDnD.message)

      if (sectionDnD.statusCode == 200) {
        // console.info(sectionDnD.message)
        this.$store.dispatch("section/fetchProjectSections", { projectId: this.$route.params.id }).then(() => {
          // this.$emit("update-key")
          this.$nuxt.$emit("update-key")

        })
      } /*else {
        console.warn(sectionDnD.message)
      }*/

      this.loading = false

    }, 600),

    /*taskWithSection(sectionId) {
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
    },*/

    overdue(item) {
      // console.log(new Date(item.dueDate), new Date);
      return (new Date(item.dueDate) < new Date() && item.statusId != 5) ? 'bg-danger' : '';
    },

    openSidebar(task, projectId) {
      let project = [{
        projectId: projectId,
        project: {
          id: projectId
        }
      }]
      this.$nuxt.$emit("open-sidebar", { ...task, project: project });

      let el = event.target.offsetParent
      let scrollAmt = event.target.offsetLeft - event.target.offsetWidth;

      el.scrollTo({
        top: 0,
        left: scrollAmt,
        behavior: 'smooth'
      });

    },
    addToFavorites(task) {
      // console.log('to be favorites task', task.id)
      this.$emit("set-favorite", task)
    },/*
    taskCheckIcon(task) {
      return task.statusId == 5 ? 'success' : 'secondary-sub1'
    },*/
    markComplete(task){
      this.$emit("mark-complete", task)
    },
  },
};

</script>
<style scoped lang="scss">
.smooth-dnd-container.vertical>.smooth-dnd-draggable-wrapper {
  overflow: initial;
}

.section-draggable {
  min-height: calc(100vh - 260px);
  border-radius: 3px;
}

.highlight {
  outline: 2px skyblue dashed;
  background-color: azure;
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
