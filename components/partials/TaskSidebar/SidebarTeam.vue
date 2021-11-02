<template>
  <div :class="adClass">
    <section-title title="Add Team Member" />

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
import { TEAMMATES } from "config/constants";

export default {
  props: {
    adClass: {
      type: String,
      default: "container pt-1",
    },
  },
  data: function () {
    return {
      teammates: TEAMMATES,
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
