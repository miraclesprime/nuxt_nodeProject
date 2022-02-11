<template>
  <div>
    <bib-app-wrapper class="test" :navigationCollapsed="collapseNavigation" :select="appHeaderActions.select" :button="appHeaderActions.button" @button-click="rightClkFileSection" @collapseNavigation="
        () => {
          resizeCalendar()
          collapseNavigation = !collapseNavigation;
        }
      ">
      <template #topbar>
        <bib-header></bib-header>
      </template>
      <template #switcher>
        <bib-app-switcher :menuItems="appItems"></bib-app-switcher>
      </template>
      <template #navigation>
        <bib-app-navigation :items="navItems1" @click='goToRoute($event)' class="mb-1"></bib-app-navigation>
        <bib-app-navigation :items="navItems2" @click='goToRoute($event)'></bib-app-navigation>
        <!-- <bib-app-navigation :items="navItems3"></bib-app-navigation> -->
      </template>
      <template #content>
        <div class="main" id='main-content' :class="openSidebar ? 'open-sidebar' : ''">
          <Nuxt />
        </div>
      </template>
    </bib-app-wrapper>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";

export default {
  data() {
    return {
      openSidebar: false,
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
        { label: "Home", icon: "home", key:"dashboard-route" },
        { label: "Inbox", icon: "mail-new" },
        { label: "My tasks", icon: "check-circle" },
        { label: "Favorites", icon: "heart-like" },
      ],
      navItems2: [
        { label: "Tasks", icon: "check-circle", key:"task-route" },
        { label: "Projects", icon: "folder-add", key: 'project-route', selected: true },
        { label: "Goals", icon: "plans" },
        { label: "Dream", icon: "star" },
      ],
      navItems3: [
        { label: "Departments", icon: "home" },
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
          items: [{
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
    }
  },
  created() {
    this.$root.$on("open-sidebar", (flag) => {
      this.openSidebar = flag;
    });
  },
  mounted() {
    if (process.client) {

      // let cookie = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJrNjFZUWRKNko3bGRPR3BKIiwic3ViZSI6ImRocnV2LnNoYXJtYUBxc3N0ZWNobm9zb2Z0LmNvbSIsInN1YnMiOiJBQ1RJVkUiLCJzdWJiIjoiTzNHV3BtYms1ZXpKbjRLUiIsInN1YmJzIjoiQ0xJRU5UIiwic3ViciI6IkFETUlOIiwic3ViYyI6IkNhbmFkYSIsImlhdCI6MTY0NDU1MjQ3ODgwMCwiZXhwIjoxNjUyMzI4NDc4ODAwLCJqdGkiOiJjZmVhZTA1OC03NmE5LTRlYWMtOTVjMy03NmYxNzhlZjA3ZGQifQ._STkz-xT4N82Qix25BrfCVUt2rf488yGPG5N_kHIG5I"

      // this.$cookies.set('b_ssojwt', cookie);
      // this.$store.dispatch('token/setToken', cookie);

      if (this.$cookies.get('b_ssojwt')) {
        let jwt = this.$cookies.get('b_ssojwt');

        // extract user
        var base64Url = jwt.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        let user = JSON.parse(jsonPayload);

        this.$store.dispatch('user/setUser', user)

        this.$axios
          .$post(process.env.VUE_APP_API_ENDPOINT + "/user/create", {
            id: user.sub,
            email: user.sube
          }).then((value) => {
            console.log('user created!!')
          }).catch((err) => {
            console.log('there was some issue!!!')
          })

        this.$store.dispatch('token/setToken', jwt);
        localStorage.setItem('accessToken', jwt)
      } else {
        window.location.href = process.env.AUTH_REDIRECT_URL + process.env.VUE_APP_URL;
      }
    }
  },
  methods: {

    rightClkFileSection(event) {
      this.$refs.modals.showCreateProjectModal = true;
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
      if ($event.key == 'task-route') {
        this.$router.push('/tasks')
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
  }
}

</script>

<style lang="scss">
html {
  font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
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

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
.main {
  /*display: grid;
  grid-template-rows: 2.5rem 2.5rem 2.5rem 100%;*/
  overflow: hidden;
  background-color: white;

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
