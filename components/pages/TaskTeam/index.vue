<template>
  <div :class="adClass">
    <a href="#" class="add-task w-100">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 48 48"
      >
        <g>
          <path
            d="M39,22H26V9a2,2,0,0,0-4,0V22H9a2,2,0,0,0,0,4H22V39a2,2,0,0,0,4,0V26H39a2,2,0,0,0,0-4Z"
          ></path>
        </g>
      </svg>

      <span>Add Team Members</span>
    </a>

    <div class="team-list w-100">
      <div
        class="teammate"
        v-for="(item, index) in teammates"
        :key="'teammate-' + index"
      >
        <bib-avatar :src="'https://i.pravatar.cc/' + index * 100" size="25px">
        </bib-avatar>

        <span class="teammate-name"
          >{{ item.name }}
          <template v-if="item.role !== 'developer'">
            ( {{ item.role }} )
          </template>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { Teammates } from "config/constants";

export default {
  props: {
    adClass: {
      type: String,
      default: "container pt-1",
    },
  },
  data: function () {
    return {
      teammates: Teammates,
    };
  },
};
</script>

<style lang="scss" scoped>
.teammate {
  padding: 7px 0;
  border-bottom: 1px solid $gray6;

  &:first-child {
    border-top: 1px solid $gray6;
  }
}

.teammate-name {
  font-size: $sidebar-size;
  font-weight: 400;
}
</style>
