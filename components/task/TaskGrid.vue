<template>
  <div class="task-grid" id='task-grid-wrapper'>
    <div class="task-top" id='task-top-wrap'>
      <div class="d-flex" id='task-inside-wrap' @click="openSidebar()">
        <custom-check-box :id="'task-' + task.key" />

        <span class="ml-05" style="margin-top: 2px" id='task-grid-title'
          >{{ task.title }}</span
        >
      </div>

      <bib-button pop="elipsis" icon="elipsis" style="margin-top: 2px" size="xl">
        <template v-slot:menu>
          <div class="list" id='task-list'>
            <span class="list__item" id='t-fav' @click="addToFavorites"
              >Add to favorites</span
            >
            <span class="list__item" id='t-copy-link'
              >Copy Task Link</span
            >
            <span class="list__item" id='t-delete-task'
              >Delete Task</span
            >
            <span class="list__item" id='t-view-task' @click="openSidebar"
              >View Task Details</span
            >
          </div>
        </template>
      </bib-button>
    </div>
    <div class="task-bottom" id='task-bottom'>
      <bib-avatar size="25px"></bib-avatar>

      <span id='task-bottom-duedate'>{{ task.dueDate }}</span>
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
    openSidebar(key) {
      this.flag = !this.flag;
      this.$root.$emit("open-sidebar", this.flag);
      this.$root.$emit("set-active-task", this.task);
    },
    addToFavorites() {
    }
  },
};
</script>

<style scoped lang="scss">
.task-top,
.task-bottom {
  display: flex;
  justify-content: space-between;
}

.task-top {
  margin-bottom: 1rem;
}

.task-bottom {
  align-items: center;
}

.task-grid {
  margin: 8px 4px 8px;
  padding: 8px;
  background: #fff;
  border: 1px solid $gray4;
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
