<template>
  <div id="tgs-scroll" class="of-scroll-x position-relative" style="min-height: 30rem;">
    <draggable :list="localdata" class="d-flex " :move="moveSection" v-on:end="$emit('section-dragend', localdata)" handle=".section-drag-handle">
      <div class="task-grid-section " :id="'task-grid-section-wrapper-'+section.id" v-for="section in localdata" :key="`grid-${templateKey}${section.title}${section.id}`">
        <div class="w-100 d-flex align-center section-title-wrapper border-bottom-gray2 mb-075" :id="'tgs-inner-wrap-'+section.id" :class="{'active': sectionEdit}" >
          <!-- <div class="title text-gray section-drag-handle flex-grow-1" :id="'tgs-label-'+section.id">
            <template v-if="sectionEdit">
              <input type="text" class="new-section-input" :ref="'sectionEditInput'+section.id" v-model="section.title" @input.stop="updateSectionTitle(section.title)" @blur="() => {sectionEdit = false}" @keyup.esc="() => {sectionEdit = false}">
            </template>
            <span v-else @click.stop="makeSectionEditable('sectionEditInput'+section.id)">{{ section.title.includes('_section') ? 'Untitled section' : section.title }}</span>
          </div> -->
          <task-grid-section-title :section="section" @update-title="renameSection"></task-grid-section-title>
          <div class="d-flex align-center section-options" :id="'tgs-section-options-'+section.id">
            <div class="cursor-pointer shape-rounded bg-hover-gray2 mx-05 align-center" v-on:click.stop="showCreateTaskModal(section.id)">
              <bib-icon icon="add" variant="gray5" :scale="1.25"></bib-icon>
            </div>
            <bib-popup pop="elipsis" icon-variant="gray5" class="bg-hover-gray2" :scale="1">
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
                  <span class="list__item list__item__danger" :id="'tgs-list-3'+section.id" v-on:click="$emit('section-delete',{id: section.id, title: section.title, projectId: section.projectId })">
                    Delete section
                  </span>
                </div>
              </template>
            </bib-popup>
          </div>
        </div>
        <div class="task-section__body" :id="'tgs-task-section-body-'+section.id">
          <draggable :list="section.tasks" :group="{name: 'task'}" :move="moveTask" @start="taskDragStart" @end="taskDragEnd" class="section-draggable" :class="{highlight: highlight == section.id}" :data-section="section.id">
            <!-- <div class="task-grid bg-white" v-for="task in section.tasks" :key="task.title + templateKey + '-' + task.id" :class="[ currentTask.id == task.id ? 'active' : '']" :id="'tg-card-'+task.id" v-on:click.stop="openSidebar(task, section.projectId)">
              <figure v-if="task.cover" id="tg-card-image" class="task-image bg-light" style="background-image:url('https://via.placeholder.com/200x110')"></figure>
              <div class="task-top" :id="'tg-card-top'+task.id">
                <div class="d-flex" :id="'tg-card-inside-wrap'+task.id">
                  <span class="cursor-pointer" @click="markComplete(task)">
                    <bib-icon icon="check-circle" :scale="1.5" :variant="task.statusId == 5 ? 'success' : 'light'" ></bib-icon>
                  </span>
                  <span class="ml-05" :id="'tg-title'+task.id">{{ task.title }} </span>
                </div>
                <div class="shape-circle bg-light width-2 height-2 d-flex flex-shrink-0 justify-center align-center">
                  <bib-popup pop="elipsis" icon-variant="gray5" icon-hover-variant="dark" >
                    <template v-slot:menu>
                      <div class="list" :id="'tg-list'+task.id">
                        <span class="list__item success" :id="'tg-comp'+task.id" v-on:click="markComplete(task)">
                          <bib-icon icon="check-circle" :variant="task.statusId == 5 ? 'success' : 'secondary-sub1'" class="mr-05"></bib-icon> {{task.statusId != 5 ? "Mark" : ""}} Completed
                        </span>
                        <span class="list__item" :id="'tg-fav'+task.id" data-fav="isFavorite(task).status" v-on:click.stop="addToFavorites(task)">
                          <bib-icon :icon="isFavorite(task).icon" :variant="isFavorite(task).variant" class="mr-05"></bib-icon> {{isFavorite(task).text}}
                        </span>
                        <hr>
                        <span class="list__item" :id="'tg-attach'+task.id">
                          <bib-icon icon="check-square-solid" class="mr-05"></bib-icon> Subtasks
                        </span>
                        <span class="list__item" :id="'tg-assign'+task.id">
                          <bib-icon icon="user-group-solid" class="mr-05"></bib-icon> Team
                        </span>
                        <span class="list__item" :id="'tg-reminder'+task.id">
                          <bib-icon icon="comment-forum" class="mr-05"></bib-icon> Conversation
                        </span>
                        <span class="list__item " :id="'tg-copy-link'+task.id">
                          <bib-icon icon="awesome-file" class="mr-05"></bib-icon> Files
                        </span>
                        <span class="list__item" :id="'tg-move'+task.id">
                          <bib-icon icon="time-history" class="mr-05"></bib-icon> History
                        </span>
                        <span class="list__item " :id="'tg-view-task'+task.id">
                          <bib-icon icon="warning" class="mr-05"></bib-icon> Report
                        </span>
                        <hr>
                        <span class="list__item list__item__danger" :id="'tg-delete-task'+task.id" @click="$emit('delete-task', task)">Delete Task</span>
                      </div>
                    </template>
                  </bib-popup>
                </div>
              </div>
              <div class="task-mid d-flex gap-05">
                <status-badge :status="task.status"></status-badge>
                <priority-badge :priority="task.priority"></priority-badge>
              </div>
              <div class="task-bottom" :id="'tg-card-bottom'+task.id">
                <user-info v-if="task.userId" :userId="task.userId"></user-info>
                <div v-if="task.dueDate" class="align-center gap-05 ml-auto">
                  <bib-icon icon="calendar" :variant="overdue(task)"></bib-icon>
                  <format-date :datetime="task.dueDate" :variant="overdue(task)" ></format-date>
                </div>
              </div>
            </div> -->
            <template v-for="task in section.tasks">
              <task-grid :task="task" :project="section.projectId" :key="task.title + templateKey + '-' + task.id" :class="[ currentTask.id == task.id ? 'active' : '']" @open-sidebar="openSidebar(task, section.projectId)" ></task-grid>
            </template>
            <task-grid-blank :section="section" :key="'blankTaskGrid'+section.id" :ref="'blankTaskGrid'+section.id" @close-other="closeOtherBlankGrid"></task-grid-blank>
            <!-- <div v-click-outside="closeNewTask">
              <div class="bg-success-sub6 shape-rounded cursor-pointer bg-hover-success-sub3 px-05 text-success text-center font-lg" @click.stop="showNewTask(section.id)" >+</div>
              <task-grid-blank :ref="'newTaskGrid'+section.id" :key="'newTaskGrid'+section.id" :sectionId="section.id" ></task-grid-blank>
            </div> -->
          </draggable>
        </div>
      </div>
      <div class="task-grid-section " id="task-grid-section-blank-1">
        <div class="section-title-wrapper d-flex justify-center flex-d-column p-05 mb-075" :class="{'active': sectionInput}" >
          <div class="title pb-05" id="tgs-new-section">
            <div v-if="!sectionInput" class="pt-025 align-center position-relative">
              <span class="text-secondary cursor-pointer d-inline-block  " @click="sectionInput = true">Add section</span>
              <span v-if="newSectionLoader" class="position-absolute" style="top:-2px;right:-2px;"><bib-spinner :scale="2.25"></bib-spinner></span>
            </div>
            <template v-else>
              <input type="text" ref="newsectioninput" class="new-section-input" placeholder="Enter text..." v-model.trim="newSectionName" @blur="() => {newSectionName = ''; sectionInput = false}" @keyup.esc="() => {newSectionName = ''; sectionInput = false}" @input="debounceCreateSection" @keyup.enter="createSection">
            </template>
          </div>
          <span class="border-bottom-gray2 my-025"></span>
        </div>
      </div>
      <div class="task-grid-section " id="task-grid-section-blank-2"></div>
      <div class="task-grid-section " style="border-left-color: transparent;" id="task-grid-section-blank-3"></div>
    </draggable>
    <!-- <loading :loading="loading"></loading> -->
  </div>
