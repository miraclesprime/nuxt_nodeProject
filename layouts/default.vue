<template>
  <div id="layout-wrapper">
    <bib-app-wrapper class="test" :navigationCollapsed="collapseNavigation" :select="appHeaderActions.select" @collapseNavigation="() => {
          resizeCalendar()
          collapseNavigation = !collapseNavigation;
        }" :button="appCreateButton" @createbtn-click="createBtnClick">
      <template #topbar>
        <bib-header :avatarLink="user2 ? user2.Photo : ''">
          <template #avatar_menu>
            <bib-button pop="arrowhead-right" :scale="1.3">
              <template v-slot:menu>
                <div class="list" id="layout-list">
                  <!-- <span class="list__item">
                    <bib-icon icon="home" :scale="1.1" variant="gray5" class="mr-075"></bib-icon> My Account
                  </span> -->
                  <span class="list__item" id="layout-list-item1">
                    <a :href="userProfileUrl" id="layout-list-item1-link">
                      <bib-icon icon="user-canonical" :scale="1.1" variant="gray5" class="mr-075"></bib-icon> My Profile
                    </a>
                  </span>
                  <span class="list__item" id="layout-list-item2">
                    <a :href="logoutUrl" id="layout-list-item2-link">
                      <bib-icon icon="output" :scale="1.1" variant="gray5" class="mr-075"></bib-icon> Logout
                    </a>
                  </span>
                </div>
              </template>
            </bib-button>
          </template>
        </bib-header>
      </template>
      <template #switcher>
        <bib-app-switcher :menuItems="appItems"></bib-app-switcher>
      </template>
      <template #navigation>
        <bib-button v-show="!collapseNavigation" dropdown="" label="" class="height-3 create-dropdown " >
          <template v-slot:menu>
            <ul>
              <li v-for="item in appHeaderActions.button.items" :key="item.label" class="d-flex align-center" @click="createAction(item)">
                <bib-icon :variant="item.iconVariant" :icon="item.icon" :scale="1.1"></bib-icon>
                <span class="ml-05">{{item.label}}</span>
              </li>
            </ul>
          </template>
        </bib-button>
        <!-- <div v-show="!collapseNavigation">
          <bib-button label="Create" variant="success" size="lg" pill class="w-75"></bib-button>
          <bib-button dropdown="" label="" class="w-75" style="transform: translateY(-28px); z-index:9;">
            <template v-slot:menu>
              <ul>
                <li v-for="item in appHeaderActions.button.items" :key="item.label" class="d-flex align-center" @click="createAction(item)">
                  <bib-icon :variant="item.iconVariant" :icon="item.icon" :scale="1.1"></bib-icon>
                  <span class="ml-05">{{item.label}}</span>
                </li>
              </ul>
            </template>
          </bib-button>
        </div> -->
        <bib-app-navigation :items="navItems1" @click="goToRoute($event)"></bib-app-navigation>
        <!-- separator -->
        <div class="bg-dark-sub1 mt-05 mb-05" style="height: 1px"></div>
        <bib-app-navigation :items="navItems2" @click="goToRoute($event)"></bib-app-navigation>
        <!-- separator -->
        <div class="bg-dark-sub1 mt-05 mb-05" style="height: 1px"></div>
        <bib-detail-collapse v-show="!collapseNavigation" label="Favorite Projects" variant="white" open>
          <template v-slot:content>
            <!-- <div class="d-flex p-05 gap-05 cursor-pointer text-secondary text-hover-light" id="layout-add-icon">
              <bib-icon icon="add" variant="success" :scale="1.5" class="p-025 ml-025"></bib-icon> <span id=" layout-icon-text" class="p-025">Create a project</span>
            </div> -->
            <bib-app-navigation :items="favProjects" @click="goToProject($event)"></bib-app-navigation>
          </template>
        </bib-detail-collapse>
        <!-- separator -->
        <div class="bg-dark-sub1 mt-05 mb-05" style="height: 1px"></div>
        <bib-detail-collapse v-show="!collapseNavigation" label="People" variant="white" open>
          <template v-slot:content>
            <!-- <div class="d-flex p-05 gap-05 cursor-pointer text-secondary text-hover-light">
              <bib-icon icon="add" variant="success" :scale="2" class="p-025 ml-025"></bib-icon> <span class="p-025">Add a team mate</span>
            </div> -->
            <bib-app-navigation :items="teammate"></bib-app-navigation>
          </template>
        </bib-detail-collapse>
      </template>
      <template #content>
        <div class="main" id='main-content' :class="openSidebar ? 'open-sidebar' : ''">
          <Nuxt />
        </div>
      </template>
    </bib-app-wrapper>
    <create-project-modal ref="projectModals"></create-project-modal>
    <add-teammember-modal ref="teammemberModal"></add-teammember-modal>
    <add-member-to-task ref="taskTeamModal"></add-member-to-task>
    <!-- <create-task-modals @create-task="
        (task) => {
          createTask(task);
        }
      " ref="modals"></create-task-modals> -->
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import AddMemberToTask from '../components/task/AddMemberToTask.vue';

