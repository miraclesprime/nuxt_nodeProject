<template>
  <div class="task-actions ml-05">
    <div class="action-left">
      <section-title
        title="Add Task/Section"
        titleSize="15px"
        itemSpace="5px"
      />
    </div>

    <div class="action-right">
      <ul class="actions">
        <li class="action">
          <custom-check-box />

          <span>My items only</span>
        </li>
        <li class="action">
          <bib-icon icon="sort" />
          <span>Sort</span>
        </li>
        <li class="action">
          <bib-icon icon="filter-horizontal" />
          <span>Filter</span>
        </li>
        <li class="action">
          <bib-icon icon="group" />
          <span>Group</span>
        </li>
        <li class="action">
          <span style="margin-right: 5px">Views</span>
          <a href="#" class="grid-type" @click.prevent="changeGridType('grid')">
            <bib-icon
              icon="list"
              :variant="gridType === 'grid' ? 'black' : 'gray'"
            />
          </a>

          <a href="#" class="grid-type" @click.prevent="changeGridType('list')">
            <bib-icon
              icon="kanban"
              :variant="gridType === 'list' ? 'black' : 'gray'"
            />
          </a>
        </li>
        <li class="action">
          <a href="#">
            <bib-icon icon="horizontal-dots" />
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import SectionTitle from "../SectionTitle.vue";
export default {
  components: { SectionTitle },
  data() {
    return {
      gridType: "grid",
    };
  },
  methods: {
    changeGridType(type) {
      this.gridType = type;
      this.$root.$emit("changeGridType", type);
    },
  },
};
</script>


<style scoped lang="scss">
.task-actions {
  display: flex;
  border-bottom: 1px solid $gray4;
  align-items: center;
}
.action-right {
  margin-left: auto;
}
.actions {
  display: flex;
  color: $gray1;

  span {
    margin-left: 5px;
    font-size: 13px;
  }

  svg,
  svg g {
    fill: $gray1;
  }
}
.action {
  display: flex;
  padding: 0 20px;
  align-items: center;
}
.custom-control-label {
  &::before {
    position: static;
    transform: none;
  }

  svg {
    left: 2px;
  }
}
.grid-type {
  border: 1px solid $gray4;
  padding: 2px 3px 0px;
  border-radius: 5px;
}
</style>