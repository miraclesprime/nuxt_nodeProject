<template>
  <div class="task-grid" @click="openSidebar()">
    <div class="task-top">
      <div class="d-flex">
        <custom-check-box :id="'task-' + task.key" />

        <span class="ml-05" style="margin-top: 2px"
          >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do</span
        >
      </div>

      <bib-icon icon="elipsis" style="margin-top: 4px" />
    </div>
    <div class="task-bottom">
      <bib-avatar size="25px"></bib-avatar>

      <span>{{ task.dueDate }}</span>
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
