<template>
  <table v-click-outside="handleOutClick" id="tlist-table" class="table" cellspacing="0">
    <template v-if="!headless">
      <tr class="table__hrow"  id="tlist-tr">
        <th 
          v-for="(field, key) in fields"
          :key="key"
          :id="'item-' + key"
          :class="'task-' + field.key"
        >
          {{ field.label }}
        </th>
      </tr>
    </template>

    <Container
      :group-name="groupName"
      :get-child-payload="getChildPayload"
      drag-handle-selector=".task-key"
      @drop="onDrop('sections', $event)"
    >
      <Draggable v-for="(item, keyI) in sections" :key="'table' + item.key">
        <div class="draggable-item"  id="tlist-draggable-item">
          <tr 
            class="table__irow"
            @contextmenu="rightClickItem($event, keyI)"
            @click="selectItem(keyI)"
            :id="keyI"
            :key="'item-' + keyI"
          >
            <td v-for="(col, key) in cols" :key="key" :class="'task-' + col" :id="'tlist-td-' + col">
              <slot
                :name="'cell(' + col + ')'"
                v-bind:keyI="keyI"
                v-bind:value="sections[keyI]"
              >
              </slot>
            </td>
          </tr>
        </div>
      </Draggable>
    </Container>
  </table>
</template>

<script>
import { Container, Draggable } from "vue-smooth-dnd";
import { applyDrag } from "~/utils/helpers";

export default {
  components: { Container, Draggable },
  props: {
    groupName: {
      type: String,
    },
    headless: {
      type: Boolean,
      default() {
        return null;
      },
    },
    contentless: {
      type: Boolean,
      default() {
        return false;
      },
    },
    fields: {
      type: Array,
      default() {
        return [];
      },
    },
    taskSections: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      cols: this.fields.map((field) => field.key),
      item: {},
      sections: this.taskSections,
      flag: false,
    };
  },
  computed: {
    activeClass() {
      return (keyI) => (this.sections[keyI].active ? "active" : "");
    },
  },
  methods: {
    selectItem(key) {
      this.flag = !this.flag;
      this.$root.$emit("open-sidebar", this.flag);
      this.$root.$emit("set-active-task", this.sections[key]);

      this.unselectAll();
      document.getElementById(key).classList.toggle("active");
    },
    unselectAll() {
      let rows = document.getElementsByClassName("table__irow");
      for (let row of rows) {
        row.classList.remove("active");
      }
    },
    handleOutClick() {
      this.unselectAll();
    },
    rightClickItem(event, key) {
      this.$emit("item-right-clicked", event, this.sections[key]);
    },
    onDrop(collection, dropResult) {
      this[collection] = applyDrag(this[collection], dropResult);
    },
    getChildPayload(index) {
      return this.sections[index];
    },
  },
};
</script>

<style lang="scss" scoped>
tr {
  display: flex;
  width: 100%;
  align-items: center;
}

th {
  display: flex;
  height: 100%;
  align-items: center;
}

.draggable-item td {
  display: flex;
  align-items: center;
  color: $dark-sub1;
  font-weight: 600;
}
.no-content .smooth-dnd-container {
  display: none;
}

.task-key {
  width: 4%;
  justify-content: center;
}
.task-name {
  width: 28%;
}
.task-status {
  width: 19%;
  justify-content: space-between;
}
.task-priority,
.task-assignee {
  width: 17%;
}
.task-dueDate {
  width: 15%;
}
</style>