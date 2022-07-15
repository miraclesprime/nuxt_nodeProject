<template>
  <div id="goal-id-wrapper" class="goal-id-wrapper ">
      <nav id="goal-id-nav" class="d-flex align-center gap-05 py-075 px-025 ">
      <nuxt-link to="/goals" class="d-flex">
        <bib-icon icon="arrowhead-left" :scale="1.5" variant="gray5"></bib-icon>
      </nuxt-link>
      <bib-avatar></bib-avatar>
      <span id="goal-id-goal-title" class=" font-w-700  mr-1 " style="font-size: 1.25rem;">{{goal.title}}</span>
      <!-- <bib-page-title label="Page Title"></bib-page-title> -->
      <template> <!-- v-if="goal.status" -->
        <span id="goal-id-badge-status" class="badge-status" v-if="goal.status">{{ goal.status.text }}</span>
      </template>
      <div class="ml-auto d-flex gap-05 align-center position-relative" id="goal-id-button-wraps">
        <bib-avatar></bib-avatar>
        <bib-button label="invite" variant="light" pill v-on:click="$nuxt.$emit('add-teammember-modal')"></bib-button>
        <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" id="goal-id-bookmark" @click="setFavorite">
          <bib-icon class="m-auto" :icon="isFavorite.icon" :variant="isFavorite.variant"></bib-icon>
        </div>
        <div id="goal-id-horizontal-dots-wrap" class="cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center">
          <bib-button pop="horizontal-dots" id="goal-id-horizontal-dots">
            <template v-slot:menu>
              <div class="list" id="goal-id-list">
                <!-- <span class="list__item" id="goal-id-list-item1">Show goal details</span> -->
                <!-- <hr id="goal-id-hr"> -->
                <span class="list__item" id="goal-id-list-item2" @click="setFavorite">
                  <bib-icon :icon="isFavorite.icon" :variant="isFavorite.variant" class="mr-075"></bib-icon> {{isFavorite.text}}
                </span>
                <span class="list__item" id="goal-id-list-item3">
                  <bib-icon icon="user-add" class="mr-075"></bib-icon> Share with
                </span>
                <span class="list__item" id="goal-id-list-item4" @click="renameModal = !renameModal">
                  <bib-icon icon="pencil" class="mr-075"></bib-icon> Rename
                </span>
                <div class="mt-1" id="goal-id-div"></div>
                <span class="list__item" id="goal-id-list-item5" @click="reportModal = !reportModal">
                  <bib-icon icon="warning" class="mr-075"></bib-icon> Report
                </span>
                <hr id="goal-id-hr2">
                <span class="list__item danger" id="goal-id-list-item6">Delete </span>
              </div>
            </template>
          </bib-button>
        </div>
        <!-- <loading :loading="favLoading"></loading> -->
      </div>
    </nav>
  <div class="menu " id='goal-id-menu-content'>
      <bib-tabs :value="activeTab.value" @change="tabChange" :tabs="GOAL_TABS" />
    </div>
    <div id="goal-id-tab-content" class="goal-id-tab-content h-100 position-relative of-scroll-y">
      <goal-overview v-if="activeTab.value == GOAL_TAB_TITLES.overview" :fields="TABLE_FIELDS" ></goal-overview>
      <goal-projects v-if="activeTab.value == GOAL_TAB_TITLES.projects" :fields="TABLE_FIELDS" ></goal-projects>
      <goal-tasks v-if="activeTab.value == GOAL_TAB_TITLES.tasks" :fields="TABLE_FIELDS" ></goal-tasks>
      <goal-conversations v-if="activeTab.value == GOAL_TAB_TITLES.conversations" :fields="TABLE_FIELDS" ></goal-conversations>
      <goal-team v-if="activeTab.value == GOAL_TAB_TITLES.team" :fields="TABLE_FIELDS"></goal-team>
      <goal-files v-if="activeTab.value == GOAL_TAB_TITLES.files" :fields="TABLE_FIELDS" ></goal-files>
    </div>
  </div>
</template>

<script>
import {TABLE_FIELDS, GOAL_TABS, GOAL_DEFAULT_TAB, GOAL_TAB_TITLES } from "config/constants";
import { mapGetters } from 'vuex'

export default {
    data() {
        return {
            activeTab: GOAL_DEFAULT_TAB,
            GOAL_TABS,
            GOAL_TAB_TITLES,
            TABLE_FIELDS,
            goal: {},
            favLoading: false,
            popupMessages: [],
        }
    },

    computed: {
        ...mapGetters({
          favGoals: "goals/getFavGoals",
        }),

        isFavorite() {
            let fav = this.favGoals.some(t => t.id == this.goal.id)
            if (fav) {
                return { icon: "bookmark-solid", variant: "orange", text: "Remove favorite", status: true }
            } else {
                return { icon: "bookmark", variant: "gray5", text: "Add to favorites", status: false }
            }
        },
    },

    mounted() {
      if (process.client) {
        this.loading = true
        this.$axios.$get(`goal/${this.$route.params.id}`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        }).then((res) => {
          if (res) {
            this.goal = res.data;
            this.loading = false
          }
        }).catch(err => {
          console.log(err);
        })
      }
    },

    methods: {
        tabChange(value) {
            this.activeTab = value;
        },

        setFavorite() {
            this.favLoading = true
            if (this.isFavorite.status) {
              this.$store.dispatch("goals/removeFromFavorite", { id: this.$route.params.id })
                .then(msg => {
                  this.popupMessages.push({ text: msg, variant: "orange" })

                  // alert(msg)
                })
                .catch(e => console.log(e))
                .then(() => this.favLoading = false)
            } else {
              this.$store.dispatch("goals/addToFavorite", { id: this.$route.params.id })
                .then(msg => {
                  this.popupMessages.push({ text: msg, variant: "success"})

                  // alert(msg)
                })
                .catch(e => console.log(e))
                .then(() => this.favLoading = false)
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.goal-id-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

#goal-id-nav {
  border-bottom: 1px solid var(--bib-light);
}

.shape-circle {
  .menu {
    margin-left: auto;
    margin-right: auto
  }
}

</style>