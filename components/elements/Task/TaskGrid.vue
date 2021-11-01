<template>
  <div class="task-grid" @click="openSidebar()">
    <div class="task-top">
      <div class="d-flex">
        <custom-check-box :id="'task-' + task.key" />

        <span class="ml-05"
          >Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do</span
        >
      </div>

      <bib-icon icon="elipsis" />
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
    openSidebar() {
      this.flag = !this.flag;
      this.$root.$emit("open-sidebar", this.flag);
      this.$root.$emit("set-active-task", this.sections[key]);
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
  margin: 1rem 4px 1rem;
  padding: 8px;
  background: #fff;
  border: 1px solid $gray4;
  border-radius: 4px;
  cursor: pointer;

  span {
    font-size: 14px;
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
