<template>
  <table v-click-outside="unselectAll" class="table" cellspacing="0">
    <template v-if="!headless">
      <tr class="table__hrow">
        <th
          v-for="(field, key) in fields"
          :key="key"
          :class="'task-' + field.key"
        >
          {{ field.label }}
        </th>
      </tr>
    </template>
    <template v-for="(item, keyI) in sections">
      <tr
        class="table__irow"
        @contextmenu="rightClickItem($event, keyI)"
        @click="selectItem(keyI)"
        :id="keyI"
        :key="'item-' + keyI"
      >
        <td v-for="(col, key) in cols" :key="key" :class="'task-' + col">
          <slot
            :name="'cell(' + col + ')'"
            v-bind:keyI="keyI"
            v-bind:value="sections[keyI]"
          >
          </slot>
        </td>
      </tr>
    </template>
  </table>
</template>

<script>
export default {
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
    };
  },
  computed: {
    activeClass() {
      return (keyI) => (this.sections[keyI].active ? "active" : "");
    },
  },
  methods: {
    selectItem(key) {
      this.$emit("item-clicked", this.sections[key]);

      this.unselectAll();
      document.getElementById(key).classList.toggle("active");
    },
    unselectAll() {
      let rows = document.getElementsByClassName("table__irow");
      for (let row of rows) {
        row.classList.remove("active");
      }
    },
    rightClickItem(event, key) {
      this.$emit("item-right-clicked", event, this.sections[key]);
    },
  },
};
</script>

<style lang="scss" scoped>
.table {
  width: 100%;
  height: max-content;
  border-top: 1px solid $light;

  tr {
    height: 2.5rem;
  }

  th,
  td {
    padding-left: 8px;
    padding-right: 6px;
  }

  &__hrow {
    height: 2.5rem;
    background-color: $light;
    color: $dark-sub1;
    font-size: 13px;
    font-weight: bold;

    th {
      border: $gray4 1px solid;
      border-top: none;

      &:not(:first-child) {
        text-align: left;
      }
    }
  }

  &__srow {
    font-weight: bold;
    cursor: pointer;
    user-select: none;
  }

  &__irow {
    color: $gray6;
    font-weight: 400;
    line-height: 2rem;
    font-size: $base-size;
    outline: 1px solid transparent;
    transition: background-color 0.3s linear, outline-color 0.3s linear;
    border: 1px solid $light;
    border-top: none;

    td {
      border-right: 1px solid $light;

      &:last-child {
        border-right: none;
      }
      &:first-child {
        text-align: center;
      }
    }
    &:nth-child(2) td {
      border-top: none;
    }
    &:not(:last-child) td {
      border-bottom: none;
    }
    &:hover {
      cursor: pointer;
      background-color: $light;
      outline: 1px solid $gray4;
      td {
        border-left: $gray4 1px solid;
      }
    }
    &:active {
      cursor: pointer;
      background-color: $light;
      outline: 1px solid $black;
    }
    &.active {
      outline: 1px solid $black;
      background-color: $light;
    }
  }
}

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

td {
  display: flex;
  align-items: center;
  color: $dark-sub1;
  font-weight: 600;
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