export default {
  components: { AddMemberToTask },
  data() {
    return {
      openSidebar: false,
      appCreateButton: {
        label: "Create",
        event: "createbtn-click",
        variant: "success",
        icon: "add",
      },
      appItems: [{
          img: "Layers",
          color: "primary",
          text: "Templates",
          href: process.env.VITE_BIB_TEMPLATES_APP_URL,
        },
        { img: "Files", color: "success-sub1", text: "Files", href: process.env.VITE_BIB_DRIVE_URL },
        { img: "Signature", color: "orange", text: "eSign", href: process.env.VITE_BIB_ESIGN_APP_URL },
        { img: "Tick", color: "primary", text: "Project", active: true, href: process.env.VUE_APP_URL },
        { img: "CommentForum", color: "purple", text: "Chat", href: process.env.VITE_BIB_CHAT_APP_URL },
      ],
      navItems1: [
        { label: "Home", icon: "home", key: "dashboard-route" },
        { label: "Inbox", icon: "mail-new" },
        { label: "My tasks", icon: "check-circle", key: 'mytasks' },
        { label: "Favorites", icon: "heart-like", key: 'favorites' },
      ],
      navItems2: [
        { label: "Tasks", icon: "check-all", key: "task-route" },
        { label: "Projects", icon: "briefcase", key: 'project-route' },
        { label: "Goals", icon: "flag-racing" },
        { label: "Dream", icon: "star", avatar: "https://i.pravatar.cc/150" },
      ],
      /*favProjects: [
        { label: "Project one", icon: "folder-solid" },
        { label: "Project two", icon: "folder-solid" },
      ],*/
      // teammate: [
      //   { label: "Person one", icon: "user" }
      // ],
      collapseNavigation: false,
      appHeaderActions: {
        button: {
          items: [
            { label: "New Task", icon: "check-circle", iconVariant: "success", key: "new-task" },
            { label: "New Project", icon: "briefcase", key: "new-project" },
            { label: "New File", icon: "file", key: "new-file" },
            { label: "New Folder", icon: "folder", key: "new-folder" },
          ]
        },
        select: {
          items: [{
              label: "Biztree",
              event: "item-click",
              img: "https://i.pravatar.cc/100",
            },
            {
              label: "Organization Name",
              event: "item-click",
              img: "https://i.pravatar.cc/100",
            },
          ],
          footer: {
            label: "Add organization",
            icon: "plus",
            event: "add-organization",
          },
          selectedOrg: {
            label: "Biztree",
            img: "https://i.pravatar.cc/100"
          }
        },
      },
      userProfileUrl: process.env.USER_PROFILE_URL,
      logoutUrl: process.env.LOGOUT_URL,
    }
  },
  created() {
    this.$root.$on("open-sidebar", (flag) => {
      this.openSidebar = flag;
    });
    this.$root.$on("create-project-modal", () => {
      this.$refs.projectModals.showCreateProjectModal = true;
    })
    this.$nuxt.$on("add-teammember-modal", () => {
      this.$refs.teammemberModal.showTeamCreateModal = true
    })
    this.$nuxt.$on("add-member-to-task", () => {
      this.$refs.taskTeamModal.showTaskTeamModal = true
    })
  },
  mounted() {
    if (process.client) {

      // let cookie = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrNjFZUWRKNko3bGRPR3BKIiwic3ViZSI6ImRocnV2LnNoYXJtYUBxc3N0ZWNobm9zb2Z0LmNvbSIsInN1YnMiOiJBQ1RJVkUiLCJzdWJiIjoiTzNHV3BtYms1ZXpKbjRLUiIsInN1YmJzIjoiQ0xJRU5UIiwic3ViciI6IkFETUlOIiwic3ViYyI6IkNhbmFkYSIsImVudiI6ImRldiIsImlhdCI6MTY0Njk3MjYzNzcxNSwiZXhwIjoxNjU0NzQ4NjM3NzE1LCJqdGkiOiIyMDFjZGExYy02MDVjLTQ4ZDMtODhiMi1lODhjMDFhZGQ3YWUifQ.aw6BfQV6G5iDlWXNvMiV9AgxaMGjPVyF2LRgteMo5OU"

      // let cookie = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0cTJWb2xlalJlak5tR1FCIiwic3ViZSI6Imh0YW5nQGJpenRyZWUuY29tIiwic3VicyI6IkFDVElWRSIsInN1YmIiOiJPM0dXcG1iazVlekpuNEtSIiwic3ViYnMiOiJDTElFTlQiLCJzdWJyIjoiQURNSU4iLCJzdWJjIjoiQ2FuYWRhIiwiZW52IjoiZGV2IiwiaWF0IjoxNjQ4NTUwMTI1ODY0LCJleHAiOjE2NTYzMjYxMjU4NjQsImp0aSI6ImM1MDYyM2I4LTM3NGMtNDhjMi04MzNiLTJmZjk3ZTA2MGIxZSJ9.sVGhB1aKeLurq_S1t1aWT86TDi-4fXhqBic90i3xTVA"

      let cookie = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJES2dsOWF2Mk53bmFHMXZ6Iiwic3ViZSI6InZpc2h3YWplZXQubWFuZGFsQHFzc3RlY2hub3NvZnQuY29tIiwic3VicyI6IkFDVElWRSIsInN1YmIiOiJPM0dXcG1iazVlekpuNEtSIiwic3ViYnMiOiJDTElFTlQiLCJzdWJyIjoiVVNFUiIsInN1YmMiOiJDYW5hZGEiLCJlbnYiOiJkZXYiLCJpYXQiOjE2NTA0NjA0NDgyOTMsImV4cCI6MTY1ODIzNjQ0ODI5MywianRpIjoiMmYzNDE1MTUtNzBjMy00YjYyLWI3MmMtNmIxNDczODgzODU4In0.pnG0ierfColobVCVAQaOq8StqquRKYx-KeFVO6RkUKI"

      this.$cookies.set('b_ssojwt', cookie);
      this.$store.dispatch('token/setToken', cookie);

      if (this.$cookies.get('b_ssojwt')) {
        let jwt = this.$cookies.get('b_ssojwt');

        // extract user
        var base64Url = jwt.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        let user = JSON.parse(jsonPayload);

        localStorage.setItem('user', JSON.stringify(user))
        this.$store.dispatch('user/setUser', user)

        this.$axios.get(`${process.env.USER_API_URL}/${user.sub}`, {
          headers: {
            'Authorization': `Bearer ${jwt}`
          }
        }).then((res) => {
          let firstName = res.data[0].FirstName;
          let lastName = res.data[0].LastName;

          this.$store.dispatch("user/setUser2", res.data[0])

          this.$axios.$post("/user/create", {
            id: user.sub,
            email: user.sube,
            firstName: firstName,
            lastName: lastName,
            companyId: user.subb
          }, {
            headers: {
              'Authorization': `Bearer ${jwt}`
            }
          }).then((value) => {
            // console.log('user created!!')
            this.$store.dispatch("project/setFavProjects")
            this.$store.dispatch("user/setTeamMembers")
            this.$store.dispatch("task/getFavTasks")
          }).catch((err) => {
            console.log('there was some issue!!!')
          })

        }).catch((err) => {
          console.log(err);
        })

        this.$store.dispatch('token/setToken', jwt);
        localStorage.setItem('accessToken', jwt);

        this.$store.dispatch("company/fetchCompanyMembers", user.subb)

      } else {
        window.location.href = process.env.AUTH_REDIRECT_URL + process.env.VUE_APP_URL;
      }
    }
  },

  computed: {
    ...mapGetters({
      favProjects: 'project/getFavProjects',
      teammate: 'user/getTeamMembers',
      user2: 'user/getUser2',
    })
  },

  methods: {
    createBtnClick(e) {
      console.log('create', e)
      this.collapseNavigation = false
    },
    isRouteActive(id) {
      if (this.$route.path.includes(id)) {
        return true
      } else {
        return false
      }
    },

    rightClkFileSection(event) {
      console.log('click outside event')
      // this.$refs.projectModals.showCreateProjectModal = true;
    },

    /*createProject(data) {
      this.$store.dispatch('project/createProject', data.name);
    },*/

    createAction($event) {
      // console.log($event.key)
      switch ($event.key) {
        case "new-task":
          console.log($event.key)
          break;
        case "new-project":
          console.log($event.key)
          this.$refs.projectModals.showCreateProjectModal = true;
          break;
        case "new-file":
          console.log($event.key)
          break;
        case "new-folder":
          console.log($event.key)
          break;
        default:
          console.log('default')
          break;
      }
    },

    resizeCalendar() {
      if (document.getElementById('myDiv')) {
        window.dispatchEvent(new Event('resize'));
      }
      return false;
    },


    goToRoute($event) {
      console.log($event.key)
      if ($event.key == 'dashboard-route') {
        this.$router.push('/dashboard')
      }
      if ($event.key == 'project-route') {
        this.$router.push('/projects')
      }
      if ($event.key == 'favorites') {
        this.$router.push('/favorites')
      }
      if ($event.key == 'task-route') {
        this.$router.push('/tasks')
      }
      if ($event.key == 'mytasks') {
        this.$router.push('/mytasks')
      }
    },

    goToProject($event) {
      this.$router.push("/projects/" + $event.id)
    },

    // Handle User logout
    async logout() {
      try {
        let response = await this.$auth.logout();
      } catch (err) {
        console.log(err);
      }
    },
  }
}

</script>
<style lang="scss">
html {
  font-family: $font-family;
  /*font-size: 16px;
  word-spacing: 1px;*/
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.main {
  /*display: grid;
  grid-template-rows: 2.5rem 2.5rem 2.5rem 100%;*/
  overflow: hidden;
  background-color: white;
  position: relative;

  .bread {
    padding: 0 0.15rem 0 0.15rem;
    display: grid;
    grid-template-columns: 2rem auto;
    line-height: 1.8rem;
  }
}

  .app-wrapper{
    &__navigation { position: relative;
      .create-dropdown { position: absolute; top: 4rem; left:0; right: 0; z-index:9;
        &.button { position: absolute; }
        
      }
    }
  }
::v-deep {
  
  .button--drop.create-dropdown { 
    .menu {
      details {
        .wrapper { top: 2.5rem; }
      }
    }
  }
    
  .panel-wrapper.side-panel {
    position: fixed;
    right: 0;
    max-width: $sidebar-width;
    border-left: 1px solid $gray4;
  }

  /*.align-start.d-flex.flex-d-column {
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
  }*/
}

</style>
