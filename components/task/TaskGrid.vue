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
            <span class="list__item" :id="'task-comp'+task.id">
              <bib-icon icon="check-circle" class="mr-05"></bib-icon> Mark Completed
            </span>
            <span class="list__item" :id="'task-fav'+task.id" @click="addToFavorites">
              <bib-icon icon="heart-like" class="mr-05"></bib-icon> Add to favorites
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
            <span class="list__item danger" :id="'task-delete-task'+task.id">Delete Task</span>
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
export default {
  props: {
    task: Object,
  },
  data() {
    return {
      flag: false,
    };
  },
  methods: {
    /*openSidebar(key) {
      this.flag = !this.flag;
      this.$root.$emit("open-sidebar", this.flag);
      this.$root.$emit("set-active-task", this.task);
    },*/
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
    addToFavorites() {}
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
