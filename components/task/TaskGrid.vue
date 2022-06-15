<template>
  <div class="task-grid" :id="'task-grid-wrapper'+ task.id" v-on:click="openSidebar(task)">
    <figure v-if="task.cover" :id="'task-card-image'+task.id" class="task-image bg-light" style="background-image:url('https://via.placeholder.com/200x110')"></figure>
    <div class="task-top" :id="'tg-top-wrap'+ task.id">
      <!-- <div class="d-flex" :id="'tg-inside-wrap'+ task.id" @click="openSidebar()">
        <custom-check-box :id="'tg-' + task.id" />
        <span class="ml-05" style="margin-top: 2px" :id="'tg-title'+ task.id"
          >{{ task.title }}</span
        >
      </div> -->
      <div class="d-flex" :id="'task-card-inside-wrap'+task.id">
        <bib-icon icon="check-circle" :scale="1.5" :variant="task.status ? task.status.text === 'Done' ? 'success' : 'secondary-sub1': ''" class="cursor-pointer" @click="handleTaskStatus(task)"></bib-icon>
        <span class="ml-05" :id="'task-title'+task.id">{{ task.title }} </span>
      </div>
      <bib-button pop="elipsis" icon="elipsis" style="margin-top: 2px" size="xl">
        <template v-slot:menu>
          <div class="list" :id="'task-list'+task.id">
            <span class="list__item" :id="'task-comp'+task.id" v-on:click="markComplete(task)">
              <bib-icon icon="check-circle" :variant="task.statusId == 5 ? 'success' : 'secondary-sub1'" class="mr-05"></bib-icon> {{task.statusId != 5 ? "Mark" : ""}} Completed
            </span>
            <span class="list__item" :id="'tg-fav'+task.id" data-fav="isFavorite(task).status" v-on:click.stop="addToFavorites(task)">
                <bib-icon :icon="isFavorite(task).icon" :variant="isFavorite(task).variant" class="mr-05"></bib-icon> {{isFavorite(task).text}}
            </span>
            <span class="list__item" :id="'task-attach'+task.id">
              <bib-icon icon="upload" class="mr-05"></bib-icon> Attach file...
            </span>
            <span class="list__item" :id="'task-assign'+task.id">
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
            </span>
            <span class="list__item " :id="'task-view-task'+task.id">
              <bib-icon icon="warning" class="mr-05"></bib-icon> Report
            </span>
            <hr>
            <span class="list__item danger" :id="'task-delete-task'+task.id" @click="deleteTask(task)">Delete Task</span>
          </div>
        </template>
      </bib-button>
    </div>
    <div class="task-bottom" :id="'tg-bottom'+ task.id">
      <!-- <bib-avatar size="25px"></bib-avatar> -->
      <user-info :userId="task.userId"></user-info>
      <span :id="'tg-bottom-duedate'+ task.id" v-format-date="task.dueDate"></span>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

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
    })
  },
  methods: {
    /*openSidebar(key) {
      this.flag = !this.flag;
      this.$root.$emit("open-sidebar", this.flag);
      this.$root.$emit("set-active-task", this.task);
    },*/
    isFavorite(task) {
      let fav = this.favTasks.some(t  => t.task.id == task.id)
      if (fav) {
        return { icon: "bookmark-solid", variant: "orange", text: "Remove favorite", status: true }
      } else {
        return { icon: "bookmark", variant: "gray5", text: "Add to favorites", status: false }
      }
    },
    openSidebar(task) {
      
      // console.log(task)
      this.$nuxt.$emit("open-sidebar", {...task} );

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
      this.loading = true
      let isFav = this.favTasks.some((f) => f.taskId == $event.id)
      // console.log(isFav)

      if (isFav) {
        this.$store.dispatch("task/removeFromFavorite", { id: $event.id })
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
        this.$store.dispatch("task/addToFavorite", { id: $event.id })
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
    deleteTask(task) {
      this.loading = true
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
    },
  },
};

</script>
<style scoped lang="scss">
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
  background: var(--bib-light);
  border: 1px solid transparent;
  border-radius: 4px;
  cursor: pointer;

  span {
    font-size: 15px;
    font-weight: 500;
  }

  .task-bottom span {
    font-size: 13px;
  }
}

::v-deep {
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
