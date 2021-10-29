<template>
  <bib-panel-wrapper class="side-panel">
    <template v-slot:header>
      <div class="side-panel__header">
        <div class="side-panel__header__file__info">
          <div
            class="
              p-05
              of-hidden
              text-of-elipsis
              h-fit
              text-wrap text-secondary
            "
          ></div>
        </div>
        <div class="d-flex side-panel__header__actions pull-right">
          <div class="m-auto cursor-pointer">
            <bib-icon
              icon="full-screen"
              variant="gray5"
              :scale="1.25"
            ></bib-icon>
          </div>
          <div class="m-auto cursor-pointer">
            <bib-icon icon="download" variant="gray5" :scale="1.25"></bib-icon>
          </div>
          <div class="m-auto cursor-pointer">
            <bib-icon icon="heart" variant="gray5" :scale="1.25"></bib-icon>
          </div>
          <div class="m-auto cursor-pointer">
            <bib-icon
              icon="comment-forum"
              variant="gray5"
              :scale="1.25"
            ></bib-icon>
          </div>
          <div class="m-auto cursor-pointer">
            <bib-icon icon="share" variant="gray5" :scale="1.25"></bib-icon>
          </div>
          <div class="m-auto cursor-pointer">
            <bib-icon
              icon="horizontal-dots"
              variant="gray5"
              :scale="1.25"
            ></bib-icon>
          </div>
          <div class="m-auto cursor-pointer" @click="hideSidebar()">
            <bib-icon icon="close" variant="gray4" :scale="1.5"></bib-icon>
          </div>
        </div>
        <div class="row" style="margin: 1rem -0.5rem">
          <div class="col-8">
            <bib-input
              type="text"
              v-model="form.name"
              placeholder="Enter task name..."
              label="Task name"
            ></bib-input>
          </div>

          <div class="col-4">
            <bib-input
              type="date"
              v-model="form.dueDate"
              placeholder="Enter date/range"
              label="Due date"
            ></bib-input>
          </div>
        </div>
      </div>
    </template>

    <template v-slot:menu>
      <div class="menu">
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
      />

      <div class="container pt-1" v-if="activeSidebarTab == 'Subtasks'">
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
    }),
  },
  methods: {
    hideSidebar() {
      this.$root.$emit("openSidebar", false);
    },
    sidebarTabChange(tab) {
      this.activeSidebarTab = tab.value;
    },
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
