<template>
  <div>
    <bib-header></bib-header>
    <bib-sidebar></bib-sidebar>
    <div class="main">
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
        <bib-tabs :value="activeTab" @change="tabChange" :tabs="TABS" />
      </div>
      <div class="">
        <bib-toolbar label="Add Task/Section"></bib-toolbar>
        <task-overview
          v-if="activeTab == TAB_TITLES.overview"
          :fields="TABLE_FIELDS"
          :tasks="tasks"
        />
        <task-view
          v-else-if="activeTab == TAB_TITLES.task"
          :fields="TABLE_FIELDS"
          :tasks="tasks"
        />
        <task-timeline-view
          v-else-if="activeTab == TAB_TITLES.timeline"
          :fields="TABLE_FIELDS"
          :tasks="tasks"
        />
        <task-calendar-view
          v-else-if="activeTab == TAB_TITLES.calendar"
          :fields="TABLE_FIELDS"
          :tasks="tasks"
        />
        <!--
        {{ this.$auth.user }}
        <bib-button
          @click.native="logout"
          class="bg-danger"
          size="md"
          label="logout"
        ></bib-button>
        -->
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
import { TABLE_FIELDS, TABS, DEFAULT_TAB, TAB_TITLES } from "config/constants";

export default {
  data() {
    return {
      activeTab: DEFAULT_TAB,
      TABS,
      TAB_TITLES,
      TABLE_FIELDS
    };
  },
  computed: {
    ...mapState("task", ["list", "single"]),
    ...mapGetters({
      tasks: "task/tasksForListView"
    })
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
    }
  },
  created() {
    this.$nextTick(async () => {
      await this.$store.dispatch("task/fetchTasks");
    });
  }
};
</script>
<style lang="scss" scoped>
* {
  font-family: "Lato", sans-serif;
}
.main {
  width: calc(100% - (#{$item-height} * 1.8));
  height: 100%;
  display: grid;
  position: absolute;
  top: 4rem;
  overflow: hidden;
  left: $item-height * 1.8;
  background-color: white;
  grid-template-rows: 2.5rem 2.5rem 100%;

  .menu {
    padding: 0 1rem 0 0.25rem;
    max-width: 40%;
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
</style>
