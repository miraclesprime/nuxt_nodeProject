<template>
  <div>
    <draggable v-model="localdata" class="d-flex of-scroll-x" :move="moveSection" handle=".section-drag-handle">
      <div class="task-grid-section " :id="'task-grid-section-wrapper-'+section.id" v-for="section in localdata" :key="`grid-${key}${section.title}${section.id}`">
        <div class="w-100 d-flex justify-between section-drag-handle" :id="'tgs-inner-wrap-'+section.id" style="margin-bottom: 10px">
          <div class="title text-gray" :id="'tgs-label-'+section.id" v-show="!section.title.includes('_section')">{{ section.title }}</div>
          <div class="d-flex align-center ml-auto section-options" :id="'tgs-section-options-'+section.id">
            <bib-icon icon="add" class="mx-05"></bib-icon>
            <bib-button pop="elipsis">
              <template v-slot:menu>
                <div :id="'tgs-list'+section.id" class="list">
                  <span class="list__item" :id="'tgs-list-1'+section.id">
                    <div class="d-flex align-center" :id="'tgs-list-flex-1'+section.id">
                      <bib-icon icon="add"></bib-icon>
                      <span class="ml-05" :id="'tgs-list-span'+section.id">Add task</span>
                    </div>
                  </span><span class="list__item" :id="'tgs-list-2'+section.id">
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
          <draggable :list="section.tasks" group="task" :move="moveTask">
            <div class="task-grid " v-for="task in section.tasks" :key="task.title + key + '-' + task.id" :class="overdue(task)" :id="'tg-card-'+task.id" v-on:click="openSidebar(task)">
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
                <user-info :user="task.user" avatar="https://i.pravatar.cc/32"></user-info>
                <span :id="'tg-bottom-duedate'+task.id" v-format-date="task.dueDate"></span>
              </div>
            </div>
          </draggable>
        </div>
      </div>
    </draggable>
    <loading :loading="loading"></loading>
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
    };
  },
  /*props: {
    sections: { type: Array },
    tasks: { type: Array },
  },*/
  created() {
    this.$nuxt.$on("update-key", () => {
      console.log('updated-key received')
      this.$store.dispatch("section/fetchProjectSections", this.project.id)
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
  },
  mounted() {
    // console.info('mounted', this.project)
    this.$store.dispatch("section/fetchProjectSections", this.project.id)
    this.key += parseInt(Math.random().toString().slice(-2))

    this.taskByOrder();

  },
  /*watch: {
    localdata: function(newValue, oldValue) {

      this.ordered = newValue

      this.ordered.forEach(function(element, index) {
        element.order = index
      });

      this.sectionDragDrop();

    }
  },*/
  computed: {
    ...mapGetters({
      token: "token/getToken",
      project: "project/getSingleProject",
      sections: "section/getProjectSections",
    }),
    templateKey() {

    },
    /*myList: {
      get: function() {
        this.data = JSON.parse(JSON.stringify(this.sections))
        // return JSON.parse(JSON.stringify(this.sections))
      },
      set: function(newValue) {
        this.data = newValue
      }
    }*/
  },
  methods: {
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
    moveTask(e) {
      // console.info(e.relatedContext.list)
      let tasks = []

      setTimeout(function() {
        e.relatedContext.list.forEach((element, index) => {
          element['order'] = index
          tasks.push(element)
          // console.log(element.order, element.title)
        })
      }, 1000)

      /*console.log(e.draggedContext.element )
      console.log(e.relatedContext.element)*/

      setTimeout(() => {
        // console.log("ordered tasks =>", tasks)
        /*for (let i = 0; i < tasks.length; i++) {
          console.log(tasks[i].order, tasks[i].title, tasks[i].id)
        }*/
        this.taskDragDrop(tasks, e.relatedContext.element.sectionId)
        // debounceUpdate(tasks)
      }, 1500)

    },
    moveSection(e) {

      let ordered=[]

      setTimeout(() => {
        this.localdata.forEach(function(element, index) {
          element.order = index
          ordered.push(element)
        });
      }, 800)

      setTimeout( () => {
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
        this.$store.dispatch("section/fetchProjectSections", this.$route.params.id).then(() => {
          this.key += 1
          this.$nuxt.$emit("update-key", this.key)
        })
      } else {
        console.warn(sectionDnD.message)
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
        console.info(taskDnD.message)

        this.$store.dispatch("section/fetchProjectSections", this.$route.params.id).then(() => {
          this.taskByOrder();
        })

      } else {
        console.warn(taskDnD.message)
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
    debounceUpdate: _.debounce(function(data) {
      // console.log('Debounce called!')
      this.taskDragDrop(...args)
    }, 1200),
    overdue(item) {
      // console.log(new Date(item.dueDate), new Date);
      return new Date(item.dueDate) < new Date() ? 'bg-danger' : 'bg-gray2';
    },
    swap(sourceObj, sourceKey, targetObj, targetKey) {
      var temp = sourceObj[sourceKey];
      sourceObj[sourceKey] = targetObj[targetKey];
      targetObj[targetKey] = temp;
    },
    getSectionPayload(index) {
      return JSON.parse(JSON.stringify(this.sections));
    },
    async onSectionDrop(dropResult) {
      const { removedIndex, addedIndex, payload } = dropResult
      console.info(dropResult);

      var ordered = []

      if (removedIndex - addedIndex >= 1 || removedIndex - addedIndex <= -1) {
        // ordered = JSON.parse(JSON.stringify(payload))
        ordered = payload.map(a => { return { ...a } })
        ordered.splice(removedIndex, 1)
        ordered.splice(addedIndex, 0, payload[removedIndex])

        ordered.forEach((item, index) => {
          item.order = index
        })
      }

      let dnd = await this.$axios.$put("/section/dragdrop", { projectId: payload[removedIndex].projectId, data: ordered }, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
          "Content-Type": "application/json"
        }
      })

      // console.log(dnd)
      if (dnd.statusCode == 200) {
        this.$store.dispatch("section/fetchProjectSections", this.$route.params.id)
        this.$store.dispatch('task/fetchTasks', { id: this.$route.params.id, filter: 'all' }).then(() => {
          this.$emit("update-key", 1)
          this.key += 1
        })
      } else {
        console.warn(dnd.message)
      }

    },
    getTaskPayload(sectionId) {
      let propTasks = JSON.parse(JSON.stringify(this.tasks))
      var tasks = []

      for (var j = 0; j < propTasks.length; ++j) {
        if (propTasks[j].sectionId == sectionId) {
          tasks.push(propTasks[j]);
        }
      }
      return tasks;
    },
    async onTaskDrop(dropResult) {

      const { removedIndex, addedIndex, payload, element } = dropResult

      // console.info(dropResult);
      var ordered = []

      /*if (removedIndex - addedIndex >= 1 || removedIndex - addedIndex <= -1) {
        // ordered = JSON.parse(JSON.stringify(payload))
        ordered = payload.map(a => { return { ...a } })
        ordered.splice(removedIndex, 1)
        ordered.splice(addedIndex, 0, payload[removedIndex])

        ordered.forEach((item, index) => {
          item.order = index
        })
      }*/

      // console.log(ordered)

      /*let dnd = await this.$axios.$put("/task/dragdrop", { sectionId: payload[removedIndex].sectionId, data: ordered }, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
          "Content-Type": "application/json"
        }
      })

      // console.log(dnd)
      if (dnd.statusCode == 200) {
        this.$store.dispatch("section/fetchProjectSections", this.$route.params.id)
        this.$store.dispatch('task/fetchTasks', { id: this.$route.params.id, filter: 'all' }).then(() => {
          this.$emit("update-key", 1)
          this.key += 1
        })
      } else {
        console.warn(dnd.message)
      }*/

    },

    /*log(evt) {
      window.console.log(evt);
    },*/
    /*onDropReady(dropResult) {
      const { removedIndex, addedIndex, payload, element } = dropResult;
      console.log(dropResult)
    },
    shouldAcceptDrop(sourceContainerOptions, payload) {
      console.log(sourceContainerOptions, payload)
      return true;
    },*/

    openSidebar($event) {
      // this.flag = !this.flag;
      this.$nuxt.$emit("open-sidebar", true);
      // this.$nuxt.$emit("set-active-task", task);
      this.$store.dispatch('task/setSingleTask', $event)
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

.task-grid-section {
  flex: 0 0 16rem;
  /*min-width: 240px;
  min-height: 80vh;*/
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
  /*background: var(--bib-gray2);*/
  border-radius: 4px;
  cursor: pointer;

  &.bg-danger {
    background-color: var(--bib-danger);
    color: #fff;

    .user-name {
      color: #fff
    }
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
