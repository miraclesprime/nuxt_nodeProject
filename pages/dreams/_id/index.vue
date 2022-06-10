<template>
  <div id="dream-id-wrapper" class="dream-id-wrapper ">
      <nav id="dream-id-nav" class="d-flex align-center gap-05 py-075 px-025 ">
      <nuxt-link to="/dreams" class="d-flex">
        <bib-icon icon="arrowhead-left" :scale="1.5" variant="gray5"></bib-icon>
      </nuxt-link>
      <bib-avatar></bib-avatar>
      <span id="dream-id-dream-title" class=" font-w-700  mr-1 " style="font-size: 1.25rem;">{{dream ? dream.title : 'Dream Title'}}</span>
      <!-- <bib-page-title label="Page Title"></bib-page-title> -->
      <template> <!-- v-if="dream.status" -->
        <span id="dream-id-badge-status" class="badge-status"><!--{{dream.status.text}} --> Status</span>
      </template>
      <div class="ml-auto d-flex gap-05 align-center position-relative" id="dream-id-button-wraps">
        <bib-avatar></bib-avatar>
        <bib-button label="invite" variant="light" pill v-on:click="$nuxt.$emit('add-teammember-modal')"></bib-button>
        <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" id="dream-id-bookmark" @click="setFavorite">
          <bib-icon class="m-auto" :icon="isFavorite.icon" :variant="isFavorite.variant"></bib-icon>
        </div>
        <div id="dream-id-horizontal-dots-wrap" class="cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center">
          <bib-button pop="horizontal-dots" id="dream-id-horizontal-dots">
            <template v-slot:menu>
              <div class="list" id="dream-id-list">
                <!-- <span class="list__item" id="dream-id-list-item1">Show dream details</span> -->
                <!-- <hr id="dream-id-hr"> -->
                <span class="list__item" id="dream-id-list-item2" @click="setFavorite">
                  <bib-icon :icon="isFavorite.icon" :variant="isFavorite.variant" class="mr-075"></bib-icon> {{isFavorite.text}}
                </span>
                <span class="list__item" id="dream-id-list-item3">
                  <bib-icon icon="user-add" class="mr-075"></bib-icon> Share with
                </span>
                <span class="list__item" id="dream-id-list-item4" @click="renameModal = !renameModal">
                  <bib-icon icon="pencil" class="mr-075"></bib-icon> Rename
                </span>
                <div class="mt-1" id="dream-id-div"></div>
                <span class="list__item" id="dream-id-list-item5" @click="reportModal = !reportModal">
                  <bib-icon icon="warning" class="mr-075"></bib-icon> Report
                </span>
                <hr id="dream-id-hr2">
                <span class="list__item danger" id="dream-id-list-item6">Delete </span>
              </div>
            </template>
          </bib-button>
        </div>
        <!-- <loading :loading="favLoading"></loading> -->
      </div>
    </nav>
  <div class="menu " id='dream-id-menu-content'>
      <bib-tabs :value="activeTab.value" @change="tabChange" :tabs="DREAM_TABS" />
    </div>
    <div id="dream-id-tab-content" class="dream-id-tab-content position-relative of-scroll-y">
      <dream-overview v-if="activeTab.value == DREAM_TAB_TITLES.overview" :fields="TABLE_FIELDS" ></dream-overview>
      <dream-goals v-if="activeTab.value == DREAM_TAB_TITLES.goals" :fields="TABLE_FIELDS" ></dream-goals>
      <dream-projects v-if="activeTab.value == DREAM_TAB_TITLES.projects" :fields="TABLE_FIELDS" ></dream-projects>
      <dream-tasks v-if="activeTab.value == DREAM_TAB_TITLES.tasks" :fields="TABLE_FIELDS" ></dream-tasks>
      <dream-conversations v-if="activeTab.value == DREAM_TAB_TITLES.conversations" :fields="TABLE_FIELDS" ></dream-conversations>
      <dream-team v-if="activeTab.value == DREAM_TAB_TITLES.team" :fields="TABLE_FIELDS"></dream-team>
      <dream-files v-if="activeTab.value == DREAM_TAB_TITLES.files" :fields="TABLE_FIELDS" ></dream-files>
    </div>
  </div>
</template>

<script>
import { TABLE_FIELDS, DREAM_TABS, DREAM_DEFAULT_TAB, DREAM_TAB_TITLES } from "config/constants";

export default {
    data() {
        return {
            dream: null,
            activeTab: DREAM_DEFAULT_TAB,
            DREAM_TABS,
            DREAM_TAB_TITLES,
            TABLE_FIELDS
        }
    },
    
    computed: {
        isFavorite() {
            // this.favProjects.some(t => t.id == this.project.id)
            let fav = null
            if (fav) {
                return { icon: "bookmark-solid", variant: "orange", text: "Remove favorite", status: true }
            } else {
                return { icon: "bookmark", variant: "gray5", text: "Add to favorites", status: false }
            }
        },
    },

    methods: {
        tabChange(value) {
            this.activeTab = value;
        },

        setFavorite() {
            
        }
    }
}
</script>

<style lang="scss" scoped>
.dream-id-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
}

#dream-id-nav {
  border-bottom: 1px solid var(--bib-light);
}

.shape-circle {
  .menu {
    margin-left: auto;
    margin-right: auto
  }
}

</style>