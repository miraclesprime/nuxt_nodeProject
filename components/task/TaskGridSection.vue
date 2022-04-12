<template>
  <Container class="d-flex of-scroll-x" orientation="horizontal" @drop="onSectionDrop" :get-child-payload="getSectionPayload" >
    <Draggable v-for="section in sections" :key="`grid-${key}${section.title}${section.id}`">
      <div class="task-grid-section draggable-item" id="task-grid-section-wrapper">
        <div class="w-100 d-flex justify-between" id="tgs-inner-wrap" style="margin-bottom: 10px">
          <div class="title text-gray" id="tgs-label" v-show="!section.title.includes('_section')">{{ section.title }}</div>
          <div class="d-flex align-center ml-auto section-options" id="tgs-section-options">
            <bib-icon icon="add" class="mx-05"></bib-icon>
            <bib-button pop="elipsis">
              <template v-slot:menu>
                <div class="list">
                  <span class="list__item">
                    <div class="d-flex align-center">
                      <bib-icon icon="add"></bib-icon>
                      <span class="ml-05">Add task</span>
                    </div>
                  </span><span class="list__item">
                    <div class="d-flex align-center">
                      <bib-icon icon="pencil"></bib-icon>
                      <span class="ml-05">Rename</span>
                    </div>
                  </span>
                </div>
              </template>
            </bib-button>
          </div>
        </div>
        <div class="task-section__body" id="tgs-task-section-body">
          <Container group-name="1" @drop="onTaskDrop" @drop-ready="onDropReady" :get-child-payload="()=>getTaskPayload(section.id)" :should-accept-drop="shouldAcceptDrop">
            <Draggable v-for="task in taskWithSection(section.id)" :key="task.title + key + '-' + task.id">
              <div class="task-grid draggable-item " :class="overdue(task)" :id="'tg-card-'+task.id">
                <figure v-if="task.cover" id="tg-card-image" class="task-image bg-light" style="background-image:url('https://via.placeholder.com/200x110')"></figure>
                <div class="task-top" id='tg-card-top'>
                  <div class="d-flex" id='tg-card-inside-wrap'>
                    <bib-icon icon="check-circle" :scale="1.5" :variant="task.status.text === 'Done' ? 'success' : 'secondary-sub1'" class="cursor-pointer" @click="handleTaskStatus(task)"></bib-icon>
                    <span class="ml-05" id='tg-title'>{{ task.title }} </span>
                  </div>
                  <bib-button pop="elipsis" icon="elipsis" :icon-variant="overdue(task) == 'bg-danger'? 'white' :'secondary'">
                    <template v-slot:menu>
                      <div class="list" id='tg-list'>
                        <span class="list__item" v-on:click="openSidebar(task)">Details</span>
                        <hr>
                        <span class="list__item">
                          <bib-icon icon="check-circle" class="mr-05"></bib-icon> Mark Completed
                        </span>
                        <span class="list__item" id='tg-fav' @click="addToFavorites">
                          <bib-icon icon="heart-like" class="mr-05"></bib-icon> Add to favorites
                        </span>
                        <span class="list__item">
                          <bib-icon icon="upload" class="mr-05"></bib-icon> Attach file...
                        </span>
                        <span class="list__item">
                          <bib-icon icon="user-add" class="mr-05"></bib-icon> Assign to...
                        </span>
                        <span class="list__item">
                          <bib-icon icon="notification" class="mr-05"></bib-icon> Set as reminder
                        </span>
                        <span class="list__item " id='tg-copy-link'>
                          <bib-icon icon="duplicate" class="mr-05"></bib-icon> Copy
                        </span>
                        <span class="list__item">
                          <bib-icon icon="transfer" class="mr-05"></bib-icon> Move to
                        </span>
                        <span class="list__item " id='tg-view-task'>
                          <bib-icon icon="warning" class="mr-05"></bib-icon> Report
                        </span>
                        <hr>
                        <span class="list__item danger" id='tg-delete-task'>Delete Task</span>
                      </div>
                    </template>
                  </bib-button>
                </div>
                <div class="task-bottom" id='tg-card-bottom'>
                  <user-info :user="task.user" avatar="https://i.pravatar.cc/32"></user-info>
                  <span id='tg-bottom-duedate' v-format-date="task.dueDate"></span>
                </div>
              </div>
            </Draggable>
          </Container>
        </div>
      </div>
    </Draggable>
  </Container>
</template>
<script>
import { Container, Draggable } from "vue-smooth-dnd";
import { mapGetters } from 'vuex';

export default {
  components: {
    Container,
    Draggable,
  },
  data() {
    return {
      // sections: this.taskSections,
      flag: false,
      ordered: [],
      key: 0,
    };
  },
  props: {
    sections: { type: Array, required: true },
    tasks: { type: Array },
    /*label: {
      type: String,
      default () {
        return "Section";
      },
    },*/
    /*taskSections: {
      type: Array,
      default () {
        return [];
      },
    },*/
  },
  computed: {
    ...mapGetters({
      token: "token/getToken",
      project: "project/getSingleProject",
    }),
  },
  methods: {
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

      // console.log(ordered)

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

    log(...params) {
      console.log(...params)
    },
    onDropReady(dropResult) {
      const { removedIndex, addedIndex, payload, element } = dropResult;
      console.log(dropResult)
    },
    shouldAcceptDrop(sourceContainerOptions, payload) {
      console.log(sourceContainerOptions, payload)
      return true;
    },

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
  /*width: 18%;*/
  min-width: 240px;
  min-height: 80vh;
  padding: 10px;
  cursor: grab;
  user-select: none;

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
