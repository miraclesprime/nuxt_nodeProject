<template>
  <article id="side-panel" class="side-panel">
    <div class="side-panel__header" id='ts-header'>
      <!-- <div class="side-panel__header__file__info" id='ts-header-file-info'>
        <div id='ts-secondary-text' class="p-05 of-hidden text-of-elipsis h-fit text-wrap text-secondary"></div>
      </div> -->
      <div class="d-flex justify-between side-panel__header__actions mb-1" id='ts-side-panel'>
        <div class="d-flex align-center gap-05" id="ts-icon-close-Wrapper">
          <div id='ts-icon-7' class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" @click="hideSidebar()">
            <bib-icon icon="page-last" class="m-auto"></bib-icon>
          </div>
          <div class="d-flex cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2" id='ts-icon-external-wrapper'>
            <bib-icon icon="expand-fullscreen" variant="gray6" class="m-auto"></bib-icon>
          </div>
        </div>
        <div class="d-flex gap-05 align-center" id="ts-icon-attachment-wrapper">
          <bib-button variant="light" pill label="invite"></bib-button>
          <div class="p-025 cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex" id='ts-icon-2'>
            <bib-icon icon="attachment" variant="gray5" class="m-auto"></bib-icon>
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
          <div id="ts-list-wrap" class="cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center">
            <bib-button pop="horizontal-dots">
              <template v-slot:menu>
                <div class="list" id="ts-list">
                  <span class="list__item" id="ts-list-item-1">
                    <bib-icon icon="check-circle" variant="gray5" class="mr-075"></bib-icon> Mark Completed
                  </span>
                  <span class="list__item" id="ts-list-item-2">
                    <bib-icon icon="heart-like" variant="gray5" class="mr-075"></bib-icon> Add to favorites
                  </span>
                  <span class="list__item" id="ts-list-item-3">
                    <bib-icon icon="upload" variant="gray5" class="mr-075"></bib-icon> Attach file...
                  </span>
                  <span class="list__item" id="ts-list-item-4">
                    <bib-icon icon="user-add" variant="gray5" class="mr-075"></bib-icon> Invite
                  </span>
                  <span class="list__item" id="ts-list-item-5">
                    <bib-icon icon="notification" variant="gray5" class="mr-075"></bib-icon> Set reminder
                  </span>
                  <span class="list__item" id="ts-list-item-6">
                    <bib-icon icon="duplicate" variant="gray5" class="mr-075"></bib-icon> Copy
                  </span>
                  <span class="list__item" id="ts-list-item-7">
                    <bib-icon icon="warning" variant="gray5" class="mr-075"></bib-icon> Report
                  </span>
                  <hr>
                  <span class="list__item danger" id="ts-list-item-8">Delete</span>
                </div>
              </template>
            </bib-button>
          </div>
        </div>
      </div>
      <div class="row" id='ts-row'>
        <div class="col-8" id='ts-col-1'>
          <bib-input type="text" v-model="Object.keys(activeItem).length ? activeItem.title : form.name" placeholder="Enter task name..." :variant="error == 'invalid'?'alert':''" label="Task name"></bib-input>
          <!-- <small v-show="error == 'invalid'" class="text-danger font-xs " style="display:block; margin-top: -0.25rem;">Task name is required</small> -->
        </div>
        <div class="col-4" id='ts-col-2'>
          <bib-input type="date" v-model="Object.keys(activeItem).length ? activeItem.dueDate : form.dueDate" placeholder="Enter date/range" label="Due date"></bib-input>
        </div>
      </div>
    </div>
    <div class="menu" id='ts-menu'>
      <bib-tabs :value="activeSidebarTab" @change="sidebarTabChange" :tabs="sidebarTabs"></bib-tabs>
    </div>
    <div class="of-scroll-y position-relative" id="ts-of-scroll-y">
      <loading :loading="loading"></loading>
      <sidebar-overview v-if="activeSidebarTab == 'Overview'" :fields="taskFields" :activeTask="activeItem" v-on:create-task="createTask" />
      <div class="container pt-1" id='ts-subtask-container' v-if="activeSidebarTab == 'Subtasks'">
        <task-group />
      </div>
      <sidebar-team v-if="activeSidebarTab == 'Team'" />
      <sidebar-conversation v-if="activeSidebarTab == 'Conversations'" />
      <sidebar-files v-if="activeSidebarTab == 'Files'" />
      <sidebar-history v-if="activeSidebarTab == 'History'" />
    </div>
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
      loading: false,
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
      // error: false
    };
  },

  computed: {
    ...mapGetters({
      tasks: "task/tasksForListView",
      activeItem: 'task/getSelectedTask',
    }),
    error() {
      if (this.form.name || this.activeItem.title) {
        return "valid"
      } else {
        return "invalid"
      }
    }
  },
  methods: {
    hideSidebar() {
      this.$emit("open-sidebar", false)
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

    },
    createTask($event) {
      // console.table($event);
      if (this.error == "valid") {
        this.loading = true
        this.$store.dispatch("task/createTask", {
          "sectionId": $event.sectionId,
          "projectId": $event.projectId,
          "title": this.form.name,
          "description": $event.description,
          "dueDate": this.form.dueDate,
          "priorityId": $event.priorityId,
          "budget": 0,
          "statusId": $event.statusId
        }).then(() => {
          this.loading = false
          this.hideSidebar()
        }).catch(e => console.warn(e)).then(() => {
          this.loading = false
        })
      }
    }
  },
};

</script>
<style lang="scss" scoped>
.side-panel {
  display: grid;
  grid-auto-flow: row;
  align-content: start;
}

.row {
  padding: 0 1rem;

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
