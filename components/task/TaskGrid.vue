<template>
  <div :id="'task-grid-wrapper'+ task.id" class="task-grid bg-white" v-on:click.stop="openSidebar()">
    <figure v-if="task.cover" :id="'task-card-image'+task.id" class="task-image bg-light" style="background-image:url('https://via.placeholder.com/200x110')"></figure>
    <div class="task-top" :id="'tg-top-wrap'+ task.id">
      <!-- <div class="d-flex" :id="'tg-inside-wrap'+ task.id" @click="openSidebar()">
        <custom-check-box :id="'tg-' + task.id" />
        <span class="ml-05" style="margin-top: 2px" :id="'tg-title'+ task.id"
          >{{ task.title }}</span
        >
      </div> -->
      <div class="d-flex" :id="'task-card-inside-wrap'+task.id">
        <bib-icon icon="check-circle" :scale="1.5" :variant="task.status ? task.status.text === 'Done' ? 'success' : 'secondary-sub1': ''" class="cursor-pointer" @click="markComplete(task)"></bib-icon>
        <span class="ml-05" :id="'task-title'+task.id">{{ task.title }} </span>
      </div>
      <bib-button pop="elipsis" icon="elipsis" style="margin-top: 2px" size="xl">
        <template v-slot:menu>
          <div class="list" :id="'task-list'+task.id">
            <span class="list__item" :id="'task-comp'+task.id" v-on:click="markComplete(task)">
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
            <!-- <span class="list__item" :id="'task-assign'+task.id">
              <bib-icon icon="user-add" class="mr-05"></bib-icon> Assign to...
            </span>
            <span class="list__item" :id="'task-reminder'+task.id">
              <bib-icon icon="notification" class="mr-05"></bib-icon> Set as reminder
            </span>
            <span class="list__item " :id="'task-copy-link'+task.id">
              <bib-icon icon="duplicate" class="mr-05"></bib-icon> Copy
            </span>
            <span class="list__item" :id="'task-move'+task.id">
              <bib-icon icon="transfer" class="mr-05"></bib-icon> Move to
            </span> -->
            <span class="list__item " :id="'task-view-task'+task.id">
              <bib-icon icon="warning" class="mr-05"></bib-icon> Report
            </span>
            <hr>
            <span class="list__item list__item__danger" :id="'task-delete-task'+task.id" @click="deleteTask(task)">Delete Task</span>
          </div>
        </template>
      </bib-button>
    </div>
    <div class="task-mid d-flex gap-05">
      <status-badge :status="task.status"></status-badge>
      <priority-badge :priority="task.priority"></priority-badge>
      <!-- <priority-comp :priority="task.priority" :iconOnly="true"></priority-comp> -->
    </div>
    <div class="task-bottom" :id="'tg-bottom'+ task.id">
      <user-info v-if="task.userId" :userId="task.userId"></user-info>
      <format-date v-if="task.dueDate" :datetime="task.dueDate" class="ml-auto"></format-date>
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

    openSidebar() {
      // console.log(task)
      this.$nuxt.$emit("open-sidebar", this.task);

      let el = event.target.offsetParent
      let scrollAmt = event.target.offsetLeft - event.target.offsetWidth;

      el.scrollTo({
        top: 0,
        left: scrollAmt,
        behavior: 'smooth'
      });

    },
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
</style>
