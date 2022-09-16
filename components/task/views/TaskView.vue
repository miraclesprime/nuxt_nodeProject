<template>
  <div id="task-view-wrapper" class="task-view-wrapper position-relative">
    <task-actions :gridType="gridType" v-on:create-task="toggleSidebar($event)" v-on:show-newsection="showNewsection" v-on:filterView="filterView" v-on:sort="taskSort($event)"></task-actions>
    <new-section-form :showNewsection="newSection" :showLoading="sectionLoading" :showError="sectionError" v-on:toggle-newsection="newSection = $event" v-on:create-section="createSection"></new-section-form>
    <template v-if="gridType === 'list'">
      <!-- task list table -->
      <drag-table :fields="tableFields" :sections="localdata" :key="templateKey" :componentKey="templateKey" @row-click="openSidebar" @row-rightclick="taskRightClick" @task-checkmark-click="markComplete" @new-task="toggleSidebar($event)" @table-sort="taskSort($event)" @section-dragend="sectionDragEnd" @task-dragend="taskDragEnd"></drag-table>
      <!-- table context menu -->
      <table-context-menu :items="taskContextMenuItems" :show="taskContextMenu" :coordinates="contextCoords" :activeItem="activeTask" @close-context="closeContext" ref="task_menu" @item-click="contextItemClick" ></table-context-menu>
      <!-- <task-list-section :project="project" :sections="localdata" :templateKey="templateKey" v-on:sort-task="taskSort($event)" v-on:update-key="updateKey"></task-list-section> -->
    </template>
    <template v-else>
      <task-grid-section :sections="localdata" :activeTask="activeTask" :templateKey="templateKey" @section-rename="renameSectionModal" @section-delete="deleteSection" v-on:update-key="updateKey" v-on:create-task="toggleSidebar($event)" v-on:set-favorite="setFavorite" v-on:mark-complete="markComplete" v-on:delete-task="deleteTask" @section-dragend="sectionDragEnd" @task-dragend="taskDragEnd">
      </task-grid-section>
    </template>
    <loading :loading="loading"></loading>
    <span id="projects-0" v-show="nodata" class="d-inline-flex gap-1 align-center m-1 bg-warning-sub3 border-warning shape-rounded py-05 px-1">
      <bib-icon icon="warning"></bib-icon> No records found
    </span>
    <!-- section rename modal -->
    <bib-modal-wrapper v-if="renameModal" title="Rename section" @close="renameModal = false">
      <template slot="content">
        <div>
          <bib-input type="text" v-model.trim="sectionTitle" placeholder="Enter name..."></bib-input>
          <loading :loading="loading"></loading>
        </div>
      </template>
      <template slot="footer">
        <div class="d-flex justify-between">
          <bib-button label="Cancel" variant="light" pill @click="renameModal = false"></bib-button>
          <bib-button label="Rename" variant="success" pill v-on:click="renameSection"></bib-button>
        </div>
      </template>
    </bib-modal-wrapper>
    <!-- popup-notification -->
    <bib-popup-notification-wrapper>
      <template #wrapper>
        <bib-popup-notification v-for="(msg, index) in popupMessages" :key="index" :message="msg.text" :variant="msg.variant">
        </bib-popup-notification>
      </template>
    </bib-popup-notification-wrapper>
  </div>
</template>
<script>
import { TASK_FIELDS, TASK_CONTEXT_MENU } from "config/constants";
import { mapGetters } from 'vuex';
import _ from 'lodash'

