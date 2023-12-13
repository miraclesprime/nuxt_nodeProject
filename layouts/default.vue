<template>
  <client-only>
    <div id="layout-wrapper" v-if="expandVisible">
      <bib-app-wrapper
        class="test"
        :navigationCollapsed="collapseNavigation"
        :select="appHeaderActions.select"
        @collapseNavigation="
          () => {
            resizeCalendar();
            collapseNavigation = !collapseNavigation;
          }
        "
        :isLightTheme="isLightTheme"
      >
        <template #topbar>
          <bib-header
            :avatarLink="user2 ? user2.Photo : ''"
            :isLightTheme="isLightTheme"
            @side-menu-expand="collapseNavigation=!collapseNavigation"
            :mainAction="btnText"
            hide-search-box
            noResultText="No results, type a project or task name to begin search."
            @my-account-link="myAccount"
            @logout="$logout"
            hide-search-box
            @support-link="supportURL"
            @billing-link="billingURL"
            @team-link="teamURL"
          >
          </bib-header>
        </template>
        <template #switcher>
          <bib-app-switcher
            :menuItems="appItems"
            :isLightTheme="isLightTheme"
              v-if="!collapseNavigation"
            @toggle-theme="handleToggleWrapperTheme"
            style="z-index: 99;"
          ></bib-app-switcher>
        </template>
        <template #navigation>
          <bib-app-navigation
            :items="navItems1"
            @click="goToRoute"
            :isLightTheme="isLightTheme"
          ></bib-app-navigation>
          <!-- separator -->
          <div
            class="mt-05 mb-05"
            :class="[isLightTheme ? 'line-light' : 'bg-dark-sub1']"
            style="height: 1px"
          ></div>
          <bib-app-navigation
            :items="navItems2"
            @click="goToRoute"
            :isLightTheme="isLightTheme"
          ></bib-app-navigation>
          <!-- separator -->
          <div
            class="mt-05 mb-05"

            :class="[isLightTheme ? 'line-light' : 'bg-dark-sub1']"
            style="height: 1px"
            v-show="!collapseNavigation"
          ></div>
          <favorite-project-collpase
            v-show="!collapseNavigation"
            label="Favorite Projects"
            label-weight="400"
            variant="light"
            open
          >
            <template v-slot:content>
              <bib-app-navigation
                :items="favProjects"
                @click="goToProject"
              ></bib-app-navigation>
            </template>
          </favorite-project-collpase>
          <!-- separator -->
          <!-- :class="[isLightTheme ? 'bg-gray2' : 'bg-dark-sub1']" -->
          <div
            class="mt-05 mb-05"
            :class="[isLightTheme ? 'line-light' : 'bg-dark-sub1']"
            style="height: 1px"
            v-show="!collapseNavigation"
          ></div>
          <people-sort-collapse
            v-show="!collapseNavigation"
            :themeColor="isLightTheme"
            label=""
            label-weight="400"
            variant="light"
            open
            v-if="isAdmin"
          >
           
            <template v-slot:content>
              <bib-app-navigation
                :items="teamMembers"
                @click="goToUsertask"
                :key="navKey"
              ></bib-app-navigation>
            </template>
          </people-sort-collapse>
  
        </template>
        <template #content>
          <div
            class="main"
            id="main-content"
            :class="openSidebar ? 'open-sidebar' : ''"
          >
            <Nuxt />
            <transition name="drawer">
              <task-sidebar-two v-show="openSidebar" :expandVisible="expandVisible" :unassignedTasks="unassignedTasks"></task-sidebar-two>
            </transition>
          </div>
        </template>
      </bib-app-wrapper>
      <!-- task sidebar -->
      <create-project-modal ref="projectModals"></create-project-modal>
      <add-teammember-modal ref="teammemberModal"></add-teammember-modal>
      <add-member-to-task ref="taskTeamModal"></add-member-to-task>
    </div>
    <div class="blackbox" v-else>
        <bib-app-wrapper>
        <template #content>
          <div class="main blackbox" id="main-content" :class="openSidebar ? 'open-sidebar' : ''" >
            <Nuxt />
            <div class="blackbox"></div>
            <transition name="drawer">
              <task-sidebar-two v-show="openSidebar" :expandVisible="expandVisible" :unassignedTasks="unassignedTasks" ></task-sidebar-two>
            </transition>
          </div>
        </template>
      </bib-app-wrapper>  
      </div>
  </client-only>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      // sortUser:[],
      openSidebar: false,
      flag: false,
      navKey: 0,
      historyLength: 2,
      appItems: 
      [
        {
          img: "layers-solid",
          color: "primary",
          active: false,
          text: "Templates",
          href: process.env.BIB_TEMPLATES_APP_URL,
        },
        {
          img: "cloud-data-network-solid",
          color: "success-sub1",
          active: false,
          text: "Drive",
          href: process.env.BIB_DRIVE_URL,
        },
        {
          img: "editor",
          color: "primary-sub1",
          active: false,
          text: "Editor",
          href: process.env.WEB_EDITOR_APP_URL,
        },
        {
          img: "table",
          color: 'primary',
          active: false,
          text: "Sheets",
          href: process.env.WEB_SHEET_EDITOR_APP_URL,
        },
        {
          img: "chat",
          color: "purple",
          active: false,
          text: "Chat",
          href: process.env.BIB_CHAT_APP_URL,
        },
        {
          img: "signature",
          color: "orange",
          active: false,
          text: "eSign",
          href: process.env.BIB_ESIGN_APP_URL,
        },
        {
          img: "meetings",
          color: "warning",
          active: false,
          text: "Connect",
          href: process.env.VIDEO_CONF_APP_URL,
        },
        {
          img: "projects",
          color: "primary",
          active: true,
          text: "Projects",
          href: process.env.BIB_PROJECT_APP_URL,
        },
      ],
      navItems1: [
        /*{
          label: "Home",
          icon: "home-solid",
          key: "dashboard-route",
          selected: false,
        },*/
        {
          label: "Inbox",
          icon: "mail-new-solid",
          key: "inbox",
          selected: false,
        },
        {
          label: "My Tasks",
          icon: "check-circle-solid",
          key: "mytasks",
          selected: false,
        },
        {
          label: "Favorites",
          icon: "bookmark-multiple-solid",
          key: "favorites",
          selected: false,
        },
      ],
      navItems2: [
        {
          label: "Tasks",
          icon: "check-all",
          key: "task-route",
          selected: false,
        },
        {
          label: "Projects",
          icon: "briefcase-solid",
          key: "project-route",
          selected: false,
        },
      ],
      collapseNavigation: false,
      // lightThemeChecked: true,
      appHeaderActions: {
        select: {
          items: [
            {
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
            img: "https://i.pravatar.cc/100",
          },
        },
      },
      userProfileUrl: process.env.USER_PROFILE_URL,
      logoutUrl: process.env.LOGOUT_URL,
      sectionPreselect: null,
      scrollId: "",
      isAdmin: false,
      btnText: "Upgrade",
      departmentId: null,
      sortCompleteTasks:[],
      sortAllTasks:[],
      teamMembers:[],
      unassignedTasks: null,
    };
  },
  created() {
    // this.isLightTheme = this.$cookies.get("isLightTheme") == undefined || this.$cookies.get("isLightTheme") ? true : false;
    this.isThemeCheck()
    // console.log(this.isLightTheme)
    this.$root.$on("open-sidebar", (payload) => {
      this.openSidebar = true;
      this.$store.dispatch("task/setSidebarVisible", true)
      this.scrollId = payload.scrollId;
      //get userinfo about userTask page and Mytask page
      if(payload.email){
          this.$store.dispatch("user/setSideBarUser",payload.email)
      }
      if(payload.userId){
          this.$store.dispatch("user/setSideBarUser",payload.userId)
      }
      
      if (!payload.id) {
        if (typeof payload == "number") {
          this.sectionPreselect = payload;
        }
        this.$store.dispatch("task/setSingleTask", {});
        this.$store.commit("task/fetchTeamMember", []);
        if (payload?.data) {
          this.unassignedTasks = payload.data
        }
      } else {
        if (payload.project?.[0]?.project?.id) {
          // this.$store.dispatch("section/fetchProjectSections", {
          //   projectId: payload.project[0].project.id,
          //   filter: "all",
          // });
          // fetch single project data
          this.$axios
            .$get(`/project/${payload.project[0].project.id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
              },
            })
            .then((res) => {
              if (res) {
                this.$store.dispatch("project/setSingleProject", res.data);
              }
          })
            .catch((err) => console.log(err));
        } else {
          this.$store.dispatch("project/setSingleProject", {});
        }
        this.$store.dispatch("task/fetchSingleTask", payload.id);
        this.$store.dispatch("task/fetchTeamMember", { id: payload.id });
      }

      if (payload.department) {
        this.departmentId = payload.department.id;
      }
    });
    this.$root.$on("close-sidebar", () => {
      this.openSidebar = false;
      this.$store.dispatch("task/setSidebarVisible", false)
      this.$store.dispatch("task/setSingleTask", {});
      this.unassignedTasks = null
    });
    this.$root.$on("create-project-modal", () => {
      this.$refs["projectModals"].showCreateProjectModal = true;
    });
    this.$nuxt.$on("add-teammember-modal", () => {
      this.$refs.teammemberModal.showTeamCreateModal = true;
    });
    this.$nuxt.$on("add-member-to-task", () => {
      this.$refs.taskTeamModal.showTaskTeamModal = true;
    });
  },
  mounted() {
    if (process.client) {
      
      if (this.$router.history.current.fullPath == "/inbox") {
        this.navItems1[0].selected = true;
      }

      if (this.$router.history.current.fullPath == "/mytasks") {
        this.navItems1[1].selected = true;
      }

      if (this.$router.history.current.fullPath == "/favorites") {
        this.navItems1[2].selected = true;
      }

    if(!this.isAdmin) {
      if (this.$router.history.current.fullPath == "/tasks") {
        this.navItems2[0].selected = true;
      }

      if (this.$router.history.current.fullPath == "/projects") {
        setTimeout(() => {
          this.navItems2[1].selected = true;
        }, 500);
      }
    } else {
      if (this.$router.history.current.fullPath == "/projects") {
        this.navItems2[0].selected = true;
      }
    }

      // if (this.$router.history.current.fullPath == '/goals') {
      //   this.navItems2[2].selected = true;
      // }

      // if (this.$router.history.current.fullPath == '/dreams') {
      //   this.navItems2[3].selected = true;
      // }

      if (this.$cookies.get(process.env.SSO_COOKIE_NAME)) {
        let jwt = this.$cookies.get(process.env.SSO_COOKIE_NAME);

        // extract user
        var base64Url = jwt.split(".")[1];
        var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        var jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );

        let user = JSON.parse(jsonPayload);

        if (user.subbs == "FREETRIAL") {
          this.btnText = "See Plans & Pricing";
        } else {
          this.btnText = "Upgrade";
        }

        localStorage.setItem("user", JSON.stringify(user));
        this.$store.dispatch("user/setUser", user);

        this.$axios
          .get(`${process.env.USER_API_ENDPOINT}/${user.sub}`, {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          })
          .then((res) => {
            let firstName = res.data.FirstName;
            let lastName = res.data.LastName;

            this.$store.dispatch("user/setUser2", res.data);

            this.$axios
              .$post(
                "/user/create",
                {
                  id: user.sub,
                  email: user.sube,
                  firstName: firstName,
                  lastName: lastName,
                  companyId: user.subb,
                },
                {
                  headers: {
                    Authorization: `Bearer ${jwt}`,
                  },
                }
              )
              .then((value) => {
                if (JSON.parse(localStorage.getItem("user")).subr == "ADMIN") {
                  this.isAdmin = true;
                  this.$store.commit("user/setIsAdmin",this.isAdmin)
                  // console.log(this.isAdmin)
                } else {
                  this.navItems2.splice(0,1);
                  this.isAdmin = false;
                  this.$store.commit("user/setIsAdmin",this.isAdmin)
                }
                this.$store.dispatch("department/fetchDepartments");
                this.$store.dispatch("project/fetchFavProjects");
                this.$store.dispatch("user/setTeamMembers");
                this.$store.dispatch("task/getFavTasks");
                this.$store.dispatch("company/fetchInitialCompanyTasks");
              })
              .catch((err) => {
                console.log("there was some issue!!!");
              });
          })
          .catch((err) => {
            console.log(err);
          });

        // this.$store.dispatch("token/setToken", jwt);
        localStorage.setItem("accessToken", jwt);

        this.$store.dispatch("company/fetchCompanyMembers", user.subb);
      } else {
        window.location.href =
          process.env.AUTH_REDIRECT_URL + process.env.VUE_APP_URL;
      }
    }
  },

  computed: {
    ...mapGetters({
      favProjects: "project/getFavProjects",
      appMembers: "user/getAppMembers",
      user2: "user/getUser2",
      expandVisible:"task/getExpandVisible",
      sidebar: "task/getSidebarVisible",
    }),
    isLightTheme() {
      return this.$store.state.isLightTheme;
    },
  },
  watch: {
    appMembers(newVal){
      this.teamMembers=newVal
    },
 },
  methods: {

    isRouteActive(id) {
      if (this.$route.path.includes(id)) {
        return true;
      } else {
        return false;
      }
    },

    resizeCalendar() {
      if (document.getElementById("myDiv")) {
        window.dispatchEvent(new Event("resize"));
      }
      return false;
    },

    goToRoute(event, item) {
      this.appMembers.map((u) => (u.selected = false));
      this.navKey++;

      for (let i = 0; i < this.navItems1.length; i++) {
        if (this.navItems1[i].key == item.key) {
          this.navItems1[i].selected = true;
        } else {
          this.navItems1[i].selected = false;
        }
      }

      for (let i = 0; i < this.navItems2.length; i++) {
        if (this.navItems2[i].key == item.key) {
          this.navItems2[i].selected = true;
        } else {
          this.navItems2[i].selected = false;
        }
      }

      if (item.key == "dashboard-route") this.$router.push("/dashboard");
      if (item.key == "project-route") this.$router.push("/projects");
      if (item.key == "favorites") this.$router.push("/favorites");
      if (item.key == "task-route") this.$router.push("/tasks");
      if (item.key == "mytasks") this.$router.push("/mytasks");
      if (item.key == "inbox") this.$router.push("/inbox");
    },

    goToProject($event, item) {
      this.$router.push("/projects/" + item.id);

      for (let i = 0; i < this.navItems1.length; i++) {
        this.navItems1[i].selected = false;
      }

      for (let i = 0; i < this.navItems2.length; i++) {
        this.navItems2[i].selected = false;
      }

      if(!this.isAdmin) {
        this.navItems2[0].selected = true;
      } else {
        this.navItems2[1].selected = true;
      }

    },

    goToUsertask($event, item) {
      // this.teammate.find((u) => u.email == item.email);

      this.appMembers.map((u) => {
        if (u.email == item.email) {
          u.selected = true;
        } else {
          u.selected = false;
        }
      });

      for (let i = 0; i < this.navItems1.length; i++) {
        this.navItems1[i].selected = false;
      }

      for (let i = 0; i < this.navItems2.length; i++) {
        this.navItems2[i].selected = false;
      }

      this.navKey++;
      // localStorage.setItem('user-page-query', JSON.stringify({id: item.id}) )
      let id = item.id;
      this.$router.push({ path: `/usertasks/${id}` });
    },

    removeCookie(cookieName) {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    },
    myAccount(){
      window.location.href = process.env.USER_PROFILE_URL;
    },
    teamURL() {
      window.location.href = process.env.TEAM_URL;
    },
    billingURL() {
      window.location.href = process.env.BILLING_URL;
    },
    supportURL() {
      window.location.href = process.env.SUPPORT_URL;
    },
    handleToggleWrapperTheme(value) {
      this.$store.commit("setTheme", value)
      this.$cookies.set("isLightTheme", value)
    },
    isThemeCheck(){
      let isTheme = this.$cookies.get('isLightTheme');
      if (isTheme == undefined) {
          this.$cookies.set("isLightTheme", false, {
            path: "/",
            domain: location.host.includes("business-in-a-box.com")
              ? ".business-in-a-box.com"
              : undefined,
            maxAge: 60 * 60 * 24 * 30,
          });
          this.$store.commit("setTheme", false)
        } else {
          this.$store.commit("setTheme", isTheme)
        }
    }
  },
};
</script>
<style lang="scss">
html {
  font-family: $font-family;
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

      .drop-wrapper {
        top: 2.5rem;
      }
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

.blackbox {
  width: 100vw;
  height: 100vh;
  background-color: black;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 6;  
}
.line-light{
  border-bottom: 1px solid rgba(29,29,32,.08);
}
</style>