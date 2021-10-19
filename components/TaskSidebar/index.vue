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
        <div class="w-50">
          <bib-tabs
            :value="activeFileInfoTab"
            @change="fileInfoTabChange"
            :tabs="fileInfoTabs"
          ></bib-tabs>
        </div>
      </div>
    </template>
    <template v-slot:content>
      <sidebar-overview
        v-if="activeFileInfoTab == 'Overview'"
        :fields="taskFields"
        :tasks="tasks"
      />

      <div class="container pt-1">
        <task-group v-if="activeFileInfoTab == 'Subtasks'" />
      </div>

      <sidebar-team v-if="activeFileInfoTab == 'Team'" />

      <sidebar-conversation v-if="activeFileInfoTab == 'Conversations'" />

      <sidebar-files v-if="activeFileInfoTab == 'Files'" />

      <sidebar-history v-if="activeFileInfoTab == 'History'" />
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
      fileInfoTabs: [
        "Overview",
        "Subtasks",
        "Team",
        "Conversations",
        "Files",
        "History",
      ],
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
      activeFileInfoTab: "Overview",
    };
  },
  computed: {
    ...mapGetters({
      tasks: "task/tasksForListView",
    }),
  },
  methods: {
    hideSidebar() {
      document.querySelector("#__layout").classList.remove("show-sidebar");
    },
    fileInfoTabChange(value) {
      this.activeFileInfoTab = value;
    },
  },
};
</script>
  
<style lang="scss" scoped>
svg {
  width: 100%;
  height: 100%;
  fill: #b2b2b5;
}

.icon {
  margin: 5px 8px 0 5px;
}

.toolbox {
  padding: 5px 0 1rem;
}

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

.d-flex {
  width: 50%;
  margin-left: auto;
}
</style>
  