<template>
  <div>
    <task-actions :gridType="gridType"></task-actions>

    <template v-if="gridType === 'list'">
      <bib-table
        v-for="(item, index) in sections"
        :key="'table-section-' + index"
        :fields="tableFields"
        :sections="item.tasks"
        :collapseObj="{
          collapsed: false,
          label: item.title,
        }"
        class="border-gray4 bg-white"
        :style="{ borderBottom: 'none' }"
        @item-clicked="toggleSidebar"
      >
        <!-- <template #cell(name)="data">
          <div class="d-flex gap-05">
            <bib-avatar class="mt-auto mb-auto" size="1.5rem"></bib-avatar>
            <span class="text-dark">{{ data.value.name }}</span>
          </div>
        </template> -->
         <template #cell(title)="data">
            <div class="d-flex gap-05">
              <span class="text-dark" @click="taskSelected(data.value)">{{ data.value.title }}</span>
            </div>
          </template>
        <template #cell(status)="data">
          <div class="justify-between text-dark">
            <span :class="statusClass(data.value.status.text)">
              {{ data.value.status.text }}
            </span>
            <span :class="statusClass(data.value.status)">
              {{ data.value.progress }}<span v-if="data.value.progress">%</span></span
            >
          </div>
        </template>
        <template #cell(priority)="data">
          <div class="justify-between text-dark">
            <span :class="priorityClass(data.value.priority)">
              {{ data.value.priority }}
            </span>
          </div>
        </template>
        <template #cell(assignee)="data">
          <div class="text-dark">
            <bib-avatar class="mt-auto mb-auto" size="1.5rem"></bib-avatar>

            <span>{{ data.value.assignee }}</span>
          </div>
        </template>
        <template #cell(dueDate)="data">
          <div class="text-dark">
            <span>{{ new Date(data.value.dueDate).toLocaleString("en-US") }}</span>
          </div>
        </template>
      </bib-table>
<!--  -->
      
    </template>

    <template v-else>
      <div class="d-flex">
        <task-grid-section
          :headless="true"
          label="Section"
          :taskFields="tableFields"
          :taskSections="tasks.slice(0, 3)"
          :open="true"
          groupName="1"
        />
        <!-- <task-grid-section
          :headless="true"
          label="Section"
          :taskFields="tableFields"
          :taskSections="tasks.slice(3, 6)"
          groupName="1"
        />
        <task-grid-section
          :headless="true"
          label="Section"
          :taskFields="tableFields"
          :taskSections="tasks.slice(6, 9)"
          groupName="1"
        /> -->
      </div>
    </template>
  </div>
</template>


<script>
import { DUMMY_TASK_FIELDS } from "~/dummy/tasks.js";
import {mapGetters, mapActions} from 'vuex';

export default {
  props: {
    gridType: String,
  },
  data() {
    return {
      tableFields: DUMMY_TASK_FIELDS,
      // tableSections: DUMMY_TASKS,
      flag: false,
    };
  },
  computed: {
    ...mapGetters({
      tasks: "task/getAllTasks",
      sections: "section/getAllSections"
    }),
  },
  methods: {
    toggleSidebar() {
      this.flag = !this.flag;
      this.$root.$emit("open-sidebar", this.flag);
    },

    statusClass(status) {
      if (status === "Past Due") return "text-red";
      if (status === "In-progress") return "text-blue";
    },

    priorityClass(priority) {
      if (priority === "Urgent") return "text-red";
      if (priority === "Top") return "text-orange";
      return "text-green";
    },
    taskSelected($event) {
      console.log('working!!')
      this.$store.dispatch('task/setSingleTask', $event)
    }
  },
  
  
  mounted() {
    this.$nextTick(async () => {
      await this.$store.dispatch("task/fetchTasks");
      await this.$store.dispatch("section/fetchSections");
    });
    // mapActions({fetchSections: 'section/fetchSections'})
  }
};
</script>