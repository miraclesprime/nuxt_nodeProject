<template>
  <client-only>
    <div id="page" class="h-100">
      <page-title title="Favorite subtask"></page-title>
      <favorite-actions v-on:change-viewing="changeView" v-on:change-sorting="changeSort"></favorite-actions>
      <div id="subtask-favorite-wrap" class=" position-relative content-wrap" :style="{ 'width': contentWidth }">
        <advance-table :tableFields="tableFields" :tableData="subtasks" @title-click="openSubPanel" ></advance-table>
      </div>
      <transition name="drawer">
        <article v-if="subPanel" id="sub-panel" class="side-panel" v-click-outside="closeSubPanel">
          <keep-alive>
            <subtask-detail titleClick="task" @close-sidebar-detail="subPanel = false"></subtask-detail>
          </keep-alive>
        </article>
      </transition>
    </div>
  </client-only>
</template>
<script>
import _ from 'lodash'
import { DEMO_TABLE, TASK_CONTEXT_MENU } from '~/config/constants'
import { mapGetters, mapActions } from 'vuex';
export default {

  name: 'Demo',

  data() {
    return {
      subtasks: [],
      tableFields: DEMO_TABLE,
      subPanel: false,
      contentWidth: "100%",
    }
  },

  computed: {
    ...mapGetters({
      /*favProjects: 'project/getFavoriteProjects',
      favTasks: 'task/getFavTasks',*/
      favSubtasks: "subtask/getFavSubtasks",
      teamMembers: "user/getTeamMembers",
    }),
    /*contentWidth(){
      const page = document.getElementById("page")
      console.log(page)
      if (this.subPanel) {
        return (page.scrollWidth - 730) + 'px'
      } else {
        return page.scrollWidth + 'px'
      }
    }*/
  },

  watch: {
    subPanel(){
      const page = document.getElementById("page")
      process.nextTick(() => {
        const sub = document.getElementById("sub-panel")
        console.log(page.scrollWidth, sub.scrollWidth)
        if (this.subPanel) {
          this.contentWidth = (page.scrollWidth - sub.scrollWidth) + 'px'
        } else {
          this.contentWidth = page.scrollWidth + 'px'
        }
      });
    }
  },

  mounted() {
    this.$store.dispatch("subtask/fetchFavorites")
      .then(res => {
        // console.log(res)
        res.data.forEach(d => {
          if (d.subtasks) {
            this.subtasks.push({ ...d.subtasks, project: d.subtasks.task.project || [{}] })
          }
        })

        /*const page = document.getElementById("page")
        console.log(page)
        if (this.subPanel) {
          this.contentWidth = (page.scrollWidth - 730) + 'px'
        } else {
          this.contentWidth = page.scrollWidth + 'px'
        }*/
      })

  },

  methods: {
    openSubPanel($event) {
      // this.$nuxt.$emit("close-sidebar");
      // console.log($event)
      this.$store.dispatch("subtask/setSelectedSubtask", $event)
      this.subPanel = true
    },
    closeSubPanel() {
      this.subPanel = false
    },
    changeView($event) {
      console.log($event)
      if ($event == 'complete') {
        /*this.projLocalData = JSON.parse(JSON.stringify(this.sortedProject));
        this.taskSubtaskLocalData = JSON.parse(JSON.stringify(this.sortedTask));
        this.fetchProjects().then(() => {
          let com = this.projLocalData.filter(p => p.statusId == 5)
          this.projLocalData = com
        })
        this.fetchTasks().then(() => {
          let com = this.taskSubtaskLocalData.filter(t => t.statusId == 5)
          this.taskSubtaskLocalData = com
        })*/

      }

      if ($event == 'incomplete') {
        /*this.projLocalData = JSON.parse(JSON.stringify(this.sortedProject));
        this.taskSubtaskLocalData = JSON.parse(JSON.stringify(this.sortedTask));
        this.fetchProjects().then(() => {
          let com = this.projLocalData.filter(p => p.statusId != 5)
          this.projLocalData = com
        })
        this.fetchTasks().then(() => {
          let com = this.taskSubtaskLocalData.filter(t => t.statusId != 5)
          this.taskSubtaskLocalData = com
        })*/
      }

      if ($event == 'all') {
        /*this.projLocalData = JSON.parse(JSON.stringify(this.sortedProject));
        this.taskSubtaskLocalData = JSON.parse(JSON.stringify(this.sortedTask));*/
      }

    },
    changeSort($event) {
      /*if (this.projOrder == this.taskOrder) {
        this.sortProject($event)
        this.sortTask($event)
      } else {
        this.projOrder = 'asc'
        this.taskOrder = 'asc'
        this.sortProject($event)
        this.sortTask($event)
      }*/
      console.log($event)
    },
  }
}

</script>
<style lang="scss" scoped>
#page {
  display: grid;
  grid-template-rows: 1fr 1fr 15fr;
  grid-template-columns: 1fr;
}

.content-wrap {
  /*max-height: calc(100vh - 150px);*/
  transition: margin 200ms ease-out;
  &.squeeze { width: calc(100% - $sidebar-width); }
}

</style>
