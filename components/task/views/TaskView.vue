<template>
  <div id="task-view-wrapper" class="task-view-wrapper position-relative">
    <task-actions :gridType="gridType" v-on:create-task="toggleSidebar($event)" v-on:create-section="createSectionInline" v-on:filterView="filterView" v-on:sort="taskSort($event)"></task-actions>
    <section v-show="newSection" id="tv-new-section-input-container">
      <div id="tv-new-section-input-wrapper" class="d-flex align-center p-05 bg-light">
        <input id="tv-new-section-input" type="text" class="new-section-input" ref="newsectioninput" v-model.trim="newSectionName" v-on:blur="clickOutside" v-on:keyup.enter="createSectionOnEnter" placeholder="Enter section name">
        <small v-if="sectionError" class="text-danger ml-05">invalid input</small>
        <div v-show="sectionLoading" class="d-flex align-center">
          <bib-spinner :scale="2"></bib-spinner> <span class="text-secondary">Creating section ...</span>
        </div>
        <bib-icon icon="close" class="ml-auto" v-on:click="clickOutside"></bib-icon>
      </div>
      <!-- <bib-input type="text" ref="newsectionbibinput" v-model="newSectionName" name="sectionname" size="sm" placeholder="Enter section name"></bib-input> -->
    </section>
    <template v-if="gridType === 'list'">
      <task-list-section :project="project" :sections="localdata" :templateKey="templateKey" v-on:sort-task="taskSort($event)" v-on:update-key="updateKey"></task-list-section>
    </template>
    <template v-else>
      <task-grid-section :sections="localdata" :activeTask="activeTask" :templateKey="templateKey" v-on:update-key="updateKey" v-on:create-task="toggleSidebar($event)" v-on:set-favorite="setFavorite" v-on:mark-complete="markComplete">
      </task-grid-section>
    </template>
    <loading :loading="loading"></loading>
    <span id="projects-0" v-show="nodata" class="d-inline-flex gap-1 align-center m-1 bg-warning-sub3 border-warning shape-rounded py-05 px-1">
      <bib-icon icon="warning"></bib-icon> No records found
    </span>
    <!-- task sidebar -->
    <!-- <task-sidebar  :activeTask="activeTask" @open-sidebar="toggleSidebar()" v-on:update-key="updateKey"></task-sidebar> -->
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
    <bib-popup-notification-wrapper>
      <bib-popup-notification v-for="(msg, index) in popupMessages" :key="index" :message="msg.text" :variant="msg.variant"></bib-popup-notification>
    </bib-popup-notification-wrapper>
  </div>
</template>
<script>
import { TASK_FIELDS } from "config/constants";
import { mapGetters } from 'vuex';

