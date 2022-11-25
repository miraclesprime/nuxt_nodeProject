<template>
  <div id="inbox-wrapper" class="inbox-wrapper d-flex h-100">
    <main>
      <page-title title="Inbox" :avatar="'I'"></page-title>
      <nav id="inbox-nav" class="d-flex align-center gap-05 py-05 px-025 border-bottom-light">
        <!-- <button type="button" @click="$router.back()" class="d-flex cursor-pointer bg-white border-white">
        <bib-icon icon="arrowhead-left" :scale="1.5" variant="gray5"></bib-icon>
      </button>
      <bib-avatar></bib-avatar>
      <span id="inbox-title" class=" font-w-700  mr-1 " style="font-size: 1.25rem;">Inbox</span> -->
        <div class="ml-auto d-flex gap-05 align-center position-relative" id="inbox-button-wraps">
          <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" id="project-id-menu-item1" v-tooltip="'Team'">
            <bib-icon icon="user-group-solid" class="m-auto"></bib-icon>
          </div>
          <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" id="project-id-menu-item2" v-tooltip="'Conversation'">
            <bib-icon icon="comment-forum-solid" class="m-auto"></bib-icon>
          </div>
          <div class="shape-circle bg-light bg-hover-gray2 width-2 height-2 d-flex cursor-pointer" id="project-id-menu-item3" v-tooltip="'Files'">
            <bib-icon icon="folder-solid" class="m-auto"></bib-icon>
          </div>
          <div id="project-id-horizontal-dots-wrap" class="cursor-pointer bg-light bg-hover-gray2 shape-circle width-2 height-2 d-flex align-center justify-center">
            <!-- <bib-popup pop="horizontal-dots" id="project-id-horizontal-dots">
            <template v-slot:menu>
              <div class="list" id="project-id-list">
                <span class="list__item" id="project-id-list-item1" @click="modalOpen('overview', 'Overview')">View details</span>
               
                <span class="list__item" id="project-id-list-item2" @click="setFavorite">
                  <bib-icon :icon="isFavorite.icon" :variant="isFavorite.variant" class="mr-075"></bib-icon> {{isFavorite.text}}
                </span>
                <span class="list__item" id="project-id-list-item3">
                  <bib-icon icon="user-group-solid" class="mr-075"></bib-icon> Team
                </span>
                <span class="list__item" id="project-id-list-item3" @click="conversationModal = true">
                  <bib-icon icon="comment-forum-solid" class="mr-075"></bib-icon> Conversation
                </span>
                <span class="list__item" id="project-id-list-item3" @click="modalOpen('files', 'Files')">
                  <bib-icon icon="folder-solid" class="mr-075"></bib-icon> Files
                </span>
                <span class="list__item" id="project-id-list-item3">
                  <bib-icon icon="group" class="mr-075"></bib-icon> Subtasks
                </span>

                <span class="list__item" id="project-id-list-item5" @click="reportModal = !reportModal">
                  <bib-icon icon="warning" class="mr-075"></bib-icon> Report
                </span>
                <hr id="project-id-hr2">
                <span v-if="cdp" class="list__item list__item__danger" id="project-id-list-item6" @click="deleteProject(project)">Delete </span>
              </div>
            </template>
          </bib-popup> -->
          </div>
        </div>
      </nav>
      <div class="position-relative h-100 of-scroll-y">
        <div v-for="n in 5">
          <inbox-item></inbox-item>
        </div>
      </div>
      <loading :loading="loading"></loading>
    </main>
    <aside class=" border-left-gray4">
    	right col
    </aside>
  </div>
</template>
<script>
export default {

  name: 'Inbox',

  data() {
    return {
      loading: false,
    }
  }
}

</script>
<style lang="scss" scoped>
.inbox-wrapper {
	main { flex: 1 1 auto; }
	aside { flex: 0 0 $sidebar-width; }
}
</style>
