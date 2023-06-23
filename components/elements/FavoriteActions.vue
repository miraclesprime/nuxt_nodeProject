<template>
  <div id="favorite-action-wrapper" class="favorite-actions ">
    
    <div id="fa-add-project-wrapper" class="action-left d-flex gap-1">
      <div class="d-flex align-center gap-05 cursor-pointer text-success bg-success-sub6 bg-hover-success-sub3 shape-rounded py-025 px-05 font-md" id="fa-add-project-button" v-on:click="$nuxt.$emit('create-project-modal')">
        <bib-icon icon="add" variant="success" :scale="1.1" class=""></bib-icon> <span id="fa-add-prject-text" class="">New Project</span>
      </div>
      <div class="d-flex align-center gap-05 cursor-pointer text-success bg-success-sub6 bg-hover-success-sub3 shape-rounded py-025 px-05 font-md" id="fa-add-task-button" v-on:click.stop="$nuxt.$emit('open-sidebar', false)">
        <bib-icon icon="add" variant="success" :scale="1.1" class=""></bib-icon> <span id="fa-add-task-text" class="">New Task</span>
      </div>
    </div>

    <div class="action-right d-flex gap-05" id="fa-action-right">
      <template>
        <bib-input size="sm" type="text" v-model="searchText" name="name" @input="$emit('search-projects-tasks', searchText)" placeholder="Search Projects or Tasks..." :variant="searchText.length > 50 ? 'alert': ''"></bib-input>
      </template>
      <ul class="actions" id="fa-actions-list">
        <li class="action" id="fa-action-item1" >
          <sorting-comp :items="viewing" icon="eye-open" activeIcon="tick" tooltip="View" v-on:change-sort="$emit('change-viewing', $event)"></sorting-comp>
        </li>
        <li class="action" id="fa-action-item2" >
          <sorting-comp :items="sorting" icon="swap-vertical" tooltip="Sort By" v-on:change-sort="$emit('change-sorting', $event)"></sorting-comp>
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
      sorting: FAVORITE_SORT,
      searchText: ""
    };
  }, 
  
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
  padding: 0 4px;
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