<template>
  <div class="task-grid-section">
    <div class="w-100 d-flex justify-between">
      <div class="title text-gray">{{ label }}</div>

      <div class="d-flex">
        <div class="mr-1">
          <bib-icon icon="add" variant="success" :scale="1.2" />
        </div>

        <div>
          <bib-icon icon="elipsis" :scale="1.2" />
        </div>
      </div>
    </div>

    <div class="task-section__body">
      <Container
        :group-name="groupName"
        @drop="onDrop('sections', $event)"
        :get-child-payload="getChildPayload"
      >
        <Draggable
          v-for="(item, index) in taskSections"
          :key="item.name + '-' + index"
        >
          <task-grid :task="item" />
        </Draggable>
      </Container>
    </div>
  </div>
</template>

<script>
import { Container, Draggable } from "vue-smooth-dnd";
import { applyDrag } from "~/utils/helpers";

export default {
  components: {
    Container,
    Draggable,
  },
  props: {
    label: {
      type: String,
      default() {
        return "Section";
      },
    },
    taskSections: {
      type: Array,
      default() {
        return [];
      },
    },
    labelClass: {
      type: String,
      default() {
        return "text-gray";
      },
    },
    groupName: {
      type: String,
      default() {
        return "grid-1";
      },
    },
  },
  data() {
    return {
      sections: this.taskSections,
    };
  },
  methods: {
    onDrop(collection, dropResult) {
      this[collection] = applyDrag(this[collection], dropResult);
    },
    getChildPayload(index) {
      return this.sections[index];
    },
  },
};
</script>

<style scoped lang="scss">
.task-grid-section {
  width: 14%;
  min-width: 200px;
  min-height: 100vh;
  padding: 8px 10px;
  font-size: 16px;
  font-weight: 600;
  border-right: 1px solid $gray4;
}
</style>