<template>
  <div id="favorite-action-wrapper" class="favorite-actions ">
    
    <div id="fa-add-project-wrapper" class="action-left">
    </div>

    <div class="action-right" id="fa-action-right">
      <ul class="actions" id="pa-actions-list">
        <li class="action" id="pa-action-item1">
          <sorting-comp label="Viewing" :items=[] icon="eye-open" ></sorting-comp>
        </li>
        <!-- <li class="action" id="pa-action-item2">
          <span id="pa-action-item2-text" class="mr-025">Filter By:</span>
          <div class="shape-rounded bg-dark width-105 height-105 d-flex justify-center align-center">
            <bib-button pop="filter-horizontal" icon-variant="white" size="sm">
              
            </bib-button>
          </div>
        </li> -->
        <li class="action" id="pa-action-item3">
          <sorting-comp label="Sorted by" :items=[] icon="swap-vertical" ></sorting-comp>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>

export default {
  
  data() {
    return {

    };
  },
  
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