</template>
<script>
/*
  @vue-emits:['section-rename', 'section-delete', "create-task", 'delete-task', "set-favorite", "mark-complete", ],
  @vue-nuxt-emits:[ "update-key", ],
*/
import draggable from 'vuedraggable'
import { mapGetters } from 'vuex';
import _ from 'lodash'

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
      sectionInput: false,
      sectionEdit: false,
      newSectionName: '',
      newSectionLoader: false,
      newTask: false,
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
    },
    sectionInput(newVal){
      if (newVal) {
        this.$nextTick(()=>{
          // document.getElementById("newsectioninput").focus()
          // console.log(this.$refs.newsectioninput)
          this.$refs.newsectioninput.focus()
        })
      }
    },
    templateKey(){
      this.newSectionLoader = false
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
    closeOtherBlankGrid($event){
      // console.log($event, this.$refs)
      // this.$nextTick(() => {
        for (var ref in this.$refs) {
          // console.info(this.$refs[ref][0], $event)
          if(this.$refs[ref][0].title != $event){
            this.$refs[ref][0].newTask = false
          }
        }
      // });
    },
    isFavorite(task) {
      let fav = this.favTasks.some(t => t.task.id == task.id)
      if (fav) {
        return { icon: "bookmark-solid", variant: "orange", text: "Remove favorite", status: true }
      } else {
        return { icon: "bookmark-solid", variant: "gray5", text: "Add to favorites", status: false }
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
      return (new Date(item.dueDate) < new Date() && item.statusId != 5) ? 'danger' : 'gray5';
    },   

    openSidebar(task, projectId) {
      // console.log(event.target.classList)
      // let elclass = event.target.classList
      let fwd = this.$donotCloseSidebar(event.target.classList)
      if(!fwd) {
        this.$nuxt.$emit("close-sidebar");
        return false
      } 
      
      let project = [{
        projectId: projectId,
        project: {
          id: projectId
        }
      }]
      this.$nuxt.$emit("open-sidebar", { ...task, project: project });

      // let el = event.target.offsetParent
      let el = document.getElementById("tgs-scroll")
      let scrollAmt = event.target.closest(".task-grid").offsetLeft - event.target.offsetWidth;
      // console.log(event.target.closest(".task-grid").offsetLeft)
      el.scrollTo({
        top: 0,
        left: scrollAmt,
        behavior: 'smooth'
      });
    },

    /*addToFavorites(task) {
      // console.log('to be favorites task', task.id)
      this.$emit("set-favorite", task)
    },*/
    /*
        taskCheckIcon(task) {
          return task.statusId == 5 ? 'success' : 'secondary-sub1'
        },*/
    /*markComplete(task) {
      this.$emit("mark-complete", task)
    },*/

    debounceCreateSection: _.debounce(function() {
      this.createSection()
    }, 1200),

    createSection(){
      if (this.newSectionName.length > 0) {
        this.newSectionLoader = true
        this.$emit('create-section', this.newSectionName)
      }
      this.sectionInput = false
      this.newSectionName = ''
      this.$emit("update-key")
    },
    renameSection(payload){
      // console.log(payload)
      this.$store.dispatch("section/renameSection", {
        id: payload.id,
        // projectId: this.section.projectId,
        data: {
          title: payload.title
        },
        text: `renamed section to "${payload.title}"`,
      }, ).then(r => {
        // console.log(r)
        if (r.statusCode == 200) {
          this.$emit("update-key")
        }
      }).catch(e => console.warn(e))
    },
  },
};

</script>
<style lang="scss" scoped >
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

.section-title-wrapper {
  min-height: 50px;
  max-width: 280px;
  border-radius: 0.35rem;
  border: 1px dashed transparent;
  &.active {
    background-color: white;
    border-color: var(--bib-gray4);
  }
}

.new-section-input {
  min-height: 2rem;
  max-width: 200px;
  padding: 0 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 0.25rem;
  border: 1px solid var(--bib-gray1);

  &:focus {
    outline: none;
    border-color: var(--bib-dark);
  }
}

::v-deep {

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

}

</style>
