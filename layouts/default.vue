<template>
  <client-only>
    <div id="layout-wrapper">
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
        :isLightTheme="lightThemeChecked"
      >
        <template #topbar>
          <bib-header
            :avatarLink="user2 ? user2.Photo : ''"
            :isLightTheme="lightThemeChecked"
            :mainAction="btnText"
          >
            <template #avatar_menu>
              <bib-button pop="arrowhead-right" :scale="1.3">
                <template v-slot:menu>
                  <div class="list" id="layout-list">
                    <span class="list__item" id="layout-list-item1">
                      <a :href="userProfileUrl" id="layout-list-item1-link">
                        <bib-icon
                          icon="user-canonical"
                          :scale="1.1"
                          variant="gray5"
                          class="mr-075"
                        ></bib-icon>
                        My Profile
                      </a>
                    </span>
                    <span class="list__item" id="layout-list-item2">
                      <a :href="logoutUrl" id="layout-list-item2-link">
                        <bib-icon
                          icon="output"
                          :scale="1.1"
                          variant="gray5"
                          class="mr-075"
                        ></bib-icon>
                        Logout
                      </a>
                    </span>
                  </div>
                </template>
              </bib-button>
            </template>
          </bib-header>
        </template>
        <template #switcher>
          <bib-app-switcher
            :menuItems="appItems"
            :isLightTheme="lightThemeChecked"
            @toggle-theme="handleToggleWrapperTheme"
          ></bib-app-switcher>
        </template>
        <template #navigation>
          <bib-app-navigation
            :items="navItems1"
            @click="goToRoute"
            :isLightTheme="lightThemeChecked"
          ></bib-app-navigation>
          <!-- separator -->
          <div
            class="mt-05 mb-05"
            :class="[lightThemeChecked ? 'bg-gray2' : 'bg-dark-sub1']"
            style="height: 1px"
          ></div>
          <bib-app-navigation
            :items="navItems2"
            @click="goToRoute"
            :isLightTheme="lightThemeChecked"
          ></bib-app-navigation>
          <!-- separator -->
          <div
            class="mt-05 mb-05"
            :class="[lightThemeChecked ? 'bg-gray2' : 'bg-dark-sub1']"
            style="height: 1px"
          ></div>
          <bib-detail-collapse
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
          </bib-detail-collapse>
          <!-- separator -->
          <div
            class="mt-05 mb-05"
            :class="[lightThemeChecked ? 'bg-gray2' : 'bg-dark-sub1']"
            style="height: 1px"
          ></div>
          <bib-detail-collapse
            v-show="!collapseNavigation"
            label="People"
            label-weight="400"
            variant="light"
            open
            v-if="isAdmin"
          >
            <template v-slot:content>
              <bib-app-navigation
                :items="appMembers"
                @click="goToUsertask"
                :key="navKey"
              ></bib-app-navigation>
            </template>
          </bib-detail-collapse>
        </template>
        <template #content>
          <div
            class="main"
            id="main-content"
            :class="openSidebar ? 'open-sidebar' : ''"
          >
            <Nuxt />
            <transition name="drawer">
              <task-sidebar
                v-show="openSidebar"
                :visible="openSidebar" 
                :sectionIdActive="sectionPreselect"
                :scrollId="scrollId"
                :departmentId="departmentId"
              ></task-sidebar>
            </transition>
          </div>
        </template>
      </bib-app-wrapper>
      <!-- task sidebar -->
      <create-project-modal ref="projectModals"></create-project-modal>
      <add-teammember-modal ref="teammemberModal"></add-teammember-modal>
      <add-member-to-task ref="taskTeamModal"></add-member-to-task>
    </div>
  </client-only>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      openSidebar: false,
      flag: false,
      navKey: 0,
      historyLength: 2,
      appItems: [
        {
          img: "layers-solid",
          color: "secondary",
          text: "Templates",
          href: process.env.BIB_TEMPLATES_APP_URL,
        },
        {
          img: "cloud-solid",
          color: "success-sub1",
          text: "Files",
          href: process.env.BIB_DRIVE_URL,
        },
        {
          img: "signature",
          color: "orange",
          text: "eSign",
          href: process.env.BIB_ESIGN_APP_URL,
        },
        {
          img: "projects",
          color: "primary",
          text: "Project",
          active: true,
          href: process.env.VUE_APP_URL,
        },
        {
          img: "chat",
          color: "purple",
          text: "Chat",
          href: process.env.BIB_CHAT_APP_URL,
        },
        {
          img: "editor",
          color: "primary-sub1",
          text: "Editor",
          href: "http://dev.editor.business-in-a-box.com",
        },
        {
          img: "meetings",
          color: "warning",
          text: "Video",
          href: "https://dev-video-conf.business-in-a-box.com",
        },
        {
          img: "data-storage-single",
          color: "primary",
          text: "Drive",
          href: "",
        },
      ],
      navItems1: [
        {
          label: "Home",
          icon: "home-solid",
          key: "dashboard-route",
          selected: false,
        },
        {
          label: "Inbox",
          icon: "mail-new-solid",
          key: "inbox",
          selected: false,
        },
        {
          label: "My tasks",
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
      lightThemeChecked: false,
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
    };
  },
  created() {
    this.$root.$on("open-sidebar", (payload) => {
      this.openSidebar = true;
      this.$store.dispatch("task/setSidebarVisible", true)
      this.scrollId = payload.scrollId;

      if (!payload.id) {
        if (typeof payload == "number") {
          this.sectionPreselect = payload;
        }
        this.$store.dispatch("task/setSingleTask", {});
        this.$store.commit("task/fetchTeamMember", []);
      } else {
        if (payload.project.length > 0) {
          this.$store.dispatch("section/fetchProjectSections", {
            projectId: payload.project[0].projectId,
            filter: "all",
          });
          // fetch single project data
          this.$axios
            .$get(`project/${payload.project[0].projectId}`, {
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
        this.$store.dispatch("task/setSingleTask", payload);
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
    });
    this.$root.$on("create-project-modal", () => {
      this.$refs.projectModals.showCreateProjectModal = true;
    });
    this.$nuxt.$on("add-teammember-modal", () => {
      this.$refs.teammemberModal.showTeamCreateModal = true;
    });
    this.$nuxt.$on("add-member-to-task", () => {
      this.$refs.taskTeamModal.showTaskTeamModal = true;
    });
  },
  mounted() {
    window.addEventListener("popstate", this.handleStateChange);
    if (process.client) {
      if (this.$router.history.current.fullPath == "/dashboard") {
        this.navItems1[0].selected = true;
      }

      if (this.$router.history.current.fullPath == "/inbox") {
        this.navItems1[1].selected = true;
      }

      if (this.$router.history.current.fullPath == "/mytasks") {
        this.navItems1[2].selected = true;
      }

      if (this.$router.history.current.fullPath == "/favorites") {
        this.navItems1[3].selected = true;
      }

      if (this.$router.history.current.fullPath == "/tasks") {
        this.navItems2[0].selected = true;
      }

      if (this.$router.history.current.fullPath == "/projects") {
        setTimeout(() => {
          this.navItems2[1].selected = true;
        }, 500);
      }

      // if (this.$router.history.current.fullPath == '/goals') {
      //   this.navItems2[2].selected = true;
      // }

      // if (this.$router.history.current.fullPath == '/dreams') {
      //   this.navItems2[3].selected = true;
      // }

      // Dhruv (admin)
      let cookie = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrNjFZUWRKNko3bGRPR3BKIiwic3ViZSI6ImRocnV2LnNoYXJtYUBxc3N0ZWNobm9zb2Z0LmNvbSIsInN1YnMiOiJBQ1RJVkUiLCJzdWJiIjoiTzNHV3BtYms1ZXpKbjRLUiIsInN1YmJzIjoiQ0xJRU5UIiwic3ViciI6IkFETUlOIiwic3ViYyI6IkNhbmFkYSIsImVudiI6ImRldiIsImlhdCI6MTY4NTk0OTcwNTYwMSwiZXhwIjoxNjkzNzI1NzA1NjAxLCJqdGkiOiJlNTYxMzc1ZC05MjdiLTQxYmQtOWNkNS05ZTQ0MWZmYjkzNGIifQ.iLVUiKPRiDNN7c9GYD20azlUxGoAFHYr-E65n_R_Byw";
      // let cookie = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrNjFZUWRKNko3bGRPR3BKIiwic3ViZSI6ImRocnV2LnNoYXJtYUBxc3N0ZWNobm9zb2Z0LmNvbSIsInN1YnMiOiJBQ1RJVkUiLCJzdWJiIjoiTzNHV3BtYms1ZXpKbjRLUiIsInN1YmJzIjoiQ0xJRU5UIiwic3ViciI6IkFETUlOIiwic3ViYyI6IkNhbmFkYSIsImVudiI6ImRldiIsImlhdCI6MTY4MjMxNDk5MjM1NywiZXhwIjoxNjkwMDkwOTkyMzU3LCJqdGkiOiIxODkxMjg1Ni00ZDIyLTQzMDQtODI4My1kNzAzMDMzOTQ2NTYifQ.7NKaoTwlgkwho6DzjV96ohKvQznbASt846ZA1KRCtN0";

      // let cookie = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrNjFZUWRKNko3bGRPR3BKIiwic3ViZSI6ImRocnV2LnNoYXJtYUBxc3N0ZWNobm9zb2Z0LmNvbSIsInN1YnMiOiJBQ1RJVkUiLCJzdWJiIjoiTzNHV3BtYms1ZXpKbjRLUiIsInN1YmJzIjoiQ0xJRU5UIiwic3ViciI6IkFETUlOIiwic3ViYyI6IkNhbmFkYSIsImVudiI6ImRldiIsImlhdCI6MTY4NTk0OTcwNTYwMSwiZXhwIjoxNjkzNzI1NzA1NjAxLCJqdGkiOiJlNTYxMzc1ZC05MjdiLTQxYmQtOWNkNS05ZTQ0MWZmYjkzNGIifQ.iLVUiKPRiDNN7c9GYD20azlUxGoAFHYr-E65n_R_Byw";

      // Vishwajeet
      // let cookie = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJES2dsOWF2Mk53bmFHMXZ6Iiwic3ViZSI6InZpc2h3YWplZXQubWFuZGFsQHFzc3RlY2hub3NvZnQuY29tIiwic3VicyI6IkFDVElWRSIsInN1YmIiOiJPM0dXcG1iazVlekpuNEtSIiwic3ViYnMiOiJDTElFTlQiLCJzdWJyIjoiVVNFUiIsInN1YmMiOiJDYW5hZGEiLCJlbnYiOiJkZXYiLCJpYXQiOjE2ODA2NzI3NTEwOTksImV4cCI6MTY4ODQ0ODc1MTA5OSwianRpIjoiOGUyYzc4M2YtOTY3My00OGVlLTgyOTgtMGVjZTU5NTIyZWJhIn0.rftT95n4vGjR52nHsrLVHnbH3WNETaBpUaD9c5b7DRA"

      // Rajeev
      // let cookie = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJnRUxZcWFRV1FHOWRuamsyIiwic3ViZSI6InJhamVldi5zaGFybWFAcXNzdGVjaG5vc29mdC5jb20iLCJzdWJzIjoiQUNUSVZFIiwic3ViYiI6Ik8zR1dwbWJrNWV6Sm40S1IiLCJzdWJicyI6IkNMSUVOVCIsInN1YnIiOiJVU0VSIiwic3ViYyI6IkNhbmFkYSIsImVudiI6ImRldiIsImlhdCI6MTY3MjYzOTg2MDMzMSwiZXhwIjoxNjgwNDE1ODYwMzMxLCJqdGkiOiJhYWZlYmUxYi1kZGI2LTRmODMtYjIzYy1hZWRkMDcxMzU1ZTEifQ.AxRf7tHVZC4r0Io6J9ghNZJscPkRKWM3LBOgevkQdKE"

      //free
      // let cookie = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJWWW14a2F6cFJqWWRKMFBvIiwic3ViZSI6ImFyaXR6YTNAc2hhcGVkY3YuY29tIiwic3VicyI6IkFDVElWRSIsInN1YmIiOiJEWE1WeWI4MmtEM2V2QVpFIiwic3ViYnMiOiJGUkVFVFJJQUwiLCJzdWJyIjoiQURNSU4iLCJzdWJjIjoiVW5pdGVkIFN0YXRlcyIsImVudiI6ImRldiIsImlhdCI6MTY3OTYzNzM2MzkxMiwiZXhwIjoxNjg3NDEzMzYzOTEyLCJqdGkiOiJkZGJiMzE1MC04ODkxLTQ5MjAtYTVjYy0yNDBhYTcxZTdhMDQifQ.7Xy5W1dEFUN-R6rHXYL3awJ5QjDa_73uxhGl_nqcvEc"

      // Charan
      // let cookie = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJQeTdMRGR3cE9xMWUxWUtYIiwic3ViZSI6ImNoYXJhbi5wYWxAcXNzdGVjaG5vc29mdC5jb20iLCJzdWJzIjoiQUNUSVZFIiwic3ViYiI6Ik8zR1dwbWJrNWV6Sm40S1IiLCJzdWJicyI6IkNMSUVOVCIsInN1YnIiOiJVU0VSIiwic3ViYyI6IkNhbmFkYSIsImVudiI6ImRldiIsImlhdCI6MTY3NzQ5NjY2MDM4NywiZXhwIjoxNjg1MjcyNjYwMzg3LCJqdGkiOiJkNjAwOWQ0Zi1lNDFjLTQ2YWMtYjU0MC1iOTk3NzJmNDIzY2MifQ.6G04xtF0oRIaHr5gV4Jxx71TJRPb3sb3S1e85BMn3vc"

      this.$cookies.set('b_ssojwt', cookie);
      this.$store.dispatch('token/setToken', cookie);

      if (this.$cookies.get("b_ssojwt")) {
        let jwt = this.$cookies.get("b_ssojwt");

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
                } else {
                  this.isAdmin = false;
                }
                this.$store.dispatch("department/fetchDepartments");
                this.$store.dispatch("project/fetchFavProjects");
                this.$store.dispatch("user/setTeamMembers");
                this.$store.dispatch("task/getFavTasks");
              })
              .catch((err) => {
                console.log("there was some issue!!!");
              });
          })
          .catch((err) => {
            console.log(err);
          });

        this.$store.dispatch("token/setToken", jwt);
        localStorage.setItem("accessToken", jwt);

        this.$store.dispatch("company/fetchCompanyMembers", user.subb);
      } else {
        window.location.href =
          process.env.AUTH_REDIRECT_URL + process.env.VUE_APP_URL;
      }
    }
  },
  watch: {
    $route: function () {
      this.$store.commit("project/setArrowVisible", this.historyLength + 1);
      this.historyLength = this.historyLength + 1;
    },
  },
  computed: {
    ...mapGetters({
      favProjects: "project/getFavProjects",
      teammate: "user/getTeamMembers",
      appMembers: "user/getAppMembers",
      user2: "user/getUser2",
      sidebar: "task/getSidebarVisible",
    }),
  },

  methods: {
    handleStateChange() {
      this.$store.commit("project/setArrowVisible", this.historyLength - 2);
      this.historyLength = this.historyLength - 2;
    },
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

      this.navItems2[1].selected = true;
    },

    goToUsertask($event, item) {
      this.teammate.find((u) => u.email == item.email);

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
      this.$router.push({ path: "/usertasks", query: { email: item.email } });
    },

    // Handle User logout
    async logout() {
      try {
        let response = await this.$auth.logout();
      } catch (err) {
        console.log(err);
      }
    },
    handleToggleWrapperTheme(value) {
      this.lightThemeChecked = value;
    },
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
</style>
