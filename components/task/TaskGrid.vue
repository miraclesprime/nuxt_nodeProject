<template>
  <div :id="'task-grid-wrapper'+ task.id" class="task-grid bg-white" @click.stop="$emit('open-sidebar', task)" >
    <figure v-if="task.cover" :id="'task-card-image'+task.id" class="task-image bg-light" style="background-image:url('https://via.placeholder.com/200x110')"></figure>
    <div class="task-top" :id="'tg-top-wrap'+ task.id">
      <!-- <div class="d-flex" :id="'tg-inside-wrap'+ task.id" @click="openSidebar()">
        <custom-check-box :id="'tg-' + task.id" />
        <span class="ml-05" style="margin-top: 2px" :id="'tg-title'+ task.id"
          >{{ task.title }}</span
        >
      </div> -->
      <div class="d-flex" :id="'task-card-inside-wrap'+task.id">
        <span class="cursor-pointer" @click.stop="markComplete(task)">
          <bib-icon icon="check-circle" :scale="1.5" :variant="task.statusId == 5 ? 'success' : 'light'" ></bib-icon>
        </span>
        <span class="ml-05 flex-grow-1" :id="'task-title'+task.id">{{ task.title }} </span>
      </div>
      <div class="shape-circle bg-light width-2 height-2 d-flex flex-shrink-0 justify-center align-center">
        <bib-popup pop="elipsis" icon="elipsis" icon-variant="gray5" icon-hover-variant="dark" >
          <template v-slot:menu>
            <div class="list" :id="'task-list'+task.id">
              <span class="list__item" :id="'task-comp'+task.id" v-on:click.stop="markComplete(task)">
                <bib-icon icon="check-circle" :variant="task.statusId == 5 ? 'success' : 'secondary-sub1'" :scale="1.1" class="mr-05"></bib-icon> {{task.statusId != 5 ? "Mark" : ""}} Completed
              </span>
              <span class="list__item" :id="'tg-fav'+task.id" data-fav="isFavorite.status" v-on:click.stop="addToFavorites(task)">
                <bib-icon :icon="isFavorite.icon" :variant="isFavorite.variant" class="mr-05"></bib-icon> {{isFavorite.text}}
              </span>
              <!-- <span class="list__item" :id="'task-attach'+task.id">
                <bib-icon icon="upload" class="mr-05"></bib-icon> Attach file...
              </span> -->
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
              <span class="list__item " :id="'task-view-task'+task.id">
                <bib-icon icon="warning" class="mr-05"></bib-icon> Report
              </span>
              <hr>
              <span class="list__item list__item__danger" :id="'task-delete-task'+task.id" @click="deleteTask(task)">Delete Task</span>
            </div>
          </template>
        </bib-popup>
      </div>
    </div>
    <div class="task-mid d-flex gap-05">
      <status-badge :status="task.status"></status-badge>
      <priority-badge :priority="task.priority"></priority-badge>
      <!-- <priority-comp :priority="task.priority" :iconOnly="true"></priority-comp> -->
    </div>
    <div class="task-bottom" :id="'tg-bottom'+ task.id">
      <user-info v-if="task.userId" :userId="task.userId"></user-info>
      <div v-if="task.dueDate" class="align-center gap-05 ml-auto">
        <bib-icon icon="calendar" :variant="overdue(task)"></bib-icon>
        <format-date :datetime="task.dueDate" :variant="overdue(task)" ></format-date>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    task: Object,
  },
  data() {
    return {
      flag: false,
    };
  },
  computed: {
    ...mapGetters({
      favTasks: "task/getFavTasks",
    }),
    isFavorite() {
      let fav = this.favTasks.some(t => t.task.id == this.task.id)
      if (fav) {
        return { icon: "bookmark-solid", variant: "orange", text: "Remove favorite", status: true }
      } else {
        return { icon: "bookmark", variant: "gray5", text: "Add to favorites", status: false }
      }
    },
  },
  methods: {
    overdue(item) {
      // console.log(new Date(item.dueDate), new Date);
      return (new Date(item.dueDate) < new Date() && item.statusId != 5) ? 'danger' : 'gray5';
    },

    /*openSidebar() {
      this.$nuxt.$emit("open-sidebar", this.task);

      let el = event.target.offsetParent
      let scrollAmt = event.target.offsetLeft - event.target.offsetWidth;

      el.scrollTo({
        top: 0,
        left: scrollAmt,
        behavior: 'smooth'
      });

    },*/

    addToFavorites($event) {
      // console.info("to be fav task", $event)
      let isFav = this.favTasks.some((f) => f.taskId == $event.id)
      // console.log(isFav)

      if (isFav) {
        this.$store.dispatch("task/removeFromFavorite", { id: $event.id })
          .then(msg => {
            // console.log(msg)
            this.$emit("update-key", msg)
          })
          .catch(e => {
            console.log(e)
          })
      } else {
        this.$store.dispatch("task/addToFavorite", { id: $event.id })
          .then(msg => {
            // console.log(msg)
            this.$emit("update-key", msg)
          })
          .catch(e => {
            console.log(e)
          })
      }
    },
    markComplete($event) {
      // console.log(this.currentTask)
      this.$store.dispatch('task/updateTaskStatus', $event)
        .then((d) => {
          console.log(d)
          this.$nuxt.$emit("update-key")
          this.$store.dispatch("task/setSingleTask", d)
        }).catch(e => {
          console.log(e)
        })
    },
    deleteTask(task) {
      this.$store.dispatch("task/deleteTask", task).then(t => {
        if (t.statusCode == 200) {
          this.$emit("update-key", t.message)
        } else {
          console.warn(t.message);
        }
      }).catch(e => {
        console.log(e)
      })
    },
  },
};

</script>
<style scoped lang="scss">
.task-grid {
  font-size: 14px;
  margin: 1rem 0 ;
  border: 1px solid var(--bib-gray4);
  border-radius: 6px;
  cursor: pointer;
  transition: all 200ms ease;

  &.bg-danger {
    background-color: var(--bib-danger);
    color: #fff;

    .user-name {
      color: #fff
    }
  }

  &.active {
    border-color: $dark;
    box-shadow: 0 0 0 4px $primary-sub3;
  }

  .task-image {
    aspect-ratio: 16 / 9;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
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

}
</style>
