<template>
  <article class="side-panel">
    <div class="side-panel__header" id='ts-header'>
      <!-- <div class="side-panel__header__file__info" id='ts-header-file-info'>
        <div id='ts-secondary-text' class="p-05 of-hidden text-of-elipsis h-fit text-wrap text-secondary"></div>
      </div> -->
      <div class="d-flex justify-between side-panel__header__actions" id='ts-side-panel'>
        <div class="d-flex align-center">
          <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle" @click="hideSidebar()" id='ts-icon-7'>
            <bib-icon icon="close" variant="gray6" ></bib-icon>
          </div>
          <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle" id='ts-icon-1'>
            <bib-icon icon="external" variant="gray6" ></bib-icon>
          </div>
        </div>
        <div class="d-flex align-center">
          <bib-button variant="light" pill label="invite"></bib-button>
          <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle" id='ts-icon-2'>
            <bib-icon icon="attachment" variant="gray5" :scale="1.25"></bib-icon>
          </div>
          <!-- <div class="p-025 cursor-pointer" id='ts-icon-3'>
            <bib-icon icon="heart-like" variant="gray5" :scale="1.25"></bib-icon>
          </div> -->
          <!-- <div class="p-025 cursor-pointer" id='ts-icon-4'>
            <bib-icon icon="comment-forum" variant="gray5" :scale="1.25"></bib-icon>
          </div> -->
          <!-- <div class="p-025 cursor-pointer" id='ts-icon-5'>
            <bib-icon icon="share" variant="gray5" :scale="1.25"></bib-icon>
          </div> -->
          <!-- <div class="p-025 cursor-pointer" id='ts-icon-6'>
            <bib-icon icon="horizontal-dots" variant="gray5" :scale="1.25"></bib-icon>
          </div> -->
          <bib-button pop="horizontal-dots" class="cursor-pointer bg-light bg-hover-gray2 shape-circle">
            <template v-slot:menu>
              <div class="list">
                  <span class="list__item "><bib-icon icon="check-circle" variant="gray5" class="mr-075"></bib-icon> Mark Completed</span>
                  <span class="list__item"><bib-icon icon="heart-like" variant="gray5" class="mr-075"></bib-icon> Add to favorites</span>
                  <span class="list__item"><bib-icon icon="upload" variant="gray5" class="mr-075"></bib-icon> Attach file...</span>
                  <span class="list__item"><bib-icon icon="user-add" variant="gray5" class="mr-075"></bib-icon> Invite</span>
                  <span class="list__item"><bib-icon icon="notification" variant="gray5" class="mr-075"></bib-icon> Set reminder</span>
                  <span class="list__item"><bib-icon icon="duplicate" variant="gray5" class="mr-075"></bib-icon> Copy</span>
                  <span class="list__item"><bib-icon icon="warning" variant="gray5" class="mr-075"></bib-icon> Report</span>
                  <hr>
                  <span class="list__item danger">Delete</span>
                </div>
              </template>
            </bib-button>
        </div>
      </div>
      <div class="row" style="margin: 1rem -0.5rem" id='ts-row'>
        <div class="col-8" id='ts-col-1'>
          <bib-input type="text" :value="activeItem.title" placeholder="Enter task name..." label="Task name"></bib-input>
        </div>
        <div class="col-4" id='ts-col-2'>
          <bib-input type="date" :value="activeItem.dueDate ? formattedDate(activeItem.dueDate) : ''" placeholder="Enter date/range" label="Due date"></bib-input>
        </div>
      </div>
    </div>
    <div class="menu" id='ts-menu'>
      <bib-tabs :value="activeSidebarTab" @change="sidebarTabChange" :tabs="sidebarTabs"></bib-tabs>
    </div>
    <sidebar-overview v-if="activeSidebarTab == 'Overview'" :fields="taskFields" :tasks="tasks" :activeTask="activeTask" />
    <div class="container pt-1" id='ts-subtask-container' v-if="activeSidebarTab == 'Subtasks'">
      <task-group />
    </div>
    <sidebar-team v-if="activeSidebarTab == 'Team'" />
    <sidebar-conversation v-if="activeSidebarTab == 'Conversations'" />
    <sidebar-files v-if="activeSidebarTab == 'Files'" />
    <sidebar-history v-if="activeSidebarTab == 'History'" />
  </article>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  props: {
    activeTask: Object,
  },
  data: function() {
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
      taskFields: [{
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

</style>
