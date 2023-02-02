<template>
  <div id="task-grid-wrapper" class="task-grid bg-white active" >
    <div class="task-top" id="tg-top-wrap">
      <div class="d-flex gap-025" id="task-card-inside-wrap">
        <span class="cursor-pointer" >
          <bib-icon icon="check-circle-solid" :scale="1.5" variant="light"></bib-icon>
        </span>
        <!-- <span class="ml-05 flex-grow-1" :id="'task-title'+task.id">{{ task.title }} </span> -->
        <input type="text" id="newtaskInput" class="editable-input" v-model="title" @input="debounceCreate" placeholder="Enter title...">
      </div>
      <span>{{sectionId}}</span>
      <!-- <div class="shape-circle bg-light width-2 height-2 d-flex flex-shrink-0 justify-center align-center">
        <bib-popup pop="elipsis" icon="elipsis" icon-variant="gray5" icon-hover-variant="dark">
          <template v-slot:menu>
            <div class="list" :id="'task-list'+task.id">
              <span v-for="(item, index) in contextMenuItems" :key="item.label+index" class="list__item cursor-pointer" :class=" ['list__item__'+item.variant] " v-on:click.stop="contextItemClick(item)">
                <bib-icon v-if="item.icon" :icon="item.icon" :variant="activeVariant(item)" class="mr-05"></bib-icon> {{item.label}}
              </span>
            </div>
          </template>
        </bib-popup>
      </div> -->
    </div>
    <div class="task-mid d-flex gap-05">
      <status-badge :status="{id: 1, text: 'Not Started'}"></status-badge>
      <!-- <priority-badge :priority="task.priority"></priority-badge> -->
      <priority-comp :priority="{id:2, text: 'Medium'}" :iconOnly="true"></priority-comp>
    </div>
    <div class="task-bottom" id="tg-bottom">
      <!-- <user-info v-if="task.userId" :userId="task.userId"></user-info> -->
      <bib-avatar size="1.25rem"></bib-avatar>
      <div  class="align-center gap-05 ml-auto">
        <bib-icon icon="calendar" variant="gray5"></bib-icon>
        <format-date :datetime="new Date().toString()" variant="gray5"></format-date>
      </div>
    </div>
  </div>
</template>
<script>
// import { mapGetters } from 'vuex'
// import { TASK_CONTEXT_MENU } from "../../config/constants";
export default {
  name: "taskGridBlank",
  props: {
    sectionId: Number,
  },
  data() {
    return {
      title: "",
      // flag: false,
      // contextMenuItems: TASK_CONTEXT_MENU,
    };
  },
  computed: {
    /*...mapGetters({
      favTasks: "task/getFavTasks",
    }),*/
  },
  mounted(){
    this.$nextTick(() => {
      document.getElementById("newtaskInput").focus
    });
  },
  methods: {
    debounceCreate: _.debounce(function() {
      console.info(this.title)
    }, 1500),
    /*overdue(item) {
      // console.log(new Date(item.dueDate), new Date);
      return (new Date(item.dueDate) < new Date() && item.statusId != 5) ? 'danger' : 'gray5';
    },*/

    /*openSidebar(task, scroll) {
      // console.log(task)
      this.$nuxt.$emit("open-sidebar", {...task, scrollId: scroll});
    },*/

    /*addToFavorites(task) {
      // console.info("to be fav task", task)
      let isFav = this.favTasks.some((f) => f.taskId == task.id)
      // console.log(isFav)

      if (isFav) {
        this.$store.dispatch("task/removeFromFavorite", { id: task.id })
          .then(msg => {
            // console.log(msg)
            this.$emit("update-key", msg)
          })
          .catch(e => {
            console.log(e)
          })
      } else {
        this.$store.dispatch("task/addToFavorite", { id: task.id })
          .then(msg => {
            // console.log(msg)
            this.$emit("update-key", msg)
          })
          .catch(e => {
            console.log(e)
          })
      }
    },*/
    /*markComplete(task) {
      // console.log(this.currentTask)
      this.$store.dispatch('task/updateTaskStatus', task)
        .then((d) => {
          console.log(d)
          this.$nuxt.$emit("update-key")
          this.$store.dispatch("task/setSingleTask", d)
        }).catch(e => {
          console.log(e)
        })
    },*/
    /*deleteTask(task) {
      this.$store.dispatch("task/deleteTask", task).then(t => {
        if (t.statusCode == 200) {
          this.$emit("update-key", t.message)
        } else {
          console.warn(t.message);
        }
      }).catch(e => {
        console.log(e)
      })
    },*/
    /*activeVariant(item){
        if (item.label.includes('Complete')) {
          return this.task.statusId == 5 ? 'success': 'gray5'
        }
        if (item.label.includes('Delete')) {
          return 'danger'
        }
        if (item.label.includes('Favorites')) {
          let fata = this.favTasks.some(ft=>ft.taskId == this.task.id)
          // console.log(fata, fapo)
          return fata ? 'orange': 'gray5'
        }
    },*/
    /*contextItemClick(item){
      // console.log(item)
      switch (item.event) {
        case 'done-task':
          // statements_1
          this.markComplete(this.task)
          break;
        case 'fav-task':
          this.addToFavorites(this.task)
          break;
        case 'delete-task':
          this.deleteTask(this.task)
          break;
        case 'gotoTeam':
          this.$nuxt.$emit('add-member-to-task')
          break;
        case 'gotoComment':
          this.openSidebar(this.task, 'task_conversation')
          break;
        case 'gotoSubtask':
          this.openSidebar(this.task, 'task_subtasks')
          break;
        case 'gotoFiles':
          this.openSidebar(this.task, 'task_files')
          break;
        default:
          alert("no task assigned")
          break;
      }
    },*/
  },
};

</script>
<style scoped lang="scss">
.task-grid {
  font-size: 14px;
  margin: 1rem 0;
  border: 1px solid var(--bib-gray4);
  border-radius: 6px;
  transition: all 200ms ease;

  &.active {
    border-color: $dark;
    box-shadow: 0 0 0 4px $primary-sub3;
  }

  .task-top,
  .task-bottom {
    display: flex;
    justify-content: space-between;
    padding: 8px;
  }

  .task-top {
    margin-bottom: 0.5rem;
  }

  .task-mid {
    padding: 4px 8px;
  }

  .task-bottom {
    align-items: center;
    color: $gray5;

    span {
      font-size: 13px;
    }
  }

  .editable-input { font-size: $base-size; font-weight: nowmal; }

}

</style>
