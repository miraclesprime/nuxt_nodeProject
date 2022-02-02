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
        
        <div class="main" id='project-main-content'>

        <div class="bread d-flex" id='project-bread-icons'>
            <div class="d-flex align-center" id='p-prev-icon'>
              <bib-icon icon="previous" :scale="2.0"></bib-icon>
            </div>
            <h3 class="bold mt-auto mb-auto d-flex" id='proj-name'>
              {{ projectName }}
              <div class="pl-1 mt-auto mb-auto" id='p-heart-icon'>
                <bib-icon icon="heart" :scale="1.25"></bib-icon>
              </div>
              <div class="pl-1 mt-auto mb-auto" id='p-list-items'>
                <bib-button pop="elipsis">
                  <template v-slot:menu>
                    <div class="list__section" id='p-list-section'>
                      <span class="list__item" id='p-list-item-1'>item 1</span>
                      <span class="list__item" id='p-list-item-2'>item 2</span>
                      <span class="list__item" id='p-list-item-3'>item 3</span>
                    </div>
                  </template>
                </bib-button>
              </div>
            </h3>
          </div>
        
        <bib-table
            :fields="tableFields"
            class="border-gray4 bg-white"
            :sections="tableSections"
            @item-clicked="handleItemClick_Table"
        >
            <template #cell(name)="data">
                <div class="d-flex gap-05" id='proj-cell-data'>
                <bib-avatar
                    class="mt-auto mb-auto"
                    shape="rounded"
                    :src="data.value.preview"
                    size="1.5rem"
                >
                </bib-avatar>
                <span class="text-dark" id='proj-cell-values'>
                    {{ data.value.name }}
                </span>
                </div>
            </template>
            <template #cell(type)="data">
                <div class="justify-between text-dark" id='centered-values'>
                <span>
                    {{
                    data.value.type.charAt(0) +
                    data.value.type.slice(1).toLowerCase()
                    }}
                    ({{ data.value.extension.toUpperCase() }})
                </span>
                </div>
            </template>
            <template #cell_action="data">
                <bib-button pop="elipsis">
                    <template v-slot:menu>
                        <div class="list" id='proj-list'>
                            <span class="list__item" id='handle-proj1' @click="handleAction_Table(data)">View profile</span>
                            <span class="list__item" id='handle-proj-edit'>Edit</span>
                            <span class="list__item" id='handle-proj-delete'>Delete</span>
                        </div>
                    </template>
                </bib-button>
            </template>
            </bib-table>
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
import { TABLE_FIELDS, TABS, DEFAULT_TAB, TAB_TITLES } from "config/constants";
import { DUMMY_TASK_FIELDS } from "~/dummy/tasks.js";
import {mapGetters} from 'vuex';

export default {
    data() {
    return {
      activeTab: DEFAULT_TAB,
      tableFields: DUMMY_TASK_FIELDS,
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
        { label: "Projects", icon: "folder-add", key: 'project-route' },
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
    }
    },
    methods: {
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

        rightClkFileSection(event) {
            this.$refs.modals.showCreateProjectModal = true;
        }
    },

    computed: {
        ...mapGetters({
            projects: 'project/getAllProjects'
        })
    },
    
    mounted() {
        this.$nextTick(async () => {
            this.$store.dispatch('project/fetchProjects')
        })
    }
}
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