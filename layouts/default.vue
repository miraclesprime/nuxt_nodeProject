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
        <bib-button v-show="!collapseNavigation" dropdown="" label="" class="height-3 create-dropdown ">
          <template v-slot:menu>
            <ul>
              <li v-for="item in appHeaderActions.button.items" :key="item.label" class="d-flex align-center cursor-pointer" @click.stop="createAction(item)">
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
        <bib-app-navigation :items="navItems1" @click="goToRoute($event, navItems1)"></bib-app-navigation>
        <!-- separator -->
        <div class="bg-dark-sub1 mt-05 mb-05" style="height: 1px"></div>
        <bib-app-navigation :items="navItems2" @click="goToRoute($event, navItems2)"></bib-app-navigation>
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
          <task-sidebar @open-sidebar="toggleSidebar()" :sectionIdActive="sectionPreselect"></task-sidebar>
        </div>
      </template>
    </bib-app-wrapper>
    <!-- task sidebar -->
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
      flag: false,
      appCreateButton: {
        label: this.$i18n.t("Create"),
        event: "createbtn-click",
        variant: "success",
        icon: "add",
      },
      appItems: [{
          img: "Layers",
          color: "primary",
          text: "Templates",
          href: process.env.BIB_TEMPLATES_APP_URL,
        },
        { img: "Files", color: "success-sub1", text: "Files", href: process.env.BIB_DRIVE_URL },
        { img: "Signature", color: "orange", text: "eSign", href: process.env.BIB_ESIGN_APP_URL },
        { img: "Tick", color: "primary", text: "Project", active: true, href: process.env.VUE_APP_URL },
        { img: "CommentForum", color: "purple", text: "Chat", href: process.env.BIB_CHAT_APP_URL },
        {
          img: "pencil",
          color: "primary-sub1",
          text: "Editor",
          href: "http://dev.editor.business-in-a-box.com"
        },
        {
          img: "video",
          color: "warning",
          text: "Video",
          href: "https://dev-video-conf.business-in-a-box.com"
        },
        {
          img: "data-storage-single",
          color: "primary",
          text: "Drive",
          href: ""
        },
      ],
      navItems1: [
        { label: "Home", icon: "home", key: "dashboard-route", selected: false },
        { label: "Inbox", icon: "mail-new", selected: false },
        { label: "My tasks", icon: "check-circle", key: 'mytasks', selected: false },
        { label: "Favorites", icon: "bookmark-multiple-solid", key: 'favorites', selected: false },
      ],
      navItems2: [
        { label: "Tasks", icon: "check-all", key: "task-route", selected: false },
        { label: "Projects", icon: "briefcase", key: 'project-route', selected: false },
        // { label: "Goals", icon: "flag-racing", key: 'goals', selected: false },
        // { label: "Dream", icon: "star", key: 'dreams', selected: false },
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
      sectionPreselect: null,
    }
  },
  created() {
    this.$root.$on("open-sidebar", (payload) => {
      // console.log("openSidebar => ", typeof(payload), payload)
      this.openSidebar = true;
      // this.toggleSidebar

      if (!payload.id) {
        console.info(payload, typeof payload);
        if (typeof(payload) == "number") {
          this.sectionPreselect = payload
        }
        this.$store.dispatch("task/setSingleTask", {})
      } else {
        if (payload.project.length > 0) {
          // console.log(payload.project[0])
          this.$store.dispatch("section/fetchProjectSections", { projectId: payload.project[0].projectId, filter: 'all' })
          // fetch single project data
          this.$axios.$get(`project/${payload.project[0].projectId}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
          }).then((res) => {
            if (res) {
              this.$store.dispatch('project/setSingleProject', res.data)
            }
          }).catch(err => console.log(err))
          // this.$store.dispatch("project/setSingleProject", payload.project[0].project)
          // this.$store.dispatch("task/setSingleTask", { ...payload, projectId: payload.project[0].projectId })
        } else {
          this.$store.dispatch('project/setSingleProject', {})
        }
        this.$store.dispatch("task/setSingleTask", payload)
        this.$store.dispatch('task/fetchTeamMember', { id: payload.id })
      }
    });
    this.$root.$on('close-sidebar', () => {
      this.openSidebar = false
      this.$store.dispatch("task/setSingleTask", {})
    })
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

      if (this.$router.history.current.fullPath == '/dashboard') {
        this.navItems1[0].selected = true;
      }

      if (this.$router.history.current.fullPath == '/mytasks') {
        this.navItems1[2].selected = true;
      }

      if (this.$router.history.current.fullPath == '/favorites') {
        this.navItems1[3].selected = true;
      }

      if (this.$router.history.current.fullPath == '/tasks') {
        this.navItems2[0].selected = true;
      }

      if (this.$router.history.current.fullPath == '/projects') {
        this.navItems2[1].selected = true;
      }

      if (this.$router.history.current.fullPath == '/goals') {
        this.navItems2[2].selected = true;
      }

      if (this.$router.history.current.fullPath == '/dreams') {
        this.navItems2[3].selected = true;
      }

      // let cookie = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0cTJWb2xlalJlak5tR1FCIiwic3ViZSI6Imh0YW5nQGJpenRyZWUuY29tIiwic3VicyI6IkFDVElWRSIsInN1YmIiOiJPM0dXcG1iazVlekpuNEtSIiwic3ViYnMiOiJDTElFTlQiLCJzdWJyIjoiQURNSU4iLCJzdWJjIjoiQ2FuYWRhIiwiZW52IjoiZGV2IiwiaWF0IjoxNjU2NTkyOTMxMjE1LCJleHAiOjE2NjQzNjg5MzEyMTUsImp0aSI6Ijk0YTViNDdiLWI3ODMtNGIxYS1hNGEyLWY2Y2I2OTcyNjkxMyJ9.Ua72OOl1EwTnYCAxaWOW8i-IvXV9WXDaolQbBWAK9eM"

       let cookie = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrNjFZUWRKNko3bGRPR3BKIiwic3ViZSI6ImRocnV2LnNoYXJtYUBxc3N0ZWNobm9zb2Z0LmNvbSIsInN1YnMiOiJBQ1RJVkUiLCJzdWJiIjoiTzNHV3BtYms1ZXpKbjRLUiIsInN1YmJzIjoiQ0xJRU5UIiwic3ViciI6IkFETUlOIiwic3ViYyI6IkNhbmFkYSIsImVudiI6ImRldiIsImlhdCI6MTY1OTYwOTkyNzgyMywiZXhwIjoxNjY3Mzg1OTI3ODIzLCJqdGkiOiJhNWE4YmNhMi05MWQ1LTQ2NzctOGRiOC0yMmFiY2M5MzE1YjcifQ.C7fMRdSPr32rA2m4DMFFV_RQ-yYZp436n7yLjKvPq0U"
       
      //  let cookie = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJES2dsOWF2Mk53bmFHMXZ6Iiwic3ViZSI6InZpc2h3YWplZXQubWFuZGFsQHFzc3RlY2hub3NvZnQuY29tIiwic3VicyI6IkFDVElWRSIsInN1YmIiOiJPM0dXcG1iazVlekpuNEtSIiwic3ViYnMiOiJDTElFTlQiLCJzdWJyIjoiVVNFUiIsInN1YmMiOiJDYW5hZGEiLCJlbnYiOiJkZXYiLCJpYXQiOjE2NTcwODk0NjE5OTgsImV4cCI6MTY2NDg2NTQ2MTk5OCwianRpIjoiNjgxNTE2YWItMWM0NC00OWM1LWI4ZmUtNDE0NjA0NDNiMzU1In0.ptVLjXbVoTU-MfTST5tcpXlRcXh2_t_Cq_BG_1vlt3Q"

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
            this.$store.dispatch("goals/setFavGoals")
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
      // activeTask: "task/getSelectedTask",
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

    /*createProject(data) {
      this.$store.dispatch('project/createProject', data.name);
    },*/

    /*toggleSidebar($event) {
      // console.log($event)
      // in case of create task 
      if (!$event) {
        this.$store.dispatch("task/setSingleTask", {})
      } else {
        this.$store.dispatch("task/setSingleTask", task)
      }

    },*/

    createAction($event) {
      // console.log($event.key)
      switch ($event.key) {
        case "new-task":
          console.log($event.key)
          this.$nuxt.$emit("open-sidebar", $event)
          break;
        case "new-project":
          console.log($event.key)
          this.$refs.projectModals.showCreateProjectModal = true;
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

      for (let i = 0; i < this.navItems1.length; i++) {
        if (this.navItems1[i].key == $event.key) {
          this.navItems1[i].selected = true;
        } else {
          this.navItems1[i].selected = false;
        }
      }

      for (let i = 0; i < this.navItems2.length; i++) {
        if (this.navItems2[i].key == $event.key) {
          this.navItems2[i].selected = true;
        } else {
          this.navItems2[i].selected = false;
        }
      }

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

      if ($event.key == 'goals') {
        this.$router.push('/goals')
      }

      if ($event.key == 'dreams') {
        this.$router.push('/dreams')
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

.app-wrapper {
  &__navigation {
    position: relative;

    .create-dropdown {
      position: absolute;
      top: 0.75rem;
      left: 0;
      right: 0;
      z-index: 9;

      &.button {
        position: absolute;
      }

      .drop-wrapper { top: 2.5rem;}

    }
  }
}

::v-deep {

  .button--drop.create-dropdown {
    .menu {
      details {
        .wrapper {
          top: 2.5rem;
        }
      }
    }
  }

  .panel-wrapper.side-panel {
    position: fixed;
    right: 0;
    max-width: $sidebar-width;
    border-left: 1px solid $gray4;
  }

}

</style>
