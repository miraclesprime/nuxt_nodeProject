<template>
  <bib-app-wrapper
    class="test"
    :navigationCollapsed="collapseNavigation"
    @button-click="rightClkFileSection"
    @collapseNavigation="
      () => {
        collapseNavigation = !collapseNavigation;
      }
    "
    :header-actions="appHeaderActions"
  >
    <template #topbar>
      <bib-header></bib-header>
    </template>

    <template #switcher>
      <bib-app-switcher :menuItems="appItems"></bib-app-switcher>
    </template>

    <template #navigation>
      <bib-app-navigation :items="navItems1"></bib-app-navigation>
      <bib-app-navigation :items="navItems2"></bib-app-navigation>
      <bib-app-navigation :items="navItems3"></bib-app-navigation>
    </template>

    <template #content>
      <div class="main" :class="openSidebar ? 'open-sidebar' : ''">
        <task-sidebar :activeTask="activeTask" />

        <div class="bread d-flex">
          <div class="d-flex align-center">
            <bib-icon icon="previous" :scale="2.0"></bib-icon>
          </div>
          <h3 class="bold mt-auto mb-auto d-flex">
            Project Name
            <div class="pl-1 mt-auto mb-auto">
              <bib-icon icon="heart" :scale="1.25"></bib-icon>
            </div>
            <div class="pl-1 mt-auto mb-auto">
              <bib-button pop="elipsis">
                <template v-slot:menu>
                  <div class="list__section">
                    <span class="list__item">item 1</span>
                    <span class="list__item">item 2</span>
                    <span class="list__item">item 3</span>
                  </div>
                </template>
              </bib-button>
            </div>
          </h3>
        </div>

        <div class="menu">
          <bib-tabs :value="activeTab.value" @change="tabChange" :tabs="TABS" />
        </div>

        <div class="">
          <task-overview
            v-if="activeTab.value == TAB_TITLES.overview"
            :fields="TABLE_FIELDS"
            :tasks="tasks"
            :gridType="gridType"
          />
          <task-view
            v-else-if="activeTab.value == TAB_TITLES.tasks"
            :fields="TABLE_FIELDS"
            :tasks="tasks"
            :gridType="gridType"
          />
          <task-conversations
            v-else-if="activeTab.value == TAB_TITLES.conversations"
            :fields="TABLE_FIELDS"
            :tasks="tasks"
          />
          <task-timeline-view
            v-else-if="activeTab.value == TAB_TITLES.timeline"
            :fields="TABLE_FIELDS"
            :tasks="tasks"
          />
          <task-calendar-view
            v-else-if="activeTab.value == TAB_TITLES.calendar"
            :fields="TABLE_FIELDS"
            :tasks="tasks"
          />
          <task-team
            v-else-if="activeTab.value == TAB_TITLES.team"
            :fields="TABLE_FIELDS"
            :tasks="tasks"
          />
          <task-files
            v-else-if="activeTab.value == TAB_TITLES.files"
            :fields="TABLE_FIELDS"
            :tasks="tasks"
          />
        </div>
      </div>
    </template>
  </bib-app-wrapper>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { TABLE_FIELDS, TABS, DEFAULT_TAB, TAB_TITLES } from "config/constants";

export default {
  auth: false,
  data() {
    return {
      activeTab: DEFAULT_TAB,
      TABS,
      TAB_TITLES,
      TABLE_FIELDS,
      gridType: "list",
      openSidebar: false,
      activeTask: {
        assignee: null,
        priority: null,
        status: null,
      },
      appItems: [
        {
          img: "Layers",
          color: "primary",
          active: true,
          text: "Templates",
          href: "#",
        },
        { img: "Files", color: "success-sub1", text: "Files", href: "#" },
        { img: "Signature", color: "orange", text: "eSign", href: "#" },
        { img: "Tick", color: "primary", text: "Project", href: "#" },
        { img: "CommentForum", color: "purple", text: "Chat", href: "#" },
      ],
      navItems1: [
        { label: "Project Home", icon: "home", selected: true },
        { label: "Inbox", icon: "nodes" },
        { label: "My tasks", icon: "check-circle" },
        { label: "Favorites", icon: "heart-like" },
      ],
      navItems2: [
        { label: "Dream", icon: "home", selected: true },
        { label: "Goals", icon: "nodes" },
        { label: "Projects", icon: "folder-add" },
        { label: "Tasks", icon: "check-circle" },
      ],
      navItems3: [
        { label: "Departments", icon: "home", selected: true },
        { label: "People", icon: "user-group" },
      ],
      collapseNavigation: false,
      appHeaderActions: {
        button: {
          label: "Create / Upload",
          event: "button-click",
          variant: "success",
          icon: "add",
        },
        select: {
          items: [
            {
              label: "Organization Name",
              event: "item-click",
              img: "https://i.pravatar.cc/300",
            },
            {
              label: "Organization Name",
              event: "item-click",
              img: "https://i.pravatar.cc/300",
            },
          ],
          footer: {
            label: "Add organization",
            icon: "plus",
            event: "add-organization",
          },
        },
      },
    };
  },
  computed: {
    ...mapState("task", ["list", "single"]),
    ...mapGetters({
      tasks: "task/tasksForListView",
    }),
  },
  methods: {
    // Change Tab
    tabChange(value) {
      this.activeTab = value;
    },

    // Handle User logout
    async logout() {
      try {
        let response = await this.$auth.logout();
      } catch (err) {
        console.log(err);
      }
    },

    rightClkFileSection(event) {
      event.preventDefault();
      var menu = document.getElementById("file__section__context");
      this.closeMenus();
      this.showFileSectionMenu = true;

      var body = document.body,
        html = document.documentElement;

      var height = Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );

      if (menu) {
        menu.style.position = "fixed";
        menu.style.left = event.clientX + "px";
        menu.style.top = event.clientY + "px";

        if (height - event.pageY < 150) {
          menu.style.maxHeight = height - event.pageY + "px";
          menu.style.overflowY = "scroll";
          menu.scroll(1, 1);
        } else {
          menu.style.maxHeight = "max-content";
        }
      }
    },
  },
  created() {
    this.$nextTick(async () => {
      await this.$store.dispatch("task/fetchTasks");
    });

    this.$root.$on("change-grid-type", (type) => {
      this.gridType = type;
    });

    this.$root.$on("open-sidebar", (flag) => {
      this.openSidebar = flag;
    });

    this.$root.$on("set-active-task", (task) => {
      this.activeTask = task;
    });
  },
};
</script>

<style lang="scss" scoped>
* {
  font-family: "Lato", sans-serif;
}
.main {
  display: grid;
  overflow: hidden;
  background-color: white;
  grid-template-rows: 2.5rem 2.5rem 100%;

  .menu {
    padding: 0 1rem 0 0.25rem;
  }
  .bread {
    padding: 0 0.15rem 0 0.15rem;
    display: grid;
    grid-template-columns: 2rem auto;
    line-height: 1.8rem;
  }
}

details {
  summary::-webkit-details-marker {
    display: none;
  }
}

::v-deep {
  .align-start.d-flex.flex-d-column {
    padding-left: 0 !important;
  }
  .app-wrapper__collapser {
    justify-content: center;
  }
  .app-wrapper__collapser--collapsed {
    right: 0 !important;
  }
  .app-wrapper__navigation--collapsed {
    .nav-item {
      padding: 0;
    }
  }
}
</style>