export default {

  props: {
    gridType: String, // project ID page 
  },
  data() {
    return {
      tableFields: TASK_FIELDS,
      taskContextMenuItems: TASK_CONTEXT_MENU,
      taskContextMenu: false,
      contextCoords: {},
      activeTask: {},
      headless: null,
      flag: false,
      newSection: false,
      newSectionName: "",
      sectionLoading: false,
      sectionError: "",
      localdata: [],
      sortName: "",
      loading: false,
      templateKey: 0,
      orderBy: "asc",
      renameModal: false,
      sectionId: null,
      sectionTitle: "",
      popupMessages: [],
    };
  },
  computed: {
    ...mapGetters({
      token: "token/getToken",
      user: "user/getUser",
      task: "task/getSelectedTask",
      favTasks: "task/getFavTasks",
      project: "project/getSingleProject",
      sections: "section/getProjectSections",
    }),

    /*isFavorite() {
      let fav = this.favTasks.some(t => t.task.id == this.currentTask.id)
      if (fav) {
        return { icon: "bookmark-solid", variant: "orange", text: "Remove favorite", status: true }
      } else {
        return { icon: "bookmark", variant: "gray5", text: "Add to favorites", status: false }
      }
    },*/

    /*sectionError() {
      if (this.newSectionName.indexOf("_") == 0) {
        return true
      } else {
        return false
      }
    },*/
    nodata() {
      if (this.sections.length > 0) {
        return false
      } else {
        return true
      }
    },
  },
  created() {

    this.$nuxt.$on("update-key", () => {
      // console.log('update key event capture')
      this.updateKey()
    })
  },

  mounted() {
    this.loading = true
    this.$store.dispatch("section/fetchProjectSections", { projectId: this.$route.params.id, filter: 'all' }).then((res) => {
      // console.log("project sections => ", res.length)
      /*if (res.length < 1) {
        this.nodata = true
      }*/

      this.localdata = JSON.parse(JSON.stringify(this.sections))

      let sorted = this.localdata.map(s => {
        let t = s.tasks.sort((a, b) => a.order - b.order)
        s.tasks = t
        return s
      })
      // console.log("sorted =>", sorted)
      this.localdata = sorted
      this.templateKey += 1
      this.loading = false
    }).catch(e => console.log(e))

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
      this.templateKey += 1
      // this.$nuxt.$emit("update-key", this.key)
    },
    taskRightClick(payload) {
      this.projectContextMenu = false
      this.taskContextMenu = true
      const { event, task } = payload

      this.contextCoords = { left: event.pageX + 'px', top: event.pageY + 'px' }
      this.activeTask = task
      // console.log(task)
      // this.$store.dispatch('task/setSingleTask', task)
    },
    closeContext() {
      this.taskContextMenu = false
      this.activeTask = {}
      // this.$store.dispatch('task/setSingleTask', {})
    },
    contextItemClick(key){
      console.log(key)
      switch (key) {
        case 'done-task':
          // statements_1
          this.markComplete(this.activeTask)
          break;
        case 'fav-task':
          this.setFavorite(this.activeTask)
          break;
        case 'delete-task':
          this.deleteTask(this.activeTask)
          break;
        case 'assign-task':
          // statements_1
          break;
        default:
          alert("no task assigned")
          break;
      }
    },
    taskSort($event) {
      // sort by title
      console.log('sort key->', $event, 'sort-order->', this.orderBy)
      if ($event == "title") {
        // var orderBy = "asc"
        if (this.orderBy == "asc") {
          this.orderBy = "desc"
          this.localdata.forEach(function(sec, index) {
            sec["tasks"] = sec.tasks.sort((a, b) => a.title.localeCompare(b.title))
          })
        } else {
          this.orderBy = "asc"
          this.localdata.forEach(function(sec, index) {
            sec["tasks"] = sec.tasks.sort((a, b) => b.title.localeCompare(a.title))
          })
        }
        // this.templateKey += 1
        // console.log(this.key, this.orderBy)
      }
      // Sort By owner
      if ($event == "userId") {
        if (this.orderBy == "asc") {
          this.orderBy = "desc"
          /*this.localdata.forEach(function(sec, index) {
            sec["tasks"] = sec.tasks.sort((a, b) => a.user.firstName.localeCompare(b.user.firstName));
          })*/
          this.localdata.forEach(function(sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => {
              if (a.user && b.user) {
                return a.user.firstName.localeCompare(b.user.firstName)
              }
            });
          })
        } else {
          this.orderBy = "asc"
          /*this.localdata.forEach(function(sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => b.user.firstName.localeCompare(a.user.firstName));
          })*/
          this.localdata.forEach(function(sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => {
              if (a.user && b.user) {
                return b.user.firstName.localeCompare(a.user.firstName)
              }
            });
          })
        }
        // this.templateKey += 1
        // console.log(this.key, this.orderBy)
      }
      // sort By Status
      if ($event == "status") {
        if (this.orderBy == "asc") {
          this.orderBy = "desc"
          this.localdata.forEach(function(sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => a.status.text.localeCompare(b.status.text));
          })
        } else {
          this.orderBy = "asc"
          this.localdata.forEach(function(sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => b.status.text.localeCompare(a.status.text));
          })
        }
        // this.templateKey += 1
        // console.log(this.key, this.orderBy)
      }
      // Sort By Priotity
      if ($event == "priority") {
        // console.log('sort priority',$event)
        if (this.orderBy == "asc") {
          this.orderBy = "desc"
          this.localdata.forEach(function(sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => a.priority.text.localeCompare(b.priority.text));
          })
        } else {
          this.orderBy = "asc"
          this.localdata.forEach(function(sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => b.priority.text.localeCompare(a.priority.text));
          })
        }
        // this.templateKey += 1
      }
      // sort By Start Date
      if ($event == "createdAt") {
        if (this.orderBy == "asc") {
          this.orderBy = "desc"
          this.localdata.forEach(function(sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          })
        } else {
          this.orderBy = "asc"
          this.localdata.forEach(function(sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          })

        }
        // this.templateKey += 1
      }

      // sort By DueDate
      if ($event == "dueDate") {
        if (this.orderBy == "asc") {
          this.orderBy = "desc"
          this.localdata.forEach(function(sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
          })
        } else {
          this.orderBy = "asc"
          this.localdata.forEach(function(sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
          })
        }
        // this.templateKey += 1
      }

      this.templateKey += 1

    },
    updateKey() {
      // console.log("update-key event received", this.templateKey)
      this.$store.dispatch("section/fetchProjectSections", { projectId: this.$route.params.id, filter: 'all' }).then(() => {
        this.taskByOrder()
      })
    },
    /*showSectionTitle(section) {
      if (section.title.includes("_section")) {
        return null
      } else {
        return {
          collapsed: false,
          label: section.title,
          variant: 'black',
        }
      }
    },
    showSectionTitleBoard(section) {
      if (section.title.includes("_section")) {
        return ''
      } else {
        return section.title
      }
    },*/

    toggleSidebar($event) {
      // console.log("taskview => ",$event)

      this.flag = !this.flag;
      // this.$emit("open-sidebar", $event);
      if ($event.id) {
        this.$nuxt.$emit("open-sidebar", $event.id)
      } else {
        this.$nuxt.$emit("open-sidebar", $event);
      }
    },
    openSidebar(task) {
      let project = [{
        projectId: this.project.id,
        project: {
          id: this.project.id
        }
      }]
      this.$nuxt.$emit("open-sidebar", { ...task, project: project });
    },

    showNewsection() {
      this.$nextTick(() => {
        this.newSection = true
      })
    },

    async createSection($event) {
      this.sectionLoading = true
      const res = await this.$store.dispatch("section/createSection", {
        "projectId": this.project.id,
        "title": $event,
        "isDeleted": false,
      })
      if (res.statusCode == 200) {
        this.updateKey()
        this.newSection = false
        this.sectionLoading = false
        this.popupMessages.push({ text: "Section created", variant: "success" })
      } else {
        this.sectionError = res.message
        this.sectionLoading = false
      }

    },

    renameSectionModal($event) {
      console.log($event)
      this.renameModal = true
      this.sectionId = $event.id
      this.sectionTitle = $event.title
    },

    async renameSection() {
      this.loading = true
      const sec = await this.$store.dispatch("section/renameSection", {
        projectId: Number(this.$route.params.id),
        id: this.sectionId,
        data: {
          title: this.sectionTitle
        }
      })
      // console.log("rename section output", sec)
      if (sec.statusCode = 200) {
        this.renameModal = false
        this.popupMessages.push({ text: "Section renamed", variant: "success" })
        this.updateKey()
      }
      this.loading = false
    },

    // taskSelected($event) {
    //   this.$store.dispatch('task/setSingleTask', $event)
    //   this.activeTask = $event;
    //   this.toggleSidebar($event)
    //   this.teamKey += 1;
    // },

    filterView($event) {
      this.loading = true
      if ($event == 'complete') {
        this.$store.dispatch('section/fetchProjectSections', { projectId: this.$route.params.id, filter: 'complete' }).then(() => {
          this.taskByOrder()
        }).catch(e => console.log(e))
      }
      if ($event == 'incomplete') {
        this.$store.dispatch('section/fetchProjectSections', { projectId: this.$route.params.id, filter: 'incomplete' }).then(() => {
          this.taskByOrder()
        }).catch(e => console.log(e))
      }
      if ($event == 'all') {
        this.$store.dispatch('section/fetchProjectSections', { projectId: this.$route.params.id, filter: 'all' }).then(() => {
          this.taskByOrder()
        }).catch(e => console.log(e))
      }
      this.loading = false
    },

    checkActive() {
      for (let i = 0; i < this.tableFields.length; i++) {
        if (this.tableFields[i].header_icon) {
          this.tableFields[i].header_icon.isActive = false
        }

        if (this.tableFields[i].header_icon && this.tableFields[i].key == this.sortName) {
          this.tableFields[i].header_icon.isActive = true
        }
      }
    },

    setFavorite(task) {
      // console.info("to be fav task", task)
      this.loading = true
      let isFav = this.favTasks.some((f) => f.taskId == task.id)
      // console.log(isFav)

      if (isFav) {
        this.$store.dispatch("task/removeFromFavorite", { id: task.id })
          .then(msg => {
            console.log(msg)
            this.popupMessages.push({ text: msg, variant: "success" })
            this.updateKey()
            this.loading = false
          })
          .catch(e => {
            this.loading = false
            console.log(e)
          })
      } else {
        this.$store.dispatch("task/addToFavorite", { id: task.id })
          .then(msg => {
            console.log(msg)
            this.popupMessages.push({ text: msg, variant: "success" })
            this.updateKey()
            this.loading = false
          })
          .catch(e => {
            this.loading = false
            console.log(e)
          })
      }
    },

    markComplete(task) {
      console.log(typeof task, this.task)
      this.loading = true
      if (typeof task == "object" && Object.keys(task).length > 0) {
        console.log(task)
      } else {
        // alert("no task selected")
        task = this.activeTask
      }
      this.$store.dispatch('task/updateTaskStatus', task)
        .then((d) => {
          // console.log(d)
          this.loading = false
          this.popupMessages.push({ text: d.message, variant: "success" })
          // this.$nuxt.$emit("update-key")
          this.updateKey()
          this.$store.dispatch("task/setSingleTask", d)
        }).catch(e => {
          console.log(e)
          this.popupMessages.push({ text: e.message, variant: "warning" })
          this.loading = false
        })
    },

    deleteTask(task) {
      let del = confirm("Are you sure")
      this.loading = true
      if (del) {
        this.$store.dispatch("task/deleteTask", task).then(t => {

          if (t.statusCode == 200) {
            this.popupMessages.push({ text: t.message, variant: "success" })
            this.updateKey()
          } else {
            this.popupMessages.push({ text: t.message, variant: "warning" })
            console.warn(t.message);
          }
          this.loading = false
        }).catch(e => {
          this.loading = false
          this.popupMessages.push({ text: e, variant: "danger" })
          console.log(e)
        })
      } else {
        this.loading = false
      }
    },

    deleteSection(section) {
      this.loading = true;
      let del = confirm("Are you sure?")
      if (del) {
        this.$store.dispatch("section/deleteSection", section).then(s => {

          if (s.statusCode == 200) {
            this.popupMessages.push({ text: s.message, variant: "success" })
            this.updateKey()
          } else {
            this.popupMessages.push({ text: s.message, variant: "warning" })
            console.warn(t.message);
          }
          this.loading = false
        }).catch(e => {
          this.loading = false
          this.popupMessages.push({ text: e, variant: "danger" })
          console.log(e)
        })
      } else {
        this.loading = false
      }
    },

    sectionDragEnd: _.debounce(async function(payload) {

      this.loading = true

      // console.log(payload)
      let clone = _.cloneDeep(payload)
      clone.forEach((el, i) => {
        el.order = i
      })

      console.log("ordered sections =>", clone)

      let sectionDnD = await this.$axios.$put("/section/dragdrop", { projectId: this.project.id, data: clone }, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
          "Content-Type": "application/json"
        }
      })

      console.log(sectionDnD.message)

      if (sectionDnD.statusCode == 200) {
        this.$store.dispatch("section/fetchProjectSections", { projectId: this.$route.params.id }).then(() => {
          this.$nuxt.$emit("update-key")
        })
      }

      this.loading = false

    }, 600),

    taskDragEnd: _.debounce(async function(payload) {
      console.log('task dragend =>', payload)
      // this.highlight = null
      this.loading = true
      let tasks = _.cloneDeep(payload.tasks)

      tasks.forEach((el, i) => {
        el.order = i
      })

      console.log("sorted->", tasks)

      let taskDnD = await this.$axios.$put("/section/crossSectionDragDrop", { data: tasks, sectionId: payload.sectionId }, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("accessToken"),
          "Content-Type": "application/json"
        }
      })

      console.log(taskDnD.message)
      if (taskDnD.statusCode == 200) {
        this.$emit("update-key")
      } else {
        console.warn(taskDnD.message)
      }
      this.loading = false
    }, 600),
  },

};

</script>
<style lang="scss" scoped>
.task-view-wrapper {
  min-height: 5rem;
}

.new-section-input {
  min-height: 2rem;
  padding: 0 0.5rem;
  font-size: $font-size-sm;
  border-radius: 0.18rem;
  border: 1px solid var(--bib-gray4);

  &:focus {
    outline: none;
    border: 2px solid var(--bib-gray6);
    border-radius: 0;
  }
}

</style>