export default {

  props: {
    gridType: String, // project ID page 
  },
  data() {
    return {
      tableFields: TASK_FIELDS,
      activeTask: {},
      headless: null,
      flag: false,
      newSection: false,
      newSectionName: "",
      sectionLoading: false,
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

    sectionError() {
      if (this.newSectionName.indexOf("_") == 0) {
        return true
      } else {
        return false
      }
    },
    nodata() {
      if (this.sections.length > 0) {
        return false
      } else {
        return true
      }
    },
  },
  created() {
    this.$nuxt.$on("section-rename", ($event) => {
      this.renameModal = true
      this.sectionId = $event.id
      this.sectionTitle = $event.title
    })

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
    taskSort($event) {
      // sort by title
      if ($event == "name") {
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
        this.templateKey += 1
        // console.log(this.key, this.orderBy)
      }
      // Sort By owner
      if ($event == "owner") {
        if (this.orderBy == "asc") {
          this.orderBy = "desc"
          this.localdata.forEach(function(sec, index) {
            sec["tasks"] = sec.tasks.sort((a, b) => a.user.firstName.localeCompare(b.user.firstName));
          })
        } else {
          this.orderBy = "asc"
          this.localdata.forEach(function(sec) {
            sec["tasks"] = sec.tasks.sort((a, b) => b.user.firstName.localeCompare(a.user.firstName));
          })
        }
        this.templateKey += 1
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
        this.templateKey += 1
        // console.log(this.key, this.orderBy)
      }
      // Sort By Priotity
      if ($event == "priority") {
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
      }
      // sort By Start Date
      if ($event == "startDate") {
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
      }

    },
    updateKey() {
      // console.log("update-key event received", this.templateKey)
      this.$store.dispatch("section/fetchProjectSections", { projectId: this.$route.params.id, filter: 'all' }).then(() => {
        this.taskByOrder()
      })
    },
    showSectionTitle(section) {
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
    },

    toggleSidebar($event) {
      // console.log($event)
      // in case of create task 
      if (!$event) {
        // this.$store.dispatch("task/setSingleTask", {})
        this.$nuxt.$emit("open-sidebar", $event)
      }
      this.flag = !this.flag;
      /*this.$emit("open-sidebar", this.flag);
      this.$nuxt.$emit("open-sidebar", this.flag);*/
    },

    createSectionInline() {
      this.newSection = true
      // console.log(this.$refs.newsectioninput.clientWidth, this.$refs.newsectioninput.clientHeight)
      var inputdisplay = setTimeout(() => {
        // console.log(this.$refs.newsectioninput.clientHeight)
        this.$refs.newsectioninput.focus()
      }, 500)
    },
    /*onFocus(event) {
      console.log('focus', event)
      console.log(this.$refs.newsectioninput.clientWidth, this.$refs.newsectioninput.clientHeight)
    },*/
    clickOutside() {
      if (this.newSectionName) {
        this.createSectionOnEnter
      } else {
        this.newSectionName = ""
        this.newSection = false
      }
    },
    async createSectionOnEnter($event) {
      // console.log("blur ", $event.target)
      let newvalue = this.newSectionName;
      if (newvalue) {
        if (this.sectionError) {
          return false
        }
        this.processing = true
        this.$refs.newsectioninput.setAttribute("disabled", true)
        this.sectionLoading = true

        this.$store.dispatch("section/createSection", {
          "projectId": this.project.id,
          "title": newvalue.trim(),
          "isDeleted": false,
        }).then(() => {
          this.sectionLoading = false
          this.newSection = false
          this.$refs.newsectioninput.removeAttribute("disabled")
          this.updateKey()
        }).catch(e => console.log(e))

      } else {
        this.newSection = false
        console.log('No section added')
      }
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
      console.log("rename section output", sec)
      if (sec.statusCode = 200) {
        this.renameModal = false
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

    sortTitle() {
      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      this.sortName = 'name';
      this.checkActive()
    },

    sortOwner() {
      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      this.sortName = 'owner';
      this.checkActive()
    },

    sortByStatus() {
      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      this.sortName = 'status';
      this.checkActive()
    },

    sortByStartDate() {
      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      this.sortName = 'startDate';
      this.checkActive()
    },

    sortByDueDate() {
      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      this.sortName = 'dueDate';
      this.checkActive()
    },

    sortByPriority() {
      if (this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      this.sortName = 'priority';
      this.checkActive()
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

    setFavorite($event) {
      // console.info("to be fav task", $event)
      let isFav = this.favTasks.some((f) => f.taskId == $event.id)
      // console.log(isFav)

      if (isFav) {
        this.$store.dispatch("task/removeFromFavorite", { id: $event.id })
          .then(msg => {
            console.log(msg)
            this.popupMessages.push({ text: msg, variant: "success" })
            this.updateKey()
          })
          .catch(e => console.log(e))
      } else {
        this.$store.dispatch("task/addToFavorite", { id: $event.id })
          .then(msg => {
            console.log(msg)
            this.popupMessages.push({ text: msg, variant: "success" })
            this.updateKey()
          })
          .catch(e => console.log(e))
      }
    },
    markComplete($event) {
      // console.log(this.currentTask)
      this.loading = true
      this.$store.dispatch('task/updateTaskStatus', $event)
        .then((d) => {
          // console.log(d)
          this.loading = false
          this.popupMessages.push({ text: d.message, variant: "success" })
          this.$nuxt.$emit("update-key")
          this.$store.dispatch("task/setSingleTask", d)
        }).catch(e => {
          console.log(e)
          this.popupMessages.push({ text: e.message, variant: "warning" })
          this.loading = false
        })
    },
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
