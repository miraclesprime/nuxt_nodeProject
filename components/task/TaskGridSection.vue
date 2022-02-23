<template>
  <div class="task-grid-section">
    <div class="w-100 d-flex justify-between" style="margin-bottom: 10px">
      <div class="title text-gray">{{ label }}</div>

      <div class="d-flex section-options">
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
  width: 16%;
  min-width: 230px;
  min-height: 100vh;
  padding: 10px;
  font-size: 15px;
  font-weight: 600;

  &:not(:first-child) {
    border-left: 1px solid $gray4;
  }

  &:last-child {
    border-right: 1px solid $gray4;
  }

  &:hover {
    &,
    & + .task-grid-section {
      border-left-color: $gray5;
    }

    .section-options {
      visibility: visible;
      opacity: 1;
    }
  }

  &:last-child:hover {
    border-right-color: $gray5;
  }
}

.section-options {
  visibility: hidden;
  opacity: 0;
  transition: all 0.3s;
}
</style>