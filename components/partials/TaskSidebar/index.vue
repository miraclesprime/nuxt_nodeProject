<template>
  <bib-panel-wrapper class="side-panel">
    {{formattedDate(activeItem.dueDate)}}
    <template v-slot:header>
      <div class="side-panel__header" id='ts-header'>
        <div class="side-panel__header__file__info" id='ts-header-file-info'>
          <div
            id='ts-secondary-text'
            class="
              p-05
              of-hidden
              text-of-elipsis
              h-fit
              text-wrap text-secondary
            "
          ></div>
        </div>
        <div class="d-flex side-panel__header__actions pull-right" id='ts-side-panel'>
          <div class="m-auto cursor-pointer" id='ts-icon-1'>
            <bib-icon
              icon="full-screen"
              variant="gray5"
              :scale="1.25"
            ></bib-icon>
          </div>
          <div class="m-auto cursor-pointer" id='ts-icon-2'>
            <bib-icon icon="download" variant="gray5" :scale="1.25"></bib-icon>
          </div>
          <div class="m-auto cursor-pointer" id='ts-icon-3'>
            <bib-icon icon="heart" variant="gray5" :scale="1.25"></bib-icon>
          </div>
          <div class="m-auto cursor-pointer" id='ts-icon-4'>
            <bib-icon
              icon="comment-forum"
              variant="gray5"
              :scale="1.25"
            ></bib-icon>
          </div>
          <div class="m-auto cursor-pointer" id='ts-icon-5'>
            <bib-icon icon="share" variant="gray5" :scale="1.25"></bib-icon>
          </div>
          <div class="m-auto cursor-pointer" id='ts-icon-6'>
            <bib-icon
              icon="horizontal-dots"
              variant="gray5"
              :scale="1.25"
            ></bib-icon>
          </div>
          <div class="m-auto cursor-pointer" @click="hideSidebar()" id='ts-icon-7'>
            <bib-icon icon="close" variant="gray4" :scale="1.5"></bib-icon>
          </div>
        </div>
        <div class="row" style="margin: 1rem -0.5rem" id='ts-row'>
          <div class="col-8" id='ts-col-1'>
            <bib-input
              type="text"
              :value="activeItem.title"
              placeholder="Enter task name..."
              label="Task name"
            ></bib-input>
          </div>

          <div class="col-4" id='ts-col-2'>
            <bib-input
              type="date"
              :value="activeItem.dueDate ? formattedDate(activeItem.dueDate) : ''"
              placeholder="Enter date/range"
              label="Due date"
            ></bib-input>
          </div>
        </div>
      </div>
    </template>

    <template v-slot:menu>
      <div class="menu" id='ts-menu'>
        <bib-tabs
          :value="activeSidebarTab"
          @change="sidebarTabChange"
          :tabs="sidebarTabs"
        ></bib-tabs>
      </div>
    </template>

    <template v-slot:content>
      <sidebar-overview
        v-if="activeSidebarTab == 'Overview'"
        :fields="taskFields"
        :tasks="tasks"
        :activeTask="activeTask"
      />

      <div class="container pt-1" id='ts-subtask-container' v-if="activeSidebarTab == 'Subtasks'">
        <task-group />
      </div>

      <sidebar-team v-if="activeSidebarTab == 'Team'" />

      <sidebar-conversation v-if="activeSidebarTab == 'Conversations'" />

      <sidebar-files v-if="activeSidebarTab == 'Files'" />

      <sidebar-history v-if="activeSidebarTab == 'History'" />
    </template>
  </bib-panel-wrapper>
</template>
  
  <script>
import { mapGetters } from "vuex";

export default {
  props: {
    activeTask: Object,
  },
  data: function () {
    return {
      form: {
        name: "",
        dueDate: "2021/11/7",
      },
      sidebarTabs: [
        { title: "Overview", value: "Overview" },
        { title: "Subtasks", value: "Subtasks" },
        { title: "Team", value: "Team" },
        { title: "Conversations", value: "Conversations" },
        { title: "Files", value: "Files" },
        { title: "History", value: "History" },
      ],
      activeSidebarTab: "Overview",
      taskFields: [
        {
          key: "id",
          label: "#",
        },
        {
          key: "title",
          label: "Task name",
        },
        {
          key: "status",
          label: "Status",
        },
        {
          key: "priority",
          label: "Priority",
        },
        {
          key: "assignee",
          label: "Assignee",
        },
        {
          key: "dueDate",
          label: "Due Date",
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      tasks: "task/tasksForListView",
      activeItem: 'task/getSingleTask'
    }),
  },
  methods: {
    hideSidebar() {
      this.$root.$emit("open-sidebar", false);
    },
    sidebarTabChange(tab) {
      this.activeSidebarTab = tab.value;
    },
    formattedDate(d) {
      let date = new Date(d);
      let month = date.getMonth() + 1;
      let day = '0' + date.getDay();
      let year = date.getFullYear()
      return `${year}-${month}-${day}`
      
    }
  },
};
</script>
  
<style lang="scss" scoped>
.row {
  padding: 0 1.5rem;

  .input {
    font-size: $sidebar-size;
    color: #ccc;
  }
}

.container.pt-1::v-deep {
  padding-top: 1rem;
}

.container.pt-2::v-deep {
  padding-top: 2rem;
}

.d-flex {
  width: 50%;
  margin-left: auto;
}
</style>
