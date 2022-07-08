<template>
  <div id="dreams-wrapper" class="dreams-wrapper" >
    
    <page-title title="Dreams"></page-title>
    
    <dream-actions @sortValue='sortName=$event' v-on:dream-create-modal="openCreateDreamModal"  />
    <div id="dreams-list-wrapper" class="dreams-list-wrapper of-scroll-y position-relative" >
      <!-- <loading :loading="loading"></loading> -->
      <template v-if="dreams.length">
        <bib-table :fields="tableFields" class="border-gray4 bg-white" :sections="dreams" :hide-no-column="true" @file-title-sort="sortTitle" @file-owner-sort="sortOwner" @file-status-sort="sortByStatus" @file-department-sort="sortByDepartment" @file-dueDate-sort="sortByDueDate" @file-priority-sort="sortByPriority">
          <template #cell(title)="data">
            <div class="d-flex align-center text-dark cursor-pointer" :id="'goals-' + data.value.title" @click="goToDreamId(data.value)">
              <bib-icon icon="briefcase" variant="gray5" :scale="1.1" class="mr-025"></bib-icon>
              <span :id="'goals-' + data.value.title + '-text'">{{data.value.title}}</span>
            </div>
          </template>
          <template #cell(department)="data">
            <span>{{data.value.department}}</span>
          </template>
          <template #cell(status)="data">
            <status-comp :status="data.value.status"></status-comp>
          </template>
          <template #cell(priority)="data">
            <priority-comp :priority="data.value.priority"></priority-comp>
          </template>
          <template #cell(userId)="data">
            <user-info :userId="data.value.userId" :key="newKey"></user-info>
          </template>
          <template #cell(dueDate)="data">
            <format-date :datetime="data.value.dueDate" :key="newKey"></format-date>
          </template>
        </bib-table>
      </template>
      <template v-else>
        <span id="projects-0" class="d-flex gap-1 align-center m-1 bg-warning-sub3 border-warning shape-rounded py-05 px-1">
          <bib-icon icon="warning"></bib-icon> No records found
        </span>
      </template>
    </div>
    <create-dream-modal ref="createDreamModal"></create-dream-modal>
  </div>
</template>

<script>
import { DREAM_FIELDS } from '../../dummy/dream';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      sortName: '',
      viewName: '',
      loading: true,
      tableFields: DREAM_FIELDS,
      gridType: "list",
      activeTask: {
        assignee: null,
        priority: null,
        status: null,
      },
      orderBy: '',
      newkey: 0,
    }
  },

  computed: {
    ...mapGetters({
      dreams: "dream/getDreams"
    })
  },

  mounted() {
    this.$store.dispatch('dream/fetchDreams').then(() => { 
      this.newkey = Math.floor(Math.random() * 1000) + 1;
      this.loading = false 
    })
    
  },

  methods: {

    openCreateDreamModal(){
      this.$refs.createDreamModal.showCreateDreamModal = true
    },

    goToDreamId(dream) {
      this.$store.dispatch('dream/setSingleDream', dream)
      this.$router.push("/dreams/" + dream.id)
    },

    checkActive() {
      for(let i=0; i<this.tableFields.length; i++) {
          if(this.tableFields[i].header_icon) {
            this.tableFields[i].header_icon.isActive = false
          }

          if(this.tableFields[i].header_icon && this.tableFields[i].key == this.sortName) {
            this.tableFields[i].header_icon.isActive = true
          } 
      }
    },

    sortTitle() {
      
      if(this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      this.$store.dispatch('dream/sortDreams', {key: 'name', order: this.orderBy} )
      this.sortName = 'title';
      this.checkActive()
    },

    sortOwner() {

      if(this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      this.$store.dispatch('dream/sortDreams', {key: 'owner', order: this.orderBy} )
      this.sortName = 'userId';
      this.checkActive()
    },

    sortByStatus() {

      if(this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      this.$store.dispatch('dream/sortDreams', {key: 'status', order: this.orderBy} )
      this.sortName = 'status';
      this.checkActive()
    },

    sortByDepartment() {

      if(this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      this.$store.dispatch('dream/sortDreams', {key: 'department', order: this.orderBy} )
      this.sortName = 'department';
      this.checkActive()
    },

    sortByDueDate() {

      if(this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      this.$store.dispatch('dream/sortDreams', {key: 'dueDate', order: this.orderBy} )
      this.sortName = 'dueDate';
      this.checkActive()
    },

    sortByPriority() {

      if(this.orderBy == 'asc') {
        this.orderBy = 'desc'
      } else {
        this.orderBy = 'asc'
      }
      this.$store.dispatch('dream/sortDreams', {key: 'priority', order: this.orderBy} )
      this.sortName = 'priority';
      this.checkActive()
    }
  },

}

</script>
<style lang="scss" scoped>
.dreams-wrapper { display: flex; flex-direction: column; height: 100%; }

details {
  summary::-webkit-details-marker {
    display: none;
  }
}

</style>
