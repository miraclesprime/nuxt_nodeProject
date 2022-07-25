<template>
  <div class="of-scroll-x position-relative" style="min-height: 20rem;">
    <draggable :list="localdata" class="d-flex " :move="moveSection" v-on:end="$emit('section-dragend', localdata)" handle=".section-drag-handle">
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
                  </span><span class="list__item" :id="'tgs-list-2'+section.id" v-on:click="$emit('section-rename',{id: section.id, title: section.title })">
                    <div class="d-flex align-center" :id="'tgs-list-flex-2'+section.id">
                      <bib-icon icon="pencil"></bib-icon>
                      <span class="ml-05" :id="'tgs-list-span'+section.id">Rename</span>
                    </div>
                  </span>
                  <hr>
                  <span class="list__item list__item__danger" :id="'tgs-list-3'+section.id" v-on:click="$emit('section-delete',{id: section.id })">
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
                  <bib-icon icon="check-circle" :scale="1.25" :variant="task.statusId == 5 ? 'success' : 'secondary-sub1'" class="cursor-pointer" @click="markComplete(task)"></bib-icon>
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
                      <span class="list__item list__item__danger" :id="'tg-delete-task'+task.id" @click="$emit('delete-task', task)">Delete Task</span>
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
  </div>
</template>
<script>
/*
  @vue-emits:['section-rename', 'section-delete', "create-task", 'delete-task', "set-favorite", "mark-complete", ],
  @vue-nuxt-emits:[ "update-key", ],
*/
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
      // popupMessages: [],
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
    // this.localdata = _.cloneDeep(this.sections)
    // console.info('mounted', this.project)
    this.$store.dispatch("section/fetchProjectSections", { projectId: this.project.id })
      .then((sections) => {
        // let key = parseInt(Math.random().toString().slice(-2))
        this.localdata = sections
        this.loading = false
        this.$emit("update-key")
      })
      .catch(e => {
        console.log(e)
        this.loading = false
      })

  },

  methods: {
    isFavorite(task) {
      let fav = this.favTasks.some(t => t.task.id == task.id)
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

      // this.taskDnDlist = tasks
      this.taskDnDsectionId = +e.to.dataset.section
      this.highlight = +e.to.dataset.section

    },

    taskDragEnd(e) {
      // console.log(e)
      this.highlight = false
      let sectionData = this.localdata.filter(s => s.id == e.to.dataset.section)
      this.$emit('task-dragend', { tasks: sectionData[0].tasks, sectionId: e.to.dataset.section })
    },

    moveSection(e) {

      // console.log("move section =>",e.relatedContext.list)
      this.highlight = +e.to.dataset.section

    },

    overdue(item) {
      // console.log(new Date(item.dueDate), new Date);
      return (new Date(item.dueDate) < new Date() && item.statusId != 5) ? 'bg-warning-sub3' : '';
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
    },
    /*
        taskCheckIcon(task) {
          return task.statusId == 5 ? 'success' : 'secondary-sub1'
        },*/
    markComplete(task) {
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
