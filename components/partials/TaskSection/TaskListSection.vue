<template>
  <bib-detail-collapse :label="label" :open="open" :class="labelClass">
    <template v-slot:content>
      <bib-table
        :fields="taskFields"
        :sections="taskSections"
        :headless="headless"
        :groupName="groupName"
        class="bg-white p-0 task-table"
        @item-clicked="itemClicked()"
      >
        <template #cell(key)="data">
          <div class="task-key">
            {{ data.value.key }}
          </div>
        </template>

        <template #cell(name)="data">
          <custom-check-box :id="groupName + '-' + data.value.key" />
          <span class="ml-05">{{ data.value.name }}</span>
        </template>

        <template #cell(status)="data">
          <span :class="statusClass(data.value.status)">
            {{ data.value.status }}
          </span>
          <span :class="statusClass(data.value.status)">
            {{ data.value.progress }}</span
          >
        </template>
        <template #cell(priority)="data">
          <span :class="priorityClass(data.value.priority)">
            {{ data.value.priority }}
          </span>
        </template>
        <template #cell(assignee)="data">
          <bib-avatar size="25px"></bib-avatar>
          <span class="assignee-name ml-05">
            {{ data.value.assignee }}
          </span>
        </template>
        <template #cell(dueDate)="data">
          {{ data.value.dueDate }}
        </template>
      </bib-table>
    </template>
  </bib-detail-collapse>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default() {
        return "Task Section";
      },
    },
    open: {
      type: Boolean,
      default() {
        return false;
      },
    },
    headless: {
      type: Boolean,
      default() {
        return false;
      },
    },
    taskSections: {
      type: Array,
      default() {
        return [];
      },
    },
    taskFields: {
      type: Array,
      default() {
        return [];
      },
    },
    groupName: {
      type: String,
      default() {
        return "1";
      },
    },
    labelClass: {
      type: String,
      default() {
        return "text-dark";
      },
    },
  },
  data() {
    return {
      flag: false,
    };
  },
  methods: {
    activeTab(e) {},

    statusClass(status) {
      if (status === "Past Due") return "text-red";
      if (status === "In-progress") return "text-blue";
    },

    priorityClass(priority) {
      if (priority === "Urgent") return "text-red";
      if (priority === "Top") return "text-orange";
      return "text-green";
    },

    itemClicked() {
      this.flag = !this.flag;
      this.$root.$emit("open-sidebar", this.flag);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep {
  .detail-collapse__content {
    padding: 0;
  }

  .table {
    tr:first-child td {
      border-top: none;
    }

    tr:nth-child(2) td {
      border-top: 1px solid $gray3;
    }
  }

  .detail-collapse__header {
    border-top: none !important;
  }

  .border-top-gray4 {
    border-top: 1px solid $gray4;
  }

  td {
    display: flex;
    align-items: center;
    color: $dark !important;
    font-weight: 600;
  }
  td:first-child {
    width: 4%;
    justify-content: center;
  }
  td:nth-child(2) {
    width: 28%;
  }
  td:nth-child(3) {
    width: 19%;
    justify-content: space-between;
  }
  td:nth-child(4),
  td:nth-child(5) {
    width: 17%;
  }
  td:nth-child(6) {
    width: 15%;
  }
  tr {
    display: flex;
  }
}
</style>