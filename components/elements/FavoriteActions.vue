<template>
  <div id="favorite-action-wrapper" class="favorite-actions ">
    
    <div id="fa-add-project-wrapper" class="action-left d-flex gap-1">
      <div class="d-flex gap-05 cursor-pointer text-secondary bg-hover-light shape-rounded py-025 px-05 text-hover-dark" id="fa-add-project-button" v-on:click="$nuxt.$emit('create-project-modal')">
        <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon> <span id="fa-add-prject-text" class="">New Project</span>
      </div>
      <div class="d-flex gap-05 cursor-pointer text-secondary bg-hover-light shape-rounded py-025 px-05 text-hover-dark" id="fa-add-task-button" v-on:click.stop="$nuxt.$emit('open-sidebar', false)">
        <bib-icon icon="add" variant="success" :scale="1.25" class=""></bib-icon> <span id="fa-add-task-text" class="">New Task</span>
      </div>
    </div>

    <div class="action-right" id="fa-action-right">
      <ul class="actions" id="fa-actions-list">
        <li class="action" id="fa-action-item1">
          <sorting-comp label="Viewing" :items="viewing" icon="eye-open" v-on:change-sort="$emit('change-viewing', $event)"></sorting-comp>
        </li>
        <li class="action" id="fa-action-item2">
          <sorting-comp label="Sorted by" :items="sorting" icon="swap-vertical" v-on:change-sort="$emit('change-sorting', $event)"></sorting-comp>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import { VIEW_FILTER, FAVORITE_SORT } from '../../config/constants';

export default {
  
  data() {
    return {
      viewing: VIEW_FILTER,
      sorting: FAVORITE_SORT
    };
  },

  methods: {
    /*viewProjects($event) {
      // console.log($event);
      this.$emit('change-viewing', $event)
    },*/

    sortBy($event) {
      // if(this.orderBy == 'asc') {
      //   this.orderBy = 'desc'
      // } else {
      //   this.orderBy = 'asc'
      // }
      // this.$store.dispatch('project/sortProjects', {key: $event, order: this.orderBy})
      // this.selectedSort = $event;
      // this.$emit('sortValue', $event)
      console.log($event)
    }
  }
  
};

</script>


<style scoped lang="scss">
.favorite-actions {
  display: flex;
  padding: 0.25rem;
  border-bottom: 1px solid $gray4;
  align-items: center;
}

.action-right {
  margin-left: auto;
}

.actions {
  display: flex;
  color: $gray1;
}

.action {
  display: flex;
  padding: 0 20px;
  align-items: center;
}

.custom-control-label {
  &::before {
    position: static;
    transform: none;
  }

  svg {
    left: 2px;
  }
}

.grid-type {
  border: 1px solid $gray4;
  padding: 2px 3px 0px;
  border-radius: 5px;
}

</style>