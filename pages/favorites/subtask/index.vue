<template>
  <client-only>
    <div id="page" class="h-100">
      <page-title title="Favorite subtask"></page-title>
      <favorite-actions v-on:change-viewing="changeView" v-on:change-sorting="changeSort" ></favorite-actions>
      <div id="subtask-favorite-wrap" class="of-scroll-y position-relative content-wrap">
        <advance-table :tableFields="tableFields" :tableData="subtasks"></advance-table>
      </div>
    </div>
  </client-only>
</template>
<script>
import _ from 'lodash'
import { TASK_FAVORITES, TASK_CONTEXT_MENU } from '~/config/constants'
import { mapGetters, mapActions } from 'vuex';
export default {

  name: 'Demo',

  data() {
    return {
      subtasks: [],
      tableFields: TASK_FAVORITES,
    }
  },

  computed: {
    ...mapGetters({
      /*favProjects: 'project/getFavoriteProjects',
      favTasks: 'task/getFavTasks',*/
      favSubtasks: "subtask/getFavSubtasks",
      teamMembers: "user/getTeamMembers",
    })
  },

  mounted(){
    this.$store.dispatch("subtask/fetchFavorites")
    .then(res => {
      console.log(res)
      res.data.forEach(d => {
        if(d.subtasks){
          this.subtasks.push({...d.subtasks, project: d.subtasks.task.project})
        }
      })
    })

  },

  methods: {
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
#page { display: grid; grid-template-rows: 1fr 1fr 11fr; grid-template-columns: 1fr; }
.content-wrap { /*max-height: calc(100vh - 150px);*/}
</style>
