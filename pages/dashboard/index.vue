<template>
  <div>
    <bib-app-wrapper
      class="test"
      :navigationCollapsed="collapseNavigation"
      :select="appHeaderActions.select"
      :button="appHeaderActions.button"
      @button-click="rightClkFileSection"
      @collapseNavigation="
        () => {
          resizeCalendar()
          collapseNavigation = !collapseNavigation;
        }
      "
    >
      <template #topbar>
        <bib-header></bib-header>
      </template>

      <template #switcher>
        <bib-app-switcher :menuItems="appItems"></bib-app-switcher>
      </template>

      <template #navigation>
        <bib-app-navigation :items="navItems1"></bib-app-navigation>
        <bib-app-navigation :items="navItems2" @click='goToRoute($event)'></bib-app-navigation>
        <bib-app-navigation :items="navItems3"></bib-app-navigation>
      </template>

      <template #content>
        <div class="main" id='main-content' :class="openSidebar ? 'open-sidebar' : ''">
          <div id="project-name" style="border-bottom: 1px solid #dcdcdf" class="p-05 text-secondary font-sm">{{project.title ? project.title : 'My Project'}}</div>
          <task-sidebar :activeTask="activeTask" />

          <div class="bread d-flex" id='bread-icons'>
            <div class="d-flex align-center" id='prev-icon'>
              <bib-icon icon="previous" :scale="2.0"></bib-icon>
            </div>
            <h3 class="bold mt-auto mb-auto d-flex" id='project-heading'>
              {{ projectName }}
              <div class="pl-1 mt-auto mb-auto" id='heart-icon'>
                <bib-icon icon="heart" :scale="1.25"></bib-icon>
              </div>
              <div class="pl-1 mt-auto mb-auto" id='list-items'>
                <bib-button pop="elipsis">
                  <template v-slot:menu>
                    <div class="list__section" id='list-section'>
                      <span class="list__item" id='list-item-1'>item 1</span>
                      <span class="list__item" id='list-item-2'>item 2</span>
                      <span class="list__item" id='list-item-3'>item 3</span>
                    </div>
                  </template>
                </bib-button>
              </div>
            </h3>
          </div>

          <div class="menu" id='menu-content'>
            <bib-tabs :value="activeTab.value" @change="tabChange" :tabs="TABS" />
          </div>

          <div id='task-overview'>
            <task-overview
              v-if="activeTab.value == TAB_TITLES.overview"
              :fields="TABLE_FIELDS"
              :tasks="tasks"
              :gridType="gridType"
            />
            <task-view
              v-else-if="activeTab.value == TAB_TITLES.tasks"
              :fields="taskFields"
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
    <task-modals
      @create-project="
        (project) => {
          createProject(project);
        }
      "
      ref="modals"
    ></task-modals>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import { TABLE_FIELDS, TABS, DEFAULT_TAB, TAB_TITLES } from "config/constants";
import { DUMMY_PROJECT } from "~/dummy/tasks.js";

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
        { label: "Projects", icon: "folder-add", key: 'project-route'  },
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
      projectName: ''
    };
  },
  computed: {
    // ...mapState("task", ["list", "single"]),
    ...mapGetters({
      tasks: "task/tasksForListView",
      taskFields: "task/tableFields",
      token: "token/getToken",
      project: "project/getSingleProject"
    }),
  },
  methods: {
    // resize for Calendar Page View
    resizeCalendar() {
      if(document.getElementById('myDiv')) {
        window.dispatchEvent(new Event('resize'));
      } 
      return false;
    },

    // Change Tab
    tabChange(value) {
      this.activeTab = value;
    },

    async createProject(project) {
      //COLLECTING FOLDER INFO
      if (project.name != "") {
          this.$store.dispatch('project/createProject', project.name)
          this.$refs.modals.showCreateProjectModal = false;
          // this.$emit("change-data");
      }
    },

    goToRoute($event) {
        if($event.key == 'project-route') {
          this.$router.push('/projects')
        }
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
      this.$refs.modals.showCreateProjectModal = true;
      // event.preventDefault();
      // var menu = document.getElementById("file__section__context");
      // this.closeMenus();
      // this.showFileSectionMenu = true;

      // var body = document.body,
      //   html = document.documentElement;

      // var height = Math.max(
      //   body.scrollHeight,
      //   body.offsetHeight,
      //   html.clientHeight,
      //   html.scrollHeight,
      //   html.offsetHeight
      // );

      // if (menu) {
      //   menu.style.position = "fixed";
      //   menu.style.left = event.clientX + "px";
      //   menu.style.top = event.clientY + "px";

      //   if (height - event.pageY < 150) {
      //     menu.style.maxHeight = height - event.pageY + "px";
      //     menu.style.overflowY = "scroll";
      //     menu.scroll(1, 1);
      //   } else {
      //     menu.style.maxHeight = "max-content";
      //   }
      // }
    },
    closeMenus() {
      // this.showSortMenu = false;
      // this.showMoreMenu = false;
      // this.showFolderMenu = false;
      // this.showFileMenu = false;
      // this.showFileSectionMenu = false;
      // for (let file of this.files.data) {
      //   file.active = false;
      // }
    },
  },
  created() {
    // this.$nextTick(async () => {
    //   await this.$store.dispatch("task/fetchTasks");
    // });
    // if(process.client) {
    //   if (document.cookie.includes("b_ssojwt=")) {
    //           let jwt = document.cookie
    //           .split("; ")
    //           .find((row) => row.includes("b_ssojwt="))
    //           .split("=")[1];
    //           this.$store.dispatch('token/setToken', jwt);
    //           localStorage.setItem('accessToken', jwt)
    //     }
    // }

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
  mounted() {
      // let accessToken = this.token;
      
      // if (accessToken) {
      //     this.$axios
      //     .$post(
      //         "https://www.biztree.com/usr-ctrl-test/api/sso/verify",
      //         {},
      //         {
      //             headers: {
      //                 authorization: "Bearer "+accessToken,
      //             },
      //         }
      //         )
      //         .then((value) => {
      //             console.log(">> in if direction",value.data);
      //             document.querySelector(".customLoader").style.display="none";
      //             if(value.data.code!="valid_token"){
      //                 console.log("Not valid code")
      //                 window.location.href ="http://dev.account.business-in-a-box.com/login/?redirect=http://dev.proj-mgmt.business-in-a-box.com/en/dashboard/";
      //             }
      //         })
      //         .catch((err) => {
      //             console.log(err);
      //         });
      //     } else {
      //         console.log(">> in else redirection");
      //         window.location.href ="http://dev.account.business-in-a-box.com/login/?redirect=http://dev.proj-mgmt.business-in-a-box.com/en/dashboard/";
      //     }

  }

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
  grid-template-rows: 2.5rem 2.5rem 2.5rem 100%;

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
  .panel-wrapper.side-panel {
    position: fixed;
    right: 0;
    max-width: $sidebar-width;
    border-left: 1px solid $gray4;
  }

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
