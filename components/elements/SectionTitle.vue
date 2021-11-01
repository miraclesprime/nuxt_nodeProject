<template>
  <div class="section-title w-100 d-flex align-center" @click="openSidebar">
    <bib-icon :icon="icon" variant="success" :scale="1.2" />

    <span :style="titleStyle">{{ title }}</span>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default() {
        return "Add Subtask";
      },
    },
    titleSize: {
      type: String,
      default() {
        return "14px";
      },
    },
    iconSize: {
      type: Number,
      default() {
        return 1.2;
      },
    },
    icon: {
      type: String,
      default() {
        return "add";
      },
    },
    itemSpace: {
      type: String,
      default() {
        return "2px";
      },
    },
  },
  computed: {
    titleStyle() {
      return "font-size:" + this.titleSize + "; margin-left:" + this.itemSpace;
    },
  },
  methods: {
    openSidebar: function () {
      this.$root.$emit("open-sidebar", true);
      this.$root.$emit("set-active-task", { name: "", status: "" });
    },
  },
};
</script>

<style scoped lang="scss">
.section-title {
  margin: 9px 0 8px;
  cursor: pointer;

  svg,
  span {
    vertical-align: middle;
  }
}
</style>