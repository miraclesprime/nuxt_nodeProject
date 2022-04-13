<template>
  <div id="favorite-action-wrapper" class="favorite-actions ">
    
    <div id="fa-add-project-wrapper" class="action-left">
    </div>

    <div class="action-right" id="fa-action-right">
      <ul class="actions" id="pa-actions-list">
        <li class="action" id="pa-action-item1">
          <sorting-comp label="Viewing" :items="viewing" icon="eye-open" v-on:change-sort="viewProjects($event)"></sorting-comp>
        </li>
        <li class="action" id="pa-action-item3">
          <sorting-comp label="Sorted by" :items="sorting" icon="swap-vertical" v-on:change-sort="sortBy($event)"></sorting-comp>
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
    viewProjects($event) {
      // this.$emit("loading", true)
      // this.$store.dispatch('project/fetchProjects', $event).then(() => { this.$emit("loading", false) })
      // this.selectedView = $event;
      // this.$emit('viewValue', $event)
      console.log($event);
    },

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
  padding: 8px 0;
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